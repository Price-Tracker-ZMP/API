const router = require('express').Router();
const jwt = require('jsonwebtoken');
const fetch = require('node-fetch');

const User = require('../models/User.js');
const Game = require('../models/Game.js');

const { addingGameValidation } = require('../validation/gameValidation.js');
const responseStandard = require('../controller.js');

router.post('/by-id', async (request, response) => {
	console.log('-----------------------------------');
	console.log("Got 'add-game/by-name' order: ", request.body);

	const { error } = addingGameValidation(request.body);
	if (error) {
		return response.json(responseStandard(false, error.details[0].message));
	}

	const decode = await jwt.verify(
		request.body.token,
		process.env.TOKEN_SECRET,
		(err, decode) => {
			if (err) {
				return response.json(responseStandard(false, 'Unvalid Token'));
			}
			if (!err) {
				return decode;
			}
		}
	);

	const userFromToken = await User.findById(decode);
	if (!userFromToken) {
		return response.json(responseStandard(false, "User doesn't exists"));
	}

	//sprawdzenie, czy gra o podanym id juz istnieje w db
	const isGameFromRequestExistInDB = await Game.findOne({
		steam_appid: request.body.gameId,
	});

	if (isGameFromRequestExistInDB) {
		var gameID = isGameFromRequestExistInDB._id; //id dokumentu z bd gry

		const isUserHasThatGame = await User.findOne({
			_id: userFromToken._id,
			gamesList: gameID,
		});
		if (isUserHasThatGame) {
			return response.json(
				responseStandard(false, 'User already has this game')
			);
		}
		try {
			if (!isUserHasThatGame) {
				userFromToken.gamesList.push(gameID);
				await userFromToken.save();
				return response.json(responseStandard(true, 'Game add to user'));
			}
		} catch (err) {
			response.json(responseStandard(false, "Problems during 'save'"));
		}
	}

	if (!isGameFromRequestExistInDB) {
		const steamUrl =
			'https://store.steampowered.com/api/appdetails?appids={app_id}&cc=pl';

		const gameResponseFromSteam = await fetch(
			steamUrl.replace('{app_id}', request.body.gameId)
		).then(res => res.json());

		if (!gameResponseFromSteam[request.body.gameId].success) {
			return response.json(responseStandard(false, 'appid error'));
		}

		const { steam_appid, name, price_overview } =
			gameResponseFromSteam[request.body.gameId].data;

		const newGameToSave = new Game({
			name: name,
			steam_appid: steam_appid,
			currency: price_overview.currency,
			priceInitial: price_overview.initial,
			priceFinal: price_overview.final,
			discountPercent: price_overview.discount_percent,
		});

		try {
			await newGameToSave.save();
			userFromToken.gamesList.push(newGameToSave._id);
			await userFromToken.save();
			response.json(responseStandard(true, 'Game Added'));
		} catch (err) {
			response.json(responseStandard(false, "Problems during 'save'"));
		}
	}
});

router.post('/by-link', async (request, response) => {
	console.log('-----------------------------------');
	console.log("Got 'add-game/by-link' order: ", request.body);
	const token = request.body.token;
	const link = request.body.link.toString();

	const { _id } = jwt.verify(token, process.env.TOKEN_SECRET, (err, decode) => {
		if (err) {
			return res.json(responseStandard(false, 'Token Invalid'));
		}
		return decode;
	});

	const userFromToken = await User.findById(_id);
	console.log(userFromToken);

	const gameNumber = link
		.split('/')
		.filter(element => element !== '')
		.at(-2);

	const steamUrlSchema =
		'https://store.steampowered.com/api/appdetails?appids={app_id}&cc=pl';

	const gameFromSteam = await fetch(
		steamUrlSchema.replace('{app_id}', gameNumber)
	).then(res => res.json());
	const name = gameFromSteam[gameNumber].data.name;
	const steam_appid = gameFromSteam[gameNumber].data.steam_appid;
	const currency = gameFromSteam[gameNumber].data.price_overview.currency;
	const initial = gameFromSteam[gameNumber].data.price_overview.initial;
	const final = gameFromSteam[gameNumber].data.price_overview.final;
	const discount_percent =
		gameFromSteam[gameNumber].data.price_overview.discount_percent;

	const isGameInDB = await Game.findOne({
		name: name,
		steam_appid: steam_appid,
	});

	if (isGameInDB) {
		const gameInDB = await Game.findOne({ steam_appid: steam_appid });

		const hasUserHasThisGame = userFromToken.gamesList.find(
			element => element.valueOf() === gameInDB._id.valueOf()
		);

		if (hasUserHasThisGame) {
			return response.json(responseStandard(false, 'User has this game'));
		}

		if (!hasUserHasThisGame) {
			userFromToken.gamesList.push(gameInDB._id);
			userFromToken.save();
			return response.json(responseStandard(true, 'Game Added'));
		}
	}

	if (!isGameInDB) {
		const newGame = new Game({
			name: name,
			steam_appid: steam_appid,
			currency: currency,
			priceInitial: initial,
			priceFinal: final,
			discountPercent: discount_percent,
		});
		try {
			newGame.save();
			userFromToken.gamesList.push(newGame._id);
			userFromToken.save();
			return response.json(responseStandard(true, 'Game Added'));
		} catch (err) {
			return response.json(responseStandard(false, err));
		}
	}
});

module.exports = router;
