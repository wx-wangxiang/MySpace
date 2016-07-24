require.config({
	baseUrl: 'static',
	map: {
		'*': {'css': 'http://apps.bdimg.com/libs/require-css/0.1.8/css.min.js'}
	},
	paths: {
		jquery: 'http://apps.bdimg.com/libs/jquery/2.1.4/jquery.min'
	}
});
require(['jquery', 'modules/backtop/backtop'], function($, backtop) {
	/*new backtop.BackTop('#top',{
		mode: 'move'
	})*/

	$('#top').backtop({
		mode: 'move',
		speed: 800
	})
})