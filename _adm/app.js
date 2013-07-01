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
				$.extend(settings.locale, $.parseJSON(data));
			} catch (e) {
				info(e.stack || e, true);
			}
		}
	});

	var mainTab = function (id) {
		$('#mainTabs li').removeClass('active');
		if (id) {
			var link = $('#mainTabs a[href="#' + id + '"]');
			link.parent().addClass('active');
		}
	};

	// var angular = angular.noConflict();

	var app = angular.module('fineCutAdm', []);

	app.controller('HeadCtrl', ['$scope', function ($scope) {
				$.extend($scope, settings.locale.head);
			}
		]);

	app.controller('BodyCtrl', ['$scope', function ($scope) {
				$scope.i18n = settings.locale.body;
				mainTab('pages');
			}
		]);

	app.controller('MainTabsCtrl', ['$scope', function ($scope) {
				mainTab();
			}
		]);

	app.controller('PagesCtrl', ['$scope', function ($scope) {
				mainTab('pages');
			}
		]);

	app.controller('TemplatesCtrl', ['$scope', function ($scope) {
				mainTab('templates');
			}
		]);

	app.controller('FilesCtrl', ['$scope', function ($scope) {
				mainTab('files');
			}
		]);

	app.controller('SettingsCtrl', ['$scope', function ($scope) {
				mainTab('settings');
			}
		]);

	app.config(['$routeProvider', function ($routeProvider) {
				$routeProvider
				.when('/main', {
					templateUrl : 'parts/main.html'
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
		]);

	angular.bootstrap($('#ng-app'), ['fineCutAdm']);

});
