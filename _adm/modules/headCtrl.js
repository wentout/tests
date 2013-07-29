function () {
	var scope = this;
	return {
		h : ['$scope', function ($scope) {
				$.extend(true, $scope, scope.config.locale.head);
			}
		],
		b : ['$scope', '$location', function ($scope, $location, $locationProvider) {
				$.extend(true, $scope, {
					i18n : scope.config.locale.body,
					tabs : scope.config.links.main,
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
				scope.setSizes();
			}
		],
		m : ['$scope', function ($scope) {}
		]
	};
}
