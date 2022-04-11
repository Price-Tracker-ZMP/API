const router = require('express').Router();
const jwt = require('jsonwebtoken');

const User = require('../models/User.js');
const Game = require('../models/Game.js');

const responseStandard = require('../controller.js');

router.get('/user-email', async (req, res) => {
	console.log('----------------------------------------------');
	console.log("Get request '/user-info/user-email': ", req.body);
	console.log('header(authentication): ', req.header('authentication'));

	try {
		const token = req.header('authentication');
		if (!token) {
			throw "Token doesn't exist";
		}

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
		const userById = await User.findById(_id);
		if (userById) {
			return res.json(
				responseStandard(true, 'User Found', { email: userById.email })
			);
		}
		if (!userById) {
			throw "User with that token doesn't exist";
		}
	} catch (err) {
		console.log(err);
		return res.json(responseStandard(false, err));
	}
});

router.get('/user-games', async (req, res) => {
	console.log('----------------------------------------------');
	console.log("Get request '/user-info/user-games': ", req.body);
	console.log('header(authentication): ', req.header('authentication'));

	try {
		const token = req.header('authentication');
		if (!token) {
			throw "Token doesn't exist";
		}

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
		const userById = await User.findById(_id);
		console.log('User from ID', userById);

		if (!userById) {
			throw "User with that token doesn't exist";
		}

		if (userById) {
			const gamesObjectIds = userById.gamesList.map(element => {
				return element.valueOf();
			});
			const games = await Promise.all(
				gamesObjectIds.map(async element => {
					return await Game.findById(element);
				})
			);
			res.json(responseStandard(true, "User's games", games));
		}
	} catch (err) {
		console.log(err);
		res.json(responseStandard(false, err));
	}
});

module.exports = router;
