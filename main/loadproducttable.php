<?php
//Passed values
header('Content-Type: application/json');
$v = file_get_contents("php://input");
$data = json_decode($v);

$searchname = $data->productname;
include $_SERVER['DOCUMENT_ROOT'].'/main/connection.php';

//SQL
$sql = "SELECT Product_Name FROM productlist";
if ($searchname != "")
	$sql = $sql . " WHERE Product_Name LIKE '%" . $searchname . "%'";
$sql = $sql . " ORDER BY Product_Name";
$result = $connection->query($sql);
if ($result->num_rows == 0)
{
	echo "<h2>Sajnáljuk, de nincs a keresésnek megfelelő elem!</h2>";
	exit();
}
while($data = $result->fetch_assoc()) {
    $row[] = $data;
}
echo '<table id = ProductTable class = "SimpleTable">';
for ($i = 0; $i < count($row); $i++)
{
	echo '<tr id = "TrRow'.$i.'"> <td id = "Row'.$i.'" class = "SimpleTableTitle">' . $row[$i]["Product_Name"] . '</td> <td class = "SimpleTableEdit" onclick = "EditProduct('.$i.')"> Szerkesztés </td> <td class = "SimpleTableDelete" onclick = "RemoveProduct('.$i.')"> Törlés </td> </tr>';
}
echo '</table>';
?>