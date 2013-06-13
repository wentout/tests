(function (jQuery, undefined) {
	
    var e;
	
    jQuery.fn.extend({
        customTree: function (x) {
			
            var tree = {
				
                container: this // JQ container for tree
								
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
				
				init: function ( callback ) {
					
					tree.root = {
						path: x.root
					},
					callback.call( controller, tree	);
					
				}
				
			};
			
            try {
				// tree startup
                window.setTimeout(function () {
					
                    if (x.init.preloader) {
                        tree.container.addClass(x.css.preloader);
					}
					controller.init( x.init.callback );
					
				}, x.init.delay);
				
			} catch (e) { alert(e); }
			
		}
	});
	
})(jQuery);