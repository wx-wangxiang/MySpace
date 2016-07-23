
define(['jquery'], function($) {
	function ScrollTo(opts) {
		this.opts = $.extend({}, Scroll.DEFAULTS, opts);
	}

	Scroll.prototype.test = function() {
		console.log('hello world');
	};
	Scroll.DEFAULTS = {
		dest: 0, //指定的滑动的位置
		speed: 800 //滑动的速度
	};

	return {
		Scroll: Scroll
	}
})