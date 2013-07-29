(function (jQuery, undefined) {

	var ca = function (obj, scope) {
		if ($.isArray(scope)) {
			obj = obj.apply(scope);
		} else {
			obj = obj.call(scope);
		}
		return obj;
	};

	var info = function (str) {
		if (console && console.log) {
			console.log(str);
		}
	};

	jQuery.loadSubScript = function (url, scope, callback, async, json) {

		var retObj = null;

		var jx = {
			type : 'GET',
			dataType : 'text',
			success : function (data) {
				try {

					var obj = undefined;

					if (json) {
						obj = data;
					} else {
						var fn = new Function(' return ' + data);
						if (data.indexOf('function') == 0) {
							obj = fn();
						} else {
							obj = ca(fn, scope);
						}
					}

					if (obj) {
						if ($.isFunction(obj)) {
							obj = ca(obj, scope);
						} else {
							if(!$.isArray(obj)){
								obj = $.extend(true, scope, obj);
							}
						}

						if (callback) {
							if ($.isFunction(callback)) {
								callback(obj);
							} else {
								if ($.isFunction(callback.success)) {
									callback.success(obj);
								}
							}
						} else {
							if (jx.async == false) {
								retObj = obj;
							}
						}
					}

				} catch (e) {
					info(e.stack || e);
				}
			},
			error : function (jqXHR, textStatus, errorThrown) {
				if (callback && callback.error) {
					callback.error(jqXHR, textStatus, errorThrown);
				} else {
					info('Loader Error:\n' + errorThrown);
				}
			}
		};

		(async !== undefined) && (jx.async = async);
		json && (jx.dataType = 'json');

		if (typeof url === 'string') {
			jx.url = url;
		} else {
			$.extend(true, jx, url);
		}

		$.ajax(jx);
		return retObj;

	};

})(jQuery);
