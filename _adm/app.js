$(function () {

	var settings = {

		head : {
			title : 'Hola!'
		}

	};
	angular.element(document).ready(function () {

		var myApp = angular.module('myApp', []);

		myApp.controller('HeadCtrl', ['$scope', function ($scope) {
					$.extend($scope, settings.head);
				}
			]);

		var app = $('#ng-app');

		angular.bootstrap(app, ['myApp']);

	});

}); ;
