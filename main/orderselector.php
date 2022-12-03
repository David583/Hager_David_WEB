<?php
//Passed values
header('Content-Type: application/json');
$v = file_get_contents("php://input");
$data = json_decode($v);

$groupname = $data->selectedgroup;

include $_SERVER['DOCUMENT_ROOT'].'/main/connection.php';

//SQL
$sql = "SELECT Product_Name FROM productlist WHERE Product_GroupID = (SELECT GroupID from groups WHERE GroupName = '$groupname')";
$result = $connection->query($sql);
while($data = $result->fetch_assoc()) {
    $row[] = $data;
}
$products = "";
for ($i = 0; $i < count($row); $i++)
	$products .= $row[$i]["Product_Name"] . ";";
echo $products;
?>