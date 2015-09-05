// import the mongoose package
var mongoose = require('mongoose'); // import the model

// define the schema
var userSchema = new mongoose.Schema({
	id: { type: String, required: true },
	name: { type: String, required: true },
	description: { type: String }, 
	location: { type: String, required: true },
	following: { type: Array, required: true, "default": [] },
	followers: { type: Array, required: true, "default": [] },
	track_count: { type: Number, required: true, "default": 0 },
	starred_artists: { type: Array, required: true, "default": [] },
	liked_tracks: { type: Array, required: true, "default": [] }
});

// compile schema into a model
var User = mongoose.model('Users', userSchema);

// expose the schema
module.exports = User;