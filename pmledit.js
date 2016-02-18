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

		{
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

var orig = CodeMirror.hint.javascript;
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
}

function initDoc() {
	editor = CodeMirror.fromTextArea(document.getElementById("inputText"),{
		lineNumbers: true,

		//Set pml syntax highlighting
		mode: "pml",

		//Match + Autoclose Brackets & Braces
		matchBrackets: true,
		autoCloseBrackets: true,

		//Sets up language independent code folding
		//Disable? - PML is mad for the use of braces - defeats purpose of folding in a way
		foldGutter: {
			rangeFinder: new CodeMirror.fold.combine(CodeMirror.fold.brace, CodeMirror.fold.comment)
		},
		gutters: ["CodeMirror-linenumbers", "CodeMirror-foldgutter", "CodeMirror-gutters"],

		extraKeys: {"Ctrl-Space": "autocomplete"}

	})
}
/**
 *	Function which is executed when "Compile" is pressed
 */
function buttonPress(){
	//Grab the content of the editor
	var text = editor.getValue();
	//type  = compilation
	var type = 1;
	//Create new HTTP Request
	var xhttp = new XMLHttpRequest();
	var response;
	var errorLine = 0;
	//This is executed when the client recieved a response from the server
	xhttp.onreadystatechange = function(){
	  if(xhttp.readyState == 4 && xhttp.status == 200){
	    //Place response in the output box
	    response = xhttp.responseText;
	    document.getElementById("outputText").value = response;
            //if an error message is returned, we then will send the line number to the linter
	    if(response.indexOf(error) > -1){
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


//code used for uploading a file
function readSingleFile(evt) {
	//Retrieve the first (and only!) File from the FileList object
	var f = evt.target.files[0]; 

	if (f) {
	  var r = new FileReader();
	  r.onload = function(e) { 
	      var contents = e.target.result;
	    alert( "Got the file.n" 
	          +"name: " + f.name + "n"
	          +"type: " + f.type + "n"
	          +"size: " + f.size + " bytesn"
	    );  
	  }
	  r.readAsText(f);
	} else { 
	  alert("Failed to load file");
	}
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

