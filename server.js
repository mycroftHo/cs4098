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

var routes = require('./passport-examples/routes');
var path = require('path');
var passport = require('passport');
var config = require('./passport-examples/oauth.js');
var FacebookStrategy = require('passport-facebook').Strategy;
var GoogleStrategy = require('passport-google-oauth2').Strategy;

var email = "";

var jsonfile = require('jsonfile');

var app = express();

//Configure the JSON Parser
server.use(bodyParser.json());

//Serve files in the local directory (so, locahost:6500/pmledit.html)
server.use('/', express.static(__dirname));
app.use('/', express.static(__dirname));

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
		//here pass the error messages to a function to parse errors
		//the function should return a line number as an int where the error occurs
		//then work on highlighting that line

		console.log(output);

		//Once the child finishes, send the data from either stdout or stderr streams back to frontend
		child.on('close', function(){
			res.send(output);
		});
	}
	else if(index == 2){
		var dir = __dirname + '/accounts/' + email;

		//create new account directory if doesn't already exist
		if (!fs.existsSync(dir)) {
			fs.mkdirSync('accounts/' + email);
		}
		filename = req.body.filename;
		fs.writeFile('accounts/' + email + '/' + filename, data);
		res.send("File Saved as " + filename );
	}

	else if(index == 3){
		jsonOut = req.body.graph
		jsonfile.writeFile('graph.json', jsonOut, function(err){
			console.error(err);
		})
	}

    else if(index == 4){
        child = exec("java -cp ~/bin SwimlaneDrawer flowData.csv")
        child.on('close', function(){
            res.send("swimLaneMade");
        });
    }
    else if(index == 7){
        child = exec("java -cp ~/bin SocialDrawer swimData.csv")
        child.on('close', function(){
            res.send("socialNetworkMade");
        });
    }
	else if(index == 5){
		var dir = __dirname + '/accounts/' + email;
		//create new account directory if doesn't already exist
		if (!fs.existsSync(dir)) {
			fs.mkdirSync('accounts/' + email);
			fs.writeFile(dir+"/exampleTest.pml", "process p{\n\taction a{\n\t\tagent{ b && c }\n\t}\n}", function(err){
				  if(err) throw err;
				  console.log("PML File Written");
				});
		}
		//Place test example file in account



		fileList = [];

	    var files = fs.readdirSync(dir);
	    fileList.push(email)

	    for(var i in files){
	        if (!files.hasOwnProperty(i)) continue;
	        var name = dir+'/'+files[i];
	        if (!fs.statSync(name).isDirectory()){
	            fileList.push(files[i]);
	        }
    	}
		res.send(fileList);
	}
	else if(index == 6){
		var fname = req.body.path;
		var dir = __dirname + '/accounts/' + email + '/' + fname;
		var data = fs.readFileSync(dir).toString();
		res.send(data);
	}
});



// global config
// serialize and deserialize
passport.serializeUser(function(user, done) {
	done(null, user);
});
passport.deserializeUser(function(obj, done) {
  	done(null, obj);
});

// config
passport.use(new FacebookStrategy({
  	clientID: config.facebook.clientID,
  	clientSecret: config.facebook.clientSecret,
  	callbackURL: config.facebook.callbackURL
	},
  	function(accessToken, refreshToken, profile, done) {
    	process.nextTick(function () {
    	email = profile.id
      	return done(null, profile);
    });
  }
));

passport.use(new GoogleStrategy({
  clientID: config.google.clientID,
  clientSecret: config.google.clientSecret,
  callbackURL: config.google.callbackURL,
  passReqToCallback: true
  },
  function(request, accessToken, refreshToken, profile, done) {
    process.nextTick(function () {
    	email = profile.email;
    	console.log("HARRO " + email);
      return done(null, profile);
    });
  }
));


app.configure(function() {
  	app.set('views', __dirname );
  	//app.engine('html', require('ejs').renderFile);
  	app.set('view engine', 'jade');
  	app.use(express.logger());
  	app.use(express.cookieParser());
  	app.use(express.bodyParser());
  	app.use(express.methodOverride());
  	app.use(express.session({ secret: 'my_precious' }));
  	app.use(passport.initialize());
  	app.use(passport.session());
  	app.use(app.router);
  	app.use(express.static(__dirname + '/passport-examples/public'));
});

// routes
app.get('/', routes.index);
app.get('/ping', routes.ping);
app.get('/account', ensureAuthenticated, function(req, res){
  	res.render('account', { user: req.user });
});

app.get('/', function(req, res){
  	res.render('login', { user: req.user });
});

app.get('/auth/facebook',
  	passport.authenticate('facebook'),
  	function(req, res){});
app.get('/auth/facebook/callback',
  	passport.authenticate('facebook', { failureRedirect: '/' }),
  	function(req, res) {
    	res.redirect('/account');
  });

app.get('/auth/google',
  passport.authenticate('google', { scope: [
    'https://www.googleapis.com/auth/plus.login',
    'https://www.googleapis.com/auth/plus.profile.emails.read'
  ] }
));
app.get('/auth/google/callback',
  passport.authenticate('google', { failureRedirect: '/' }),
  function(req, res) {
    res.redirect('/account');
  });

app.get('/logout', function(req, res){
  	req.logout();
  	res.redirect('/');
});


server.listen(6500);
app.listen(1337);

// test passport-examples
function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) { return next(); }
  res.redirect('/');
}

console.log('Server running on port 1337.');
module.exports = app;
