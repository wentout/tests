<!DOCTYPE html>
<html xmlns:ng = "http://angularjs.org" id = "ng-app">
<head ng-controller = "HeadCtrl">
	
	<meta http-equiv = "Content-Type" content = "text/html; charset=utf=8">
	<title ng-bind-template = "{{title}}"> Fine Cut Engine </title>
	
	
	<!-- libs //-->
	<script language = "JavaScript" type = "text/javascript" charset = "utf-8" src = "./scripts/jquery-2.0.2.min.js"></script>
	<script language = "JavaScript" type = "text/javascript" charset = "utf-8" src = "./scripts/angular.1.1.5.min.js"></script>
	
	<link rel = "stylesheet" type = "text/css" href = "./css/bootstrap.2.3.2.min.css">


	<!-- app //-->
	<script language = "JavaScript" type = "text/javascript" charset = "utf-8" src = "./tree/tree.js"></script>
	<script language = "JavaScript" type = "text/javascript" charset = "utf-8" src = "./app.js"></script>

	<link rel = "stylesheet" type = "text/css" href = "./tree/tree.css">
	<link rel = "stylesheet" type = "text/css" href = "./style.css">

	
<body ng-controller = "BodyCtrl">

<div class = "navbar navbar-fixed-top">
	<div class = "navbar-inner">
		<div class = "container">
			<b class = "brand" >{{brand}}</b>
			<ul class = "nav">
				<li><a href = "#">Pages Manager</a></li>
				<li><a href = "#">Templates</a></li>
				<li><a href = "#">File Manager</a></li>
				<li><a href = "#">Settings</a></li>
			</ul>
		</div>
	</div>
</div>
	
</body>
</html>