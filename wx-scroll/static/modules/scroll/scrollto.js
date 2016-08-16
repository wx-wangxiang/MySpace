//增加了自定义滑动对象和slide方法 -- 2016/8/16
define(['jquery'], function($) {
	function ScrollTo(opts) {
		this.opts = $.extend({}, ScrollTo.DEFAULTS, opts);
		//this.$el = $('body, html');
		this.$el = $(this.opts.el);
	}
	ScrollTo.prototype.go = function() {
		var dest = this.opts.dest;
		if($(window).scrollTop() != dest) {
			this.$el.scrollTop(dest);
		}
	};
	ScrollTo.prototype.move = function() {
		var opts = this.opts,
			dest = opts.dest;
		if(!this.$el.is(':animated')) {
			if($(window).scrollTop() != dest) {
				this.$el.animate({
					scrollTop: dest
				}, opts.speed);
			}
		}
	};
	ScrollTo.prototype.slide = function(dest) {
		var opts = this.opts;
		this.$el.animate({
			scrollTop: dest
		}, opts.speed);
	};
	ScrollTo.DEFAULTS = {
		dest: 0, //指定的滑动的位置
		speed: 800, //滑动的速度
		el: 'body, html' //默认的滑动对象
	};
	/*$.fn.extend({
		scrollto: function(opts) {
			return this.each(function() {
				new ScrollTo(opts);
			})
		}
	})*/

	return {
		Scroll: ScrollTo
	}
})