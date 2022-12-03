<?php
//Passed values
header('Content-Type: application/json');
$v = file_get_contents("php://input");
$data = json_decode($v);

$enteredusername = $data -> username;
$enteredpassword = $data -> password;
include $_SERVER['DOCUMENT_ROOT'].'/main/connection.php';

header('Content-Type: text/html');
$sql = "SELECT Pass, Rang from login WHERE Username = '$enteredusername'";
$result = $connection->query($sql);
if ($result->num_rows == 0)
{
	echo json_encode(1);
	exit();
}
$encryptedpassword = hash('sha256', $enteredpassword);
$userdetails = $result->fetch_assoc();
if  ($encryptedpassword == $userdetails["Pass"])
{
	echo json_encode(0);
	session_start();
	$_SESSION["username"] = $enteredusername;
	$_SESSION["rang"] = $userdetails["Rang"];
}
else
{
	echo json_encode(2);
	echo $encryptedpassword;
	exit();
}
?>