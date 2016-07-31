define(['jquery'], function($) {
	function FuzzyMatch(el, opts) {
		this.$el = $(el);
		this.opts = opts;
		this.selected = [];
		this._select = $('<select multiple class="form-control">'),
		this._init(opts.data);
	}

	$.extend(FuzzyMatch.prototype, {
		test: function(){
			console.log('test');
		},
		getSelected: function(){
			return this.selected;
		},
		matchEach: function(Data){
			var inputVal = this.$el.val(),
				data = Data,
				isMatched = false,
				matchResult = [],
				_this = this;
			$.each(data, function(index, item){
				isMatched = _this.match(inputVal, item);
				if(isMatched){
					matchResult.push(item);
				}
			});
			this.createList(matchResult);
		},
		match: function(matchVal, targetVal){
			var matchLength = matchVal.length,
				targetValLength = targetVal.length;
			if((matchLength > 0) && (matchLength <= targetValLength)){
				return RegExp(matchVal, 'g').test(targetVal);
			}
			return false;
		},
		createList: function(listData){
			var _this = this;
			this._select.html('');
			if(listData.length > 0){
				$.each(listData, function(index, item){
					var option = $('<option class="fuzzyMatch-item">');
					option.text(item);
					option.bind('click', function(){
						_this.$el.val($(this).text());
					})
					_this._select.append(option);
				})
			}
		},
		bind: function(){
			var _this = this;
			this.$el.on('click', function(e){
				e.stopPropagation();
				_this._select.show();
			}).bind('input propertychange', function(e){
				this.matchEach(this.opts.data);
			}.bind(this));
			this._select.on('change', function(e) {
				_this._selected = $(this).val();
				/*用时间发布订阅的方式来传递数据,将组件中选中的数据通过事件传递出去*/
				_this.$el.trigger('matched', {el: $(this), value: _this._selected});
			})
		},
		_init: function(){
			this.$el.after(this._select);
			this.bind();
			this.createList(this.opts.data);
		}
	});
	$.fn.extend({
		fuzzymatch: function(opts){
			return this.each(function(index, item){
				new FuzzyMatch(this, opts);
			})
		}
	});
})