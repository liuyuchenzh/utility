var u = {};

// 增加class的方法
u.addClass = function(elem, classList) {
	classList = classList.split(" ");
	for (var i = 0, len = classList.length; i < len; i++) {
		elem.classList.add(classList[i]);
	}
};

// 只继承原型的方法
u.inheritPrototype = function(subClass, superClass) {
	subClass.prototype = Object.create(superClass.prototype);
	subClass.prototype.constructor = subClass;
};

// Page类
u.Page = function() {
	this.children = [];
	this.element = null;
};
u.Page.prototype = {
	init: function() {
		throw new Error("rewrite init");
	},
	add: function(child) {
		this.children.push(child);
		this.element.appendChild(child.getElement());
		return this;
	},
	getElement: function() {
		return this.element;
	},
	wrap: function(elem) {
		elem.element.innerHTML = this.element.outerHTML;
		this.oldElement = this.element
		this.element = elem.element;
		return this;
	},
	end: function() {
		return this.oldElement;
	}
};

// Container类
u.Container = function(className, parent) {
	u.Page.call(this);
	if (typeof className !== "string") {
		var temp = className;
		parent = temp;
		className = "";
	}
	this.class = className;
	this.parent = parent;
	this.init();
};

// 继承Page原型
u.inheritPrototype(u.Container, u.Page);

u.Container.prototype.init = function() {
	this.element = document.createElement("div");
	if (this.class) {
		u.addClass(this.element, this.class);
	}
};

u.Container.prototype.show = function() {
	this.parent && this.parent.appendChild(this.element);
};

// Header类
u.Header = function(text) {
	u.Page.call(this);
	this.text = text;
	this.init();
};

u.inheritPrototype(u.Header, u.Page);

u.Header.prototype.init = function() {
	this.element = document.createElement("h2");
	this.text && (this.element.innerHTML = this.text);
};

// List类
u.List = function(className) {
	u.Page.call(this);
	this.class = className;
	this.init();
};

u.inheritPrototype(u.List, u.Page);

u.List.prototype.init = function() {
	this.element = document.createElement("ul");
	if (this.class) {
		u.addClass(this.element, this.class);
	}
};

// Bullet类
u.Bullet = function(className, text) {
	u.Page.call(this);
	this.class = className;
	this.text = text;
	this.init();
};

u.inheritPrototype(u.Bullet, u.Page);

u.Bullet.prototype.init = function() {
	this.element = document.createElement("li");
	this.class && (u.addClass(this.element, this.class));
	this.text && (this.element.innerHTML = this.text);
};

// Paragraph类
u.Paragraph = function(className, text) {
	u.Page.call(this);
	if (!text) {
		text = className;
		className = "";
	}
	this.class = className;
  this.text = text;
	this.init();
};

u.inheritPrototype(u.Paragraph, u.Page);

u.Paragraph.prototype.init = function() {
	this.element = document.createElement("p");
	this.element.innerHTML = this.text;
	if (this.class) {
		u.addClass(this.element, this.class);
	}
};

// Span类
u.Span = function(className, text) {
	u.Page.call(this);
	if (!text) {
		text = className;
		className = "";
	}
	this.class = className;
	this.text = text;
	this.init();
};

u.inheritPrototype(u.Span, u.Page);

u.Span.prototype.init = function() {
	this.element = document.createElement("span");
	this.text && (this.element.innerHTML = this.text);
	if (this.class) {
		u.addClass(this.element, this.class);
	}
};

u.Span.prototype.getText = function() {
	return this.element.outerHTML;
};

// Anchor类
u.Anchor = function(text, href, className) {
	u.Page.call(this);
	this.text = text;
	if (href && href.indexOf(".") < 0) {
		className = href;
		href = "#";
	}
	this.href = href || "#";
  this.class = className;
	this.init();
};

u.inheritPrototype(u.Anchor, u.Page);

u.Anchor.prototype.init = function () {
	this.element = document.createElement("a");
	this.element.href = this.href;
	this.class && (u.addClass(this.element, this.class));
	this.element.innerHTML = this.text;
};

// Input类
u.Input = function(obj) {
	// type, name, id, value, placeholder, size
	u.Page.call(this);
	this.type = obj.type || "text";
	this.name = obj.name || obj.id || "";
	this.id = obj.id || obj.name || "";
	this.value = obj.value || "";
	this.placeholder = obj.placeholder || "";
	this.size = obj.size || 15;
	this.init();
};

u.inheritPrototype(u.Input, u.Page);

