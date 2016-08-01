//滑块组件
define(function () {
	function Slider(opt){
		this.box = opt.box;
		this.min = opt.min;
		this.max = opt.max;
		this.fix = opt.fix || 0;
		this.initValue = opt.initValue;
		this.step = opt.step;
		this.danwei = opt.danwei || '万';
		this.leftCtrl = null;//左按钮
		this.rightCtrl = null;//右按钮
		this.block = null;
		this.info = null;
		this.boxWidth = 0;
		this.ctrlWidth = 0;
		this.infoWidth = 0;
		this.boxLeft = 0;
		this.ratio = 0;
		this.space = 0;
		this.minSpace = opt.minSpace || 0;//最大和最小值的距离
		this.minValue = 0;
		this.maxValue = 0;
		this.dragFlag = false;//是否在拖拽状态
		this.dragObj = null;//被拖拽dom对象
		this.mouseNum = 0;
		this.dir = '';//那个滑块被拖拽, left or right
		this.init();
	}
	Slider.prototype = {
		init: function () {
			var k = this;
			
			k.leftCtrl = k.box.find('.pos-l');
			k.rightCtrl = k.box.find('.pos-r');
			k.leftCtrl.css('z-index', 2);
			k.rightCtrl.css('z-index', 2)
			k.block = k.box.find('.pos-block');
			k.info = k.box.find('.posnum');
			k.boxWidth = k.box.width();
			k.ctrlWidth = k.leftCtrl.width();
			k.infoWidth = k.info.width();
			k.ratio = k.boxWidth/(k.max - k.min);
			k.space = Number(k.step*k.ratio);
			k.minSpace = Number(k.minSpace*k.ratio);
			
			k.initPos();
			k.initClickEvent();
			k.initMoveEvent();
		},
		initPos: function () {
			var k = this;
			var imin = k.initValue[0];
			var imax = k.initValue[1];
			var trueLeftPos = (k.initValue[0] - k.min)*k.ratio;
			var trueRigthPos = (k.initValue[1] - k.min)*k.ratio;
			var truew = trueRigthPos - trueLeftPos;
			k.setPos(trueLeftPos, trueRigthPos, truew);
			k.setView(trueLeftPos, truew, imin, imax, true);
		},
		initClickEvent: function () {
			var k = this;
			k.box.click(function (e) {
				if(k.mouseNum >= 2) {
					k.mouseNum = 0;
					return;
				}
				k.boxLeft = k.box.offset().left;
				var t = e.target;
				var curLeft = e.clientX - k.boxLeft;
				var rl = k.getLeft(k.rightCtrl);
				var ll = k.getLeft(k.leftCtrl);
				var lv = Math.abs(curLeft - ll);
				var rv = Math.abs(rl - curLeft);
				if( lv > rv) {
					k.setPos(null, curLeft, (curLeft - ll));
					k.setView(ll, (curLeft - ll), null, Number(curLeft/k.ratio).toFixed(k.fix));
				} else if(lv < rv) {
					k.setPos(curLeft, null, (rl  - curLeft));
					k.setView(curLeft, (rl  - curLeft),  Number(curLeft/k.ratio).toFixed(k.fix), null);
				}
			});
		},
		initMoveEvent: function () {
			var k = this;
			k.box.on('touchstart', function (e) {
				e.preventDefault();
				var t = $(e.target);
				var originLeft = e.touches[0].clientX;
				var newpos = 0;
				k.boxLeft = k.box.offset().left;
				if(t.hasClass('pos-l') || t.parent().hasClass('pos-l')) {
					//左侧滑块
					k.dragObj = t;
					k.dragFlag = true;
					k.mouseNum++;
					k.dir = 'left';
				} else if(t.hasClass('pos-r') || t.parent().hasClass('pos-r')) {
					//右侧滑块
					k.dragObj = t;
					k.dragFlag = true;
					k.mouseNum++;
					k.dir = 'right';
				} else {
					return;
				}
				k.box.on('touchmove', function (e) {
					if(!k.dragFlag) {
						return;
					}
					var curLeft = e.touches[0].clientX;
					var abs = curLeft - originLeft;
					var rl = k.getLeft(k.rightCtrl);
					var ll = k.getLeft(k.leftCtrl);
					var absJL = Math.abs(abs);
					if(k.dir == 'left' && (absJL >= k.space)) {
						if(abs > 0) {// 向右拖拽
							newpos = ll + absJL;
							if(newpos >= rl-k.minSpace) {
								newpos = rl-k.minSpace;
							}
							k.setPos(newpos, null, (rl  - newpos));
							k.setView(newpos - k.ctrlWidth/2, (rl  - newpos),  Number(newpos/k.ratio).toFixed(k.fix), null);
						} else {// 向左拖拽
							newpos = ll - absJL;
							if(newpos <= 0) {
								newpos = 0;
							}
							k.setPos(newpos, null, (rl  - newpos));
							k.setView(newpos - k.ctrlWidth/2, (rl  - newpos),  Number(newpos/k.ratio).toFixed(k.fix), null);
						}
						originLeft = curLeft;
					} else if(k.dir == 'right' && (absJL >= k.space)) {
						if(abs > 0) {// 向右拖拽
							newpos = rl + absJL;
							if(newpos >= k.boxWidth) {
								newpos = k.boxWidth;
							}
							k.setPos(null, newpos, (newpos - ll));
							k.setView(ll-k.ctrlWidth/2, (newpos - ll), null, Number(newpos/k.ratio).toFixed(k.fix));
						} else {// 向左拖拽
							newpos = rl - absJL;
							if(newpos <= ll+k.minSpace) {
								newpos = ll+k.minSpace;
							}
							k.setPos(null, newpos, (newpos  - ll));
							k.setView(ll-k.ctrlWidth/2, (newpos  - ll), null, Number(newpos/k.ratio).toFixed(k.fix));
						}
						originLeft = curLeft;
					}
				});
				k.box.on('touchend', function (e) {
					k.box.off('touchmove');
					k.box.off('touchend');
					k.dragObj = null;
					k.dragFlag = false;
					k.mouseNum++;
					k.dir = '';
				});
			});
			
		},
		getLeft: function (obj) {
			var k = this;
			var v = obj.css('left').replace('px', '');
			return Number(v)+k.ctrlWidth/2;
		},
		setPos: function (lpos, rpos, width) {
			var k = this;
			if(lpos !== null){
				k.leftCtrl.css('left',(lpos-(k.ctrlWidth/2)) + "px");
			}
			if(rpos !== null) {
				k.rightCtrl.css('left', (rpos-(k.ctrlWidth/2)) + "px");
			}
			if(lpos !== null) {
				k.block.css('left', lpos + "px");
			}
			k.block.css('width', width + "px");
		},
		setView: function (lpos, width, lvalue, rvalue, isInit) {
			var k = this;
			k.infoWidth = k.info.width();
			if(isInit) {
				k.info.css('left', (lpos-k.ctrlWidth/2+width/2 - k.infoWidth/2)+'px');
			} else {
				k.info.css('left', (lpos+width/2 - k.infoWidth/2)+'px');
			}
			
			if(lvalue !== null){
				k.minValue = (isInit ? Number(lvalue).toFixed(k.fix) :  (k.min + Number(lvalue)).toFixed(k.fix));
			}
			if(rvalue !== null) {
				k.maxValue = (isInit ? Number(rvalue).toFixed(k.fix) :  (k.min + Number(rvalue)).toFixed(k.fix))
			}
			k.info.html('<em></em>'+k.minValue+'-'+k.maxValue+k.danwei);
		}
	};
	return Slider;
});	