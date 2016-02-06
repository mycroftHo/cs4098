var oDoc, sDefTxt;

function initDoc() {
	oDoc = document.getElementById("textBox");
	sDefTxt = oDoc.innerHTML;
	if (document.compForm.switchMode.checked) { setDocMode(true); }
}

function formatDoc(sCmd, sValue) {
	if (validateMode()) { document.execCommand(sCmd, false, sValue); oDoc.focus(); }
}

function validateMode() {
	if (!document.compForm.switchMode.checked) { return true ; }
	alert("Uncheck \"Show HTML\".");
	oDoc.focus();
	return false;
}

function setDocMode(bToSource) {
	var oContent;
	if (bToSource) {
	oContent = document.createTextNode(oDoc.innerHTML);
	oDoc.innerHTML = "";
	var oPre = document.createElement("pre");
	oDoc.contentEditable = false;
	oPre.id = "sourceText";
	oPre.contentEditable = true;
	oPre.appendChild(oContent);
	oDoc.appendChild(oPre);
	} else {
	if (document.all) {
	  oDoc.innerHTML = oDoc.innerText;
	} else {
	  oContent = document.createRange();
	  oContent.selectNodeContents(oDoc.firstChild);
	  oDoc.innerHTML = oContent.toString();
	}
	oDoc.contentEditable = true;
	}
	oDoc.focus();
}

/**
 *	Function which is executed when "Compile" is pressed
 */
function buttonPress(){
	//Grab the content of the text box
	var text = oDoc.innerText;
	//Create new HTTP Request
	var xhttp = new XMLHttpRequest();

	//This is executed when the client recieved a response from the server
	xhttp.onreadystatechange = function(){
	  if(xhttp.readyState == 4 && xhttp.status == 200){
	  	//Place response in the output box
	    document.getElementById("outputText").value = xhttp.responseText;
	  }
	};
	//New HTTP POST request
	xhttp.open("POST", "http://127.0.0.1:8080", true);
	//Set the content type so that the server knows the data is formatted w/ JSON
	xhttp.setRequestHeader("Content-Type", "application/json; charset=UTF-8");

	//Format the text in the form {code : "<code>"} and send	
	xhttp.send(JSON.stringify({code:text}));
}

function printDoc() {
	if (!validateMode()) { return; }
	var oPrntWin = window.open("","_blank","width=450,height=470,left=400,top=100,menubar=yes,toolbar=no,location=no,scrollbars=yes");
	oPrntWin.document.open();
	oPrntWin.document.write("<!doctype html><html><head><title>Print<\/title><\/head><body onload=\"print();\">" + oDoc.innerHTML + "<\/body><\/html>");
	oPrntWin.document.close();
}
