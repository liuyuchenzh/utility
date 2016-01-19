$(function() {
	F.module("scripts/floorIndicator", ["scripts/MVVM", "scripts/loadLess"],
			function(MVVM, loadLess) {
		var M = MVVM.model;
		var V = MVVM.view;
		var VM = MVVM.viewManager;

		var tpl = "<li><a href='{#href#}' data-text='{#text#}'>{#floor#}</a></li>";

		M.setData("floorIndicator", {});

		V.simpleV("floorIndicator", tpl);

		VM.addMethod("floorIndicator", function(dom, data) {
			var floors = document.querySelectorAll(".floor");
			var num = floors.length;
			var html = "";
			data = [];

			for (var i = 0; i < num; i++) {
				var item = {};
				item.text = floors[i].dataset["title"];
				item.href = "#" + floors[i].id;
				item.floor = i + 1 + "F";
				data.push(item);
			}

			for (var i = 0; i < num; i++) {
				html += V.simpleV("floorIndicator", data[i]);
			}

			dom.innerHTML = html;

			var refreshFloor = function() {
				for (var i = 0; i < num; i++) {
					var floor = floors[i]
					var top = Number(floor.getBoundingClientRect().top);
					var height = Number(floor.clientHeight);

					if (top < 200 && Math.abs(top) < height - 200) {
						return i;
					}
				}
				return -1;
			};

			var shouldShow = function() {
				var top = Number(floors[0].getBoundingClientRect().top);
				if (top < 200) {
					return true;
				}
				return false;
			}

			requestAnimationFrame(function update() {
				var index = refreshFloor();
				var list = dom.querySelectorAll("a");
				if (shouldShow()) {
					dom.classList.add("show");
				} else {
					dom.classList.remove("show");
				}

				if (index < 0) {

				} else {
					list[index].innerHTML = list[index].dataset["text"];
					list[index].classList.add("show");
				}
				for (var i = 0; i < list.length; i++) {
				    if (i != index) {
						if (list[i].className.indexOf("over") > -1) {
							continue;
						}
						list[i].innerHTML = i + 1 + "F";
						list[i].classList.remove("show");
					}
				}

				requestAnimationFrame(update);
			});

			u.on(dom, "mouseover", function(e) {
				var target = e.target;
				if (target.nodeName !== "A") {
					return;
				}
				target.classList.add("over");
				target.innerHTML = target.dataset["text"];
			});

			u.on(dom, "mouseout", function(e) {
				var target = e.target;
				if (target.nodeName !== "A") {
					return;
				}
				target.classList.remove("over");
			})

		});

		VM.execute();
		loadLess("floorIndicator");
	})
})
