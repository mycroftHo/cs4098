console.log('Testing file choosing, upload and compiling');
var page     = require('webpage').create();
var filename = '../test.pml';
var system = require('system');

page.onConsoleMessage = function(msg) {
    system.stderr.writeLine('console: ' + msg);
};
page.onFilePicker = function(oldFile) {
console.log('Choosing File');
  console.log(filename + ' loaded');
  return filename;
};

console.log('Loading Webpage');
page.open('http://127.0.0.1:1337/pmledit.html', function(status) {
  console.log(status);
  page.uploadFile('input[id=fileToLoad]', '../test.pml');
console.log('Reading text from file');
    page.evaluateJavaScript(function(status) {
      //$("button").click();

console.log('Reading:');

	loadFileAsText();
console.log(status);
    });


page.includeJs("http://ajax.googleapis.com/ajax/libs/jquery/1.6.1/jquery.min.js", function() {
var load = page.evaluate(function() {
    return $("#loadx").text;
});
//console.log(load);
});
page.render('testupload.png');

page.evaluate(function(){
    var a = document.getElementById("loadx");
    var e = document.createEvent('MouseEvents');
    e.initMouseEvent('click', true, true, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
    a.dispatchEvent(e);
    waitforload = true;
//console.log(a);
});
console.log('Loading page for screenshot');
wait();
//page.render('testupload2.png');


page.evaluate(function(){
    var a = document.getElementById("compileButton");
    var e = document.createEvent('MouseEvents');
    e.initMouseEvent('click', true, true, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
    a.dispatchEvent(e);
    waitforload = true;
});
console.log('Compiling');
waitcompile();
//page.render('testupload3.png');
});

function wait() {
    setTimeout(function() {
            page.render('screenshot.png');
	console.log('Success, Screenshot saved in root');
           
    }, 2000);
}
function waitcompile() {
    setTimeout(function() {
            page.render('screenshotcompile.png');
	console.log('Success, Screenshot saved in root');
            phantom.exit();
    }, 3000);
}

