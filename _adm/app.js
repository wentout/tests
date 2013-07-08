$(function () {

	var config = {
		locale : {
			name : 'en-en',
			head : {},
			body : {}
		},
		paths : {
			locale : function () {
				return './i18n/' + config.locale.name + '.js';
			},
			tree : {
				get : './api/tree/get/'
			}
		},
		links : {
			main : ['pages', 'templates', 'files', 'settings']
		},
		settings : null
	};

	var info = function (str, pre) {
		var to = $('#info');
		to.removeClass('hide');
		if (pre) {
			to.html('<pre>' + str + '</pre>');
		} else {
			to.html(str);
		}
	};

	var ajax = function (path, success, opts) {
		var obj = {
			type : "POST",
			async : false,
			dataType : 'text',
			url : path,
			success : function (data) {
				if (data) {
					if (success) {
						try {
							var obj = $.parseJSON(data);
						} catch (e) {
							info(data + '<hr>' + e.stack || e, true);
						}
						if (obj) {
							success(obj);
						}
					}
				} else {
					info('no data');
				}
			}
		};
		opts && ($.extend(obj, opts));
		$.ajax(obj);

	};

	ajax(config.paths.locale(), function (obj) {
		try {
			$.extend(true, config.locale, obj);
		} catch (e) {
			info(e.stack || e, true);
		}
	});

	var currentHeight = function (asString, minus) {
		!minus && (minus = 0);
		var h = parseInt($('#container').css('minHeight')) - minus;
		asString && (h += 'px');
		return h;
	};

	var setSizes = function () {
		$('#container').css({
			'minHeight' : '' + ($(document).height() - 75) + 'px'
		});
	};
	$(window).on('resize', function () {
		setSizes();
	});

	// var angular = angular.noConflict();

	var tree = {
		loader : function (path, callback) {
			ajax(config.paths.tree.get, function (obj) {
				if (obj.error) {}
				else {
					callback(obj);
				}
			}, {
				data : {
					leaf : JSON.stringify(path)
				},
				async : true
			});
		}
	};

	var app = angular.module('fineCutAdm', [])

		.config(['$locationProvider', function ($locationProvider) {
					$locationProvider.hashPrefix('!');
				}
			])

		.config(['$routeProvider', function ($routeProvider) {
					$routeProvider
					.when('/main', {
						templateUrl : 'parts/main.html',
						controller : 'MainTabCtrl'
					})
					.when('/pages', {
						templateUrl : 'parts/pages.html',
						controller : 'PagesCtrl'
					})
					.when('/templates', {
						templateUrl : './parts/templates.html',
						controller : 'TemplatesCtrl'
					})
					.when('/files', {
						templateUrl : './parts/files.html',
						controller : 'FilesCtrl'
					})
					.when('/settings', {
						templateUrl : './parts/settings.html',
						controller : 'SettingsCtrl'
					})
					.otherwise({
						redirectTo : '/main'
					});
				}
			])

		.controller('HeadCtrl', ['$scope', function ($scope) {
					$.extend(true, $scope, config.locale.head);
				}
			])

		.controller('BodyCtrl', ['$scope', '$location', function ($scope, $location, $locationProvider) {
					$.extend($scope, {
						i18n : config.locale.body,
						tabs : config.links.main,
						$location : $location,
						activeTab : function () {
							var path = $location.path();
							if (path == '/' + this.tab) {
								return 'active';
							} else {
								return '';
							}
						}
					});
					setSizes();
				}
			])

		.controller('MainTabCtrl', ['$scope', function ($scope) {}
			])

		.controller('PagesCtrl', ['$scope', function ($scope) {
					$('#tree_content').height(currentHeight(true, 11)).customTree(tree);
				}
			])

		.controller('TemplatesCtrl', ['$scope', function ($scope) {}
			])

		.controller('FilesCtrl', ['$scope', function ($scope) {
					$('#FilesExplorerFrame').height(currentHeight(true));
				}
			])

		.controller('SettingsCtrl', ['$scope', function ($scope) {
					ajax('./options/', function (obj) {
						config.settings = obj;
					}, {
						data : {
							action : 'get'
						}
					});

					$.extend($scope, {
						i18n : config.locale.settings,
						model : $.extend(true, {}, config.settings),
						add : function () {
							$scope.model.pages.push({
								domain : window.location.host,
								page : $scope.model.pages_path
							});
						},
						remove : function (index) {
							$scope.model.pages.splice(index, 1);
						},
						save : function () {
							var pages = [];
							$.map($scope.$$childTail.model.pages, function (item, index) {
								if (angular.isString(item.domain) && angular.isString(item.page) && item.domain.length > 0 && item.page.length > 0) {
									pages.push({
										domain : item.domain,
										page : item.page
									});
								}
							});
							var model = $scope.model;
							model.pages = pages;
							ajax('./options/', function (obj) {
								if (obj.pages) {
									$scope.$$childTail.model = $scope.model = obj;
									$scope.$digest();
								} else {
									info('error obj ' + obj);
								}
							}, {
								data : {
									action : 'set',
									data : js_beautify(JSON.stringify(model), {
										indent_size : 1,
										indent_char : '\t',
										brace_style : 'collapse'
									})
								},
								async : true
							})
						}
					});
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
