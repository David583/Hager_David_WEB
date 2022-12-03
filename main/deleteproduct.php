<?php
//Passed values
header('Content-Type: application/json');
$v = file_get_contents("php://input");
$data = json_decode($v);

$searchname = $data->productname;
include $_SERVER['DOCUMENT_ROOT'].'/main/connection.php';


$dir = "SELECT Product_HTML FROM productlist WHERE Product_Name = '$searchname'";
$result = $connection->query($dir);
while($data = $result->fetch_assoc()) {
    $row[] = $data;
}
rmdir_recursive($_SERVER['DOCUMENT_ROOT'].'/products/product_'. $row[0]["Product_HTML"]);


$sql = "DELETE FROM productlist WHERE Product_Name = '" . $searchname . "'";
$connection->query($sql);
$connection->close();
?>