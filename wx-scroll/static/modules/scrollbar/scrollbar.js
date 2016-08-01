/*滚动条的基本思路：
		滑块移动距离/滑块可移动距离 = 内容滚动高度/内容可滚动高度；
		鼠标移动距离 --> 滑块移动距离 --> 滑块可移动距离 --> 内容可滚动高度 
		--> 内容滚动高度 --> 设置滑块位置
*/
define(['jquery', 'css!./scrollbar.css'], function($) {
	console.log('scrollbar required!');
	function ScrollBar(opts) {
		this._init(opts);
	}

	$.extend(ScrollBar.prototype, {
		_init: function(opts) {
			var _this = this;
			_this.opts = {
				scrollDir: 'y', //滚动的方向，默认为y
				contSelector: '', //滚动内容区选择器
				barSelector: '', //滚动条选择器
				sliderSelector: '', //滚动滑块选择器
				wheelStep: 10 //滚轮步长
			}
			$.extend(true, _this.opts, opts||{});
			this.contentRatio = 0; 
			this._initDomEvent();
		},
		/**
		 * 初始化DOM引用
		 * @return {[type]} [description]
		 */
		_initDomEvent: function() {
			var opts = this.opts;
			//滚动内容区对象，必填项
			this.$cont = $(opts.contSelector);
			//滚动条滑块对象，必填项
			this.$slider = $(opts.sliderSelector);
			//滚动条对象
			this.$bar = opts.barSelector ? $(opts.barSelector) : this.$slider.parent();
			//获取文档对象
			this.$doc = $(document);
			this._initSliderDragEvent()._bindContScroll()._bindMousewheel();
			this._update();
		},
		_initSliderDragEvent: function() {
			var slider = this.$slider,
				sliderEl = slider[0],
				_this = this;
			if(sliderEl) {
				var doc = this.$doc,
					dragStartPagePosition,
					dragStartScrollPosition,
					dragContBarRate;
				function mousemoveHandler(e) {
					e.preventDefault();
					console.log('mousemove');
					if(dragStartPagePosition == null) {
						return;
					}
					console.log(dragStartPagePosition, e.pageY, dragContBarRate);
					_this.scrollTo(dragStartScrollPosition + (e.pageY - dragStartPagePosition) * dragContBarRate);
				}
				slider.on('mousedown', function(e) {
					e.preventDefault();
					console.log('mousedown');
					dragStartScrollPosition = _this.$cont[0].scrollTop;
					dragStartPagePosition = e.pageY;
					dragContBarRate = _this.getMaxScrollPosition() / _this.getMaxSliderPosition();
					console.log(_this.getMaxScrollPosition(), _this.getMaxSliderPosition());
					doc.on('mousemove.scroll', mousemoveHandler).on('mouseup.scroll', function(e) {
						console.log('mouseup');
						doc.off('.scroll'); 
					})
				})

			}
			return _this;
		},
		_update: function(){
			this.contentRatio = this.$cont.height() / (this.getMaxScrollPosition() + this.$cont.height());
			this.$slider.css('height', this.$bar.height() * this.contentRatio);
		},
		//监听内容的滚动，同步滑块的位置
		_bindContScroll: function() {
			var _this = this;
			_this.$cont.on('scroll', function(){
				var sliderEl = _this.$slider && _this.$slider[0];
				if(sliderEl) {
					sliderEl.style.top = _this.getSliderPosition() + 'px';
				}
			});
			return _this;
		},
		_bindMousewheel: function() {
			var _this = this;
			_this.$cont.on('mousewheel DOMMouseScroll', function(e) {
				e.preventDefault();
				var oEv = e.originalEvent,
					wheelRange = oEv.wheelDelta ? -oEv.wheelDelta/120 : (oEv.detail || 0) / 3;
				_this.scrollTo(_this.$cont[0].scrollTop + wheelRange * _this.opts.wheelStep);
			});
			return _this;
		},
		//计算滑块的当前位置
		getSliderPosition: function() {
			var _this = this;
				maxSliderPosition = _this.getMaxSliderPosition();
			return Math.min(maxSliderPosition, maxSliderPosition * _this.$cont[0].scrollTop/_this.getMaxScrollPosition());
		},
		//内容可滚动的高度
		getMaxScrollPosition: function(){
			var _this = this;
			return Math.max(_this.$cont.height(), _this.$cont[0].scrollHeight) - _this.$cont.height();
		},
		//滑块可移动的距离
		getMaxSliderPosition:　function() {
			var _this = this;
			return _this.$bar.height() - _this.$slider.height();
		},
		scrollTo: function(positionVal) {
			var _this = this;
			_this.$cont.scrollTop(positionVal);
			console.log(positionVal);
		}
	});

	return {
		ScrollBar: ScrollBar
	}
})