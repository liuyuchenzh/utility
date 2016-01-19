$(function () {
	F.module("scripts/gallerySlider", ["scripts/MVVM", "scripts/loadLess"],
		function (MVVM, loadLess) {
			var M = MVVM.model;
			var V = MVVM.view;
			var VM = MVVM.viewManager;

			M.setData("gallerySlider", {
				"data": [
					{
						"href": "http://www.taobao.com/",
						"src": "../../taobao.jpg",
						"width": 100,
						"height": 100
					},
					{
						"href": "http://www.qq.com/",
						"src": "../../qq.jpg",
						"width": 100,
						"height": 100
					},
					{
						"href": "http://www.jd.com/",
						"src": "../../jd.jpg",
						"width": 100,
						"height": 100
					},
					{
						"href": "http://www.163.com/",
						"src": "../../netease.jpg",
						"width": 100,
						"height": 100
					}
				]

			});

			// 每个图片的模板，之后还要拼接成一个最终模板
			var imgTpl = "<a href='{#href#}' class='gallerySlider'>" +
				"<img src='{#src#}' width='{#width#}' height='{#height#}' />" +
				"</a>";

			// 添加模板
			V.simpleV("gallerySliderBasic", imgTpl);

			// 上一页以及下一页按钮的模板
			var buttonTpl = "<span class='prev button'><</span>" +
				"<span class='next button'>></span>";

			V.simpleV("pageBtn", buttonTpl);

			// 直接选取第几页的按钮模板
			var roundBtnTpl = "<span class='pageSelect button'></span>";

			V.simpleV("pageSelect", roundBtnTpl);

			// 封装gallerySlider算法
			VM.addMethod("gallerySlider", function (dom, data) {
				// 此时的data是字符串，一般为"gallerySliderX"，其中X为数字
				// 换句话说，针对不同数据（data，即模板名），会生成不同finalTpl
				// 并以唯一的methodName保存
				var tplName = data;
				data = M.getData(data).data;

				var num = data.length;
				var container = document.createElement("div");

				// 最终模板，根据图片的数量而变化
				var finalTpl = "";
				var html = "";

				// 根据图片位置，直接加载数据
				for (var i = 0; i < num; i++) {
					finalTpl += V.simpleV("gallerySliderBasic", data[i]);
				}

				container.innerHTML = finalTpl;
				dom.appendChild(container);

				// 加上翻页按钮
				html += V.simpleV("pageBtn");
				// 为圆形按钮添加包裹元素
				html += "<div class='pageSelectContainer'>"

				// 加上选择第几页的按钮（小圆圈）
				for (var i = 0; i < num; i++) {
					html += V.simpleV("pageSelect");
				}
				// 包裹元素结束
				html += "</div>";

				// 更新dom内容
				dom.innerHTML += html;

				// 由于直接用innerHTML更新dom内容
				// container引用的不是dom中的元素 而是加入dom之前的游离元素
				// 重新绑定container
				container = dom.firstChild;

				// 需要注意的是querySelectorAll得到的是static的list，后续增加节点不影响该结果
				var imgAnchorArr = dom.querySelectorAll("a");
				var selectBtnArr = dom.querySelectorAll("span.pageSelect");

				// 最前和最后添加轮播需要的首尾图片
				var fakeFirst = imgAnchorArr[0].cloneNode(true);
				var fakeLast = imgAnchorArr[num - 1].cloneNode(true);

				container.insertBefore(fakeLast, container.firstChild);
				container.appendChild(fakeFirst);

				// 设定初始显示情况
				imgAnchorArr[0].classList.add("show");
				selectBtnArr[0].classList.add("selected");

				// 轮播的窗口大小
				// 上下页的行高，确保按钮垂直居中
				// 放在一处绘制，提高性能
				var w = data[0]["width"];
				var h = data[0]["height"];
				container.style.width = w * (num + 2) + "px";
				container.style.transform = "translateX(" + -w + "px)";
				dom.style.width = w + "px";
				dom.style.height = h + "px";

				/*
				u.eachArray(imgAnchorArr, function(index, elem, len) {
					elem.style.left = index * w + "px";
				});
				*/

				// 点击上一页或下一页时，圆形按钮的显示改变
				function changePage(index) {
					u.eachArray(selectBtnArr, function (index, elem, len) {
						elem.classList.remove("selected");
					});
					selectBtnArr[index].classList.add("selected");
				}

				// 鼠标点击的处理
				// clickRunning用于判断动画是否完成
				var clickRunning = false;
				var clickHandler = (function () {
					var i = 0;
					var transitionRule = "transform .5s";

					var callback = function (e, data) {
						e = e || window.event;
						var target = e.target || e.srcElement;

						if (target.className.indexOf("button") < 0 || clickRunning) {
							return;
						}

						clickRunning = true;
						if (u.getStyle(container, "transition") !== transitionRule) {
							container.style.transition = transitionRule;
						}

						if (target.className.indexOf("next") > -1) {
							u.eachArray(imgAnchorArr, function (index, elem, len) {
								elem.classList.remove("show");
							});
							imgAnchorArr[++i > num - 1 ? i = 0 : i].classList.add("show");

							// 点击时, i = num-1, 点击后，i = 0，此时显示最右侧的轮播备用图
							if (i === 0) {
								container.style.transform = "translateX(" + -(num + 1) * w + "px)"
							} else {
								container.style.transform = "translateX(" + -(i + 1) * w + "px)"
							}
						}

						if (target.className.indexOf("prev") > -1) {
							u.eachArray(imgAnchorArr, function (index, elem, len) {
								elem.classList.remove("show");
							});
							imgAnchorArr[--i >= 0 ? i : i = num - 1].classList.add("show");

							// 点击时，i = 0，点击后， i = num-1，此时显示最左侧的轮播备用图
							if (i === num - 1) {
								container.style.transform = "translateX(0px)";
							} else {
								container.style.transform = "translateX(" + -(i + 1) * w + "px)";
							}

						}

						if (target.className.indexOf("pageSelect") > -1) {
							// 不用u.eachArray的原因是，并非对数组每个元素做同样的处理
							for (var j = 0, len = selectBtnArr.length; j < len; j++) {
								if (selectBtnArr[j] === target) {
									if (i === j) {
										return;
									}
									i = j;
									break;
								}
							}

							u.eachArray(imgAnchorArr, function (index, elem, len) {
								elem.classList.remove("show");
							});

							imgAnchorArr[i].classList.add("show");
							container.style.transform = "translateX(" + -(i + 1) * w + "px)";
						}

						// 改变圆形按钮的选中
						changePage(i);
						// 通知click事件正在运行中
						//clickRunning = true;
					};

					return callback;

				})();

				var transitionHandler = function (e) {
					var target = e.target;
					if (target !== container) {
						return;
					}
					function getNumber(rule) {
						var reg = /\D+(\d+)\D+/g;
						return rule.replace(reg, "$1");
					}
					// 获取的number没有正负号 一律为正数
					if (getNumber(target.style.transform) == (num + 1) * w) {
						target.style.transition = "none";
						target.style.transform = "translateX(" + -w + "px)";
					}
					if (getNumber(target.style.transform) == 0) {
						target.style.transition = "none";
						target.style.transform = "translateX(" + -num * w + "px)";
					}
					// 通知click事件结束
					clickRunning = false;
				};

				// 针对事件绑定中，短时间内多次点击时只进行第一次点击引发的动画
				// 直至动画结束后，才能开始下一次动画

				u.on(dom, "click", clickHandler);
				u.on(dom, "transitionend", transitionHandler);

				// 获取flip原色，以便得知其显示状态
				var flip = dom.parentNode;
				while (flip.className.indexOf("flip") < 0) {
					flip = flip.parentNode;
				}

				function shouldAutoSlide() {
					var sliderTop = Number(dom.getBoundingClientRect().top);
					var clientHeight = Number(document.documentElement.clientHeight);
					var displayState = u.getStyle(flip, "display");

					if (sliderTop < 0 || sliderTop > clientHeight
					        || displayState === "none") {
						return false;
					}
					return true;
				}
				// 自动轮播
				var timerID = setTimeout(function autoSlide() {
					if (!shouldAutoSlide()) {

					} else {
						transitionHandler({
						    "target": container
					    });

					    clickHandler({
						    "target": dom.querySelectorAll("span.next")[0]
					    });
					}

					timerID = setTimeout(autoSlide, 3000);
				}, 3000);

				u.on(dom, "mouseenter", function () {
					if (timerID) {
						clearTimeout(timerID);
					}
				});

				u.on(dom, "mouseleave", function () {
					timerID = setTimeout(function resume() {
						if (!shouldAutoSlide()) {

						} else {
							transitionHandler({
						        "target": container
					        });

						    clickHandler({
							    "target": dom.querySelectorAll("span.next")[0]
						    });
						}
						timerID = setTimeout(resume, 3000);
					}, 3000);
				});

			});

			VM.execute();
			loadLess("gallerySlider");
		})
})
