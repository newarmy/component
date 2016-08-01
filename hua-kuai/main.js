
require.config({
	baseUrl: '.',
	paths: {
		'c': '../commen',
		'zepto': '../commen/zepto.min'
	},
	shim: {
		'zepto': {
			exports: 'Zepto'
		}
	}
});
require(['zepto', 'slider'], function ($, Slider) {
	var priceObj = new Slider({
			box: $('.slider').eq(0),
			min: 0,
			max: 100,
			initValue: [5, 20],
			minSpace:5,
			step: 1
		});
});