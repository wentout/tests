$(function () {
	try {

		var count = 0;
		var info = function (str) {
			count++
			if (str !== undefined) {
				$('#debug').val($('#debug').val() + count + '. ' + str + '\n');
			} else {
				count = 0;
				$('#debug').html('');
			}
			$('#debug')[0].scrollTop = $('#debug')[0].scrollHeight;
		};
		info();

		var countRand = 0;
		$('#tree_content').customTree({

			root : 'top',
			init : {
				callback : function (controller, tree) {
					info('Init callback.');
				}
			},

			// for leaf callbacks
			handlers : {
				added : function (leaf, controller, tree) {
					info('Added [' + controller.getPath(leaf) + '] \n   name :' + leaf.text);
				},
				loaded : function (leaf, controller, tree) {
					info('Loaded [' + controller.getPath(leaf) + '] \n   text :' + leaf.text);
				},
				parsed : function (leaf, controller, tree) {
					info('Parsed [' + controller.getPath(leaf) + '] \n   text :' + leaf.text);
				},
				open : function (leaf, controller, tree) {
					info('Open [' + controller.getPath(leaf) + '] \n   text :' + leaf.text);
				},
				close : function (leaf, controller, tree) {
					info('Close [' + controller.getPath(leaf) + '] \n   text :' + leaf.text);
				},
				hover : function (leaf, controller, tree) {
					// info('Hover [' + controller.getPath(leaf) + '] \n   text :' + leaf.text);
				},
				unhover : function (leaf, controller, tree) {
					// info('Unhover [' + controller.getPath(leaf) + '] \n   text :' + leaf.text);
				},
				focus : function (leaf, controller, tree) {
					info('Focus [' + controller.getPath(leaf) + '] \n   text :' + leaf.text);
				},
				beforeblur : function (leaf, controller, tree) {
					info('Beforeblur [' + controller.getPath(leaf) + '] \n   text :' + leaf.text);
					return true;
				},
				blur : function (leaf, controller, tree) {
					info('Blur [' + controller.getPath(leaf) + '] \n   text :' + leaf.text);
				},
				deleted : function (leaf, controller, tree) {
					info('Deleted [' + controller.getPath(leaf) + '] \n   text :' + leaf.text);
				},
				dblclick : function (leaf, controller, tree) {
					info('Dblclick [' + controller.getPath(leaf) + '] \n   text :' + leaf.text);
				}
			},

			listeners : {
				// click, contextmenu up the element Label
				contextmenu : function (leaf, controller, tree, event) {
					// debugger;
				}
			},

			// selectParentOnClose : true,
			// selectByDblClick: true,
			storeLoaded : false,
			labelsBreak : {
				by : 50
			},

			loader : function (path, callback) {
				var obj;
				var path = JSON.stringify(path);
				info('Loading : ' + path);
				switch (path) {
				case '["top"]':
					obj = {
						child1 : {
							text : 'name1',
							folder : true,
							open : true
						},
						child2 : {
							text : 'name2',
							opts : '123'
						},
						child3 : {
							folder : true,
							open : false
						}
					};
					break;
				case '["top","child1"]':
					obj = {
						child1 : {
							text : 'name11'
						},
						child2 : {
							text : 'name12',
							opts : '123'
						}
					};
					break;
				default:
					countRand++;
					var longText = 'child3  child3  child3 child3  child3  child3 child3  child3  child3';
					obj = {
						child1 : {
							folder : true,
							text : longText
						},
						child2 : {},
						child3 : {
							text : longText
						},
						child4 : {
							folder : true
						},
						child5 : {}
					}
					var el = Math.random() > 0.5 ? 'child4' : 'child1';
					obj[el].open = countRand > 25 ? false : true;
				}
				var val = JSON.stringify(obj);
				window.setTimeout(function () {
					callback(JSON.parse(val));
					// }, 1000);
				}, 50);
			}

		});

	} catch (e) {
		alert(e);
	}
}); //.hide().fadeIn( 1000 );
