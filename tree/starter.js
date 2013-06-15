$(function () {
	try {

		$('#tree_content').customTree({

			root : 'top',
			init : {
				callback : function (controller, tree) {
					debugger;
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
				if (path == 'top') {
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
						},
					}
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
