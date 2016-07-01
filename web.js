var express = require('express');
var bodyParser = require('body-parser');
var https = require('https');

var app = express();
//app.set('port', (process.env.PORT || 5000));

var jsonParser = bodyParser.json();

console.log( "Initialized" );

// Process an incoming CAAC WebHook
app.post('/caacnotify', jsonParser, function (req, res) {
	console.log("CAAC WebHook Incoming!");
	res.end();
});

// POST /test gives hello world to console
app.post('/test', jsonParser, function (req, res) {	
	var options = {
	    hostname : 'hooks.slack.com' ,
	    path     : '/services/T1N5XSJVA/B1N4TJEJF/DfvcOqV4Xbedxi6BXsWJYflU' ,
	    method   : 'POST'
	};

	var payload1 = {
    //	"channel"    : "test" ,
    //	"username"   : "masterbot" ,
    	"text"       : "Boo!",
    	"icon_emoji" : ":ghost:"
	};

	var req = https.request( options , function (res , b , c) {
    	res.setEncoding( 'utf8' );
    	res.on( 'data' , function (chunk) {
    	} );
	} );

	req.on( 'error' , function (e) {
   		console.log( 'problem with request: ' + e.message );
	} );

	req.write( JSON.stringify( payload1 ) );
	req.end();
	res.end();
});

var port = process.env.PORT || 5000;
app.listen(port, function() {
	console.log( "Listening on " + port);
});