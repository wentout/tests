(function (jQuery, undefined) {

	var e; // for catch(e)

	var log = function (str, obj) {
		if (console && console.log) {
			if (obj) {
				console.log(obj, str);
			} else {
				console.log(str);
			}
		}
	};

	var UNDEFINED_LOADER = 'Tree leaf loader is not a function.';

	var DEFAULTS = {

		init : {

			delay : null,
			// no preloader className == no preloader
			preloader : 'preloader',
			// function (controller, tree)
			callback : null,
			method : 'fadeIn'

		},

		root : 'top',
		// must be content loading function ( path, callback ),
		// where callback will receive leafObject
		loader : null,

		animate : {
			delay : 500,
			open : 'slideDown',
			close : 'slideUp'
		},

		handlers : null,
		listeners : null,

		theme : 'custom',
		cls : {

			root : 'tree_root',

			control : 'tree_control',
			status : 'tree_leaf_status',
			text : 'tree_leaf_text',

			folder : 'folder',
			selected : 'selected',
			hover : 'hover',

			supressLabelTextSelection : 'unselectable',

			loader : 'loader',
			open : 'open',

			container : 'container'

		},
		html : {

			tree : '<UL>',
			leaf : '<LI>',
			children : '<UL>',

			heading : '<DIV>',
			control : '<SPAN>',
			status : '<SPAN>',
			text : '<SPAN>',

			container : '<DIV>'

		},
		control : {
			close : '+',
			open : '&ndash;'
		},
		storeLoaded : true,
		selectParentOnClose : false,
		selectByDblClick : false,

		labelsBreak : {
			by : 0,
			str : '\n',
			showAlways : false,
			showOnHover : true,
			showOnSelect : true
		}

	};

	var breakLine = function (text, num) {
		var arr = [];
		var len = text.length;
		var clen = 0;
		while (clen <= len) {
			arr.push(text.slice(clen, clen + num));
			clen += num;
		};
		return arr;
	};

	jQuery.fn.extend({
		customTree : function (treeParams) {

			// tree object iself
			var tree = {

				parent : null,
				name : null,
				text : null,

				folder : true,
				open : true,

				children : {},
				items : []

			};

			// settings object
			var x = {
				container : this, // JQ container for tree
				current : tree
			};

			$.each(DEFAULTS, function (name, value) {
				var param = treeParams[name];
				if (value && ((typeof value) == 'object')) {
					x[name] = $.extend(value, param || {});
				} else {
					x[name] = ((param === undefined) ? value : param);
				}
			});

			var handle = function (leaf, type, callback) {
				if (x.handlers[type]) {
					var arr = [leaf, controller, tree];
					callback && arr.unshift(callback);
					x.handlers[type].apply(leaf, arr);
				}
				return true;
			};

			var loader = function (path, callback) {
				if ($.isFunction(x.loader)) {
					x.loader(path, callback);
				} else {
					log(UNDEFINED_LOADER);
				}
			};

			var loadLeaf = function (leaf, callback) {
				x.cls.loader && (leaf.els.status.addClass(x.cls.loader));
				loader(getPath(leaf), function (obj) {
					handle(leaf, 'loaded');
					parseChildren(leaf, obj, function (leaf) {
						x.cls.loader && (leaf.els.status.removeClass(x.cls.loader));
						callback && callback(leaf, tree, controller);
					});
				});
			};

			var getPath = function (leaf) {
				var arr = [];
				if (leaf) {
					var el = leaf;
					while (el.parent !== null) {
						arr.unshift(el.name);
						el = el.parent;
					};
				}
				arr.unshift(x.root);
				return arr;
			};

			var makeEl = function (type, html) {
				var el = $(x.html[type] || type);
				x.cls[type] && el.addClass(x.cls[type]);
				html && el.html(html);
				return el;
			};

			var setControlHtml = function (leaf) {
				var text = leaf.open ? x.control.open : x.control.close;
				leaf.els.control.html(text);
			};

			var setTextHtml = function (leaf) {
				if (leaf && leaf.textBreakArray && !x.labelsBreak.showAlways) {
					var hover = x.labelsBreak.showOnHover && leaf.els.text.hasClass(x.cls.hover);
					var selected = x.labelsBreak.showOnSelect && leaf.els.text.hasClass(x.cls.selected);
					if ((hover && !selected) || selected) {
						leaf.els.text.html(leaf.textBreakArray.join(x.labelsBreak.str));
					} else {
						leaf.els.text.html(leaf.textBreakArray[0]);
					}
				}
			};

			var blur = function (callback) {
				if (x.current.parent) {
					handle(x.current, 'beforeblur', function () {
						x.current.els.text.removeClass(x.cls.selected);
						setTextHtml(x.current);
						handle(x.current, 'blur');
						x.current = tree;
						callback && callback();
					});
				} else {
					callback && callback();
				}
			};
			var focus = function (leaf) {
				leaf.els.text.addClass(x.cls.selected);
				x.current = leaf;
				setTextHtml(x.current);
				handle(x.current, 'focus');
			};

			var blurByParent = function (parent) {
				if (x.current.parent) {
					var el = x.current.parent;
					while (el.parent !== null) {
						if (el == parent) {
							return true;
							break;
						} else {
							el = el.parent;
						}
					};
				}
				return false;
			};

			var openLeaf = function (leaf) {
				if (x.storeLoaded && (leaf.items.length > 0)) {
					leaf.els.children[x.animate.open](x.animate.delay, function () {
						setControlHtml(leaf);
						handle(leaf, 'open');
					});
				} else {
					loadLeaf(leaf, function (leaf) {
						setControlHtml(leaf);
						handle(leaf, 'open');
					});
				}
			};

			var closeLeaf = function (leaf, callback) {
				leaf.els.children[x.animate.close](x.animate.delay, function () {
					setControlHtml(leaf);
					if (!x.storeLoaded) {
						emptyLeaf(leaf);
					}
					callback && callback();
					handle(leaf, 'close');
				});
			};

			var selectLeaf = function (leaf) {
				if (leaf !== x.current) {
					blur(function () {
						focus(leaf);
					});
				}
			};

			var makeLeaf = function (leaf) {
				var els = leaf.els = {
					control : makeEl('control'),
					status : makeEl('status'),
					text : makeEl('text', leaf.text),
					children : makeEl('children')
				};

				x.cls.supressLabelTextSelection && els.text.addClass(x.cls.supressLabelTextSelection);

				setControlHtml(leaf);
				if (leaf.folder) {
					els.control.addClass(x.cls.folder);
					els.control.on('click', function (ev) {
						ev.stopPropagation();
						if (leaf.open) {
							if (blurByParent(leaf)) {
								blur(function () {
									leaf.open = !leaf.open;
									closeLeaf(leaf, function () {
										if (x.selectParentOnClose) {
											focus(leaf);
										}
									});
								});
							} else {
								leaf.open = !leaf.open;
								closeLeaf(leaf);
							}
						} else {
							leaf.open = !leaf.open;
							openLeaf(leaf);
						}
					});
				}
				leaf.els.text.on('mouseover', function (ev) {
					leaf.els.text.addClass(x.cls.hover);
					setTextHtml(leaf);
					handle(leaf, 'hover');
				});
				leaf.els.text.on('mouseout', function (ev) {
					leaf.els.text.removeClass(x.cls.hover);
					setTextHtml(leaf);
					handle(leaf, 'unhover');
				});
				leaf.els.text.on('click', function (ev) {
					ev.stopPropagation();
					!x.selectByDblClick && selectLeaf(leaf);
				});
				leaf.els.text.on('deleted', function (ev) {
					handle(leaf, 'deleted');
				});

				// leaf.els.text[0].addEventListener('DOMNodeRemovedFromDocument', function (ev) {
				// handle(leaf, 'deleted');
				// }, true);

				leaf.els.text.dblclick(function (ev) {
					x.selectByDblClick && selectLeaf(leaf);
					if (x.handlers) {
						if (x.handlers.dblclick) {
							x.handlers.dblclick(leaf, controller, tree, ev);
						}
					}
				});
				if (x.listeners) {
					$.each(x.listeners, function (name, listener) {
						leaf.els.text.on(name, function () {
							var args = Array.prototype.slice.call(arguments);
							args.unshift(leaf, controller, tree);
							listener.apply(leaf, args);
						});
					});
				}
				// leaf.container = makeEl('leaf').append(els.control, els.status, els.text, els.children);
				leaf.heading = makeEl('heading').append(els.control, els.status, els.text, els.children);
				leaf.container = makeEl('leaf').append(leaf.heading);
				leaf.container.appendTo(leaf.parent.els.children);
			};

			var emptyLeaf = function (leaf, callback) {

				// $.each(leaf.children, function (name, leaf) {
				// emptyLeaf(leaf);
				// handle(leaf, 'deleted');
				// });

				if (x.handlers.deleted) {
					var oldClean = jQuery.cleanData;
					$.cleanData = function (elems) {
						for (var i = 0, elem; (elem = elems[i]) !== undefined; i++) {
							$(elem).triggerHandler("deleted");
						}
						oldClean(elems);
					};
					(leaf.els && leaf.els.children) && leaf.els.children.empty();
					$.cleanData = oldClean;
				} else {
					(leaf.els && leaf.els.children) && leaf.els.children.empty();
				}

				leaf.children = {};
				leaf.items = [];

			};

			var parseChildren = function (leaf, obj, callback) {

				leaf.els.children.hide();

				emptyLeaf(leaf);

				$.each(obj, function (name, value) {

					var el = $.extend({
							folder : false,
							// undefined || null || false
							open : (!value.folder) ? true : false
						}, value);

					el.parent = leaf;
					el.name = name;

					var text = el.text || name;
					if (x.labelsBreak.by) {
						var len = text.length;
						if (len >= x.labelsBreak.by) {
							var arr = breakLine(text, x.labelsBreak.by);
							el.textBreakArray = arr;
							if (x.labelsBreak.showAlways) {
								text = arr.join(x.labelsBreak.str);
							} else {
								text = arr[0];
							}
						}
					}
					el.text = text;

					el.children = {};
					el.items = [];

					makeLeaf(el);

					leaf.children[name] = el;
					leaf.items.push(el);

					if (el.folder && el.open) {
						loadLeaf(el);
					}

					handle(el, 'added');

				});

				var method = (leaf.parent == null) ? x.init.method : x.animate.open;

				leaf.els.children[method](x.animate.delay, function () {
					handle(leaf, 'parsed');
					callback && callback(leaf, controller, tree);
				});

			};

			var controller = {

				init : function (callback) {

					x.container.empty();

					x.init.preloader && (x.container.addClass(x.init.preloader));

					loader([x.root], function (obj) {

						x.init.preloader && (x.container.removeClass(x.init.preloader));

						tree.els = {};
						var childrenCls = x.theme + '_' + x.cls.root;
						var containerCls = childrenCls + '_' + x.cls.container;
						tree.container = $(x.html.container).addClass(containerCls).appendTo(x.container);
						tree.els.children = $(x.html.tree).addClass(childrenCls).appendTo(tree.container);

						x.init.callback(controller, tree);

						parseChildren(tree, obj);

						tree.container.on('click', function (ev) {
							// if (ev.target == tree.container[0])
							blur();
						});

					})

				},

				getPath : getPath,
				x : x

			};

			try {

				// tree startup
				window.setTimeout(function () {
					controller.init();
				}, x.init.delay);

			} catch (e) {
				log(e.stack || e);
			}

		}
	});

})(jQuery);
