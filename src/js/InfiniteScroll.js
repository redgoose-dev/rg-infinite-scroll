function log(o){console.log(o);}

/**
 * Infinite scroll
 * 스크롤에서 가장 아래쪽으로 내려가면 데이터를 추가로 불러들인다.
 * ex) var foo =
 *
 * @param {Array} $el
 * @param {Object} options
 * @return void
 */
function RGInfiniteScroll($el, options)
{

	var self = this;
	var eventID = 'rgInfiniteScroll';

	// set public values
	this.$self = $el;
	this.sets = $.extend({}, this.defaults, options);
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
		self.$self.on('scroll.' + eventID, function(){
			if ($(window).scrollTop() > self.bottomY) {
				// off scroll event
				$(this).off('scroll.' + eventID);
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
		$(window).on('resize.' + eventID, function(){
			self.bottomY = $(document).height() - $(window).height() - self.sets.bottomSpace;
		});
	}

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
		var selector = '';
		if (this.sets.loadOptions)
		{
			options = this.sets.loadOptions;
		}
		else
		{
			return false;
		}

		selector = (options.selector) ? ' ' + options.selector : '';
		$('<div>').load(changeUrl(this.sets.url, n) + selector, function(){
			if (self.sets.loadingAction)
			{
				self.sets.loadingAction(false);
			}
			options.target.append($(this).children());
			if (options.done)
			{
				options.done($(this).children());
			}
			self.action();
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
			if (self.sets.ajaxOptions.done)
			{
				self.sets.ajaxOptions.done(data, status);
			}
		});
	}

	/**
	 * Action event
	 *
	 * @Param {Boolean} sw : RGInfiniteScroll객체를 리턴받고싶으면 true
	 * @Return {RGInfiniteScroll}
	 */
	this.action = function(sw)
	{
		// init events
		scrollEvent();
		resizeEvent();

		// fire resize event
		$(window).trigger('resize.' + eventID);

		return (sw) ? this : null;
	};

	/**
	 * Stop event
	 *
	 * @Return {RGInfiniteScroll}
	 */
	this.stop = function()
	{
		self.$self.off('scroll.' + eventID);
		$(window).off('resize.' + eventID);
	};
}

// default values
RGInfiniteScroll.prototype.defaults = {
	bottomSpace : 100
	,url : './data.html?page={page}&param2=value2'
	,startNumber : 1
	,method : 'load'
	,ajaxOptions : {
		data : ''
		,dataType : ''
		,done : function(data, status){  }
	}
	,loadOptions : {
		target : $('#body')
		,selector : '#data li'
	}
	,onDataLoad : null
	,loadingAction : function(sw) {
		if (sw == true)
		{
			// loading...
		}
		else
		{
			// load complete
		}
	}
};

// set jQuery plugin
(function($) {
	return $.fn.rgInfiniteScroll = function(options) {
		return new RGInfiniteScroll(this, options).action(true);
	};
})(jQuery);
