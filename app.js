require('dotenv').config({ path: './config.env' });
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const cors = require('cors');

const authRoute = require('./routes/auth.js');
const User = require('./models/User.js');

//TODO: remember about turn on CORS
//TODO: main, test routes to do - for testing main connection with database and testing with Postman

//MIDDLEWARES!!!
app.use(express.json());
app.use(cors());
app.use('/auth', authRoute);

//ROUTES
app.get('/', async (request, response) => {
	try {
		const users = await User.find();
		response.send(users);
	} catch (err) {
		// response.json({ message: err });
		response.json('Error');
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
