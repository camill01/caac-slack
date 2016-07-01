var express = require('express');
var bodyParser = require('body-parser');
var https = require('https');

var app = express();
//app.set('port', (process.env.PORT || 5000));

var jsonParser = bodyParser.json();

console.log( "Initialized" );

// POST /test gives hello world to console
app.post('/test', jsonParser, function (req, res) {
/*	var slackJSON = {
		text: "This is a line of text in a channel.\nAnd this is another line of text."
	};
	
	console.log( JSON.stringify( slackJSON ) );
	
	var options = {
   		hostname: "hooks.slack.com",
   		path: "/services/T1N5XSJVA/B1N4TJEJF/DfvcOqV4Xbedxi6BXsWJYflU",
   		method: "POST"//,
   	//	headers: {
   //     	"Content-Type": "application/json"
	//    },
	    body: JSON.stringify( slackJSON )
 	};
 		
	var remote_request = https.request(options, function(remote_response) {
		console.log( remote_response);
		remote_response.setEncoding("utf-8");
		var responseString = "";
		remote_response.on("data", function(data) {
	  		responseString += data;
	  		console.log(responseString);
	 	});
	 	remote_response.on("end", function() {
	  		var resultObject = JSON.parse(responseString);
			console.log(resultObject);
			res.send(resultObject);
		});
	 });
	remote_request.end();
	
	remote_request.on('error', (e) => {
  		console.error(e);
	});*/
	
	var options = {
	    hostname : 'hooks.slack.com' ,
	    path     : '/services/T1N5XSJVA/B1N4TJEJF/DfvcOqV4Xbedxi6BXsWJYflU' ,
	    method   : 'POST'
	};

	var payload1 = {
    //	"channel"    : "test" ,
    //	"username"   : "masterbot" ,
    	"text"       : "Hello from Nodejs!"// ,
    //	"icon_emoji" : ":ghost:"
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
	
});

var port = process.env.PORT || 5000;
app.listen(port, function() {
	console.log( "Listening on " + port);
});

/*
var express = require(“express”);
var app = express();
app.use(express.bodyParser());
app.post(‘/’, function(req, res) {
console.log(req.body);
var payload = JSON.parse(req.body.data);
var entity_id = payload.ticket.id;
var subject = payload.ticket.subject;
var entity_display_name = “Ticket ” + payload.ticket.ticket_number;
var monitoring_tool = “UserVoice”;
var victorOpsJSON = { message_type:”CRITICAL”,
entity_id:entity_id,
state_message:subject,
monitoring_tool: monitoring_tool,
entity_display_name: entity_display_name
};
var victorOpsString = JSON.stringify(victorOpsJSON);

var headers = {
   ‘Content-Type’: ‘application/json’,
   ‘Content-Length’: victorOpsString.length
 };
 var options = {
   host: ‘alert.victorops.com’,
   port: 443,
   path: ‘/integrations/generic/20131114/alert/33aba56f-fc78-4c65-9c6d-57a49cbb6ed8/uservoicetest’,
   method: ‘POST’,
   headers: headers
 };
 var remote_request = https.request(options, function(remote_response) {
 remote_response.setEncoding(‘utf-8′);
 var responseString = ”;
 remote_response.on(‘data’, function(data) {
   responseString += data;
 });
 remote_response.on(‘end’, function() {
   var resultObject = JSON.parse(responseString);
   console.log(resultObject);
   res.send(resultObject);
 });
});
var port = process.env.PORT || 5000;
app.listen(port, function() {
console.log(“Listening on ” + port);
});
*/