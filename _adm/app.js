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
			options : {
				get : './options/get/',
				set : './options/set/'
			},
			tree : {
				get : './api/tree/get/'
			},
			page : {
				get : './api/page/get/',
				set : './api/page/set/',
				del : './api/page/del/'
			}
		},
		links : {
			main : ['pages', 'templates', 'files', 'settings']
		},
		settings : null,
		blank_page : {
			title : '',
			keywords : '',
			description : '',
			pageIsCode : false,
			header : '',
			page : '',
			props : {},
			template : 'default'
		},
		pageScope : null,
		treeController : null,
		pageIsFocused : null
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

	var jData = function (str) {
		return js_beautify(JSON.stringify(str), {
			indent_size : 1,
			indent_char : '\t',
			brace_style : 'collapse'
		});
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
		opts && ($.extend(true, obj, opts));
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

	var parsePageModel = function (data, obj) {
		if (!obj) {
			var obj = config.blank_page;
			if (data) {
				obj = JSON.parse(data.model);
				obj.page = data.page;
			}
		}
		var $scope = config.pageScope;
		if ($scope) {
			$scope.model = obj;
			if ($scope.$$childTail && $scope.$$childTail.model) {
				$scope.$$childTail.model = obj;
			}
			// if ($scope.$$phase !== '$apply') {
			try {
				$scope.$digest();
			} catch (e) {}
			// }
		}
	};

	var treeConfig = {
		init : {
			method : 'slideDown',
			callback : function (controller, tree) {
				config.treeController = controller;
			}
		},
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
		},
		handlers : {
			focus : function (leaf, controller) {
				var path = controller.getPath(leaf);
				ajax(config.paths.page.get, function (data) {
					config.pageIsFocused = leaf;
					parsePageModel(data);
				}, {
					data : {
						leaf : JSON.stringify(path)
					}
				});
			},
			blur : function () {
				config.pageIsFocused = null;
				parsePageModel();
			}
		}
	};

	var magnet = null;

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
					$.extend(true, $scope, {
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

		.controller('PagesCtrl', ['$scope', '$location', function ($scope, $location) {
					$.extend(true, $scope, {
						i18n : config.locale.page,
						model : $.extend(true, {}, config.blank_page),
						treeIsHidden : false,
						$location : $location,
						tabs : $.extend(true, {}, config.links.page),
						hideTree : function () {
							if ($scope.treeIsHidden) {
								$('div.custom_tree_root_container').fadeOut(200, function () {
									$('div.custom_tree_root_container').hide();
								});
								$('#tree_content').animate({
									'minWidth' : '0px'
								}, 500);
							} else {
								$('#tree_content').animate({
									'minWidth' : '300px'
								}, 500, function () {
									$('div.custom_tree_root_container').fadeIn();
								});
							}
						},
						add : function () {
							if (config.treeController) {
								var prt = prompt('Leaf name (url).', 'test');
								if (prt) {
									var leaf = config.treeController.x.current;
									var path = config.treeController.getPath(leaf);
									path.push(prt);
									$scope.save(path, function () {
										$scope.refresh(leaf, function () {
											$.each(leaf.items, function (index, item) {
												if (item.name === prt) {
													config.treeController.blur();
													config.treeController.focus(item);
													return false;
												}
											});
										});
									});
								}
							}
						},
						del : function () {
							if (config.treeController) {
								var leaf = config.treeController.x.current;
								if (leaf.parent.name) {
									config.treeController.focus(leaf.parent);
								} else {
									config.treeController.blur();
								}
								var path = config.treeController.getPath(leaf);
								ajax(config.paths.page.del, function (data) {
									$scope.refresh(leaf.parent);
								}, {
									data : {
										leaf : JSON.stringify(path)
									},
									async : true
								});
							}
						},
						refresh : function (leaf, callback) {
							var p = leaf || config.treeController.x.current;
							path = config.treeController.getPath(p);
							if (path.length > 1) {
								config.treeController.loadLeaf(p, callback);
							} else {
								config.treeController.init();
							}
						},
						save : function (path, callback) {
							if (config.treeController) {
								if (!path) {
									path = config.treeController.getPath(config.treeController.x.current);
								}
								if (path.length > 1) {
									var model = $scope.$$childTail ? $scope.$$childTail.model : $scope.model;
									var page = '' + model.page;
									delete model.page;
									ajax(config.paths.page.set, function (data) {
										parsePageModel(data);
										callback && callback();
									}, {
										data : {
											model : jData(model),
											page : page,
											leaf : JSON.stringify(path)
										},
										async : true
									});
								}
							}
						},
						share : function () {
							parsePageModel(null, magnet);
						},
						getMagnet : function () {
							var model = $scope.$$childTail ? $scope.$$childTail.model : $scope.model;
							magnet = model;
						},
						hasMagnet : function () {
							if (magnet) {
								return true;
							}
							return false;
						},
						pageIsFocused : function () {
							if (config.pageIsFocused) {
								return false;
							}
							return true;
						}
					});
					$('#tree_content, #page_content').height(currentHeight(true, 40));
					$('#tree_content').customTree(treeConfig);
					config.pageScope = $scope;
				}
			])

		.controller('TemplatesCtrl', ['$scope', function ($scope) {}
			])

		.controller('FilesCtrl', ['$scope', function ($scope) {
					$('#FilesExplorerFrame').height(currentHeight(true));
				}
			])

		.controller('SettingsCtrl', ['$scope', function ($scope) {
					
					ajax(config.paths.options.get, function (obj) {
						config.settings = obj;
					}, {
						method: 'GET'
					});

					$.extend(true, $scope, {
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
							var model = $scope.$$childTail ? $scope.$$childTail.model : $scope.model;
							$.map(model.pages, function (item, index) {
								if (angular.isString(item.domain) && angular.isString(item.page) && item.domain.length > 0 && item.page.length > 0) {
									pages.push({
										domain : item.domain,
										page : item.page
									});
								}
							});
							var model = $scope.model;
							model.pages = pages;
							ajax(config.paths.options.set, function (obj) {
								if (obj.pages) {
									$scope.$$childTail.model = $scope.model = obj;
									$scope.$digest();
								} else {
									info('error obj ' + obj);
								}
							}, {
								data : {
									data : jData(model)
								},
								async : true
							});
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
