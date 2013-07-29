['$routeProvider', function ($routeProvider) {
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
]
