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
		}
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

	$.ajax({
		type : "POST",
		async : false,
		dataType : 'text',
		url : settings.paths.locale(),
		success : function (data) {
			try {
				$.extend(true, settings.locale, $.parseJSON(data));
			} catch (e) {
				info(e.stack || e, true);
			}
		}
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
					$scope.i18n = settings.locale.body;
					$scope.tabs = settings.links.main;
					$scope.$location = $location;
					$scope.activeTab = function () {
						var path = $location.path();
						if (path == '/' + this.tab) {
							return 'active';
						} else {
							return '';
						}
					};
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

		.controller('SettingsCtrl', ['$scope', function ($scope) {}
			]);

	angular.bootstrap($('#ng-app'), ['fineCutAdm']);

});
