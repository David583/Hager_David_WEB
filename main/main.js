var colorlist = ["red", "brown", "orange", "yellow", "olive", "green", "cyan", "blue", "purple", "pink", "white", "gray", "black"];
var colorlisthu = ["Piros", "Barna", "Narancssárga", "Sárga", "Oliva", "Zöld", "Cián", "Kék", "Lila", "Rózsaszín", "Fehér", "Szürke", "Fekete"];
var OrderSwitches = [1, 1 ,1];
var StoredProduct = "NotLoaded\n";


function LoadPageFromFile (pagenumber)
{
	xhttp = new XMLHttpRequest();
	var data = JSON.stringify({
		"pagenumber" : pagenumber
	});
	xhttp.open("POST", "main/loadpagefromfile.php", true);
	xhttp.setRequestHeader("Content-Type", "application/json");
	xhttp.send(data);
	xhttp.onreadystatechange = function() {
	if (this.readyState == 4 && this.status == 200) {
		document.getElementById("MainBodyContents").innerHTML = this.responseText;
		if (pagenumber == 1)
			LoadProduct(0, "");
		else if (pagenumber == 2) {
			if (StoredProduct != "NotLoaded\n")
				LoadStoredProduct();
			LoadNewProductGroups();
		}
		else if (pagenumber == 3)
			LoadProductTable();
		else if (pagenumber == 4) {
			LoadProductGroups();
		}
		else if (pagenumber == 5) {
				year = document.getElementById("Year").innerText;
				var DateNow = new Date();
				var DateOneWeekBefore = new Date(DateNow.getTime() - 604800000);
				document.getElementById("DateSelectorStart").value = DateNow.toISOString().slice(0,10);
				document.getElementById("DateSelectorEnd").value = DateOneWeekBefore.toISOString().slice(0,10);
				document.getElementById("OrdersNotSeen").checked = true;
				document.getElementById("OrdersSeen").checked = true;
				document.getElementById("OrdersCompleted").checked = true;
				LoadOrders(OrderSwitches[2], OrderSwitches[1], OrderSwitches[0]);
				var year = document.getElementById("Year").innerText;
				LoadDiagram(year);	
		}
		else if (pagenumber == 6) {
			document.getElementById("LoginMenuWindow").style.display = "none";
			LoadUserTable();
		}
		else if (pagenumber == 7) {
			document.getElementById("LoginMenuWindow").style.display = "none";
			LoadGroupTable();
		}
	};
	usedids = [1];
	usedids[0] = 1;
	}
}
function LoadProduct (pagenumber, searchname)
{
	xhttp = new XMLHttpRequest();
	var data = JSON.stringify({
		"pagenumber" : pagenumber,
		"searchname" : searchname
	});
	xhttp.open("POST", "main/loadproduct.php", true);
	xhttp.setRequestHeader("Content-Type", "application/json");
	xhttp.send(data);
	xhttp.onreadystatechange = function() {
	if (this.readyState == 4 && this.status == 200) {
		document.getElementById("ProductList").innerHTML = this.responseText;
		}
	};
	window.scrollTo(0,0);
}
function LoadProductByClick()
{
	var pagenumber = 0;
	var searchname = document.getElementById("ProductsSearchBar").value;
	xhttp = new XMLHttpRequest();
	var data = JSON.stringify({
		"pagenumber" : pagenumber,
		"searchname" : searchname
	});
	xhttp.open("POST", "main/loadproduct.php", true);
	xhttp.setRequestHeader("Content-Type", "application/json");
	xhttp.send(data);
	xhttp.onreadystatechange = function() {
	if (this.readyState == 4 && this.status == 200) {
		document.getElementById("ProductList").innerHTML = this.responseText;
		}
	};
	window.scrollTo(0,0);
}
function ShowLoginMenu() 
{
	document.getElementById("LoginMenuWindow").style.display = "grid";
	setTimeout(LoginMenuDisable, 1000);
}
function LoginMenuDisable() 
{
	function HideUserMenu(event) {
		var isClickInside = document.getElementById("LoginMenuWindow").contains(event.target);
		if (!isClickInside && window.innerWidth > 768)
		{
			document.getElementById("LoginMenuWindow").style.display = "none";
			document.removeEventListener('click', HideUserMenu);
		}
	}
	document.addEventListener('click', HideUserMenu);		
}
function Login () {
	var errormessage = document.getElementById("LoginError");
	if (document.getElementById("UsernameBox").value == "" || document.getElementById("PasswordBox").value == "")
		errormessage.innerText = "Felhasználónév és \njelszó megadása kötelező!";
	else {
		xhttp = new XMLHttpRequest();
		var data = JSON.stringify({
			"username" : document.getElementById("UsernameBox").value,
			"password" : document.getElementById("PasswordBox").value
		});
		xhttp.open("POST", "main/login.php", true);
		xhttp.setRequestHeader("Content-Type", "application/json");
		xhttp.send(data);
		xhttp.onreadystatechange = function() {
		if (this.readyState == 4 && this.status == 200) {
				if (this.responseText == "1")
					errormessage.innerText = "Nincs ilyen \n felhasználónév!";
				else if  (this.responseText == "2")
					errormessage.innerText = "A megadott jelszó\n hibás!";
				else if (this.responseText == "0")
					location.reload();
			}
		};
	}
}
function CheckLogin() {
	xhttp = new XMLHttpRequest();
	xhttp.open("POST", "main/checklogin.php", true);
	xhttp.setRequestHeader("Content-Type", "text/html");
	xhttp.send(null);
	xhttp.onreadystatechange = function() {
		if (this.readyState == 4 && this.status == 200) {
			if (this.responseText != "0")
			{		
				var userdata = JSON.parse(this.responseText);
				document.getElementById("LoginMenu").innerText = "Üdv, " + userdata.username;
				if (userdata.rang == 1)
				{
					document.getElementById("NavBarRight").innerHTML += "<a onclick = 'LoadPageFromFile(2)'>Új termék</a> <a onclick = 'LoadPageFromFile(3)'>Termékek szerkesztése</a> <a onclick = 'LoadPageFromFile(5)'>Rendelések</a>";
					document.getElementById("LoginMenuWindow").innerHTML = "<p id = 'LoginButton' onclick = 'LoadPageFromFile(7)'>Termék csoportok</p> <p id = 'LoginButton' onclick = 'LoadPageFromFile(6)'>Felhasználók</p> <p id = 'LoginButton' onclick = 'LogOut()'>Kijelentkezés</p>";			
				} else
				document.getElementById("LoginMenuWindow").innerHTML = "<p id = 'LoginButton' onclick = 'LogOut()'>Kijelentkezés</p>";
			}
			else
			{
				var userdata = JSON.parse(this.responseText);
				document.getElementById("LoginMenu").innerText = "Bejelentkezés";
			}
			setTimeout(function() { document.getElementById("LoadingScreen").style.display = "none";}, 1500);
		}
	}
}
function LogOut() {
	xhttp = new XMLHttpRequest();
	xhttp.open("POST", "main/logout.php", true);
	xhttp.setRequestHeader("Content-Type", "text/html");
	xhttp.send(null);
	xhttp.onreadystatechange = function() {
		if (this.readyState == 4 && this.status == 200) {
			location.reload();
		}
	}
}

