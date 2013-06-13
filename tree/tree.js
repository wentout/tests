(function (jQuery, undefined) {

    var e;

    jQuery.fn.extend({
        customTree: function (x) {

            var tree = {

                obj: this


            };

            x.css = $.extend({
                treeLeaf: 'tree-leaf'
				, heading: 'heading'
				, control: 'control'
				, status: 'status'
				, loader: 'loader'
				, selected: 'selected'
				, preloader: 'preloader'
				, hover: 'hover'
            }, x.css || {});

            var controller = {

                init: function () {

                }

            };

            try {

                window.setTimeout(function () {

                    if (x.init.preloader) {
                        tree.obj.addClass(x.css.preloader);
                    }

                    // controller.leaf( treeViewModel );

                }, x.init.delay);

            } catch (e) { alert(e); }

        }
    });

})(jQuery);