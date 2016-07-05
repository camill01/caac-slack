var express = require('express');
var bodyParser = require('body-parser');
var https = require('https');
var pg = require('pg');
pg.defaults.ssl = true;

var app = express();
//app.set('port', (process.env.PORT || 5000));

var jsonParser = bodyParser.json();

console.log( "Initialized" );

/* Test to process an incoming CAAC WebHook */
app.post('/caacnotify', jsonParser, function (req, res) {
	console.log( 'CAAC Callback starting...');
	//console.log(req.body);
	
	var action = req.body.message.action;
	var name = req.body.message.state["500a0d67-9c48-4145-920c-821033e4a832"].value;
	var displayColor = req.body.message.state["b0778de0-a927-11e2-9e96-0800200c9a66"].value;
	var formattedId = req.body.message.state["55c5512a-1518-4944-8597-3eb91875e8d1"].value;
	var detailLink = req.body.message.detail_link;
	var username = req.body.message.transaction.username;
	var userUuid = req.body.message.transaction.uuid;
	
	var changes = [];
	for ( var prop in req.body.message.changes ) {
		var newChange = {};
		newChange.title = req.body.message.changes[prop].display_name;
		newChange.value = req.body.message.changes[prop].old_value + ' -> ' + req.body.message.changes[prop].value;
		newChange.short = false;
		changes.push(newChange);
	};
	
	// Look up the relevant Slack webhook
	var webhookUrl = '';
	pg.connect( process.env.DATABASE_URL, function( err, client ) {
  		if ( err ) {
  			console.log("Error with DB: " + err );
  			return;
  		}
  		console.log('Connected to DB');
  		console.log('Retrieving WebHook URL');
  		dbQuery = "SELECT slack_incoming_webhook FROM slack_incoming_webhooks WHERE slack_channel_id = 'C1N5XSP36';"; 
  		client.query( dbQuery ).on('row', function (row) {
  			var rowData = JSON.stringify(row);
  			console.log(rowData);
  			webhookUrl = row.slack_incoming_webhook;
  			
			console.log(webhookUrl);
			var options = {
				hostname : 'hooks.slack.com' ,
				path : webhookUrl.replace('https://hooks.slack.com', ''),
				method : 'POST'
			};

			var payload = {
				"attachments" : {
					"fallback" : action + " <" + detailLink + "|" + formattedId + "> " + name,
					"color" : displayColor,
					"author_name" : username,
					"title" : formattedId + ": " + name,
					"title_link" : detailLink,
					"fields" : changes
				}
			};
			
			for ( var prop in req.body.message.changes ) {
				var newChange = {};
				newChange.title = req.body.message.changes[prop].display_name;
				newChange.value = req.body.message.changes[prop].old_value + ' -> ' + req.body.message.changes[prop].value;
				newChange.short = false;
				payload.attachments.fields.push(newChange);
			}

			var req = https.request( options , function (res , b , c) {
				res.setEncoding( 'utf8' );
				res.on( 'data' , function (chunk) {
				} );
			} );

			req.on( 'error' , function (e) {
				console.log( 'problem with request: ' + e.message );
			} );

			req.write( JSON.stringify( payload ) );
			req.end();
			res.end();
		} );
  	} );
});

/* Endpoint for Slack in the OAuth flow */
app.get('/slackauth', jsonParser, function (req, res) {
	console.log('Slack Auth starting...');
	
	var temporaryCode = req.query.code;
	console.log('Received temporary code');
	
	var options = {
	    hostname : 'slack.com' ,
	    path  : '/api/oauth.access?client_id=' +
	    		process.env.SLACK_CLIENT_ID +
	    		'&client_secret=' + 
	    		process.env.SLACK_CLIENT_SECRET +
	    		'&code=' +
	    		temporaryCode +
	    		'&redirect_uri=' +
	    		encodeURIComponent( "https://lower-donair-82094.herokuapp.com/slackauth" ),
	    method  : 'GET',
	    headers : {
	    	'Content-type' : 'application/x-www-form-urlencoded; charset=utf-8'
	    }
	};
	
	var req = https.request( options , resOAuth => {
		console.log("Response from Slack on OAuth");
		
		var teamId = '';
		var teamName = '';
		var channelId = '';
		var channelName = '';
		var webhookUrl = '';
		
    	resOAuth.setEncoding( 'utf8' );
    	resOAuth.on('data', (d) => {
    		var data = JSON.parse(d);
    		if ( data.ok == false ) {
    			console.log("Error with Slack Response: " + d);
    			return;
    		}
    		teamId = data.team_id;
    		teamName = data.team_name;
    		channelId = data.incoming_webhook.channel_id;
    		channelName = data.incoming_webhook.channel;
    		webhookUrl = data.incoming_webhook.url;

	  		// Save info to Database
  			pg.connect( process.env.DATABASE_URL, function( err, client ) {
  				if ( err ) {
  					console.log("Error with DB: " + err );
  					return;
  				}
  				console.log('Connected to DB');
  				
  				console.log('Adding Slack Team to DB');
  				var dbQuery = "INSERT INTO slack_teams ( slack_team_id, slack_team_name) VALUES ('" + teamId + "','" + teamName + "');";
  				client.query( dbQuery );
  				
  				console.log('Adding Slack Webhook to DB');
  				dbQuery = "INSERT INTO slack_incoming_webhooks ( slack_channel_id, slack_channel_name, slack_team_id, slack_incoming_webhook ) VALUES ('" + channelId + "','" + channelName + "','" + teamId + "','" + webhookUrl + "');"; 
  				client.query( dbQuery );
  			} );
  			console.log( 'Slack Credentials added to DB');
  		} );
  	} );
	
	req.on( 'error' , function (e) {
   		console.log( 'problem with request: ' + e.message );
	} );

	req.end();
	
	console.log('Slack Auth done...');
	res.end();
});

var port = process.env.PORT || 5000;
app.listen(port, function() {
	console.log( "Listening on " + port);
});