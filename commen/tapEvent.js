// tap事件  移动端模拟click事件
define(function(){
   var classType = 3;// 3:tag, 1:class, 2:id
    function addEvent(dom, type, callback) {
		dom.addEventListener(type, callback);
	}
	//返回的事件对象
	var eventObj= {};
	function getSelector(tar,type) {
		var style;
		switch(type) {
			case 1: 
				style = tar.className;
				break;
			case 2:
				style = tar.id;
				break;
			case 3:
				style = tar.tagName.toLowerCase();
				
		}
		return style;
	}
	function getTarget(tar, className, type){
		var style= getSelector(tar, type);

		while(style.indexOf($.trim(className)) == -1) {
			if(tar.flag) {
				return null;
			}
			
			tar = tar.parentNode;
			style= getSelector(tar, type);
		}
		return tar;
	}
	/**
	* 移动端模拟click事件
	*
	*  dom: html dom 元素
	*  callback：tap事件回调参数
	*  className： dom子元素的样式类名
	*
	*/
	return function(dom, callback, className) {
		var x, y, startTime, endTime, deltaTime = 0;
		dom.flag = 'parent';
		if(className) {
			if(className.indexOf('.') == 0) {
				classType = 1;
				className = className.replace('.', '');
			} else if(className.indexOf('#') == 0){
				classType = 2;
				className = className.replace('#', '');
			} else {
				classType = 3;
			}
		}
		addEvent(dom, 'touchstart', function (e) {
			e.preventDefault();
			startTime = Date.now();
			var t = null, tar;
			if(className) {
				t = e.target;
				tar = getTarget(t, className, classType);
				
				if(tar) {
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
			var t, tar;
			endTime = Date.now();
			deltaTime = endTime - startTime;
			if(className) {
				t = e.target;
				tar = getTarget(t, className, classType);
				if(tar) {
					
					if(Math.abs(x1 - x) < 5 && Math.abs(y1 - y) < 5 && deltaTime > 80) {
						eventObj.target = tar;
						callback(eventObj);
					}
				}
			} else {
				if(Math.abs(x1 - x) < 5 && Math.abs(y1 - y) < 5 && deltaTime > 80) {
					eventObj.target = e.target;
					callback(eventObj);
				}
			}
		});
		addEvent(dom, 'click', function (e) {
			e.preventDefault();
		});
	 }
});