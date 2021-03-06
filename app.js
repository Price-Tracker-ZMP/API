require('dotenv').config({ path: './config.env' });
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const cors = require('cors');

const authRoutes = require('./routes/auth.js');
const User = require('./models/User.js');

const addGameRoutes = require('./routes/addGame.js');
const Game = require('./models/Game.js');

const getSteamGamesList = require('./routes/getSteamGamesList.js');
const userInfoRoutes = require('./routes/userInfo.js');
const gameDelete = require('./routes/gameDelete.js');
const basicGets = require('./routes/basicGetters.js');

const responseStandard = require('./controller.js');

const gamesPricesUpdate = require('./gamePriceUpdate.js');

//TODO: main, test routes to do - for testing main connection with database and testing with Postman

//MIDDLEWARES!!!
app.use(express.json());
app.use(cors());
app.use('/auth', authRoutes);
app.use('/add-game', addGameRoutes);
app.use('/get-steam-games-list', getSteamGamesList);
app.use('/user-info', userInfoRoutes);
app.use('/delete', gameDelete);
app.use('/get', basicGets);

//ROUTES
app.get('/', async (request, response) => {
	try {
		const users = await User.find();
		const games = await Game.find();
		response.json(responseStandard(true, 'Users and Games', { users, games }));
	} catch (err) {
		response.json(
			responseStandard(false, 'Something hit the fan in try-catch block')
		);
	}
});

//CONNECT TO DATABASE
mongoose.connect(process.env.DB_CONNECTION, () => {
	console.log('Database connected');
});

//LISTENING
const PORT = process.env.PORT || 5001;
app.listen(process.env.PORT, () => {
	console.log(`Server is running at port ${process.env.PORT}`);
});

setInterval(() => {
	var date = new Date();
	console.log(date);
	if (date.getHours() === 12 && date.getMinutes() === 33) {
		gamesPricesUpdate();
	}
}, 45000);
