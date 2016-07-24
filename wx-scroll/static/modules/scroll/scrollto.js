define(['jquery'], function($) {
	function ScrollTo(opts) {
		this.opts = $.extend({}, ScrollTo.DEFAULTS, opts);
		this.$el = $('body, html');
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
	ScrollTo.DEFAULTS = {
		dest: 0, //指定的滑动的位置
		speed: 800 //滑动的速度
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