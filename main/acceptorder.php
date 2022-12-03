<?php
//Passed values
header('Content-Type: application/json');
$v = file_get_contents("php://input");
$data = json_decode($v);

$id= $data->id;
$method = $data->method;

include $_SERVER['DOCUMENT_ROOT'].'/main/connection.php';

if ($method == 1)
	$sql = "UPDATE orders SET Seen = '1' WHERE OrderID = '$id'";
else
	$sql = "UPDATE orders SET Seen = '2' WHERE OrderID = '$id'";
$connection->query($sql);
$connection->close();
?>