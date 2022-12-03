<?php
//Passed values
header('Content-Type: application/json');
$v = file_get_contents("php://input");
$data = json_decode($v);

include $_SERVER['DOCUMENT_ROOT'].'/main/connection.php';

//SQL
$sql = "SELECT GroupName FROM groups";
$result = $connection->query($sql);
while($data = $result->fetch_assoc()) {
    $row[] = $data;
}
$groups = "";
for ($i = 0; $i < count($row); $i++)
	$groups .= $row[$i]["GroupName"] . ";";
echo $groups;
?>