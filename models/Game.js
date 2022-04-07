const mongoose = require('mongoose');

const GameSchema = new mongoose.Schema({
	name: {
		type: String,
		required: true,
	},
	steam_appid: {
		type: Number,
	},
	currency: {
		type: String,
	},
	priceInitial: {
		type: Number,
		lowercase: true,
		default: 0.0,
	},
	priceFinal: {
		type: Number,
		lowercase: true,
		default: 0.0,
	},
});

//TODO: make PRE middleware which will take current price of the game
// GameSchema.pre("save", function(){})

module.exports = mongoose.model('Game', GameSchema);