var usedids = [1];
usedids[0] = 1;
var imagedata = "";
var oldname = "none";
var oldhtml = "";

function AddNewProductData(id)
{
	var oldbutton = document.getElementById("NewProductDataAdd" + (id - 1));
	oldbutton.innerHTML = "-";
	oldbutton.classList.remove("NewProductDataAdd");
	oldbutton.classList.add("NewProductDataRemove");
	oldbutton.setAttribute("onclick" ,"RemoveNewProductData(" + (id - 1) + ")");
	var newbutton = document.createElement("DIV");
	newbutton.innerHTML = "<div id = 'NewData" + id + "' class = 'NewProductSection asd0'> <p>Adat név:</p> <input class = 'NewProductDataName' id = 'NPDN" + id + "'> <p id = 'ExtraMargin'>Adat leírás:</p> <input class = 'NewProductDataValue' id = 'NPDV"+ id + "'> <button class = 'NewProductDataAdd' id = 'NewProductDataAdd" + id + "' onclick = 'AddNewProductData(" + (id + 1) +")'>+</button> </div>";
	document.getElementById("NewProductData").appendChild(newbutton);
	usedids.push(id);
}
function RemoveNewProductData(id)
{
	document.getElementById("NewData" + id).remove();
	usedids.splice(usedids.indexOf(id), 1);
}
function UploadNewProductImage(event) {
	var reader = new FileReader();
	reader.readAsDataURL(event.target.files[0]);
	document.getElementById("ImagePreview").src = URL.createObjectURL(event.target.files[0]);
}
function AddNewProduct() 
{
	xhttp = new XMLHttpRequest();
	var newproducttitle = document.getElementById("NewProductName").value;
	var newproductinfo = document.getElementById("NewProductInfo").value;
	var newproductgroup = document.getElementById("NewProductGroup");
	var newproductgroupname = newproductgroup.options[newproductgroup.selectedIndex].textContent;
	var infotable = [usedids.length * 2];
	for (var i = 0; i < usedids.length; i++)
	{
		if (document.getElementById("NPDN" + usedids[i]).value == "" || document.getElementById("NPDV" + usedids[i]).value == "")
		{
			document.getElementById("AddNewProductErrorMessage").innerText = "A tulajdonságok tábla egyik cellája, vagy a tábla üres!";
			return;
		}
		infotable[i * 2] = document.getElementById("NPDN" + usedids[i]).value;
		infotable[i * 2 + 1] = document.getElementById("NPDV" + usedids[i]).value;
	}
	var colortable = "";
	if (document.getElementById("ColorTable").style.display != "none") {
		for (var i = 1; i < 14; i++)
		{
			if (document.getElementById("color" + i).checked == true)
				colortable += "1";
			else
				colortable += "0";
		}
	} else {
		for (var i = 1; i < 14; i++)
		{
			if (document.getElementById("hcolor" + i).checked == true)
				colortable += "1";
			else
				colortable += "0";
		}
	}

	if (newproducttitle == "")
	{
		document.getElementById("AddNewProductErrorMessage").innerText = "A cím mező üres!";
		return;
	}
	if (document.getElementById("ImagePreview").getAttribute('src') === "resources/noimage.png")
	{
		document.getElementById("AddNewProductErrorMessage").innerText = "Nincs kép kijelölve!";
		return;
	}
	else
	{
		imagedata = getBase64Image(document.getElementById("ImagePreview"));
	}
	if (newproductinfo == "")
	{
		document.getElementById("AddNewProductErrorMessage").innerText = "A terméknek nincs leírása!";
		return;
	}
	if (colortable == "0000000000000")
	{
		document.getElementById("AddNewProductErrorMessage").innerText = "Nincs egyetlen szín se kiválasztva!";
		return;
	}
	var dirname = "";
	var characterstochange = "áéíóöőúüűÁÉÍÓÖŐÚÜŰ -";
	var changedcharacters = "aeiooouuuAEIOOOUUU__";
	for (var i = 0; i < newproducttitle.length; i++)
	{
		if (characterstochange.indexOf(newproducttitle[i]) == -1)
			dirname += newproducttitle[i];
		else
			dirname += changedcharacters[characterstochange.indexOf(newproducttitle[i])];
	}
	if (oldname != "none")
	{
		for (var i = 0; i < oldname.length; i++)
		{
			if (characterstochange.indexOf(oldname[i]) == -1)
				oldhtml += oldname[i];
			else
				oldhtml += changedcharacters[characterstochange.indexOf(oldname[i])];
		}
	}
	var data = JSON.stringify({
		"title" : newproducttitle,
		"group" : newproductgroupname,
		"dirna" : dirname,
		"image" : imagedata,
		"description" : newproductinfo,
		"info" : infotable,
		"colors" : colortable,
		"oldname" : oldname,
		"oldhtml" : oldhtml
	});
	if (document.getElementById("EditProduct").innerHTML == "NotLoaded\n")
	{
		document.getElementById("MessageBox").innerHTML = "<p>A termék létrehozása sikeres volt!</p> <div id = 'Answers'> <p id = 'AnswerYes' onclick = 'RemoveMessageBox()'>Rendben</p>";
		xhttp.open("POST", "main/createproduct.php", true);
	}
	else
	{
		document.getElementById("MessageBox").innerHTML = "<p>A termék szerkesztése sikeres volt!</p> <div id = 'Answers'> <p id = 'AnswerYes' onclick = 'RemoveMessageBox()'>Rendben</p>";
		xhttp.open("POST", "main/updateproduct.php", true);
	}
	xhttp.setRequestHeader("Content-Type", "application/json");
	xhttp.send(data);
	document.getElementById("MessageBox").style.display = "block";
	document.getElementById("GrayEffect").style.display = "block";
	LoadPageFromFile(2);
	window.scrollTo(0,0);
}
function LoadProductTable()
{
	var productname = document.getElementById("ProductsSearchBar").value;
	xhttp = new XMLHttpRequest();
	var data = JSON.stringify({
		"productname" : productname
	});
	xhttp.open("POST", "main/loadproducttable.php", true);
	xhttp.setRequestHeader("Content-Type", "application/json");
	xhttp.send(data);
	xhttp.onreadystatechange = function() {
		if (this.readyState == 4 && this.status == 200) {
			document.getElementById("ProductT").innerHTML = this.responseText;
		}
	}
}
var idtodelete = 0;
function RemoveProduct(id) 
{
	document.getElementById("MessageBox").innerHTML = "<p>Biztos benne, hogy törölni szeretné a(z) <span id = 'ProductNameToDelete'></span> terméket?</p> <p>A törlést nem lehet visszavonni!</p> <div id = 'Answers'> <p id = 'AnswerYes' onclick = 'DeleteProduct()'>Igen</p> <p id = 'AnswerNo' onclick = 'RemoveMessageBox()'>Nem</p> </div>"
	document.getElementById("ProductNameToDelete").innerText = document.getElementById("Row" + id).innerHTML;
	document.getElementById("MessageBox").style.display = "block";
	document.getElementById("GrayEffect").style.display = "block";
	idtodelete = id;
}
function RemoveMessageBox()
{
	document.getElementById("MessageBox").style.display = "none";
	document.getElementById("GrayEffect").style.display = "none";
}
function DeleteProduct() 
{
	var productname = document.getElementById("ProductNameToDelete").innerText;
	xhttp = new XMLHttpRequest();
	var data = JSON.stringify({
		"productname" : productname
	});
	xhttp.open("POST", "main/deleteproduct.php", true);
	xhttp.setRequestHeader("Content-Type", "application/json");
	xhttp.send(data);
	xhttp.onreadystatechange = function() {
		if (this.readyState == 4 && this.status == 200) {
			document.getElementById("MessageBox").style.display = "none";
			document.getElementById("GrayEffect").style.display = "none";
			document.getElementById("TrRow" + idtodelete).innerHTML = '<td colspan = "3">A termék törlésre került!</td>';
			document.getElementById("TrRow" + idtodelete).style.backgroundColor = "#fc6078";
		}
	}
}
function EditProduct(id) 
{
	var productname = document.getElementById("Row" + id).innerHTML;
	xhttp = new XMLHttpRequest();
	var data = JSON.stringify({
		"productname" : productname
	});
	xhttp.open("POST", "main/editproduct.php", true);
	xhttp.setRequestHeader("Content-Type", "application/json");
	xhttp.send(data);
	xhttp.onreadystatechange = function() {
		if (this.readyState == 4 && this.status == 200) {			
			LoadPageFromFile(2);
			StoredProduct = this.responseText;
		}
	}
}
function LoadStoredProduct() 
{
	document.getElementById("PageTitle").innerHTML = "Termék szerkesztése";
	document.getElementById("AddNewProductButton").innerHTML = "Termék frissítése";
	document.getElementById("EditProduct").innerHTML = StoredProduct;
	StoredProduct = "NotLoaded\n";
	document.getElementById("NewProductName").value = document.getElementsByClassName("ProductTitle")[0].innerHTML;
	document.getElementById("NewProductInfo").value = document.getElementById("ProductDescription").children[1].innerHTML.replace('&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;','');
	var ListOfElements = document.getElementsByTagName("li");
	for (var i = 0; i < ListOfElements.length - 1; i++)
	{
		var item = ListOfElements[i].innerText.split(":");
		document.getElementById("NPDN" + (i+1)).value = item[0].slice(0, -1);
		document.getElementById("NPDV" + (i+1)).value = item[1].substring(1);
		if (i < ListOfElements.length - 2)
			AddNewProductData(i+2);
	}
	for (var i = 0; i < 13; i++)
	{
		if (document.getElementById("Color").getElementsByClassName(colorlist[i]).length > 0) {
			if (document.getElementById("ColorTable").style.display != "none")
				document.getElementById("color" + (i+1)).checked = true;
			else
				document.getElementById("hcolor" + (i+1)).checked = true;
		}
	}
	document.getElementById("ImagePreview").src = document.getElementById("ProductPhoto").src;
	oldname = document.getElementById("NewProductName").value;
	oldhtml = "";
}
function LoadNewProductGroups() {
	xhttp = new XMLHttpRequest();
	xhttp.open("POST", "main/loadgroups.php", true);
	xhttp.setRequestHeader("Content-Type", "application/json");
	xhttp.send(null);
	xhttp.onreadystatechange = function() {
		if (this.readyState == 4 && this.status == 200) {	
			var raw = this.responseText;
			var groups = raw.split(";");
			var select = document.getElementById("NewProductGroup");
			for (var i = 0; i < groups.length - 1; i++)
			{
				var element = document.createElement("option");
				element.text = groups[i];
				select.add(element);
			}
		}
	}
}
var usedproductid = [1];
usedproductid[0] = 1;
function LoadProductGroups() {
	xhttp = new XMLHttpRequest();
	xhttp.open("POST", "main/loadgroups.php", true);
	xhttp.setRequestHeader("Content-Type", "application/json");
	xhttp.send(null);
	xhttp.onreadystatechange = function() {
		if (this.readyState == 4 && this.status == 200) {	
			var raw = this.responseText;
			var groups = raw.split(";");
			var select = document.getElementById("ProductGroup" + usedproductid[usedproductid.length - 1]);
			for (var i = 0; i < groups.length - 1; i++)
			{
				var element = document.createElement("option");
				element.text = groups[i];
				select.add(element);
			}
			LoadProductSelector(usedproductid[usedproductid.length - 1]);
		}
	}
}
function LoadProductSelector(id) {
	xhttp = new XMLHttpRequest();
	xhttp.open("POST", "main/orderselector.php", true);
	xhttp.setRequestHeader("Content-Type", "application/json");
	var selectedgroup = document.getElementById("ProductGroup" + id);
	var selectedgroupelement = selectedgroup.options[selectedgroup.selectedIndex].textContent;
	var data = JSON.stringify({
		"selectedgroup" : selectedgroupelement
	});
	xhttp.send(data);
	xhttp.onreadystatechange = function() {
		if (this.readyState == 4 && this.status == 200) {		
			var raw = this.responseText;
			var products = raw.split(";");
			var select = document.getElementById("ProductList" + usedproductid[usedproductid.length - 1]);
			select.innerHTML = "";
			for (var i = 0; i < products.length - 1; i++)
			{
				var element = document.createElement("option");
				element.text = products[i];
				select.add(element);
			}
			LoadProductColors(usedproductid[usedproductid.length - 1]);
		}
	}
}
function LoadProductColors(id) {
	var product = document.getElementById("ProductList" + id);
	var productname = product.options[product.selectedIndex].textContent;
	xhttp = new XMLHttpRequest();
	var data = JSON.stringify({
		"productname" : productname
	});
	xhttp.open("POST", "main/editproduct.php", true);
	xhttp.setRequestHeader("Content-Type", "application/json");
	xhttp.send(data);
	xhttp.onreadystatechange = function() {
		if (this.readyState == 4 && this.status == 200) {
			document.getElementById("LoadedProduct").innerHTML = this.responseText;
			var select = document.getElementById("ProductColor" + id);
			select.innerHTML = "";
			for (var i = 0; i < 13; i++)
			{
				if (document.getElementById("Color").getElementsByClassName(colorlist[i]).length > 0)
				{
					var element = document.createElement("option");
					element.text = colorlisthu[i];
					select.add(element);
				}
			}
		}
	}
}
function OrderProductsAdd() {
	usedproductid.push(usedproductid[usedproductid.length - 1] + 1);
	var id = (usedproductid[usedproductid.length - 1]);
	document.getElementById("OrderProductsAdd").innerHTML = "Eltávolítás";
	document.getElementById("OrderProductsAdd").classList.remove("OrderProductsAdd");
	document.getElementById("OrderProductsAdd").classList.add("OrderProductsRemove");
	document.getElementById("OrderProductsAdd").id = "OrderProductsRemove" + id;
	document.getElementById("OrderProductsRemove" + id).setAttribute("onclick", "OrderProductsRemove(" + id + ")");
	var newproduct = document.createElement("DIV");
	newproduct.innerHTML = '<span style = "padding-right: 15px; padding-top: 4px">Csoport:</span> <select id = "ProductGroup' + id +'" class = "ProductList" onchange = "LoadProductSelector(' + id + ')"></select> <span style = "padding-right: 15px; padding-left: 15px; padding-top: 4px">Név:</span> <select id = "ProductList' + id +'" class = "ProductList" onchange = "LoadProductColors('+ id +')"></select> <span style = "padding-left: 15px; padding-top: 4px">Mennyiség:</span> <input type = "number" min = "1" max = "10000" id = "ProductAmount' + id +'" class = "ProductAmount"></input> <span style = "padding-left: 15px; padding-top: 4px">Szín:</span> <select id = "ProductColor' + id +'" class = "ProductList" style = "margin-left: 15px;"></select> <span id = "OrderProductsAdd" class = "OrderProductsAdd" onclick = "OrderProductsAdd()">Hozzáad</span>';
	newproduct.classList.add("Product");
	newproduct.id = "Product" + id;
	document.getElementById("OrderedProducts").appendChild(newproduct);
	LoadProductGroups();
}
function OrderProductsRemove(id)
{
	document.getElementById("Product" + (id - 1)).remove();
	usedproductid.splice(usedproductid.indexOf(id - 1), 1);
}
function OrderProducts() {
	var CompanyName = document.getElementById("CompanyName").value;
	var CompanyPersonName = document.getElementById("CompanyPersonName").value;
	var CompanyPhone = document.getElementById("CompanyPhone").value;
	var CompanyMail = document.getElementById("CompanyMail").value;
	var CompanyAddress = document.getElementById("CompanyAddress").value;	
	if (CompanyPersonName == "") {
		document.getElementById("OrderError").innerText = "Nem adott meg megrendelő nevet!";
		return;
	}
	if (CompanyPhone == "") {
		document.getElementById("OrderError").innerText = "Nem adott meg telefonszámot!";
		return;
	}
	if (CompanyMail == "") {
		document.getElementById("OrderError").innerText = "Nem adott meg e-mail címet!";
		return;
	}
	if (CompanyAddress == "") {
		document.getElementById("OrderError").innerText = "Nem adott meg cég címet!";
		return;
	}
	for (var i = 0; i < usedproductid.length; i++)
	{
		if (document.getElementById("ProductAmount" + usedproductid[i]).value == "") {
			document.getElementById("OrderError").innerText = "Nem adott meg mennyiséget az egyik terméknél!";
			return;
		}
		if (Number.isInteger(document.getElementById("ProductAmount" + usedproductid[i]).value) == true) {
			document.getElementById("OrderError").innerText = "Az egyik terméknél a mennyiség nem megfelelő!";
			return;
		}
	}
	var orders = [usedproductid.length];
	var order = "";
	var companyinfo = CompanyName + ";" + CompanyPersonName + ";" + CompanyPhone + ";" + CompanyMail + ";" + CompanyAddress;
	for (var i = 0; i < usedproductid.length; i++)
	{
		var name = document.getElementById("ProductList" + usedproductid[i]);
		var color = document.getElementById("ProductColor" + usedproductid[i]);
		orders[i] = document.getElementById("ProductAmount" + usedproductid[i]).value + ";" + colorlisthu.indexOf(document.getElementById("ProductColor" + usedproductid[i]).options[color.selectedIndex].value) + ";" + document.getElementById("ProductList" + usedproductid[i]).options[name.selectedIndex].value + ";";
		order += orders[i];
	}
	xhttp = new XMLHttpRequest();
	var data = JSON.stringify({
		"order" : order,
		"companyinfo" : companyinfo
	});
	xhttp.open("POST", "main/placeorder.php", true);
	xhttp.setRequestHeader("Content-Type", "application/json");
	xhttp.send(data);
	xhttp.onreadystatechange = function() {
	if (this.readyState == 4 && this.status == 200) { 
		window.scrollTo(0,0);
		document.getElementById("MessageBox").innerHTML = "<p>A rendelés leadása sikeres volt!</p> <div id = 'Answers'> <p id = 'AnswerYes' onclick = 'RemoveMessageBox()'>Rendben</p>";
		LoadPageFromFile(4);
		document.getElementById("MessageBox").style.display = "block";
		document.getElementById("GrayEffect").style.display = "block";
		} 
	}
}
function LoadOrders(ONS, OS, OC) {
	xhttp = new XMLHttpRequest();
	var startdate = document.getElementById("DateSelectorStart").value;
	var enddate = document.getElementById("DateSelectorEnd").value;
	if (new Date(document.getElementById("DateSelectorStart").value).getTime() < new Date(document.getElementById("DateSelectorEnd").value).getTime())
	{
		startdate = enddate;
		document.getElementById("DateSelectorStart").value = document.getElementById("DateSelectorEnd").value;
	}
	document.getElementById("Year").innerText = new Date().getFullYear();
	var switches = ONS.toString() + OS.toString() + OC.toString();
	var data = JSON.stringify({
		"startdate" : startdate,
		"enddate" : enddate,
		"switches" : switches
	});
	xhttp.open("POST", "main/loadorders.php", true);
	xhttp.setRequestHeader("Content-Type", "application/json");
	xhttp.send(data);
	xhttp.onreadystatechange = function() {
	if (this.readyState == 4 && this.status == 200) {		
			document.getElementById("Orders").innerHTML = this.responseText;
		} 
	}
}
function ChangeSwitchState(index)
{
	OrderSwitches[index] = 1 - OrderSwitches[index];
	LoadOrders(OrderSwitches[2], OrderSwitches[1], OrderSwitches[0]);
}
function AcceptOrder(id, method)
{
	if (method == 1)
		document.getElementById("MessageBox").innerHTML = "<p>A rendelés elfogadásra került, állapota frissült!</p> <div id = 'Answers'> <p id = 'AnswerYes' onclick = 'RemoveMessageBox()'>Rendben</p>";
	else
		document.getElementById("MessageBox").innerHTML = "<p>Gratulálunk a sikeres teljesítéshez, a rendelés állapota frissült!</p> <div id = 'Answers'> <p id = 'AnswerYes' onclick = 'RemoveMessageBox()'>Rendben</p>";
	document.getElementById("MessageBox").style.display = "block";
	document.getElementById("GrayEffect").style.display = "block";
	xhttp = new XMLHttpRequest();
	var data = JSON.stringify({
		"id" : id,
		"method" : method
	});
	xhttp.open("POST", "main/acceptorder.php", true);
	xhttp.setRequestHeader("Content-Type", "application/json");
	xhttp.send(data);
	xhttp.onreadystatechange = function() {
	if (this.readyState == 4 && this.status == 200) {					
			LoadOrders(OrderSwitches[2], OrderSwitches[1], OrderSwitches[0]);
			window.scrollTo(0,0);
		} 
	}
}
function CancelOrder(id)
{
	document.getElementById("MessageBox").innerHTML = "<p>A rendelés törölve a rendszerből!</p> <div id = 'Answers'> <p id = 'AnswerYes' onclick = 'RemoveMessageBox()'>Rendben</p>";
	document.getElementById("MessageBox").style.display = "block";
	document.getElementById("GrayEffect").style.display = "block";
	xhttp = new XMLHttpRequest();
	var data = JSON.stringify({
		"id" : id
	});
	xhttp.open("POST", "main/deleteorder.php", true);
	xhttp.setRequestHeader("Content-Type", "application/json");
	xhttp.send(data);
	xhttp.onreadystatechange = function() {
	if (this.readyState == 4 && this.status == 200) {					
			LoadOrders(OrderSwitches[2], OrderSwitches[1], OrderSwitches[0]);
			window.scrollTo(0,0);
		} 
	}
}
function LoadDiagram(year) 
{
	document.getElementById("Diagram").innerHTML = "";
	xhttp = new XMLHttpRequest();
	xhttp.open("POST", "main/loaddiagramdata.php", true);
	xhttp.setRequestHeader("Content-Type", "application/json");
	var data = JSON.stringify({
		"year" : year
	});
	xhttp.send(data);
	xhttp.onreadystatechange = function() {
	if (this.readyState == 4 && this.status == 200) {	
			var diagraminfo = this.responseText.split(";");
			if (diagraminfo.length != 1) {
				var xinfo = ["Január", "Február", "Március", "Április", "Május", "Június", "Július", "Augusztus", "Szeptember", "Október", "November", "December"];
				var yinfo = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
				for (var i = 0; i < diagraminfo.length - 1; i = i + 2)
				{
					yinfo[diagraminfo[i]] = diagraminfo[i + 1];
				}
				var diagram = {
					x: xinfo,
					y: yinfo,
					type: 'bar'
				};
				var data = [diagram];
				Plotly.newPlot('Diagram', data);
			} else
			document.getElementById("Diagram").innerHTML = this.responseText;
		} 
	}
}
function ChangeYear(number) {
	var newyear = document.getElementById("Year").innerText;
	newyear = parseInt(newyear) + number;
	document.getElementById("Year").innerText = newyear;
	LoadDiagram(newyear);
}
function LoadUserTable() {
	xhttp = new XMLHttpRequest();
	xhttp.open("POST", "main/loadusertable.php", true);
	xhttp.setRequestHeader("Content-Type", "application/json");
	xhttp.send(null);
	xhttp.onreadystatechange = function() {
	if (this.readyState == 4 && this.status == 200) { 
			document.getElementById("UserDiv").innerHTML = this.responseText;
		}
	}
}
function DeleteAdminAsk(id) {
	document.getElementById("MessageBox").innerHTML = "<p>Biztos benne, hogy törölni szeretné ezt a felhasználót?</p> <p>A törlést nem lehet visszavonni!</p> <div id = 'Answers'> <p id = 'AnswerYes' onclick = 'DeleteAdmin("+id+")'>Igen</p> <p id = 'AnswerNo' onclick = 'RemoveMessageBox()'>Nem</p> </div>"
	document.getElementById("MessageBox").style.display = "block";
	document.getElementById("GrayEffect").style.display = "block";
}
function DeleteAdmin(id) {
	xhttp = new XMLHttpRequest();
	xhttp.open("POST", "main/deleteadmin.php", true);
	xhttp.setRequestHeader("Content-Type", "application/json");
	var data = JSON.stringify({
		"id" : id
	});
	xhttp.send(data);
	xhttp.onreadystatechange = function() {
	if (this.readyState == 4 && this.status == 200) { 
			document.getElementById("MessageBox").innerHTML = "<p>A felhasználó törlése sikeres volt!</p> <div id = 'Answers'> <p id = 'AnswerYes' onclick = 'RemoveMessageBox()'>Rendben</p>";
		}
	}
	LoadPageFromFile(6);
	window.scrollTo(0,0);
}
function AddNewAdmin() {
	var name = document.getElementById("NewAdminName").value;
	var pass = document.getElementById("NewAdminPassword").value;
	if (name != "" && pass != "")
	{
		xhttp = new XMLHttpRequest();
		xhttp.open("POST", "main/createadmin.php", true);
		xhttp.setRequestHeader("Content-Type", "application/json");
		var data = JSON.stringify({
			"name" : name,
			"pass" : pass
		});
		xhttp.send(data);
		xhttp.onreadystatechange = function() {
		if (this.readyState == 4 && this.status == 200) {
				document.getElementById("MessageBox").innerHTML = "<p>A felhasználó hozzáadása sikeres volt!</p> <div id = 'Answers'> <p id = 'AnswerYes' onclick = 'RemoveMessageBox()'>Rendben</p>";
				document.getElementById("MessageBox").style.display = "block";
				document.getElementById("GrayEffect").style.display = "block";
			}
		}
		LoadPageFromFile(6);
		window.scrollTo(0,0);
	}
}
function LoadGroupTable() {
	xhttp = new XMLHttpRequest();
	xhttp.open("POST", "main/loadgrouptable.php", true);
	xhttp.setRequestHeader("Content-Type", "application/json");
	xhttp.send(null);
	xhttp.onreadystatechange = function() {
	if (this.readyState == 4 && this.status == 200) { 
			document.getElementById("GroupDiv").innerHTML = this.responseText;
		}
	}
}
function DeleteGroupAsk(id) {
	document.getElementById("MessageBox").innerHTML = "<p>Biztos benne, hogy törölni szeretné ezt a csoportot? FIGYELEM! A csoporthoz tartozó összes termék is törlésre kerül, így kérjük győződjön meg róla, hogy a csoporthoz nem tartozik egyetlen termék sem!</p> <p>A törlést nem lehet visszavonni!</p> <div id = 'Answers'> <p id = 'AnswerYes' onclick = 'DeleteGroup("+id+")'>Igen</p> <p id = 'AnswerNo' onclick = 'RemoveMessageBox()'>Nem</p> </div>"
	document.getElementById("MessageBox").style.display = "block";
	document.getElementById("GrayEffect").style.display = "block";
}
function DeleteGroup(id) {
	xhttp = new XMLHttpRequest();
	xhttp.open("POST", "main/deletegroup.php", true);
	xhttp.setRequestHeader("Content-Type", "application/json");
	var data = JSON.stringify({
		"id" : id
	});
	xhttp.send(data);
	xhttp.onreadystatechange = function() {
	if (this.readyState == 4 && this.status == 200) { 
			document.getElementById("MessageBox").innerHTML = "<p>A csoport törlése sikeres volt!</p> <div id = 'Answers'> <p id = 'AnswerYes' onclick = 'RemoveMessageBox()'>Rendben</p>";
		}
	}
	LoadPageFromFile(7);
	window.scrollTo(0,0);
}
function AddNewGroup() {
	var name = document.getElementById("NewGroupName").value;
	if (name != "")
	{
		xhttp = new XMLHttpRequest();
		xhttp.open("POST", "main/creategroup.php", true);
		xhttp.setRequestHeader("Content-Type", "application/json");
		var data = JSON.stringify({
			"name" : name
		});
		xhttp.send(data);
		xhttp.onreadystatechange = function() {
		if (this.readyState == 4 && this.status == 200) {
				document.getElementById("MessageBox").innerHTML = "<p>A csoport létrehozása sikeres volt!</p> <div id = 'Answers'> <p id = 'AnswerYes' onclick = 'RemoveMessageBox()'>Rendben</p>";
				document.getElementById("MessageBox").style.display = "block";
				document.getElementById("GrayEffect").style.display = "block";
			}
		}
		LoadPageFromFile(7);
		window.scrollTo(0,0);
	}
}

function getBase64Image(img) {
  var canvas = document.createElement("canvas");
  canvas.width = img.width;
  canvas.height = img.height;
  var ctx = canvas.getContext("2d");
  ctx.drawImage(img, 0, 0);
  var dataURL = canvas.toDataURL("image/png");
  return dataURL.replace(/^data:image\/(png|jpg);base64,/, "");
}