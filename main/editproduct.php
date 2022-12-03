<?php
//Passed values
header('Content-Type: application/json');
$v = file_get_contents("php://input");
$data = json_decode($v);

$searchname = $data->productname;
include $_SERVER['DOCUMENT_ROOT'].'/main/connection.php';

$sql = "SELECT Product_HTML FROM productlist WHERE Product_Name = '" . $searchname . "'";
$result = $connection->query($sql);
while($data = $result->fetch_assoc()) {
    $row[] = $data;
}
$file = file_get_contents($_SERVER['DOCUMENT_ROOT']."/products/product_".$row[0]["Product_HTML"]."/html.html", true);
echo $file;
?>