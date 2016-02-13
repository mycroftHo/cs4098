var oDoc, sDefTxt;

/*
 * Simple Mode for PML Syntax Highlighting
 */
CodeMirror.defineSimpleMode("pml", {
	start: [
		//The regex matches the token; token property contains the type
		//Here - anything contained within "", '' or `` are strings
		{
			regex: /"(?:[^\\]|\\.)*?"/,
			token: "string"
		}, {
			regex: /'(?:[^\\]|\\.)*?'/,
			token: "string"
		}, {
			regex: /`(?:[^\\]|\\.)*?`/,
			token: "string"
		},

		{
			regex: /(\s+)([a-z\$][\w\$]*)/,
			token: [null, "variable-2"]
		},

		{	//Defining the keywords
			regex: /(process|sequence|action|branch|iteration|requires|provides|agent|script)/,
			token: "keyword"
		}, {
			//Pretty sure we don't need some of these
			regex: /0x[a-f\d]+|[-+]?(?:\.\d+|\d+\.?\d*)(?:e[-+]?\d+)?/i,
			token: "number"
		}, {
			regex: /([\/#]{2}).*/,
      		token: "comment"
    	}, {
      		regex: /\/(?:[^\\]|\\\.)*?\//,
      		token: "variable-3"
    	},

    	{
	      	regex: /[\/#]\*/,
      		token: "comment",
      		next: "comment"
		}, { 
			regex: /[-\+\/\*\=\<\>\!\:\~\?]+/,
			token: "operator"
		},
		//indent and dedent properties guide autoindentation
		{
			regex: /[\{\[\(\:]/,
			indent: true
		}, {
			regex: /[\}\]\);]/,
			indent: true
		}
	],

	comment: [{
		regex: /.*?(\*\/|##)/,
		token: "comment",
		next: "start"
	}, {
		regex: /.*./,
		token: "comment"
	}],

	meta: {
		dontIndentStates:["comment"],
		lineComment: ["//", '##']
	}
});

function initDoc() {
	oDoc = CodeMirror(function(elt){
		inputText.parentNode.replaceChild(elt, inputText)
	}, { lineNumbers: true,
		//value: "function aFunction() { return 100; }",
		mode: "pml" 
	});
}

/**
 *	Function which is executed when "Compile" is pressed
 */
function buttonPress(){
	//Grab the content of the editor
	var text = oDoc.getValue();
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

/*function printDoc() {
	if (!validateMode()) { return; }
	var oPrntWin = window.open("","_blank","width=450,height=470,left=400,top=100,menubar=yes,toolbar=no,location=no,scrollbars=yes");
	oPrntWin.document.open();
	oPrntWin.document.write("<!doctype html><html><head><title>Print<\/title><\/head><body onload=\"print();\">" + oDoc.innerHTML + "<\/body><\/html>");
	oPrntWin.document.close();
}*/
