<?php
//Passed values
header('Content-Type: application/json');
$v = file_get_contents("php://input");
$data = json_decode($v);
session_start();
$name = $data->name;
include $_SERVER['DOCUMENT_ROOT'].'/main/connection.php';
if ($_SESSION["rang"] == 1) {
	$sql = "INSERT INTO groups (GroupName) VALUES ('$name')";
	$connection->query($sql);
	$connection->close();
}
?>