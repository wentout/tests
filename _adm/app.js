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
				blur : './api/page/blur/',
				order : './api/page/order/',
				rename : './api/page/rename/',
				move : './api/page/move/'
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
		pageEditor : null,
		props : {
			pageBorder : 'PageController_PageBorder',
			activeTab : 'PageController_ActiveTab'

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
			var obj = $.extend(true, {}, config.blank_page);
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
			pageDigest(function () {
				var val = config.pageScope.model.page;
				config.pageEditor.setValue(val, -1);
			});
		}
	};

	var pageDigestCounter = 0;
	var pageDigest = function (callback) {
		pageDigestCounter++;
		var buffer = 0 + pageDigestCounter;
		window.setTimeout(function () {
			if (buffer == pageDigestCounter) {
				pageDigestCounter = 0;
				try {
					config.pageScope.$digest();
					callback && callback();
				} catch (e) {
					debugger;
				}
			}
		}, 10);
	};

	var enableFocusHandler = true;
	var treeConfig = {
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
				if (enableFocusHandler) {
					if (leaf.parent) {
						var path = controller.getPath(leaf);
						ajax(config.paths.page.get, function (data) {
							// parsePageModel($.extend(true, config.blank_page, data));
							parsePageModel(data);
						}, {
							data : {
								leaf : JSON.stringify(path)
							}
						});
					} else {
						ajax(config.paths.page.blur, function () {
							parsePageModel();
						}, {
							method : 'GET'
						});
					}
				}
			},
			blur : function (leaf) {},
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
			},
			deleted : function (leaf) {
				if ((leaf.parent.items.length < 2) && (leaf.parent.els.children.hasClass('ui-sortable'))) {
					leaf.parent.els.children.sortable('destroy');
				}
			},
			added : function (leaf, controller, tree) {
				if ($.fn.draggable && $.fn.droppable && $.fn.sortable) {

					if (leaf.parent.items.length > 1) {
						if (leaf.parent.els.children.hasClass('ui-sortable')) {
							leaf.parent.els.children.sortable('refresh');
						} else {
							leaf.parent.els.children.sortable({
								axis : 'y',
								distance : 5,
								containment : '.custom_tree_root',
								update : function (event, ui) {
									var parent = event.target;
									var order = [];
									$.each(parent.children, function (index, item) {
										order.push(item.leaf.name);
									});
									var callback = false;
									ajax(config.paths.page.order, function (obj) {
										if (obj.error) {
											callback = false;
										} else {
											callback = true;
										}
									}, {
										data : {
											leaf : JSON.stringify(config.treeController.getPath(leaf.parent)),
											order : JSON.stringify(order)
										}
									});
									return callback;
								}
							});
						}

					}

					leaf.container.prop('leaf', leaf);
					leaf.els.text
					.on('mouseup', function (ev) {
						// if (leaf.els.text.prop('dropped')) {
						// ev.stopPropagation();
						// ev.preventDefault();
						// return false;
						// }
					})
					.prop('leaf', leaf)
					.prop('dropped', null)
					.draggable({
						addClasses : false,
						// revert : true,
						distance : 11,
						zIndex : 100,
						start : function () {
							// config.treeController.blur();
							// config.treeController.focus(leaf);
							leaf.els.text.prop('dropped', tree);
						},
						stop : function () {
							var dropped = leaf.els.text.prop('dropped');
							var revert = false;
							if (dropped) {
								if (dropped.open || (dropped.parent == null)) {
									var persist = false;
									var make = true;
									var parent = dropped.parent;
									while (make) {
										if (parent == null) {
											make = false;
										} else {
											if (parent == leaf) {
												persist = true;
												make = false;
											} else {
												parent = parent.parent;
											}
										}
									}

									if (persist) {
										alert('Can\'t move parent to child!');
										revert = true;
									} else {
										if (dropped.children[leaf.name]) {
											if (dropped.parent) {
												alert('There already is leaf with such a name!');
											} else {
												if (leaf.parent) {
													alert('There already is leaf with such a name!');
												} else {
													alert('Funny, You made nothing...');
												}
											}
											revert = true;
										} else {
											var path = config.treeController.getPath(leaf);
											var droppedPath = config.treeController.getPath(dropped);
											// config.treeController.blur(function () {
											enableFocusHandler = false;
											ajax(config.paths.page.move, function (data) {
												if (data.success) {
													config.pageScope.refresh(leaf.parent, function () {
														config.pageScope.refresh(dropped, function () {
															if (dropped.children[leaf.name]) {
																enableFocusHandler = true;
																config.treeController.focus(dropped.children[leaf.name], function () {});
															}
														}, true);
													});
												} else {
													config.pageScope.refresh(leaf.parent, function () {
														config.treeController.focus(leaf);
														enableFocusHandler = true;
													});
												}
											}, {
												data : {
													move : JSON.stringify(path),
													leaf : JSON.stringify(droppedPath)
												},
												error : function () {
													enableFocusHandler = true;
												}
											});
											// });

										}
									}
								} else {
									alert('Can\'t move to closed leaf!');
									revert = true;

								}
								leaf.els.text.prop('dropped', null);
							}
							if (revert) {
								leaf.els.text.animate({
									top : 0,
									left : 0
								}, 200);
							}
						}
					})
					.droppable({
						addClasses : false,
						accept : 'span.tree_leaf_text',
						drop : function (event, ui) {
							ui.draggable.prop('dropped', leaf);
						}
					});

				}
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
	if (!ls.get(config.props.activeTab)) {
		!ls.set(config.props.activeTab, 'page_head');
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

		.service('pageModel', [function () {
					return $.extend(true, {}, config.blank_page);
				}
			])

		.controller('PagesCtrl', ['$scope', '$location', 'pageModel', function ($scope, $location, pageModel) {
					$.extend(true, $scope, {
						i18n : config.locale.page,
						model : pageModel,
						treeIsHidden : false,
						$location : $location,
						tabs : $.extend(true, {}, config.links.page),
						add : function () {
							var name = prompt('Leaf name (url).', 'test');
							var leaf = config.treeController.x.current;
							if (leaf.children[name]) {
								// todo: maybe to add() to leaf parent in this situation?
								alert('There already is leaf with such name');
								window.setTimeout(function () {
									$scope.add();
								}, 100);
							} else {
								if (name) {
									var path = config.treeController.getPath(leaf);
									path.push(name);
									$scope.save(path, function () {
										$scope.refresh(leaf, function () {
											$.each(leaf.items, function (index, item) {
												if (item.name === name) {
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
						rename : function () {
							var leaf = config.treeController.x.current;
							var name = prompt('New name?', leaf.name);
							var parent = leaf.parent;
							var oldname = '' + leaf.name;
							if (name && (name !== '') && (name !== leaf.name)) {
								if (parent.children[name]) {
									alert('There already is leaf with such name.');
									window.setTimeout(function () {
										$scope.rename();
									}, 100);
								} else {

									var path = config.treeController.getPath(leaf);
									ajax(config.paths.page.rename, function (data) {
										$scope.refresh(parent, function () {
											if (parent.children[name]) {
												config.treeController.focus(parent.children[name]);
											} else {
												if (parent.children[oldname]) {
													alert('ups...');
													config.treeController.focus(parent.children[oldname]);
												}
											}
										});
									}, {
										data : {
											leaf : JSON.stringify(path),
											name : name
										},
										async : false,
										error : function (data) {
											alert('ups...');
											$scope.refresh(parent, function () {
												if (parent.children[oldname]) {
													config.treeController.focus(parent.children[oldname]);
												}
											});
										}
									});
								}
							}
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
						save : function (path, callback, modelOpts) {
							if (!path) {
								path = config.treeController.getPath(config.treeController.x.current);
							}
							if (path.length > 1) {
								var page = '';
								var model = $.extend(true, {}, config.blank_page);
								var model = $.extend(true, model, ($scope.$$childTail ? $scope.$$childTail.model : $scope.model));
								// var page = '' + model.page;
								var page = '' + config.pageEditor.getValue();

								delete model.page;

								var cursorPosition = config.pageEditor.getCursorPosition();
								var session = config.pageEditor.getSession();
								var scrTop = session.getScrollTop();

								modelOpts && ($.extend(true, model, modelOpts));

								ajax(config.paths.page.set, function (data) {
									parsePageModel(data);
									callback && callback();

									window.setTimeout(function () {
										// $('.ace_editor .ace_sb').scrollTop(scrTop);
										var session = config.pageEditor.getSession();
										session.setScrollTop(scrTop);

										// var at = ls.get(config.props.activeTab);
										// if (at == 'page_head') {
										// config.pageEditor.focus();
										// }
										config.pageEditor.moveCursorToPosition(cursorPosition);

									}, 50);

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
						canAdd : function () {
							var leaf = config.treeController.x.current;
							if (leaf.folder && leaf.open == false) {
								return false;
							}
							return true;
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
							var model = $.extend(true, {}, ($scope.$$childTail ? $scope.$$childTail.model : $scope.model));
							magnet = model;
						},
						pageIsFocused : function () {
							if (config.treeController.x.current.parent == null) {
								return false;
							}
							return true;
						},
						setActiveTab : function (target) {
							ls.set(config.props.activeTab, target);
						},
						activeTab : function (target) {
							if (ls.get(config.props.activeTab) == target) {
								return 'active';
							}
							return '';
						}

					});
					$('#tree_content, #page_content').height(currentHeight(true, 40));
					ajax(config.paths.page.focus, function (data) {
						treeConfig.init.focus = data;
					});

					var ed = $('#page_html_editor').width('97%').height(currentHeight(true, 120)).css({
							border : '1px solid black'
						});

					var editor = ace.edit("page_html_editor");
					editor.session.setMode('ace/mode/html');
					config.pageEditor = editor;

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
							drag : function (ev) {},
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
								ls.set(config.props.pageBorder, pw);
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
							// jqUI $('#container').enableSelection();
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
							// jqUI $('#container').disableSelection();
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
