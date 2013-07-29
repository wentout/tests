['$scope', '$location', 'pageModel', function ($scope, $location, pageModel) {
		$.extend(true, $scope, {
			i18n : scope.locale.page,
			model : pageModel,
			treeIsHidden : false,
			$location : $location,
			tabs : $.extend(true, {}, scope.links.page),
			add : function () {
				var name = prompt('Leaf name (url).', 'test');
				var leaf = scope.treeController.x.current;
				if (leaf.children[name]) {
					// todo: maybe to add() to leaf parent in this situation?
					alert('There already is leaf with such name');
					window.setTimeout(function () {
						$scope.add();
					}, 100);
				} else {
					if (name) {
						var path = scope.treeController.getPath(leaf);
						path.push(name);
						$scope.save(path, function () {
							$scope.refresh(leaf, function () {
								$.each(leaf.items, function (index, item) {
									if (item.name === name) {
										scope.treeController.blur();
										scope.treeController.focus(item);
										return false;
									}
								});
							}, true);
						});
					}
				}
			},
			del : function () {
				var leaf = scope.treeController.x.current;
				if (leaf.parent.name) {
					scope.treeController.focus(leaf.parent);
				} else {
					scope.treeController.blur();
				}
				var path = scope.treeController.getPath(leaf);
				scope.ajax(scope.paths.page.del, function (data) {
					$scope.refresh(leaf.parent);
				}, {
					data : {
						leaf : JSON.stringify(path)
					},
					async : true
				});
			},
			rename : function () {
				var leaf = scope.treeController.x.current;
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

						var path = scope.treeController.getPath(leaf);
						scope.ajax(scope.paths.page.rename, function (data) {
							$scope.refresh(parent, function () {
								if (parent.children[name]) {
									scope.treeController.focus(parent.children[name]);
								} else {
									if (parent.children[oldname]) {
										alert('ups...');
										scope.treeController.focus(parent.children[oldname]);
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
										scope.treeController.focus(parent.children[oldname]);
									}
								});
							}
						});
					}
				}
			},
			canRefresh : function () {
				var leaf = scope.treeController.x.current;
				if (leaf.folder && leaf.open) {
					return true;
				}
				return false;
			},
			refresh : function (leaf, callback, open) {
				leaf = leaf || scope.treeController.x.current;
				scope.treeController.refresh(leaf, callback, open);
			},
			save : function (path, callback, modelOpts) {
				if (!path) {
					path = scope.treeController.getPath(scope.treeController.x.current);
				}
				if (path.length > 1) {
					var page = '';
					var model = $.extend(true, {}, scope.blank_page);
					var model = $.extend(true, model, ($scope.$$childTail ? $scope.$$childTail.model : $scope.model));
					// var page = '' + model.page;
					var page = '' + scope.pageEditor.getValue();

					delete model.page;

					var cursorPosition = scope.pageEditor.getCursorPosition();
					var session = scope.pageEditor.getSession();
					var scrTop = session.getScrollTop();

					modelOpts && ($.extend(true, model, modelOpts));

					scope.ajax(scope.paths.page.set, function (data) {
						scope.parsePageModel(data);
						callback && callback();

						window.setTimeout(function () {
							// $('.ace_editor .ace_sb').scrollTop(scrTop);
							var session = scope.pageEditor.getSession();
							session.setScrollTop(scrTop);

							// var at = ls.get(scope.props.activeTab);
							// if (at == 'page_head') {
							// scope.pageEditor.focus();
							// }
							scope.pageEditor.moveCursorToPosition(cursorPosition);

						}, 50);

					}, {
						data : {
							model : scope.jData(model),
							page : page,
							leaf : JSON.stringify(path)
						},
						async : true
					});
				}
			},
			canAdd : function () {
				var leaf = scope.treeController.x.current;
				if (leaf.folder && leaf.open == false) {
					return false;
				}
				return true;
			},
			canShare : function () {
				if (scope.magnet) {
					return true;
				}
				return false;
			},
			share : function () {
				scope.parsePageModel(null, scope.magnet);
			},
			getMagnet : function () {
				var model = $.extend(true, {}, ($scope.$$childTail ? $scope.$$childTail.model : $scope.model));
				scope.magnet = model;
			},
			pageIsFocused : function () {
				if (scope.treeController.x.current.parent == null) {
					return false;
				}
				return true;
			},
			setActiveTab : function (target) {
				scope.ls.set(scope.props.activeTab, target);
			},
			activeTab : function (target) {
				if (scope.ls.get(scope.props.activeTab) == target) {
					return 'active';
				}
				return '';
			}

		});
		$('#tree_content, #page_content').height(scope.currentHeight(true, 40));
		scope.ajax(scope.paths.page.focus, function (data) {
			scope.treeConfig.init.focus = data;
		});

		var ed = $('#page_html_editor').width('97%').height(scope.currentHeight(true, 120)).css({
				border : '1px solid black'
			});

		var editor = ace.edit("page_html_editor");
		editor.session.setMode('ace/mode/html');
		scope.pageEditor = editor;

		var tree_content = $('#tree_content');
		scope.treeController = tree_content.customTree(scope.treeConfig);
		scope.treeController.init();
		scope.pageScope = $scope;

		tree_content.css('minWidth', scope.ls.get(scope.props.pageBorder));

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
					scope.ls.set(scope.props.pageBorder, pw);
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
]
