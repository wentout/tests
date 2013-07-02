$(function () {

	var settings = {
		locale : {
			name : 'en-en',
			head : {},
			body : {}
		},
		paths : {
			locale : function () {
				return './i18n/' + settings.locale.name + '.js';
			}
		},
		links : {
			main : ['pages', 'templates', 'files', 'settings']
		},
		opts : null
	};

	var info = function (str, pre) {
		var to = $('#info');
		to.removeClass('hidden');
		if (pre) {
			to.html('<pre>' + str + '</pre>');
		} else {
			to.html(str);
		}
	};

	var ajaxSync = function (path, success) {
		$.ajax({
			type : "POST",
			async : false,
			dataType : 'text',
			url : path,
			success : function (data) {
				if (success) {
					try {
						var obj = $.parseJSON(data);
					} catch (e) {
						info(e.stack || e, true);
					}
					if (obj) {
						success(obj);
					}
				}
			}
		});

	};

	ajaxSync(settings.paths.locale(), function (obj) {
		try {
			$.extend(true, settings.locale, obj);
		} catch (e) {
			info(e.stack || e, true);
		}
	});

	ajaxSync('./options.json', function (obj) {
		settings.opts = obj;
	});

	// var angular = angular.noConflict();

	var app = angular.module('fineCutAdm', [])

		.config(['$locationProvider', function ($locationProvider) {
					$locationProvider.hashPrefix('!');
				}
			])

		.config(['$routeProvider', function ($routeProvider) {
					$routeProvider
					.when('/main', {
						templateUrl : 'parts/main.html',
						controller : 'MainTabsCtrl'
					})
					.when('/pages', {
						templateUrl : 'parts/pages.html',
						controller : 'BodyCtrl'
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
					$.extend(true, $scope, settings.locale.head);
				}
			])

		.controller('BodyCtrl', ['$scope', '$location', function ($scope, $location, $locationProvider) {
					$.extend($scope, {
						i18n : settings.locale.body,
						tabs : settings.links.main,
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
				}
			])

		.controller('MainTabsCtrl', ['$scope', function ($scope) {}
			])

		.controller('PagesCtrl', ['$scope', function ($scope) {}
			])

		.controller('TemplatesCtrl', ['$scope', function ($scope) {}
			])

		.controller('FilesCtrl', ['$scope', function ($scope) {}
			])

		.controller('SettingsCtrl', ['$scope', function ($scope) {
					$.extend($scope, {
						i18n : settings.locale.settings,
						model : $.extend(true, {}, settings.opts),
						add : function () {
							$scope.model.pages.push({
								domain : "",
								page : ""
							});
						},
						remove : function (index) {
							$scope.model.pages.splice(index, 1);
						},
						save : function () {
							
						}
					});
				}
			]);

	angular.bootstrap($('#ng-app'), ['fineCutAdm']);

});
