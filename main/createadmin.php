<?php
//Passed values
header('Content-Type: application/json');
$v = file_get_contents("php://input");
$data = json_decode($v);
session_start();
$name = $data->name;
$pass = $data->pass;
$passw = hash('sha256', $pass);
include $_SERVER['DOCUMENT_ROOT'].'/main/connection.php';
if ($_SESSION["rang"] == 1) {
	$sql = "INSERT INTO login (Username, Pass, Rang) VALUES ('$name', '$passw', 2)";
	$connection->query($sql);
	$connection->close();
}
?>