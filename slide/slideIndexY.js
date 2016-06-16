require.config({
	baseUrl: '.',
	paths: {
		c: '../commen'
	}
});
require(['slide', 'c/tools'], function (slide, tool) {
	document.addEventListener("touchmove", function(e) {e.preventDefault()});
	var pageDOM = tool.get('.focus');
	new slide({el:pageDOM, swipe:'Y'});
});