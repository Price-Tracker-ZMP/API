require('dotenv').config({ path: './config.env' });
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const cors = require('cors');

const authRoute = require('./routes/auth.js');
const User = require('./models/User.js');

const addGameRoutes = require('./routes/addGame.js');
const Game = require('./models/Game.js');

const getSteamGamesList = require('./routes/getSteamGamesList.js');

const userInfo = require('./routes/userInfo.js');

const responseStandard = require('./controller.js');

//TODO: main, test routes to do - for testing main connection with database and testing with Postman

//MIDDLEWARES!!!
app.use(express.json());
app.use(cors());
app.use('/auth', authRoute);
app.use('/add-game', addGameRoutes);
app.use('/get-steam-games-list', getSteamGamesList);
app.use('/user-info', userInfo);

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

//TODO: not-static port listening
//LISTENING
const PORT = process.env.PORT || 5001;
app.listen(process.env.PORT, () => {
	console.log(`Server is running at port ${process.env.PORT}`);
});
