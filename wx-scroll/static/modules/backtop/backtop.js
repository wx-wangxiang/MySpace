define(['jquery', '../scroll/scrollto'], function($, scroll) {
	function BackTop(el, opts) {
		this.opts = $.extend({}, BackTop.DEFAULTS, opts);
		this.$el = $(el);
		this.scroll = new scroll.Scroll({
			dest: 0,
			speed: this.opts.speed
		});
		this._init();
		if(this.opts.mode == 'move') {
			this.$el.on('click', $.proxy(this._move, this));
		}else{
			this.$el.on('click', $.proxy(this._go, this));
		}
		$(window).on('scroll', $.proxy(this._checkPosition, this));
	}
	BackTop.DEFAULTS = {
		mode: 'move', //滑动的方式，是运动到指定位置还是直接定位到指定位置：move是运动，go是直接到指定位置
		pos: $(window).height(), //返回顶部按钮的出现和隐藏的临界点
		speed: 800 //滑动的速度
	};
	BackTop.prototype._init = function() {
		this._checkPosition();
	};
	BackTop.prototype._move = function() {
		this.scroll.move();
	};
	BackTop.prototype._go = function() {
		this.scroll.go();
	}
	BackTop.prototype._checkPosition = function() {
		if($(window).scrollTop() > this.opts.pos) {
			this.$el.fadeIn();
		}else{
			this.$el.fadeOut();
		}
	}

	/*注册为jquery插件*/
	$.fn.extend({
		backtop: function(opts) {
			return this.each(function(index, item) {
				new BackTop(this, opts);
			})
		}
	})
	/*requirejs的模块化的返回写法*/
	return {
		BackTop: BackTop
	}
})