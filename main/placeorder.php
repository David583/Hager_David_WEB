<?php
//Passed values
header('Content-Type: application/json');
$v = file_get_contents("php://input");
$data = json_decode($v);

$order = $data->order;
$companyinfo = $data->companyinfo;
include $_SERVER['DOCUMENT_ROOT'].'/main/connection.php';
$sql = "INSERT INTO orders (CompanyInfo, OrderedItems, Seen, DateOfOrder) VALUES ('$companyinfo', '$order', '0', '".date('Y-m-d')."')";
echo $sql;
$connection->query($sql);
$connection->close();
?>