u.Input.prototype.init = function() {
	this.element = document.createElement("input");
	this.element.type = this.type;
	this.name && (this.element.name = this.name);
	this.id && (this.element.id = this.id);
	this.value && (this.element.value = this.value);
	this.placeholder && (this.element.placeholder = this.placeholder);
	this.element.size = this.size;
};

// Label类
u.Label = function(text, forWhich) {
	u.Page.call(this);
	this.text = text;
	this.for = forWhich;
	this.init();
};

u.inheritPrototype(u.Label, u.Page);

u.Label.prototype.init = function() {
	this.element = document.createElement("label");
	this.element.innerHTML = this.text;
	this.element.setAttribute("for", this.for);
}

// Select类
u.Select = function(name, id, className) {
	u.Page.call(this);
	this.name = name;
	// 当参数只有两个时
	// 默认参数为name和className
	if (arguments.length === 2) {
		className = id;
		id = name;
	}
	this.id = id || name;
	this.class = className;
	this.init();
}

u.inheritPrototype(u.Select, u.Page);

u.Select.prototype.init = function() {
	this.element = document.createElement("select");
	this.element.name = this.name;
	this.class && (u.addClass(this.element, this.class));
}

// Option类
u.Option = function(value, text) {
	u.Page.call(this);
	this.value = value;
	this.text = text || value;
	this.init();
}

u.inheritPrototype(u.Option, u.Page);

u.Option.prototype.init = function() {
	this.element = document.createElement("option");
	this.element.value = this.value;
	this.element.innerHTML = this.text;
}

// Alert类 创建提示框
u.Alert = function(data) {
	data.text = !!data.text ? data.text : "plz compile content";
	data.close = !!data.close ? data.close : "close";
	data.confirm = !!data.confirm ? data.confirm : "confirm"
	this.panel = document.createElement("div");
	this.content = "<p class='alert-content'>" + data.text + "</p>";
	this.close = "<a class='a-close'>" + data.close + "</a>";
	this.confirm = "<span class='alert-confirm'>" + data.confirm + "</span>";
	this.success = data.success;
	this.init();
}

u.Alert.prototype = {
	init: function() {
		this.panel.innerHTML = this.close + this.content + this.confirm;
		this.panel.classList.add("alert");
		document.body.appendChild(this.panel);
		this.bindEvent();
		this.hide();
	},
	bindEvent: function() {
		var that = this;
		u.on(that.panel, "click", function(e) {
			var target = e.target;

			if (target.className.indexOf("a-close") > -1) {
				that.hide();
			}
			if (target.className.indexOf("alert-confirm") > -1) {
				that.success();
				that.hide();
			}
		});
	},
	hide: function() {
		this.panel.style.display = "none";
	},
	show: function() {
	    this.panel.style.display = "block";
	}
}

// 迭代数组
u.eachArray = function(arr, fn) {
	var len = arr.length;
	var i = 0;
	for (; i < len; i++) {
		fn(i, arr[i], len);
	}
};

// 事件绑定
u.on = function(dom, type, fn, data) {
	if (dom.addEventListener) {
		dom.addEventListener(type, function(e) {
			fn.call(dom, e, data);
		}, false);
	} else if (dom.attachEvent) {
		dom.attachEvent("on" + type, function(e) {
			fn.call(dom, e, data);
		});
	} else {
		dom["on" + type] = function(e) {
			e = window.event;
			fn.call(dom, e, data);
		}
	}
}

// 获取样式
u.getStyle = function() {
	if (document.documentElement.currentStyle) {
		return function(dom, prop) {
			return dom.currentStyle[prop];
		}
	}
		return function(dom, prop) {
			return getComputedStyle(dom, false)[prop];
		}
}();

// 简单模板
u.template = (function() {
	var tpl = {
		JDsidebarMod:
			"<div class='sidebarMod {#name#}'>" +
		        "<a href='{#href#}'>" +
			        "<span>{#chineseName#}</span>" +
				"</a>" +
			"</div>",
	};

	function templateHTML(str, data) {
		var html = str.replace(/\{#(\w+)#\}/g, function(match, key) {
			return data[key];
		});
		return html;
	}

	var Action = {
		create: function(modType, dataArr) {
			var html = "";
			var str = tpl[modType];

			// 假如是Array式的data 当然判断方法很不好 但将就能用
			// 也可以用递归
			if (dataArr.length) {
				for (var i = 0, len = dataArr.length; i < len; i++) {
					html += templateHTML(str, dataArr[i]);
				}
			} else {
				// 假如data就是一个单独的对象
				html += templateHTML(str, dataArr);
			}
			return html;
		},
		show: function(container, modType, dataArr) {
			container.innerHTML = Action.create(modType, dataArr);
		},
		add: function(name, html) {
			tpl[name] = html;
		}
	};

	return {
		execute: function(container, modType, dataArr) {
			Action.show(container, modType, dataArr);
		},
		add: function(name, html) {
			Action.add(name, html);
		}
	}
})();

