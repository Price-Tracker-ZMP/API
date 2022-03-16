const express = require('express');
const app = express();
const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

const authRoute = require('./routes/auth.js');
const User = require('./models/User.js');
//TODO: take short tutorial about MONGOOSE
//TODO: remember about turn on CORS
//TODO: main, test routes to do - for testing main connection with database and testing with Postman

//MIDDLEWARES!!!
app.use(express.json());
app.use('/auth', authRoute);

//ROUTES
app.get('/all', async (request, response) => {
	try {
		const users = await User.find();
		response.json(users);
	} catch (err) {
		response.json({ message: err });
	}
});

//CONNECT TO DATABASE
mongoose.connect(process.env.DB_CONNECTION, () => {
	console.log('Database connected');
});

//TODO: not-static port listening
//LISTENING
app.listen(5000, () => {
	console.log('Server is running');
});
