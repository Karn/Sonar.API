// import the mongoose package
var mongoose = require('mongoose'); // import the model

// define the schema
var userSchema = new mongoose.Schema({
	id: { type: String, required: true },
	name: { type: String, required: true },
	description: { type: String, required: true }, 
	location: { type: String, required: true },
	following_count: { type: Number, required: true, "default": 0 },
	following: { type: Array, required: true, "default": [] },
	followers_count: { type: Number, required: true, "default": 0 },
	followers: { type: Array, required: true, "default": [] },
	tracks: { type: Number, required: true, "default": 0 },
	starred_artists: { type: Number, required: true, "default": 0 },
	liked_tracks: { type: Number, required: true, "default": 0 }
});

// compile schema into a model
var User = mongoose.model('Users', userSchema);

// expose the schema
module.exports = User;