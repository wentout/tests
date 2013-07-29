(function (jQuery, undefined) {

	var ca = function (obj, scope) {
		if ($.isArray(scope)) {
			obj = obj.apply(scope);
		} else {
			obj = obj.call(scope);
		}
		return obj;
	};

	jQuery.loadSubScript = function (url, scope, callback) {

		var jx = {
			type : 'GET',
			dataType : 'text',
			success : function (data) {
				try {

					var fn = new Function(' return ' + data);

					if (data.indexOf('function') == 0) {
						var obj = fn();
					} else {
						obj = ca(fn, scope);
					}

					if (obj) {
						if ($.isFunction(obj)) {
							obj = ca(obj, scope);
						} else {
							obj = $.extend(true, scope, obj);
						}

						if (callback) {
							callback(obj);
						} else {
							if (jx.async == false) {
								return obj;
							}
						}
					}

				} catch (e) {
					console.log(e);
				}
			},
			error : function (jqXHR, textStatus, errorThrown) {
				console.log('Loader Error:\n' + errorThrown);
			}
		};

		if (typeof url === 'string') {
			jx.url = url;
		} else {
			opts && ($.extend(true, jx, url));
		}

		$.ajax(jx);

	};

})(jQuery);
