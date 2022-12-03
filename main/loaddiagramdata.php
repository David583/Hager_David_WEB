<?php
//Passed values
header('Content-Type: application/json');
$v = file_get_contents("php://input");
$data = json_decode($v);

$year = $data->year;
include $_SERVER['DOCUMENT_ROOT'].'/main/connection.php';

$sql = "SELECT MONTH (DateOfOrder) as Honap, Count(*) as Darab FROM orders WHERE YEAR (DateOfOrder) = '$year' GROUP BY Honap";
$result = $connection->query($sql);
if ($result->num_rows == 0)
{
	echo "<h2 style = 'text-align:center'>Sajnáljuk, de a megadott évben nem volt rendelés!</h2>";
	exit();
}
while($data = $result->fetch_assoc()) {
    $row[] = $data;
}
for ($i = 0; $i < count($row); $i++)
{
	echo $row[$i]["Honap"] . ";" . $row[$i]["Darab"] . ";";
}
?>