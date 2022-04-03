const mongoose = require('mongoose');

const GameSchema = new mongoose.Schema({
	gameName: {
		type: String,
		required: true,
	},
	steam_appid: {
		type: String,
	},
	currency: {
		type: String,
	},
	price: {
		type: String,
		lowercase: true,
		default: 0.0,
	},
});

//TODO: make PRE middleware which will take current price of the game
// GameSchema.pre("save", function(){})

module.exports = mongoose.model('Game', GameSchema);
