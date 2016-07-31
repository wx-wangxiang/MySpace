require(['jquery', './static/modules/fuzzy-match.js'], function($){
	var fuzzy = $('#fuzzy').fuzzymatch({
		data: ['1', '2', '3', '12', '13', '14', '15', '16', '17', '18','19','20','21','22', '23']
	});
	$('#fuzzy').on('matched', function(e, data){
		console.log('选中的项是:' + data.value)
	})
})