const router = require('express').Router();
const fetch = require('node-fetch');
const responseStandard = require('../controller.js');

router.get('/', async (request, response) => {
	const dataToRedirect = await fetch(
		'https://api.steampowered.com/ISteamApps/GetAppList/v2/?'
	).then(res => res.json());

	const games = dataToRedirect.applist.apps.filter(e => e.name && e.appid);
	console.log(games);

	response.json(responseStandard(true, 'Take your games list', games));
});

module.exports = router;
