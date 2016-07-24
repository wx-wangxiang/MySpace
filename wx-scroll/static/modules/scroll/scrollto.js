define(['jquery'], function($) {
	function ScrollTo(opts) {
		this.opts = $.extend({}, ScrollTo.DEFAULTS, opts);
		this.$el = $('body, html');
	}

	ScrollTo.prototype.test = function() {
		console.log('hello world');
	};
	ScrollTo.prototype.go = function() {
		this.$el.scrollTop(this.opts.dest);
	}
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