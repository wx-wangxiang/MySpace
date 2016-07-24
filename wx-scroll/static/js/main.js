require.config({
	baseUrl: 'static',
	map: {
		'*': {'css': 'http://apps.bdimg.com/libs/require-css/0.1.8/css.min.js'}
	},
	paths: {
		jquery: 'http://apps.bdimg.com/libs/jquery/2.1.4/jquery.min'
	}
});
require(['jquery', 'modules/scroll/scrollto'], function($, scroll) {
	var scroll = new scroll.Scroll();
	$('#top').on('click', function() {
		scroll.go();
	})
})