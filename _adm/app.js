$(function () {

	var settings = {
		head : {
			title : 'Hola!'
		}
	};

	var app = angular.module('fineCutAdm', []);
	app.controller('HeadCtrl', ['$scope', function ($scope) {
				$.extend($scope, settings.head);
			}
		]);

	app.controller('BodyCtrl', ['$scope', function ($scope) {
				$.extend($scope, settings.head);
			}
		]);

	angular.bootstrap($('#ng-app'), ['fineCutAdm']);

});