// 节流器
u.throttle = function() {
	var isClear = arguments[0];
	var fn;
	if (typeof isClear === "boolean") {
		fn = arguments[1];
		fn.timeID && clearTimeout(fn.timeID);
	} else {
		fn = isClear;    // arguments[0]
		var arg = arguments[1];
		// 处理传递进来的参数, 参数不足就用默认值
		arg = u.extend({
			context: null,
			param: [],
			time: 500
		}, arg);
		// 确保arg.param的格式是[], 后面要用apply
		if (Object.prototype.toString.call(arg.param) !== "[object Array]") {
			arg.param = [arg.param];
		}
		// 执行setTimeout前, 先清除之前的timeID
		u.throttle(true, fn);
		fn.timeID = setTimeout(function() {
			fn.apply(arg.context, arg.param);
		}, arg.time);
	}
}

// extend 针对Obj的拓展，不考虑保留已有属性
u.extend = function(target, source) {
	for (var i in source) {
		//if (!target[i]) {
			target[i] = source[i]
		//}
	}
	return target;
}

// 求顶部高度
u.getOffsetTop = function(elem, fromWhichElement) {
	fromWhichElement = fromWhichElement || document;
	var parent = elem.offestParent;
	var offsetTop = elem.offsetTop;
	while (parent !== fromWhichElement) {
		offsetTop += parent.offsetTop;
	}
	return offsetTop;
}

// 求页面的scrollTop
u.getPageScrollTop = (function() {
	var ua = navigator.userAgent;
	// 针对IE
	if (/rv/.test(ua)) {
		return function() {
			if (arguments.length) {
				return document.documentElement.scrollTop = arguments[0];
			}
			return document.documentElement.scrollTop;
		}
	}
	return function() {
		if (arguments.length) {
			return document.body.scrollTop = arguments[0];
		}
		return document.body.scrollTop;
	}
})();

// 延迟加载图片
u.DelayImg = function(container) {
	this.container = container || document;
	this.img = this.getImg();
	this.init();
};

u.DelayImg.prototype = {
	init: function() {
		this.update();
		this.bindEvent();
	},
	getImg: function() {
		var imgs = this.container.getElementsByTagName("img");
		var arr = [];
		// 可以使用arr = Array.prototype.slice.call(imgs)
		// 使用以下方法纯粹为了兼容老版IE
		for (var i = 0, len = imgs.length; i < len; i++) {
			arr.push(imgs[i]);
		}
		return arr;
	},
	update: function() {
		if (this.img.length === 0) {
			return;
		}
		for (var i = 0, len = this.img.length; i < len; i++) {
			var img = this.img[i];
			if (this.shouldShow(img)) {
				var that = this;
				(function(j) {
					setTimeout(function() {
						img.src = img.dataset.src;
					    that.img.splice(i, 1);
					}, 2000);
				})(i)
			}
		}
	},
	shouldShow: function(img) {
		var scrollTop = document.body.scrollTop || document.documentElement.scrollTop;
		var scrollBottom = scrollTop + document.documentElement.clientHeight;
		var imgTop = this.imgTop(img);
		var imgBottom = imgTop + img.offsetHeight;

		if (imgTop > scrollTop && imgTop < scrollBottom ||
		        imgBottom > scrollTop && imgBottom < scrollBottom) {
			return true;
		}
		return false;
	},
	imgTop: function(img) {
		var imgTop = img.offsetTop;
		var parent = img.offsetParent;
		while (parent) {
			imgTop += parent.offsetTop;
			parent = parent.offsetParent
		}
		return imgTop;
	},
	on: function(element, type, fn) {
		if (element.addEventListener) {
			element.addEventListener(type, fn, false);
		} else if (element.attachEvent) {
			element.attachEvent("on" + type, fn)
		} else {
			element["on" + type] = fn;
		}
		return this;
	},
	bindEvent: function() {
		var that = this;
		this.on(window, "scroll", function() {
			u.throttle(that.update, {context: that});
		});
		this.on(window, "resize", function() {
			u.throttle(that.update, {context: that});
		});
	}
}
