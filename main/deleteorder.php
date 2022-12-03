<?php
//Passed values
header('Content-Type: application/json');
$v = file_get_contents("php://input");
$data = json_decode($v);

$id= $data->id;

include $_SERVER['DOCUMENT_ROOT'].'/main/connection.php';

$sql = "DELETE FROM orders WHERE OrderID = '$id'";
$connection->query($sql);
$connection->close();
?>