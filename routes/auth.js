const router = require('express').Router();
//TODO: checking what express.Router() method makes
const User = require('../models/User.js');
const bcrypt = require('bcryptjs');
const { registerValidation, loginValidation } = require('../validation');
const jwt = require('jsonwebtoken');

router.post('/register', async (request, response) => {
	//validacja requestu
	const { error } = registerValidation(request.body);
	if (error) return response.status(400).send(error.details[0].message);

	//validacja "czy tego emaila juz nie ma"
	const emailExist = await User.findOne({
		email: request.body.email,
	});
	if (emailExist) return response.status(400).send('Email already exist');

	//Hashowanie hasła
	const salt = await bcrypt.genSalt(10);
	const hashedPassword = await bcrypt.hash(request.body.password, salt);

	//tworzenie user'a do zapisania
	const user = new User({
		name: request.body.name,
		email: request.body.email,
		password: hashedPassword,
	});

	//zapisanie, bądz złapanie błędu
	try {
		const savedUser = await user.save();
		response.json({ id: user._id });
	} catch (err) {
		response.status(400).send(err);
	}
});

router.post('/login', async (request, response) => {
	//validacja danych wejsciowych
	const { error } = loginValidation(request.body);
	if (error) return response.status(400).send(error.details[0].message);

	//sprawdzenie, czy podany email znajduje się w bazie - wyszukujemy usera o takim emailu
	const user = await User.findOne({
		email: request.body.email,
	});
	if (!user) return response.status(400), send('Email is incorrect');

	//porównanie hasła usytkownika z podanym haslem
	const validPassword = await bcrypt.compare(
		request.body.password,
		user.password
	);
	if (!validPassword) return response.status(400).send('Password is incorrect');

	//wystawienie tokenu
	const token = jwt.sign({ _id: user._id }, process.env.TOKEN_SECRET);
	response.header('auth-token', token).send(token);
});

module.exports = router;
