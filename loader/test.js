$(function () {
	$.loadSubScript('./module1.js', {
		test : 1
	});
	$.loadSubScript('./module2.js', {
		test : 2
	});
	$.loadSubScript('./module3.js', {
		test : 3
	});
	$.loadSubScript('./module4.js', {
		test : 4
	}, function (def) {
		debugger;
	});
	$.loadSubScript('./module5.js', {
		test : 5
	}, function (def) {
		debugger;
	});
});
