(function (jQuery, undefined) {

	var e; // for catch(e)

	const log = function (str, obj) {
		if (console && console.log) {
			if (obj) {
				console.log(obj, str);
			} else {
				console.log(str);
			}
		}
	};

	var STRINGS = {
		undefLeafLoader : 'Tree leaf loader is not a function.'
	};

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

		callbacks : null,
		handlers : null,

		theme : 'custom',
		cls : {

			root : 'tree_root',

			control : 'tree_control',
			folder : 'folder',
			text : 'tree_leaf_text',

			selected : 'selected',
			hover : 'hover',

			loader : 'loader',
			open : 'open'

		},
		html : {

			tree : '<UL>',
			leaf : '<LI>',
			children : '<UL>',

			control : '<SPAN>',
			text : '<SPAN>',

		},
		control : {
			close : '+',
			open : '&ndash;'
		},
		storeLoaded : true

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
				container : this // JQ container for tree
			};

			$.each(DEFAULTS, function (name, value) {
				if (value && ((typeof value) == 'object')) {
					x[name] = $.extend(value, treeParams[name] || {});
				} else {
					x[name] = treeParams[name] || value;
				}
			});

			var loader = function (path, callback) {
				if ($.isFunction(x.loader)) {
					x.loader(path, callback);
				} else {
					log(STRINGS.undefLeafLoader);
				}
			};

			var loadLeaf = function (leaf, callback) {
				if (leaf.folder && leaf.open) {
					x.cls.loader && (leaf.els.text.addClass(x.cls.loader));
					loader(getPath(leaf), function (obj) {
						parseChildren(leaf, obj, function (leaf) {
							x.cls.loader && (leaf.els.text.removeClass(x.cls.loader));
							callback && callback(leaf, tree, controller);
						});
					});
				}
			};

			var getPath = function (leaf) {
				var arr = [leaf.name];
				var el = leaf.parent;
				while (el.parent !== null) {
					arr.unshift(el.name);
					el = el.parent;
				};
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
				leaf.els.control.html(leaf.open ? x.control.open : x.control.close);
			};

			var setControl = function (leaf) {
				var control = leaf.els.control;
			};

			var makeLeaf = function (leaf) {
				var els = leaf.els = {
					control : makeEl('control'),
					text : makeEl('text', leaf.text),
					children : makeEl('children')
				};
				setControlHtml(leaf);
				if (leaf.folder) {
					els.control.addClass(x.cls.folder);
					els.control.on('click', function (evt) {
						leaf.open = !leaf.open;
						if (leaf.open) {
							if (x.storeLoaded && (leaf.items.length > 0)) {
								leaf.els.children[x.animate.open](x.animate.delay, function () {
									setControlHtml(leaf);
								});
							} else {
								loadLeaf(leaf, function (leaf) {
									setControlHtml(leaf);
									// todo: scroll leaf into view...
								});
							}
						} else {
							leaf.els.children[x.animate.close](x.animate.delay, function () {
								setControlHtml(leaf);
							});
						}
					});
				}
				leaf.container = makeEl('leaf').append(els.control, els.text, els.children);
				leaf.container.appendTo(leaf.parent.els.children);
			};

			var parseChildren = function (leaf, obj, callback) {

				leaf.children = {};
				leaf.items = [];
				leaf.els.children.hide();
				leaf.els.children.empty();

				$.each(obj, function (name, value) {

					var el = $.extend({
							folder : false,
							// undefined || null || false
							open : (!value.folder) ? true : false
						}, value);

					el.parent = leaf;
					el.name = name;
					!el.text && (el.text = name);

					el.children = {};
					el.items = [];

					makeLeaf(el);

					leaf.children[name] = el;
					leaf.items.push(el);

					loadLeaf(el);

				});

				var method = (leaf.parent == null) ? x.init.method : x.animate.open;

				leaf.els.children[method](x.animate.delay, function () {
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
						tree.container = tree.els.children = $(x.html.tree).addClass(x.theme + '_' + x.cls.root);
						x.container.html(tree.container);

						parseChildren(tree, obj, function (leaf) {
							x.init.callback(controller, tree);
						});

					})

				},

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
