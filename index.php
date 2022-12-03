<!DOCTYPE html>
<html>
<head>
	<!-- CSS -->
	<link rel="stylesheet" type="text/css" href="main/main.css">
	<link rel="stylesheet" type="text/css" href="main/box_colors.css">
	<link rel="stylesheet" type="text/css" href="main/admin.css">
	<link rel="stylesheet" type="text/css" href="main/sizeadjust.css">
   	<link href="https://fonts.googleapis.com/css2?family=Noto+Sans+JP&display=swap" rel="stylesheet">
	<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css"> <!-- Search Button-->
	<!-- JS -->
   	<script src="main/main.js"></script> 
	<script src="https://cdn.plot.ly/plotly-latest.min.js"></script>
    <!-- Other -->
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
	<meta charset="UTF-16">
	<title>Plant-ic kft.</title>
</head>
<body onload="LoadPageFromFile(0); CheckLogin()">
	<div id = "LoadingScreen">
		<img src = "resources/loading.gif"  id = "LoadingScreenImage"></img>
	</div>
	<div id = "NavBar">
		<div id = "NavBarLeft">
			<a id = "RedirectToIndex" onclick="LoadPageFromFile(0)">Kezőlap</a>
			<a id = "RedirectToProducts" onclick="LoadPageFromFile(1)">Termékeink</a>
			<a id = "RedirectToCreateOrders" onclick="LoadPageFromFile(4)">Rendelés</a>
		</div>
	
		<div id = "NavBarMid">
			<img src = "resources/logo-small.png" id = "NavBarLogo"/>
		</div>

		<div id = "NavBarRight">
			<a id = "LoginMenu" onclick = "ShowLoginMenu()"></a>
		</div>
	</div>
	
	<div id = "LoginMenuWindow">
		<p style = "font-weight: bold; margin-bottom: 0px">Felhasználónév:</p>
		<input type = "text" id = "UsernameBox">
		<p  style = "font-weight: bold; margin-bottom: 0px">Jelszó:</p>
		<input type = "password" id = "PasswordBox">
		<p id = "LoginButton" onclick = "Login()">Bejelentkezés</p>
		<p id = "LoginError"></p>
	</div>
	
	<div id = "MainBody">
		<div id = "MainBodyContents">
			<p>Betöltés...</p>
		</div>
	</div>
	
	<div id = "GrayEffect">
	</div>
	<div id = "MessageBox">
	</div>
</body>
</html>