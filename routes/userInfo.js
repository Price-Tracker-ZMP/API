const router = require('express').Router();
const jwt = require('jsonwebtoken');

const User = require('../models/User.js');
const Game = require('../models/Game.js');

const { userEmailValidation } = require('../validation/userInfoValidation.js');

const responseStandard = require('../controller.js');

router.get('/user-email', async (req, res) => {
	console.log('----------------------------------------------');
	console.log("Get request '/user-email': ", req.body);

	const { error } = userEmailValidation(req.body);
	if (error) {
		return res.json(responseStandard(false, error.details[0].message));
	}

	const { _id } = jwt.verify(
		req.body.token,
		process.env.TOKEN_SECRET,
		(err, decode) => {
			if (err) {
				return res.json(responseStandard(false, 'Token Invalid', err));
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
		return res.json(responseStandard(false, 'Something went wrong'));
	}
});

router.get('/user-games', async (req, res) => {
	console.log('----------------------------------------------');
	console.log('Get request: ', req.body);

	const { _id } = jwt.verify(
		req.body.token,
		process.env.TOKEN_SECRET,
		(err, decode) => {
			if (err) {
				return res.json(responseStandard(false, 'Token Invalid', err));
			}
			return decode;
		}
	);
	const userById = await User.findById(_id);
	console.log(userById);

	if (!userById) {
		return res.json(
			responseStandard(false, "User with that token doesn't exist")
		);
	}

	if (userById) {
		// console.log(userById.gamesList);
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
});

module.exports = router;
