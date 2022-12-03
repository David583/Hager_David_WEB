<?php
//Passed values
header('Content-Type: application/json');
$v = file_get_contents("php://input");
$data = json_decode($v);

include $_SERVER['DOCUMENT_ROOT'].'/main/connection.php';

$sql = "SELECT GroupID, GroupName FROM groups";
$result = $connection->query($sql);
if ($result->num_rows == 0)
{
	echo "<h2>Nincs egyetlen csoport sem!</h2>";
	exit();
}
while($data = $result->fetch_assoc()) {
    $row[] = $data;
}
echo '<table id = "GroupTable" class = "SimpleTable" style = "margin-top:25px">';
for ($i = 0; $i < count($row); $i++)
{
	echo "<tr> <td class = 'SimpleTableTitle'>".$row[$i]['GroupName']."</td> <td class = 'SimpleTableDelete' onclick = 'DeleteGroupAsk(".$row[$i]['GroupID']. ")'>Törlés</td> </tr>";
}
echo '</table>';
?>