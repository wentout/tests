{
	init : {
		method : 'slideDown',
		auto : false
	},
	loader : function (path, callback) {
		scope.ajax(scope.paths.tree.get, function (obj) {
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
			if (scope.enableFocusHandler) {
				if (leaf.parent) {
					var path = controller.getPath(leaf);
					scope.ajax(scope.paths.page.get, function (data) {
						// scope.parsePageModel($.extend(true, scope.blank_page, data));
						scope.parsePageModel(data);
					}, {
						data : {
							leaf : JSON.stringify(path)
						}
					});
				} else {
					scope.ajax(scope.paths.page.blur, function () {
						scope.parsePageModel();
					}, {
						method : 'GET'
					});
				}
			}
		},
		blur : function (leaf) {},
		open : function () {
			scope.pageDigest();
		},
		close : function (leaf, controller) {
			var path = controller.getPath(leaf);
			scope.ajax(scope.paths.tree.close, function (data) {}, {
				data : {
					leaf : JSON.stringify(path)
				}
			});
			scope.pageDigest();
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
								scope.ajax(scope.paths.page.order, function (obj) {
									if (obj.error) {
										callback = false;
									} else {
										callback = true;
									}
								}, {
									data : {
										leaf : JSON.stringify(scope.treeController.getPath(leaf.parent)),
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
						// scope.treeController.blur();
						// scope.treeController.focus(leaf);
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
										var path = scope.treeController.getPath(leaf);
										var droppedPath = scope.treeController.getPath(dropped);
										// scope.treeController.blur(function () {
										scope.enableFocusHandler = false;
										scope.ajax(scope.paths.page.move, function (data) {
											if (data.success) {
												scope.pageScope.refresh(leaf.parent, function () {
													scope.pageScope.refresh(dropped, function () {
														if (dropped.children[leaf.name]) {
															scope.enableFocusHandler = true;
															scope.treeController.focus(dropped.children[leaf.name], function () {});
														}
													}, true);
												});
											} else {
												scope.pageScope.refresh(leaf.parent, function () {
													scope.treeController.focus(leaf);
													scope.enableFocusHandler = true;
												});
											}
										}, {
											data : {
												move : JSON.stringify(path),
												leaf : JSON.stringify(droppedPath)
											},
											error : function () {
												scope.enableFocusHandler = true;
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
