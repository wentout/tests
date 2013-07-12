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
				get : './api/tree/get/',
				close : './api/tree/close/',
			},
			page : {
				get : './api/page/get/',
				set : './api/page/set/',
				del : './api/page/del/',
				focus : './api/page/getfocus',
				blur : './api/page/blur/'
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
		props : {
			pageBorder : 'PageController_PageBorder'
		}
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

	var ajax = function (path, successCallback, opts) {
		var obj = {
			type : "POST",
			async : false,
			dataType : 'text',
			url : path,
			success : function (data) {
				if (data) {
					if (successCallback) {
						try {
							var obj = $.parseJSON(data);
						} catch (e) {
							info(data + '<hr>' + e.stack || e, true);
						}
						if (obj) {
							successCallback(obj);
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
			pageDigest();
		}
	};

	var pageDigestCounter = 0;
	var pageDigest = function () {
		pageDigestCounter++;
		var buffer = 0 + pageDigestCounter;
		window.setTimeout(function () {
			if (buffer == pageDigestCounter) {
				pageDigestCounter = 0;
				try {
					config.pageScope.$digest();
				} catch (e) {
					debugger;
				}
			}
		}, 10);
	};

	var treeConfig = {
		focusParentOnClose : true,
		init : {
			method : 'slideDown',
			auto : false
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
				if (leaf.parent) {
					var path = controller.getPath(leaf);
					ajax(config.paths.page.get, function (data) {
						parsePageModel(data);
					}, {
						data : {
							leaf : JSON.stringify(path)
						}
					});
				} else {
					pageDigest();
					ajax(config.paths.page.blur, null, {
						method : 'GET'
					});
				}
			},
			blur : function (leaf) {
				parsePageModel();
			},
			open : function () {
				pageDigest();
			},
			close : function (leaf, controller) {
				var path = controller.getPath(leaf);
				ajax(config.paths.tree.close, function (data) {}, {
					data : {
						leaf : JSON.stringify(path)
					}
				});
				pageDigest();
			}
		}
	};

	var ls = {
		get : function (prop) {
			var item = window.localStorage.getItem('Fine Cut LS');
			var obj = null;
			if (item) {
				try {
					obj = JSON.parse(item);
					if (prop) {
						return obj[prop];
					}
				} catch (e) {
					window.localStorage.removeItem('Fine Cut LS');
				}
			}
			return obj;
		},
		set : function (prop, value) {
			var obj = ls.get() || {};
			obj[prop] = value;
			window.localStorage.setItem('Fine Cut LS', JSON.stringify(obj));
		},
		setPageBorder : function (w) {
			ls.set('pageBorderWidth', w);
		},
		getPageBorder : function () {
			return ls.get().pageBorderWidth;
		}
	};

	if (!ls.get(config.props.pageBorder)) {
		!ls.set(config.props.pageBorder, '300px');
	}

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
						add : function () {
							var prt = prompt('Leaf name (url).', 'test');
							var leaf = config.treeController.x.current;
							var haveItem = false;
							$.each(leaf.items, function (index, item) {
								if (item.name === prt) {
									haveItem = true;
									return false;
								}
							});
							if (haveItem) {
								alert('There already is leaf with such name');
								window.setTimeout(function () {
									$scope.add();
								}, 100);
							} else {
								if (prt) {
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
										}, true);
									});
								}
							}
						},
						del : function () {
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
						},
						canRefresh : function () {
							var leaf = config.treeController.x.current;
							if (leaf.folder && leaf.open) {
								return true;
							}
							return false;
						},
						refresh : function (leaf, callback, open) {
							leaf = leaf || config.treeController.x.current;
							config.treeController.refresh(leaf, callback, open);
						},
						save : function (path, callback) {
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
						},
						canShare : function () {
							if (magnet) {
								return true;
							}
							return false;
						},
						share : function () {
							parsePageModel(null, magnet);
						},
						getMagnet : function () {
							var model = $scope.$$childTail ? $scope.$$childTail.model : $scope.model;
							magnet = model;
						},
						pageIsFocused : function () {
							if (config.treeController.x.current.parent == null) {
								return false;
							}
							return true;
						}
					});
					$('#tree_content, #page_content').height(currentHeight(true, 40));
					ajax(config.paths.page.focus, function (data) {
						treeConfig.init.focus = data;
					});

					var tree_content = $('#tree_content');
					config.treeController = tree_content.customTree(treeConfig);
					config.treeController.init();
					config.pageScope = $scope;

					tree_content.css('minWidth', ls.get(config.props.pageBorder));

					var rEl = $('#tree_content_resize');
					var w = 0;
					var dLeft = 0;
					if ($.fn.draggable) {

						rEl.draggable({
							axis : "x",
							// distance : 20,
							delay : 300,
							start : function (ev) {
								// dLeft = rEl.offset().left;
								dLeft = ev.pageX;
								w = parseInt(tree_content.css('minWidth'));
								var ww = tree_content.width();
								if (ww > w) {
									w = ww;
									tree_content.css('minWidth', ww + 'px');
								}
							},
							drag : function (ev, e1) {},
							stop : function (ev) {
								var diff = dLeft - ev.pageX;
								var end = w;
								if (diff > 0) {
									end = w - diff;
								} else {
									end = w + diff;
								}
								var pw = (w - diff) + 'px';
								tree_content.css('minWidth', pw);
								tree_content.css('minWidth', ls.set(config.props.pageBorder, pw));
								$('#tree_content_resize').css({
									'left' : 0
								});
							}
						});

					} else {

						var dragging = false;
						var draggingoff = false;
						var stopDrag = function () {
							dragging = false;
							draggingoff = false;
						};
						rEl.addClass('unselectable');
						rEl.on('mousedown', function () {
							dragging = true;
							dLeft = rEl.offset().left;
							w = parseInt(tree_content.css('minWidth'));
							var ww = tree_content.width();
							if (ww > w) {
								w = ww;
								tree_content.css('minWidth', ww + 'px');

							}
						})
						.on('mouseup', function () {
							dragging = false;
						})
						.on('mouseout', function () {
							if (dragging) {
								draggingoff = true;
								window.setTimeout(function () {
									if (draggingoff) {
										stopDrag();
									}
								}, 1000);
							}
						})
						.on('mouseover', function () {
							if (draggingoff) {
								dragging = true;
							}
						});
						$(document.body).on('mousemove', function (ev) {
							if (dragging) {
								var diff = dLeft - ev.pageX;
								var end = w;
								if (diff > 0) {
									end = w - diff;
								} else {
									end = w + diff;
								}
								tree_content.css('minWidth', (w - diff) + 'px');
							}
						}).
						on('mouseup', function () {
							if (dragging) {
								stopDrag();
							}
						});

					}

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
						method : 'GET'
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
