/**
 *  Simple node.js server to handle/compile PML code and relay the output back
 *	to the front-end 
 */

/**
 *  Setting up dependencies
 *	
 *	express 		- http server middleware for node.js
 *	body-parse 		- allows for parsing of contents handled by express server
 *	fs 				- internal node module for handling file system stuff
 *	child_process 	- internal module that facilitaies the spawning of external processes
 *					  and handling of their output(s)
 */

var express = require('express');
var bodyParser = require('body-parser');
var fs = require('fs');
var server = express();	//Initialize Server

var exec = require('child_process').exec;
var child //process

//Configure the JSON Parser
server.use(bodyParser.json());

//Serve files in the local directory (so, locahost:6500/pmledit.html)
server.use('/', express.static(__dirname));

/*
 *	Set the headers
 *	This is important as we can't communicate through localhost w/o 
 *	taking Cross-Origin Resource Sharing (CORS) into account
 */
server.all('/', function(req, res, next){
	//Response will be just plain text rather than JSON
	res.header('Content-Type', 'text/plain');
	//Handle CORS issues
	res.header('Access-Control-Allow-Origin', '*');
	res.header('Access-Control-Allow-Headers', 'Content-Type');
	next();
});

//On POST requests....
server.post('/', function(req, res, next){
	var data = '';
	var output = '';
	var index = '';
	var filename = '';

	//Print POST request to the console
	console.log(req.method);
	console.log(req.headers);
	console.log(req.url);

	//body = {data : code}
	//code = the code we have to execute

	data = req.body.code;

	index = req.body.index;
	if(index == 1){
		
		//Write the code to a pml file
		fs.writeFile("test.pml", data, function(err){
				  if(err) throw err;
				  console.log("PML File Written");
				});

		//Spawn a "child process" - execute pmlcheck with the newly-created pml file
		child = exec("./pml/check/pmlcheck test.pml")

		//Handle the stdout & stderr data streams from the checking tool
		child.stdout.on('data', function(data){
				//console.log('stdout: ' + data);
				output += data;
				console.log(output)
			});
		child.stderr.on('data', function(data){
				console.log('stderr: ' + data);
				output += data;
			});

		console.log(output);

		//Once the child finishes, send the data from either stdout or stderr streams back to frontend
		child.on('close', function(){
			res.send(output);
		});
	}
	else if(index == 2){
		filename = req.body.filename;
		fs.writeFile(filename, data, function(err){
			if(err) throw err;
			console.log("PML File Saved")
		})
		res.send("File Saved as " + filename );
	}
});

server.listen(6500);

console.log('Server running on port 6500.');
