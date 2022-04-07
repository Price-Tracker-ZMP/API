const router = require('express').Router();
const jwt = require('jsonwebtoken');
const fetch = require('node-fetch');

const User = require('../models/User.js');
const Game = require('../models/Game.js');

const { addingGameValidation } = require('../validation/gameValidation.js');
const responseStandard = require('../controller.js');

router.post('/by-name', async (request, response) => {
	console.log('-----------------------------------');
	console.log("Got 'add-game' order: ", request.body);

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
		console.log('Gra istnieje w DB');
		console.log(isGameFromRequestExistInDB);
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
		const steamUrl = 'https://store.steampowered.com/api/appdetails?appids=';

		const gameResponseFromSteam = await fetch(
			steamUrl + request.body.gameId
		).then(res => res.json());

		if (gameResponseFromSteam[request.body.gameId]) {
			console.log(gameResponseFromSteam[request.body.gameId].data);
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
module.exports = router;
