$(function () {
	try {
		var count = 0;
		$('#tree_content').customTree({

			root : 'top',
			init : {
				callback : function (controller, tree) {
					// debugger;
				}
			},

			callbacks : {
				// for leaf callbacks
				creation : function (leaf, controller, tree) {
					debugger;
				}
			},

			handlers : {
				blur : null
			},

			loader : function (path, callback) {
				var obj;
				switch (JSON.stringify(path)) {
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
					count++;
					obj = {
						child1 : {
							folder : true
						},
						child2 : {},
						child3 : {},
						child4 : {
							folder : true
						},
						child5 : {}
					}
					var el = Math.random() > 0.5 ? 'child4' : 'child1';
					obj[el].open = count > 5 ? false : true;
				}
				var val = JSON.stringify(obj);
				window.setTimeout(function () {
					callback(JSON.parse(val));
				}, 1000);
			}

		});

	} catch (e) {
		alert(e);
	}
}); //.hide().fadeIn( 1000 );
