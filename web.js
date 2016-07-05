var express = require('express');
var bodyParser = require('body-parser');
var https = require('https');

var app = express();
//app.set('port', (process.env.PORT || 5000));

var jsonParser = bodyParser.json();

console.log( "Initialized" );

// Process an incoming CAAC WebHook
app.post('/caacnotify', jsonParser, function (req, res) {
	console.log(req.body);
	
	var action = req.body.message.action;
	console.log(action);
	/*var field = req.body.message.changes.display_name;
	console.log(field);
	var newValue = req.body.message.changes.value;
	console.log(newValue);*/
	var detailLink = req.body.message.detail_link;
	console.log(detailLink);
	
	for ( var prop in req.body.message.changes ) {
		console.log(req.body.message.changes[prop]);
	}
	
	var options = {
	    hostname : 'hooks.slack.com' ,
	    path     : '/services/T1N5XSJVA/B1N4TJEJF/DfvcOqV4Xbedxi6BXsWJYflU',
	    method   : 'POST'
	};

	var payload1 = {
    //	"channel"    : "test" ,
    //	"username"   : "masterbot" ,
    	"text"       : action + " work item! <" + detailLink + "|Click here for details>",
    	"icon_emoji" : ":bowtie:"
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

/* Endpoint for Slack in the OAuth flow */
app.get('/slackauth', jsonParser, function (req, res) {
	console.log('Slack Auth starting...');
	
	var temporaryCode = req.query.code;
	console.log('Received temporary code');
	
	var options = {
	    hostname : 'slack.com' ,
	    path  : '/api/oauth.access',
	    method  : 'GET',
	    headers : {
	    	'Content-type' : 'application/json; charset=utf-8'
	    }
	};

	var payload = {
    	"client_id" : process.env.SLACK_CLIENT_ID,
    	"client_secret" : process.env.SLACK_CLIENT_SECRET,
    	"code" : temporaryCode,
    	"redirect_uri" : "https://lower-donair-82094.herokuapp.com/slackauth"
	};
	
	console.log(payload);
	
	var req = https.request( options , resOAuth => {
		console.log("Response from Slack");
		console.log('statusCode: ', res.statusCode);
		
    	resOAuth.setEncoding( 'utf8' );
    	resOAuth.on('data', (d) => {
    		console.log( d );
  		});
	} );
	
	req.on( 'error' , function (e) {
   		console.log( 'problem with request: ' + e.message );
	} );

	req.write( JSON.stringify( payload ) );
	req.end();
	
	console.log('Slack Auth done...');
	res.end();
});

var port = process.env.PORT || 5000;
app.listen(port, function() {
	console.log( "Listening on " + port);
});