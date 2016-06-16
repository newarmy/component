
/*
* 手机横屏或竖屏事件
*
*/
define(function() {
	var orientationFunc = function (callback) {
		var flag = "onorientationchange" in window,
			height = document.documentElement.clientHeight,
			width = document.documentElement.clientWidth;
		if(flag) {
			window.addEventListener("orientationchange", function() {
				// window.orientation = 90 或 -90 时为横屏，其他为竖屏
				if (window.orientation != "0") {//横屏
					 callback('landscape');
				} else {//竖屏
					 callback('portrait');
				}
			}, false);
		} else {
			//可以通过window.setInterval(updateOrientation,5000);模拟事件
			window.addEventListener("resize", function() {
				height = document.documentElement.clientHeight;
				width = document.documentElement.clientWidth;
				if (!flag) {
					if (height < width) {//横屏
					   callback('landscape');
					} else {//竖屏
					   callback('portrait');
					}
				}
			}, false);
		} 
	};
	return orientationFunc;
});

	