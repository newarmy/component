// tap事件  移动端模拟click事件
define(function(){
    function addEvent(dom, type, callback) {
		dom.addEventListener(type, callback);
	}
	/**
	* 移动端模拟click事件
	*
	*  dom: html dom 元素
	*  callback：tap事件回调参数
	*  className： dom子元素的样式类名
	*
	*/
	function addTapEvent(dom, callback, className) {
		var x, y;
		addEvent(dom, 'touchstart', function (e) {
			e.preventDefault();
			var t = null, style;
			if(className) {
				t = e.target;
				style = t.className;
				if(style.indexOf(className) > -1) {
					x = e.touches[0].clientX;
					y = e.touches[0].clientY;
				}
			} else {
				x = e.touches[0].clientX;
				y = e.touches[0].clientY;
			}
		});
		addEvent(dom, 'touchend', function (e) {
			//e.stopPropagation();
			e.preventDefault();
			var x1 = e.changedTouches[0].clientX;
			var y1 = e.changedTouches[0].clientY;
			var t, style;
			if(className) {
				t = e.target;
				style = t.className;
				if(style.indexOf(className) > -1) {
					if(Math.abs(x1 - x) < 5 && Math.abs(y1 - y) < 5) {
						callback(e);
					}
				}
			} else {
				if(Math.abs(x1 - x) < 5 && Math.abs(y1 - y) < 5) {
					callback(e);
				}
			}
		});
		addEvent(dom, 'click', function (e) {
			e.preventDefault();
		});
	 }
});