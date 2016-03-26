var editor

/*
 * Simple Mode for PML Syntax Highlighting
 * Courtesy of http://codepen.io/Ephellon/pen/zvvGaz
 * and https://codemirror.net/demo/simplemode.html
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

		{	//Defining the keywords
			regex: /(\s*)(process|sequence|action|branch|iteration|requires|provides|agent|script)[\s{]/,
			token: [null, "keyword"]
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

/*var orig = CodeMirror.hint.javascript;
CodeMirror.hint.javascript = function(cm){
	var inner = orig(cm) || {from: cm.getCursor(), to: cm.getCursor(), list:[]};
	inner.list.push("process");
	inner.list.push("sequence");
	inner.list.push("action");
	inner.list.push("branch");
	inner.list.push("iteration");
	inner.list.push("requires");
	inner.list.push("provides");
	inner.list.push("agent");
	inner.list.push("script");

	return inner;
}*/

function init() {
	editor = CodeMirror.fromTextArea(document.getElementById("inputText"),{
		lineNumbers: true,

		//Set pml syntax highlighting
		mode: "pml",
		keyMap: "default",
		//The auto-indent feature screws the tabs due to a unnecessary whitespace char appearing
		//Until I figure out what's causing it - turning it off fixes it for the time being.
		smartIndent: false,

		//Match + Autoclose Brackets & Braces
		matchBrackets: true,
		autoCloseBrackets: true,

		//Sets up language independent code folding
		//Disable? - PML is mad for the use of braces - defeats purpose of folding in a way
		foldGutter: {
			rangeFinder: new CodeMirror.fold.combine(CodeMirror.fold.brace, CodeMirror.fold.comment)
		},
		gutters: ["CodeMirror-linenumbers", "CodeMirror-foldgutter", "CodeMirror-lint-markers"],

		extraKeys: {"Ctrl-Space": "autocomplete"}

	})

	//jointInit();

}
/**
 *	Function which is executed when "Compile" is pressed
 */
var widgets = []
function buttonPress(){
	for(var i = 0; i < widgets.length; i++){
	    editor.removeLineWidget(widgets[i]);
	}
	//Grab the content of the editor
	var text = editor.getValue();
	//type  = compilation
	var type = 1;
	//Create new HTTP Request
	var xhttp = new XMLHttpRequest();
	var response;
	var errorLine = 0;
	var errorMessage;
	//This is executed when the client recieved a response from the server
	xhttp.onreadystatechange = function(){
	  if(xhttp.readyState == 4 && xhttp.status == 200){
	    //Place response in the output box
	    response = xhttp.responseText;
	    document.getElementById("outputText").value = response;
        //if an error message is returned, we then will send the line number to the linter
	    if(response.indexOf("error") > -1){
	    	//split the error message on colons
	    	//the error line is between the first colon and the second one
	    	//remove the existing error lines

	    	var splitArray = response.split(":");
	    	errorLine = parseInt(splitArray[1]);
	    	errorMessage = splitArray[2];

	    	//setting up the error div object
      		var msg = document.createElement("div");
      		var icon = msg.appendChild(document.createElement("span"));
      		icon.innerHTML = "!!";
      		icon.className = "lint-error-icon";
      		msg.appendChild(document.createTextNode(errorMessage));
      		msg.className = "lint-error";

      		//minus 2 because 0 indexed lines and want to create error above line
	    	widgets.push(editor.addLineWidget(errorLine - 1, msg, {above: true, coverGutter: false, noHScroll: true}));
	    }
	  }
	};
	//New HTTP POST request
	xhttp.open("POST", "http://127.0.0.1:6500", true);
	//Set the content type so that the server knows the data is formatted w/ JSON
	xhttp.setRequestHeader("Content-Type", "application/json; charset=UTF-8");

	//Format the text in the form {code : "<code>"} and send
	xhttp.send(JSON.stringify({index:type,code:text}));
}

function swimlane(){
	buttonPress();
	var type = 4;
	var xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = function(){
		if(xhttp.readyState == 4 && xhttp.status == 200){
			window.open("http://localhost:1337/swimlaneCanvas.html");
		}
	}
	xhttp.open("POST", "http://127.0.0.1:6500", true);
	xhttp.setRequestHeader("Content-Type", "application/json; charset=UTF-8");
	xhttp.send(JSON.stringify({index:type}));
}

function social(){
	buttonPress();
	var type = 4;
	var xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = function(){
		if(xhttp.readyState == 4 && xhttp.status == 200){
			window.open("http://localhost:1337/SocialNetwork.html");
		}
	}
	xhttp.open("POST", "http://127.0.0.1:6500", true);
	xhttp.setRequestHeader("Content-Type", "application/json; charset=UTF-8");
	xhttp.send(JSON.stringify({index:type}));
}

function saveButton(){
	//Grab the content of the editor
	var text = editor.getValue();
	//type  = save File
	var type = 2;

	var name = window.prompt("Enter Filename:", "e.g test.pml");

	if(name.valueOf() != new String('').valueOf() && name.valueOf() != new String("e.g test.pml").valueOf() ){
		//Create new HTTP Request
		var xhttp = new XMLHttpRequest();

		xhttp.onreadystatechange = function(){
		  if(xhttp.readyState == 4 && xhttp.status == 200){
		  	//Place response in the output box
		    document.getElementById("outputText").value = xhttp.responseText;
		  }
		};

		//New HTTP POST request
		xhttp.open("POST", "http://127.0.0.1:6500", true);
		//Set the content type so that the server knows the data is formatted w/ JSON
		xhttp.setRequestHeader("Content-Type", "application/json; charset=UTF-8");

		//Format the text in the form {code : "<code>"} and send
		xhttp.send(JSON.stringify({index:type,code:text,filename:name}));
	}
	else{
		document.getElementById("outputText").value = "ERROR: No Filename Entered!";
	}
}
function changeKeyMap(element){
	var x = element.value;
	editor.setOption("keyMap", x);
}

function loadFileAsText(){
	var fileToLoad = document.getElementById("fileToLoad").files[0];
	var fileReader = new FileReader();
	fileReader.onload = function(fileLoadedEvent){
		var textFromFileLoaded = fileLoadedEvent.target.result;
		document.getElementById("inputText").value = textFromFileLoaded;
		editor.setValue(fileLoadedEvent.target.result);
	};
	fileReader.readAsText(fileToLoad,"UTF-8");
}

function DownloadLocally()
{
	var textToWrite = editor.getValue();
	var textFileAsBlob = new Blob([textToWrite], {type:'text/plain'});
	var fileName = document.getElementById("FileName").value;

	var downloadLink = document.createElement("a");
	downloadLink.download = fileName;
	downloadLink.innerHTML = "Download File";

	downloadLink.href = window.URL.createObjectURL(textFileAsBlob);
	downloadLink.style.display = "none";
	document.body.appendChild(downloadLink);

	downloadLink.click();
}
