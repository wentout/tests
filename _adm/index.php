<!DOCTYPE html>
<html xmlns:ng = "http://angularjs.org" id = "ng-app">
<head ng-controller = "HeadCtrl">
	
	<meta http-equiv = "Content-Type" content = "text/html; charset=utf=8">
	<title ng-bind-template = "{{title}}"> Fine Cut Engine </title>
	
	
	<!-- libs //-->
	<script language = "JavaScript" type = "text/javascript" charset = "utf-8" src = "./scripts/jquery-2.0.2.min.js"></script>
	<script language = "JavaScript" type = "text/javascript" charset = "utf-8" src = "./scripts/angular.1.1.5.min.js"></script>
	<!-- <script language = "JavaScript" type = "text/javascript" charset = "utf-8" src = "./scripts/angular-resource.1.1.5.min.js"></script> //-->
	
	<link rel = "stylesheet" type = "text/css" href = "./css/bootstrap.2.3.2.min.css">


	<!-- app //-->
	<script language = "JavaScript" type = "text/javascript" charset = "utf-8" src = "./tree/tree.js"></script>

	<link rel = "stylesheet" type = "text/css" href = "./tree/tree.css">
	<link rel = "stylesheet" type = "text/css" href = "./style.css">

	
<body ng-controller = "BodyCtrl">

<div class = "navbar navbar-fixed-top">
	<div class = "navbar-inner">
		<div class = "container">
			<a href = "#main"><b class = "brand" >{{i18n.brand}}</b></a>
			<ul class = "nav" id = "mainTabs">
				<li><a href = "#pages">{{i18n.tabs.pages}}</a></li>
				<li><a href = "#templates">{{i18n.tabs.templates}}</a></li>
				<li><a href = "#files">{{i18n.tabs.files}}</a></li>
				<li><a href = "#settings">{{i18n.tabs.settings}}</a></li>
			</ul>
		</div>
	</div>
</div>

<div id = "container" class = "well" ng-view></div>

<div id = "info" class = "well hidden">asdf</div>
	
</body>
	<!-- app //-->
	<script language = "JavaScript" type = "text/javascript" charset = "utf-8" src = "./app.js"></script>
</html>