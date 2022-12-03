<?php
header('Content-Type: application/json');
session_start();
if (isset($_SESSION["username"]) && isset($_SESSION["rang"]))
{
	$array = new \stdClass();
	$array->username = $_SESSION["username"];
	$array->rang = $_SESSION["rang"];
	echo json_encode($array);
}
else
	echo json_encode(0);
?>