<?php
//Passed values
header('Content-Type: application/json');
$v = file_get_contents("php://input");
$data = json_decode($v);

$pagenumber = $data->pagenumber;
$searchname = $data->searchname;
include $_SERVER['DOCUMENT_ROOT'].'/main/connection.php';

//SQL
$sql = "SELECT Product_HTML FROM productlist";
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

//Paging
$usedpages = ceil(count($row) / 5);
for ($i = 5 * $pagenumber; $i < 5 * $pagenumber + 5; $i++)
{
	if ($i < count($row)) 
	{ 
		$file = file_get_contents('../products/product_'.$row[$i]["Product_HTML"].'/html.html');
		echo $file;
	}
}
echo "<p id = 'ProductPageContainer'>";
for ($i = $pagenumber - 2; $i < $pagenumber + 3; $i++)
{
	if ($i < 0 || $i >= $usedpages)
		echo "&nbsp&nbsp";
	else if ($i == $pagenumber)
		echo "<span id = 'ProductPageNumberCurrent'>". ($i + 1) . "</span>";
	else
		echo "<span id = 'ProductPageNumber' onclick = 'LoadProduct(" . ($i) .    ",\""  . $searchname . "\")'>". ($i + 1) . "</span>";
}
echo "</p>";

?>