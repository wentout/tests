<!DOCTYPE html>
<html xmlns:ng = "http://angularjs.org" id = "ng-app">
<head ng-controller = "HeadCtrl">
	
	<meta http-equiv = "Content-Type" content = "text/html; charset=utf=8">
	<title ng-bind-template = "{{title}}"> Fine Cut Engine </title>
	
	
	<!-- libs //-->
	<script language = "JavaScript" type = "text/javascript" charset = "utf-8" src = "./scripts/jquery-2.0.2.min.js"></script>
	<script language = "JavaScript" type = "text/javascript" charset = "utf-8" src = "./scripts/angular.1.1.5.min.js"></script>
	<script language = "JavaScript" type = "text/javascript" charset = "utf-8" src = "./scripts/beautify.js"></script>
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
			<a href = "#!/main" ng-click = "mainTab()"><b class = "brand">{{i18n.brand}}</b></a>
			<ul class = "nav" id = "mainTabs" ng-repeat="tab in tabs">
				<li ng-class = "activeTab()"><a href = "#!{{tab}}">{{i18n.tabs[tab]}}</a></li>
			</ul>
		</div>
	</div>
</div>

<div id = "container" class = "well" ng-view>application error</div>

<div id = "info" class = "well hidden">asdf</div>
	
</body>
	<!-- app //-->
	<script language = "JavaScript" type = "text/javascript" charset = "utf-8" src = "./app.js"></script>
</html>