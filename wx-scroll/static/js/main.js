require.config({
	baseUrl: 'static',
	map: {
		'*': {'css': 'http://apps.bdimg.com/libs/require-css/0.1.8/css.min.js'}
	},
	paths: {
		jquery: 'http://apps.bdimg.com/libs/jquery/2.1.4/jquery.min'
	}
});
require(['jquery', 'modules/scrollbar/scrollbar'], function($, scrollbar) {
	/*new backtop.BackTop('#top',{
		mode: 'move'
	})*/
	var slider = new scrollbar.ScrollBar({
		contSelector: '.scroll-cont',
		barSelector: '.scroll-bar',
		sliderSelector: '.scroll-slider'
	})
})