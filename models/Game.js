const mongoose = require('mongoose');
const PriceHistory = require('../models/PriceHistory.js');

const MAXIMUM_PRICE_HISTORY_RANGE = 20;

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
		default: 'none',
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
			if (gamesPriceHistory.priceInitial.length > MAXIMUM_PRICE_HISTORY_RANGE) {
				gamesPriceHistory.priceInitial.shift();
				gamesPriceHistory.dateInitial.shift();
			}
			gamesPriceHistory.priceInitial.push(this.priceInitial);
			gamesPriceHistory.dateInitial.push(date);
		}
		if (gamesPriceHistory.priceFinal !== this.priceFinal) {
			if (gamesPriceHistory.priceFinal.length > MAXIMUM_PRICE_HISTORY_RANGE) {
				gamesPriceHistory.priceFinal.shift();
				gamesPriceHistory.dateFinal.shift();
			}
			gamesPriceHistory.priceFinal.push(this.priceFinal);
			gamesPriceHistory.dateFinal.push(date);
		}
		await gamesPriceHistory.save();
	}
});

module.exports = mongoose.model('Game', GameSchema);
