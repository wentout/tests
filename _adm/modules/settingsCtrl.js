{
	i18n : scope.locale.settings,
	model : $.extend(true, {}, scope.settings),
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
		var model = $.extend(true, {}, ($scope.$$childTail ? $scope.$$childTail.model : $scope.model));
		$.map(model.pages, function (item, index) {
			if (angular.isString(item.domain) && angular.isString(item.page) && item.domain.length > 0 && item.page.length > 0) {
				pages.push({
					domain : item.domain,
					page : item.page
				});
			}
		});
		var model = $.extend(true, {}, $scope.model);
		model.pages = pages;
		scope.ajax(scope.paths.options.set, function (obj) {
			if (obj.pages) {
				$scope.$$childTail.model = $scope.model = obj;
				$scope.$digest();
			} else {
				scope.info('error obj ' + obj);
			}
		}, {
			data : {
				data : scope.jData(model)
			},
			async : true
		});
	}
}