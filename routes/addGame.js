const router = require('express').Router();
const jwt = require('jsonwebtoken');
const fetch = require('node-fetch');

const User = require('../models/User.js');
const Game = require('../models/Game.js');
const { addingGameValidation } = require('../validation/gameValidation.js');
const responseStandard = require('../controller');

router.post('/add-game-byName', async (request, response) => {
	console.log('-----------------------------------');
	console.log('Got add game order: ', request.body);

	//walidacja danych requestu
	const { error } = addingGameValidation(request.body);
	if (error) {
		console.log('REQUEST DATA ERROR');
		console.log(error.details[0].message);
		return response.json(responseStandard(false, error.details[0].message));
	}

	//zdekodowanie tokenu
	const decoded = jwt.verify(request.body.token, process.env.TOKEN_SECRET);
	const user = await User.findById(decoded._id);
	console.log('user:', user);
	if (!user) {
		console.log('User NIE istnieje');
		return response.json(
			responseStandard(false, 'Wrong token - User not found')
		);
	}

	//sprawdzenie, czy podana nazwa gry istnieje w bazie gier Steam
	allSteamGamesURL =
		'http://api.steampowered.com/ISteamApps/GetAppList/v0002/?format=json';
	// stary link http://api.steampowered.com/ISteamApps/GetAppList/v0002/
	const steamGamesList = await fetch(allSteamGamesURL).then(res => res.json());

	const appsList = steamGamesList.applist.apps;
	const findGame = appsList.find(
		element => element.name === request.body.gameName
	);
	if (!findGame) {
		return response.json(responseStandard(false, "Game doesn't exist"));
	}

	// wyszukanie gry w bazie steam po ID gry
	const urlSchemaToFindByAppIDs =
		'https://store.steampowered.com/api/appdetails?appids=';

	const gameInfo = await fetch(urlSchemaToFindByAppIDs + findGame.appid).then(
		res => res.json()
	);

	// const isUserHasGame = await User.find({
	// 	email: user.email,
	// 	// gameList: {
	// 	// 	$elementMatch: { gameName: gameInfo[findGame.appid].data.name },
	// 	// },
	// 	gameList: {'gameName':gameInfo[findGame.appid].data.name}
	// });

	const isUserHasGame = await User.findOne({
		email: user.email,
		'gamesList.gameName': gameInfo[findGame.appid].data.name,
	});

	console.log(
		'gameInfo[findGame.appid].data.name: ',
		gameInfo[findGame.appid].data.name
	);
	console.log('isUserHasGame: ', isUserHasGame);

	if (isUserHasGame) {
		return response.json(responseStandard(false, 'User already has this game'));
	}

	//TODO: what when user already has that game???

	try {
		const newGame = new Game({
			gameName: gameInfo[findGame.appid].data.name,
			steam_appid: gameInfo[findGame.appid].data.steam_appid,
			currency: gameInfo[findGame.appid].data.price_overview.currency,
			price: gameInfo[findGame.appid].data.price_overview.final,
		});
		user.gamesList.push(newGame);
		await user.save();
		const isGameExist = await Game.find({
			gameName: gameInfo[findGame.appid].data.name,
		});
		if (isGameExist.length === 0) {
			await newGame.save();
		}
		response
			.status(200)
			.json(responseStandard(true, 'Game added', { addedGame: newGame }));
	} catch (error) {
		console.log(error);
	}
});

module.exports = router;
