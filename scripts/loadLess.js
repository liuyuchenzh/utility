$(function() {
	F.module("scripts/loadLess", function() {
		var loadLess = function(name) {
			var link = document.createElement("link");
			link.setAttribute("rel", "stylesheet");
			link.setAttribute("href", "less/" + name + ".css");
			document.head.appendChild(link);
		}
		return loadLess;
	});
});