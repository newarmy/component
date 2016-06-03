
define( function(require, exports, module) {
	var slide = require('./slide');
	var tool = require('./tools');
	document.addEventListener("touchmove", function(e) {e.preventDefault()});
	var pageDOM = tool.get('.focus');
	new slide({el:pageDOM, swipe:'Y'});
});