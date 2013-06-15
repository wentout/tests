(function (jQuery, undefined) {

	var e; // for catch(e)

	var STRINGS = {
		undefLeafLoader : 'Tree leaf loader is not a function.'
	};

	var log = function (str, obj) {
		if (console && console.log) {
			if (obj) {
				console.log(obj, str);
			} else {
				console.log(str);
			}
		}
	};

	var DEFAULTS = {

		init : {

			delay : null,
			preloader : true,

			// function (controller, tree)
			callback : null

		},

		root : 'top',
		// must be content loading function ( path, callback ),
		// where callback will receive leafObject
		loader : null,

		animate : 500,

		callbacks : null,
		handlers : null,

		theme : 'custom',
		cls : {

			root : 'tree_root',

			control : 'tree_control',
			text : 'tree_leaf_text',

			selected : 'selected',
			hover : 'hover',

			loader : 'loader',
			preloader : 'preloader'

		},
		html : {

			tree : '<UL>',
			leaf : '<LI>',
			children : '<UL>',

			control : '<SPAN>',
			text : '<SPAN>',

		}

	};

	jQuery.fn.extend({
		customTree : function (treeParams) {

			// tree object iself
			var tree = {

				parent : null,
				name : null,
				text : null,

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

			var cls = function (name) {
				if (x.cls[name]) {
					return x.theme + '_' + x.cls[name];
				}
			};

			var loadLeaf = function (path, callback) {
				if ($.isFunction(x.loader)) {
					x.loader(path, callback);
				} else {
					log(STRINGS.undefLeafLoader);
				}
			};

			var makeEl = function (type, html) {
				var el = $(x.html[type] || type);
				var css = cls(type);
				css && el.addClass(css);
				html && el.html(html);
				return el;
			};

			var makeLeaf = function (obj) {
				var els = obj.els = {
					control : makeEl('control'),
					text : makeEl('text', obj.text)
				};
				obj.container = makeEl('leaf').append(els.control, els.text);
				obj.container.appendTo(obj.parent.container);
			};

			var parseChildren = function (leaf, obj, callback) {

				leaf.container.hide();
				leaf.container.empty();

				$.each(obj, function (name, value) {

					var el = value;

					el.parent = leaf;
					el.name = name;
					!el.text && (el.text = name);

					el.children = {};
					el.items = [];

					makeLeaf(el);

					leaf.children[name] = el;
					leaf.items.push(el);

				});

				var method = (leaf.parent == null) ? 'fadeIn' : 'slideDown';

				leaf.container[method](x.animate, function () {
					callback && callback(leaf, controller, tree);
				});

			};

			var controller = {

				init : function (callback) {

					x.container.empty();

					if (x.init.preloader) {
						x.container.addClass(x.cls.preloader);
					}

					loadLeaf(x.root, function (obj) {

						if (x.init.preloader) {
							x.container.removeClass(x.cls.preloader);
						}

						tree.container = $(x.html.tree).addClass(cls('root'));
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
