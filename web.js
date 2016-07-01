var express = require('express');
var bodyParser = require('body-parser')

var app = express();
app.set('port', (process.env.PORT || 5000));


var jsonParser = bodyParser.json();

// POST /test gives hello world to console
app.post('/test', jsonParser, function (req, res) {
  console.log( "Hello World!" );
})


/*app.post("/", function(req, res) {
	console.log(req.body);
});
var port = process.env.PORT || 5000;
app.listen(port, function() {
	console.log("Listening on " + port);
});*/

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