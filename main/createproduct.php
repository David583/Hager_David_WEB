<?php
//Passed values
header('Content-Type: application/json');
$v = file_get_contents("php://input");
$data = json_decode($v);

$title = $data->title;
$dirname = $data->dirna;
$image = $data->image;
$description = $data->description;
$info = $data->info;
$colors = $data->colors;
$group = $data->group;

include $_SERVER['DOCUMENT_ROOT'].'/main/connection.php';

mkdir($_SERVER['DOCUMENT_ROOT'].'/products/product_'. $dirname . '/', 0777);

$imagedata = base64_decode($image);
file_put_contents($_SERVER['DOCUMENT_ROOT'].'/products/product_'. $dirname . '/product.png', $imagedata);
$file = fopen($_SERVER['DOCUMENT_ROOT'].'/products/product_'. $dirname . '/html.html', "w");
$stringtowrite = '<div id = "Product">
	<hr></hr>
	<div id = "ProductDescription">
		<p><img src = " products/product_'.$dirname.'/product.png" id = "ProductPhoto"></img>
		<span class = "ProductTitle">'.$title.'</span>
		<br>
		<span class = "ProductGroup">'.$group.'</span>
		<br>
		<p>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;'.  $description . '</p>
	</div>
	<div id = "ProductDetails">
		<p id = "ProductDetailsTitle">Termék adatok:</p>
		<ul>';
$infostring = "";
for ($i = 0; $i < count($info); $i = $i + 2)
{
	$infostring = $infostring . '<li><span style = "font-style: italic">' .$info[$i]. '</span>&nbsp;:&nbsp;'. $info[$i + 1] .'</li>';
}
$infostring = $infostring . '<li id = "Color"><span style = "font-style: italic">Színek&nbsp;</span>:';
$colortable = Array("red", "brown", "orange", "yellow", "olive", "green", "cyan", "blue", "purple", "pink", "white", "gray", "black");
for ($i = 0; $i < 13; $i++)
{
	if ($colors[$i] == "1")
		$infostring = $infostring . '<div class = "box ' .$colortable[$i]. '"></div>';
}
$stringtowrite = $stringtowrite . $infostring . '</li> </ul> </div> </div>';
fwrite($file, $stringtowrite);
fclose($file);
$getgroupname = "SELECT GroupID from groups WHERE GroupName = '$group'";
$groupname = $connection->query($getgroupname);
while($data = $groupname->fetch_assoc()) {
    $row[] = $data;
}
$gname = $row[0]["GroupID"];
$sql = "INSERT INTO productlist (Product_Name, Product_HTML, Product_GroupID) VALUES ('$title', '$dirname', '$gname')";
$connection->query($sql);
$connection->close();
?>