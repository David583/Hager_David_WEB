<?php
//Passed values
header('Content-Type: application/json');
$v = file_get_contents("php://input");
$data = json_decode($v);
session_start();
$id = $data->id;
include $_SERVER['DOCUMENT_ROOT'].'/main/connection.php';

if ($_SESSION["rang"] == 1) {
	$sql = "DELETE FROM login WHERE ID = '$id'";
	$connection->query($sql);
	$connection->close();
}
?>