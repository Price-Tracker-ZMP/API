const router = require('express').Router();
const Game = require('../models/Game.js');
const PriceHistory = require('../models/PriceHistory.js');
const responseStandard = require('../controller.js');

router.get('/game/:gameId', async (req, res) => {
	console.log('------------------------------------------------');
	console.log('Get new order - get on game with gameId');

	const gameId = req.params.gameId;
	console.log(gameId);
	try {
		const gameFromId = await Game.findOne({ steam_appid: gameId });
		if (!gameFromId) {
			throw 'Problem with game id';
		}
		console.log(gameFromId);
		return res.json(responseStandard(true, 'Ordered Game', gameFromId));
	} catch (err) {
		console.log(responseStandard(false, err));
		return res.json(responseStandard(false, err));
	}
});

router.get('/game-price-history/:gameId', async (req, res) => {
	console.log('------------------------------------------------');
	console.log("Get new order - get on game's price history");

	const gameId = req.params.gameId;
	console.log(gameId);

	try {
		const priceHistory = await PriceHistory.findOne({ steam_appid: gameId });
		console.log(priceHistory);
		if (!priceHistory) {
			throw 'Problem with game id';
		}
		return res.json(
			responseStandard(true, 'Catch your price history', priceHistory)
		);
	} catch (err) {
		console.log(responseStandard(false, err));
		return res.json(responseStandard(false, err));
	}
});

module.exports = router;
