// import the mongoose package
var mongoose = require('mongoose'); // import the model

// define the schema
var trackSchema = new mongoose.Schema({
	id: { type: String, required: true },
	name: { type: String, required: true },
	likes: { type: Number, "default": 0 },
	description: { type: String },
	city: { type: String, required: true },
	state: { type: String, required: true },
	country: { type: String, required: true },
	source: { type: String, required: true },
	uploaded: { type: Date, "default": Date.now }
});

// compile schema into a model
var Track = mongoose.model('Tracks', trackSchema);

// expose the schema
module.exports = Track;