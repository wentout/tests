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

	// var angular = angular.noConflict();

	var app = angular.module('fineCutAdm', []);
	
	app.controller('HeadCtrl', ['$scope', function ($scope) {
				$.extend($scope, settings.locale.head);
			}
		]);

	app.controller('BodyCtrl', ['$scope', function ($scope) {
				$.extend($scope, settings.locale.body);
			}
		]);

	angular.bootstrap($('#ng-app'), ['fineCutAdm']);

});
