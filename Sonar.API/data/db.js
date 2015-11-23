// import the mongoose package
var mongoose = require('mongoose');

// require the config file (containing our MongoDB connection string)
var config = require('./config');

// connect to mongoDb
mongoose.connect(config.url);

// connection events: 
// we can use the mongoose api to hook into events e.g. when connecting / disconnecting to MongoDB
mongoose.connection.on('connected', function () {
	console.log('Connected to url: ' + config.url);
});

mongoose.connection.on('error', function (err) {
	console.log('Connection error: ' + err);
});

require('./userSchema.js');
require('./trackSchema.js');

