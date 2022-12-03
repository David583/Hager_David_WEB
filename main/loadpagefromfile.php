<?php
//Fejléc beállítása
header('Content-Type: application/json');
$v = file_get_contents("php://input");
$data = json_decode($v);

session_start();
//Oldalszám kinyerése az átküldött adatokból
$pagenumber = $data->pagenumber;
//Az elérhető oldalak listája. Ez statikusan van megadva, állandó.
$selection = ["start", "products", "addproduct", "editproduct", "createorder", "vieworders", "users", "groups"];
//A korlátozott oldalak csak a megfelelő rang megléte után érhetőek el, különben semmit nem kapunk vissza
if ((isset($_SESSION["rang"]) == false && ($pagenumber < 2 || $pagenumber == 4) || $_SESSION["rang"] == 1) || ($pagenumber <  6  && $_SESSION["rang"] == 2)) {
	$file = file_get_contents('../' . $selection[$pagenumber] . '.html');
	echo $file;
}
else
	exit();
?>