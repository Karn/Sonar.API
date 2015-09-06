var http = require('http');
var express = require('express');
var validator = require('express-validator');

var port = process.env.port || 8080;
var app = express();

// get the mongoose configuration/connection
require('./data/db.js');

//app.use(express.bodyParser());
app.use(express.urlencoded());
app.use(express.json());
app.use(validator()); // this line must be immediately after express.bodyParser()!

// ** routes ***
require('./routes.js')(app);

// *** listen (start app with 'node server.js') ***
http.createServer(app).listen(port);
console.log('App is listening on port number: ' + port);