<?php
//A fejléc beállítása, hogy a beérkező adatokat JSON formában olvassa be
header('Content-Type: application/json');
$v = file_get_contents("php://input");
$data = json_decode($v);

//A data objektumból kinyerjük a javascriptel átküldött adatokat
$start = $data->startdate;
$end = $data->enddate;
$switches = $data->switches;
include $_SERVER['DOCUMENT_ROOT'].'/main/connection.php'; //Megteremtjük a kapcsolatot a szerverrel

//Az SQL lekérdezés, mely megkapja a kezdeti és a vég dátumot, majd azok szerint szűr
$sql = "SELECT OrderID, CompanyInfo, OrderedItems, Seen, DateOfOrder FROM orders WHERE DateOfOrder <= '$start' AND DateOfOrder >= '$end'";
//3 fajta rendelés van: Még nem elfogadott, elfogadott, de még nem teljesített, és teljesített
//A felhasználó ezek közül szabadon választhat, hogy melyiket szeretné megjeleníteni
//Ezt 3 bit-ben ábrázolhatjuk, majd ezt a 3 bitet átkonvertálva 2-es számrendszerbe, majd a kapott számot index-ként
//használva az alábbi tömbben megkapjuk a helyes lekérdezést
$table = array("AND Seen = 3", "AND Seen = 2", "AND Seen = 1", "AND (Seen = 1 OR Seen = 2)", "AND Seen = 0", "AND (Seen = 2 OR Seen = 0)", "AND (Seen = 0 OR Seen = 1)", "");
$sql = $sql . $table[bindec($switches)];
//Az SQL parancs leadása a szervernek
$result = $connection->query($sql);
//Ha a keresésnek nincs eredménye, megszakítjuk a futást
if ($result->num_rows == 0)
{
	echo "<h2>Sajnáljuk, de a megadott dátumokon belül nem volt a kiválasztott fajtákból rendelés!</h2>";
	exit();
}
//A kapott adatokat beletöltjük egy row nevezetű objektumba
while($data = $result->fetch_assoc()) {
    $row[] = $data;
}
//A színlista statikus, állandó, mindig ilyen sorrendben található meg
$colorlisthu = array("piros", "barna", "narancssárga", "sárga", "oliva", "zöld", "cián", "kék", "lila", "rózsaszín", "fehér", "szürke", "fekete");
//A rendeléseket egyesével feldolgozzuk
for ($i = 0; $i < count($row); $i++)
{
	$id = $row[$i]['OrderID'];
	$index = 0;
	//Egy rendelés adatainak kezdete
	echo "<div class = 'OrderInfo ";
	//A rendeléshez tartozó osztály meghatározása
	//Ha nem látták: piros háttér; Ha elfogadták, de még nem teljesítették: sárga háttér; Ha már teljesítették: zöld háttér
	if ($row[$i]["Seen"] == 0)
		echo "OrderNotSeen";
	else if ($row[$i]["Seen"] == 1)
		echo "OrderSeen";
	else
		echo "OrderCompleted";
	echo "'> <p class = 'OrderInfoName'>Rendelés #$id</p>";
	//A cég adainak leírása, aki rendelte
	$companyinfo = explode(";",$row[$i]["CompanyInfo"]);
	if ($row[$i]['CompanyInfo'][0] != ';') {
		echo "<span class = 'OrderInfoHighLight'>Cég neve:&nbsp</span><span>$companyinfo[$index]&nbsp</span>";
		$index++;
	}
	echo "<span class = 'OrderInfoHighLight'>Megrendelő neve:&nbsp</span><span>$companyinfo[$index]&nbsp</span>";
	$index++;
	echo "<span class = 'OrderInfoHighLight'>Telefonszám:&nbsp</span><span>$companyinfo[$index]&nbsp</span>";
	$index++;
	echo "<span class = 'OrderInfoHighLight'>E-mail cím:&nbsp</span><span>$companyinfo[$index]&nbsp</span>";
	$index++;
	echo "<span class = 'OrderInfoHighLight'>Cég címe:&nbsp</span><span>$companyinfo[$index]&nbsp</span> <ul class = 'OrderInfoList'>";
	$index++;
	//A rendelt termékek felsorolása
	$ordereditems = explode(";", $row[$i]["OrderedItems"]);
	for ($j = 0; $j < count($ordereditems) - 1; $j++)
	{
		echo "<li>$ordereditems[$j] darab";
		$j++;
		$color = $ordereditems[$j];
		echo " $colorlisthu[$color]";
		$j++;
		echo " $ordereditems[$j]";
	}
	echo "</ul>";
	//A Seen érték a rendelésben 0-2 között változhat, s ezt használva indexnek a lenti tömbben kiírhatjuk a megfelelő gombokat
	$buttons = array("<p class = 'OrderInfoButton' onclick = 'CancelOrder($id)'>Elutasítás</p><p class = 'OrderInfoButton' onclick = 'AcceptOrder($id, 1)'>Elfogadás</p>", "<p class = 'OrderInfoButton' onclick = 'AcceptOrder($id, 2)'>Teljesítés</p>", "<p class = 'OrderInfoButton' onclick = 'CancelOrder($id)'>Törlés</p>");
	echo $buttons[$row[$i]["Seen"]];
	echo "</div>";
}
?>