$(function () {
	F.module("scripts/MVVM", function () {
		var MVVM = {};
		MVVM.model = function () {
			var M = {};
			M.data = {};
			M.conf = {};
			return {
				getData: function (m) {
					return M.data[m];
				},
				setData: function (m, v) {
					M.data[m] = v;
					return v;
				},
				getConf: function (c) {
					return M.conf[c];
				},
				setConf: function (c, v) {
					M.conf[c] = v;
					return v;
				}
			}
		} ();

		MVVM.view = function () {

			var V = {};
			var M = MVVM.model;
			V.tpl = {};

			function formateHTML(str, data) {
				return str.replace(/\{#(\w+)#\}/g, function (match, key) {
					return data[key] !== "undefined" ? data[key] : "";
				})
			}

			function simpleV(type, tpl, data) {
				var args = [].slice.call(arguments);
				var len = args.length;
				
				// 只有一个参数，即type
				if (len === 1) {
					if (typeof V.tpl[type] === "undefined") {
						throw new Error("Template does not exist!");
						return;
					}
					return V.tpl[type];
				}
				
				// 有两个参数，并存入模板
				if (!V.tpl[type]) {
					V.tpl[type] = tpl;
				}
			
				// 当只有两个参数，但用户希望是直接调用已有模板，即参数为type,data
				if (len === 2 && typeof args[len - 1] === "object") {
					data = tpl;
				}
			
				// 当用户只希望添加新模板，即参数为type, tpl，不需要调用data相关方法
				if (!data) {
					return;
				}

				if (typeof M.getData(data.type) === "undefined") {
					M.setData(data.type, data.data);
				}
				return formateHTML(V.tpl[type], data);
			}

			function powerV(str) {
				var replaceKey = "__REPLACEKEY__";

				function eachArray(arr, fn) {
					for (var i = 0, len = arr.length; i < len; i++) {
						fn(i, arr[i], len);
					}
				}

				function formateItem(str, rep) {
					return str.replace(new RegExp(replaceKey, "g"), rep);
				}

				function getHTML(str, type) {
					var html = str.replace(/(\w+)([^\{\}]*)?(\{([@\w]+)\})?(.*?)$/g,
						function (match, $1, $2, $3, $4, $5) {
							$2 = $2 || "";
							$3 = $3 || "";
							$4 = $4 || "";
							$5 = $5.replace(/\{([@\w]+)\}/g, "");
							html = type === "add" ?
								"<" + $1 + $2 + $5 + ">" + $4 + "</" + $1 + ">" + replaceKey :
								type === "in" ?
									"<" + $1 + $2 + $5 + ">" + $4 + replaceKey + "</" + $1 + ">" :
									"<" + $1 + $2 + $5 + ">" + $4 + "</" + $1 + ">";
							return html;
						})
						.replace(/#([@\w\-]+)/g, " id='$1'")
						.replace(/\.([@\-\w]+)/g, " class='$1'")
						.replace(/\[(.*)\]/g, function (match) {
							var props = match.replace(/'|"/g, "")
								.split(" ");
							var finalProp = "";
							for (var i = 0, len = props.length; i < len; i++) {
								finalProp += " " + props[i].replace(/=(.*)/g, "='$1'");
							}
							return finalProp;
						})
						.replace(/([@\w]+)/g, "{#$1#}");
					return html;
				}

				var level = str.replace(/^\s+|\s+$/g, "")
					.replace(/\s+(>)\s+/g, "$1")
					.split(">");
				var sibling;
				// 针对同一level的模板
				var html = replaceKey;
				// 针对兄弟元素的模板
				var nodeTpl;

				eachArray(level, function (levelIndex, levelItem, levelLen) {
					sibling = levelItem.split("+");
					nodeTpl = replaceKey;
					eachArray(sibling, function (siblingIndex, siblingItem, siblingLen) {
						nodeTpl = formateItem(nodeTpl, getHTML(siblingItem, siblingIndex === siblingLen - 1 ?
							(levelIndex === levelLen - 1 ? "" : "in") :
							"add"));
					})
					html += formateItem(html, nodeTpl);
				});

				return html;

			}

			function addHTMLToDOM(parent, str) {
				parent.innerHTML = powerV(str);
			}
		
			// return view
			return {
				simpleV: function () {
					var args = [].slice.call(arguments);
					return simpleV.apply(null, args);
				},
				powerV: function (str) {
					powerV(str);
				},
				addHTML: function (parent, str) {
					addHTMLToDOM(parent, str);
				}
			}
		} ();

		MVVM.viewManager = function () {
			var M = MVVM.model;
			var V = MVVM.view;
			// 设置大小相关时使用的基准单位大小，即body的font-size
			/*
			var baseUnit = function () {
				return parseInt(document.body.currentStyle ? document.body.currentStyle["fontSize"] :
					getComputedStyle(document.body, false)["fontSize"]);
			} ();
			*/
			// 封装具体算法
			var Method = {};
		
			// 获取HTML元素中"data-bind"属性，并从中得到data
			function getBindData(dom) {
				var data = dom.getAttribute("data-bind");
				return !!data && (new Function("return {" + data + "}"))();
			}
		
			// 向Method中添加新的算法
			function compileMethod(name, fn) {
				if (typeof Method[name] !== "undefined") {
					console.log(name);
					throw new Error("method already existed in VM of MVVM, \
					    cannot be rewrriten!");
				}
				if (typeof fn !== "function") {
					throw new Error("This method to be added to VM of MVVM \
					    is not a function!");
				}
				Method[name] = fn;
			}
			
			return {
				execute: function () {
					var doms = document.body.getElementsByTagName("*");
					for (var i = 0; i < doms.length; i++) {
						if (doms[i].className.indexOf("VM-finished") > -1) {
							continue;
						}
						
						var data = getBindData(doms[i]);
						// 如果方法对应的JS文件没有添加到页面，用module异步加载
						// 缺点：代码和module耦合性过高
						if (!!data.type && !Method[data.type]) {
							F.module(["scripts/" + data.type], function(fn) {
								return;
							});
						}
						
						if (!!data && Method[data.type]) {
							Method[data.type](doms[i], data.data);
							doms[i].classList.add("VM-finished");
						}
						
					}
				},
				addMethod: function (name, fn) {
					compileMethod(name, fn);
				}
			};
		} ();

		return MVVM;
	})
});

