const router = require('express').Router();
const jwt = require('jsonwebtoken');

const User = require('../models/User.js');
const Game = require('../models/Game.js');

const { gameDeleteValidation } = require('../validation/deleteValidation.js');
const responseStandard = require('../controller.js');
const { TokenExpiredError } = require('jsonwebtoken');
const { findById } = require('../models/User.js');

router.delete('/delete-game', async (req, res) => {
	console.log('---------------------------------');
	console.log(' Delete Order - delete.game:', req.body);
	console.log("header - 'authentication': ", req.header('authentication'));

	try {
		const { error } = gameDeleteValidation(req.body);
		if (error) {
			throw error.details[0].message;
		}

		const gameIdToDelete = req.body.gameId;
		const token = req.header('authentication');

		const { _id } = jwt.verify(
			token,
			process.env.TOKEN_SECRET,
			(err, decode) => {
				if (err) {
					throw 'Token Invalid';
				}
				return decode;
			}
		);

		const userFromId = await User.findById(_id);

		if (!userFromId) {
			throw "User doesn't exist";
		}

		const userGamesObjectId = userFromId.gamesList;
		const games = await Promise.all(
			userGamesObjectId.map(async objectId => {
				const game = await Game.findById(objectId);
				return game;
			})
		);

		const filteredGame = games.find(
			game => game.steam_appid === gameIdToDelete
		);

		if (!filteredGame) {
			throw "User doesn't have this game";
		}

		userFromId.gamesList.remove(filteredGame._id);
		await userFromId.save();
		return res.json(responseStandard(true, 'Game deleted'));
	} catch (err) {
		res.json(responseStandard(false, err));
	}
});

module.exports = router;
