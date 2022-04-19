const fetch = require('node-fetch');
const Game = require('./models/Game.js');

const urlSchema = 'https://store.steampowered.com/api/appdetails?appids={app_id}&cc=pl';

const updateGamesPrices = async () => {
	const allGamesInDB = await Game.find({});
	try {
		allGamesInDB.forEach(async game => {
			const steamData = await fetch(
				urlSchema.replace('{app_id}', game.steam_appid)
			).then(res => res.json());
			if (!steamData) {
				throw "I can't fetch from steam";
			}

			let steamPriceInitial =
				steamData[game.steam_appid].data.price_overview.initial;
			let steamPriceFinal = steamData[game.steam_appid].data.price_overview.final;

			game.priceInitial = steamPriceInitial;
			game.priceFinal = steamPriceFinal;

			console.log("Game log in 'gamePriceUpdate' ", game);

			await game.save();
		});
	} catch (err) {
		console.log('Game Price Update ERROR!!!');
	}
};

module.exports = updateGamesPrices;
