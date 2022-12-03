<?php
//Passed values
header('Content-Type: application/json');
$v = file_get_contents("php://input");
$data = json_decode($v);
session_start();
$id = $data->id;
include $_SERVER['DOCUMENT_ROOT'].'/main/connection.php';

if ($_SESSION["rang"] == 1) {
	$sql = "DELETE FROM groups WHERE GroupID = '$id'";
	$connection->query($sql);

	$dir = "SELECT Product_HTML FROM productlist WHERE Product_GroupID = '$id'";
	$result = $connection->query($dir);
	while($data = $result->fetch_assoc()) {
   		$row[] = $data;
	}
	rmdir_recursive($_SERVER['DOCUMENT_ROOT'].'/products/product_'. $row[0]["Product_HTML"]);

	$sql = "DELETE FROM productlist WHERE Product_GroupID = '$id'";
	$connection->query($sql);
	$connection->close();
}
?>