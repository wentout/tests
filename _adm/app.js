$(function () {

	var loader = $.loadSubScript;

	var syncJSONLoader = function (src) {
		return loader(src, null, null, false, true);
	};

	var modules = (function () {
		var cache = {};
		var ld = function (name, scp, callback) {
			var src = './modules/' + name + '.js';
			var obj = loader(src, scp || scope, callback || null, false);
			cache[name] = obj;
			return obj;
		};
		return function (name, scp, callback, reload) {
			if (cache[name] && (!reload)) {
				return cache[name];
			}
			return ld(name, scp, callback);
		};
	})();

	var locale = {
		name : 'en-en',
		path : function () {
			return './i18n/' + this.name + '.js';
		}
	};

	var scope = {
		locale : syncJSONLoader(locale.path()),
		info : function (str, pre) {
			var to = $('#info');
			to.removeClass('hide');
			if (pre) {
				to.html('<pre>' + str + '</pre>');
			} else {
				to.html(str);
			}
		},
		paths : {
			options : {
				get : './options/get/',
				set : './options/set/'
			},
			tree : {
				get : './api/tree/get/',
				close : './api/tree/close/',
			},
			page : {
				get : './api/page/get/',
				set : './api/page/set/',
				del : './api/page/del/',
				focus : './api/page/getfocus',
				blur : './api/page/blur/',
				order : './api/page/order/',
				rename : './api/page/rename/',
				move : './api/page/move/'
			}
		},
		links : {
			main : ['pages', 'templates', 'files', 'settings']
		},
		settings : null,
		blank_page : {
			title : '',
			keywords : '',
			description : '',
			pageIsCode : false,
			header : '',
			page : '',
			props : {},
			template : 'default'
		},
		pageScope : null,
		treeController : null,
		pageEditor : null,
		props : {
			pageBorder : 'PageController_PageBorder',
			activeTab : 'PageController_ActiveTab'
		},
		enableFocusHandler : true,
		magnet : null,
		ajax : function (path, successCallback, opts) {
			var obj = {
				type : "POST",
				async : false,
				dataType : 'text',
				url : path,
				success : function (data) {
					if (data) {
						if (successCallback) {
							try {
								var obj = $.parseJSON(data);
							} catch (e) {
								scope.info(data + '<hr>' + e.stack || e, true);
							}
							if (obj) {
								successCallback(obj);
							}
						}
					} else {
						scope.info('no data');
					}
				}
			};
			opts && ($.extend(true, obj, opts));
			$.ajax(obj);
		},
		jData : function (str) {
			return js_beautify(JSON.stringify(str), {
				indent_size : 1,
				indent_char : '\t',
				brace_style : 'collapse'
			});
		},
		currentHeight : function (asString, minus) {
			!minus && (minus = 0);
			var h = parseInt($('#container').css('minHeight')) - minus;
			asString && (h += 'px');
			return h;
		},
		setSizes : function () {
			$('#container').css({
				'minHeight' : '' + ($(document).height() - 75) + 'px'
			});
		},
		parsePageModel : function (data, obj) {
			if (!obj) {
				var obj = $.extend(true, {}, scope.blank_page);
				if (data) {
					obj = JSON.parse(data.model);
					obj.page = data.page;
				}
			}
			var $scope = scope.pageScope;
			if ($scope) {
				$scope.model = obj;
				if ($scope.$$childTail && $scope.$$childTail.model) {
					$scope.$$childTail.model = obj;
				}
				pageDigest(function () {
					var val = scope.pageScope.model.page;
					scope.pageEditor.setValue(val, -1);
				});
			}
		},
		ls : {
			get : function (prop) {
				var item = window.localStorage.getItem('Fine Cut LS');
				var obj = null;
				if (item) {
					try {
						obj = JSON.parse(item);
						if (prop) {
							return obj[prop];
						}
					} catch (e) {
						window.localStorage.removeItem('Fine Cut LS');
					}
				}
				return obj;
			},
			set : function (prop, value) {
				var obj = ls.get() || {};
				obj[prop] = value;
				window.localStorage.setItem('Fine Cut LS', JSON.stringify(obj));
			},
			setPageBorder : function (w) {
				ls.set('pageBorderWidth', w);
			},
			getPageBorder : function () {
				return ls.get().pageBorderWidth;
			}
		},
		pageDigest : function (callback) {
			pageDigestCounter++;
			var buffer = 0 + pageDigestCounter;
			window.setTimeout(function () {
				if (buffer == pageDigestCounter) {
					pageDigestCounter = 0;
					try {
						scope.pageScope.$digest();
						callback && callback();
					} catch (e) {
						debugger;
					}
				}
			}, 10);
		}

	};

	$(window).on('resize', function () {
		scope.setSizes();
	});

	// var angular = angular.noConflict();

	var pageDigestCounter = 0;
	scope.treeConfig = modules('treeCfg');

	var ls = scope.ls;
	if (!ls.get(scope.props.pageBorder)) {
		!ls.set(scope.props.pageBorder, '300px');
	}
	if (!ls.get(scope.props.activeTab)) {
		!ls.set(scope.props.activeTab, 'page_head');
	}

	var hbm = modules('headCtrl');

	var app = angular.module('fineCutAdm', [])

		.config(['$locationProvider', function ($locationProvider) {
					$locationProvider.hashPrefix('!');
				}
			])
		.config(modules('routes'))
		.controller('HeadCtrl', hbm.h)
		.controller('BodyCtrl', hbm.b)
		.controller('MainTabCtrl', hbm.m)

		.service('pageModel', [function () {
					return $.extend(true, {}, scope.blank_page);
				}
			])

		.controller('PagesCtrl', modules('pagesCtrl'))
		.controller('SettingsCtrl', ['$scope', function ($scope) {
					scope.ajax(scope.paths.options.get, function (obj) {
						scope.settings = obj;
					}, {
						method : 'GET'
					});
					var scp = modules('settingsCtrl');
					$.extend(true, $scope, scp);
				}
			])

		.controller('TemplatesCtrl', ['$scope', function ($scope) {}
			])

		.controller('FilesCtrl', ['$scope', function ($scope) {
					$('#FilesExplorerFrame').height(scope.currentHeight(true));
				}
			])

		.directive('ngHover', function () {
			return function (scope, element) {
				element.bind('mouseenter', function () {
					element.addClass('hover');
				}).bind('mouseleave', function () {
					element.removeClass('hover');
				})
			}
		});

	angular.bootstrap($('#ng-app'), ['fineCutAdm']);

});
