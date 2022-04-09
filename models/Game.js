const mongoose = require('mongoose');
const PriceHistory = require('../models/PriceHistory.js');

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
		default: 0.0,
	},
	priceFinal: {
		type: Number,
		default: 0.0,
	},
	discountPercent: {
		type: Number,
		default: 0.0,
	},
});

GameSchema.pre('save', async function (req, res, next) {
	const gamesPriceHistory = await PriceHistory.findOne({
		steam_appid: this.steam_appid,
	});
	const date = new Date();
	if (!gamesPriceHistory) {
		const newPriceHistory = new PriceHistory({
			steam_appid: this.steam_appid,
			priceInitial: this.priceInitial,
			dateInitial: date,
			priceFinal: this.priceFinal,
			dateFinal: date,
		});
		await newPriceHistory.save();
	}
	if (gamesPriceHistory) {
		if (gamesPriceHistory.priceInitial !== this.priceInitial) {
			gamesPriceHistory.priceInitial.push(this.priceInitial);
			gamesPriceHistory.dateInitial.push(date);
		}
		if (gamesPriceHistory.priceFinal !== this.priceFinal) {
			gamesPriceHistory.priceFinal.push(this.priceFinal);
			gamesPriceHistory.dateFinal.push(date);
		}
		await gamesPriceHistory.save();
	}
});

module.exports = mongoose.model('Game', GameSchema);
