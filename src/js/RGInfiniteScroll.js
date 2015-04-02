/**
 * Infinite scroll
 * 스크롤에서 가장 아래쪽으로 내려가면 데이터를 추가로 불러들인다.
 *
 * @param {Array} el
 * @param {Object} options
 * @return void
 */
function RGInfiniteScroll(el, options)
{
	var self = this;
	var eventID = '.rgInfiniteScroll';

	// set public values
	this.$self = $(el);
	this.sets = $.extend({}, this.defaults, options);
	this.sets.ajaxOptions = $.extend({}, this.defaults.ajaxOptions, options.ajaxOptions);
	this.sets.loadOptions = $.extend({}, this.defaults.loadOptions, options.loadOptions);
	this.bottomY = 0;
	this.current = this.sets.startNumber;


	/* ---------------------------------
	 PRIVATE FUNCTIONS
	 -------------------------------- */

	/**
	 * init scroll event
	 *
	 * @Return void
	 */
	var scrollEvent = function()
	{
		self.$self.on('scroll' + eventID, function(){
			if ($(window).scrollTop() > self.bottomY) {
				// update current number
				self.current++;
				// load data
				if (self.sets.url)
				{
					if (self.sets.loadingAction)
					{
						self.sets.loadingAction(true);
					}
					switch(self.sets.method)
					{
						case 'load':
							self.load(self.current);
							break;
						case 'ajax':
							self.ajax(self.current);
							break;
					}
				}
			}
		});
	};

	/**
	 * init resize event
	 *
	 * @Return void
	 */
	var resizeEvent = function()
	{
		$(window).on('resize' + eventID, function(){
			self.bottomY = $(document).height() - $(window).height() - self.sets.bottomSpace;
		});
	};

	/**
	 * change url
	 * 페이지번호를 갱신해서 url 주소를 넘겨준다.
	 *
	 * @Param {String} url
	 * @Return {String}
	 */
	var changeUrl = function(url, n)
	{
		return url.replace('{page}', n);
	};


	/* ---------------------------------
	 PUBLIC FUNCTIONS
	 -------------------------------- */

	/**
	 * load items (load)
	 *
	 * @Param {Number} n
	 * @Return void
	 */
	this.load = function(n)
	{
		var options = null;
		var selector = null;
		if (this.sets.loadOptions)
		{
			options = this.sets.loadOptions;
			selector = (options.selector) ? ' ' + options.selector : '';
		}
		else
		{
			return false;
		}

		// stop scroll event
		self.stop();

		// update current
		this.current += (!n) ? 1 : 0;

		// n값이 없으면 this.current에서 한개 더한다.
		n = (n) ? n : this.current + 1;

		// load data
		$('<div>').load(changeUrl(this.sets.url, n) + selector, function(data, status){
			var more = (status == 'success');
			if (self.sets.loadingAction)
			{
				self.sets.loadingAction(false);
			}
			var $add = $(this).children();
			options.target.append($add);
			if (options.complete)
			{
				var result = options.complete($add);
				more = (result) ? true : false;
			}
			if (more)
			{
				self.run();
			}
		});
	};

	/**
	 * load items (ajax)
	 *
	 * @Param {Number} n
	 * @Return void
	 */
	this.ajax = function(n)
	{
		if (!this.sets.ajaxOptions) return false;

		// stop scroll event
		self.stop();

		// update current
		this.current += (!n) ? 1 : 0;

		// n값이 없으면 this.current에서 한개 더한다.
		n = (n) ? n : this.current;

		// load data
		$.ajax({
			url : changeUrl(this.sets.url, n)
			,cache : false
			,data : this.sets.ajaxOptions.data
			,dataType : this.sets.ajaxOptions.dataType
		}).done(function(data, status){
			if (self.sets.loadingAction)
			{
				self.sets.loadingAction(false);
			}
			if (self.sets.ajaxOptions.complete)
			{
				var more = self.sets.ajaxOptions.complete(data, status);
				if (more)
				{
					self.run();
				}
			}
		});
	};

	/**
	 * run
	 *
	 * @Param {Boolean} sw : RGInfiniteScroll객체를 리턴받고싶으면 true
	 * @Return {RGInfiniteScroll}
	 */
	this.run = function(sw)
	{
		// stop event
		this.stop();

		// init events
		scrollEvent();
		resizeEvent();

		// fire resize event
		$(window).trigger('resize' + eventID);

		return (sw) ? this : null;
	};

	/**
	 * stop
	 *
	 * @Return {RGInfiniteScroll}
	 */
	this.stop = function()
	{
		this.$self.off('scroll' + eventID);
		$(window).off('resize' + eventID);
	};

	/**
	 * go to page
	 *
	 * @Param {Number} n : 값이 없으면 초기 설정한 값으로 설정한다.
	 * @Return void
	 */
	this.setPageNumber = function(n)
	{
		this.current = (n) ? n : this.sets.startNumber;
	};

	// run event
	this.run();
}

// default values
RGInfiniteScroll.prototype.defaults = {
	bottomSpace : 50
	,url : null
	,startNumber : 2
	,method : 'load'
	,ajaxOptions : {
		data : ''
		,dataType : ''
		,complete : function(data, status) {
			console.log(data);
		}
	}
	,loadOptions : {
		target : null
		,selector : ''
		,complete : function(data) {
			console.log(data);
			return true;
		}
	}
	,loadingAction : function(sw) {
		// sw is true are "loading.."
		// sw is false are "load complete"
	}
}

// set jQuery plugin
;(function($) {
	return $.fn.rgInfiniteScroll = function(options) {
		return new RGInfiniteScroll($(this), options).run(true);
	};
})(jQuery);
