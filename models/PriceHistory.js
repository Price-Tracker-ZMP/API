const mongoose = require('mongoose');

const PriceHistorySchema = mongoose.Schema({
	steam_appid: {
		type: Number,
		required: true,
	},
	priceInitial: {
		type: [Number],
		required: true,
	},
	dateInitial: {
		type: [Date],
		required: true,
	},
	priceFinal: {
		type: [Number],
		required: true,
	},
	dateFinal: {
		type: [Date],
		required: true,
	},
});

module.exports = mongoose.model('PriceHistory', PriceHistorySchema);
