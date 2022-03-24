const router = require('express').Router();
//TODO: checking what express.Router() method makes - exactly
const User = require('../models/User.js');
const bcrypt = require('bcryptjs');
const { registerValidation, loginValidation } = require('../validation');
const jwt = require('jsonwebtoken');

const responseAuth = require('../controller.js');

// /auth/register
router.post('/register', async (request, response) => {
	console.log('---------------------------------');
	console.log('Got request.body:', request.body);
	//validacja requestu
	const { error } = registerValidation(request.body);
	if (error) {
		console.log('REQUEST DATA ERROR');
		console.log(error.details[0].message);
		// return response
		// 	.status(412)
		// 	.json({ errorMessage: error.details[0].message });
		return response.json(responseAuth(false, error.details[0].message));
	}

	// validacja "czy tego emaila juz nie ma"
	const emailExist = await User.findOne({
		email: request.body.email,
	});
	if (emailExist) {
		console.log('EMAIL ALREADY EXIST');
		// return response.status(400).send('Email already exist');
		return (
			response
				// .status(404)
				// .json({ status: false, errorMessage: 'Email already exist' })
				.json(responseAuth(false, 'Email already exist'))
		);
	}

	//Hashowanie hasła
	const salt = await bcrypt.genSalt(10);
	const hashedPassword = await bcrypt.hash(request.body.password, salt);

	//tworzenie user'a do zapisania
	const user = new User({
		email: request.body.email,
		password: hashedPassword,
	});

	//zapisanie, bądz złapanie błędu
	try {
		const savedUser = await user.save();
		console.log('Saved user: ', savedUser);
		// response.json({ message: 'User created', email: user.email, id: user._id });
		response.json(responseAuth(true, 'Users created'));
	} catch (err) {
		console.log(err);
		// response.status(400).send(err);
		response.json(responseAuth(false, err));
	}
	console.log('REGISTER COMPLETED');
});

// /auth/login
router.post('/login', async (request, response) => {
	console.log(request.body);
	//validacja danych wejsciowych
	const { error } = loginValidation(request.body);
	if (error) {
		console.log('REQUEST DATA ERROR');
		return (
			response
				.status(400)
				// .json({ errorMessage: error.details[0].message });
				.json(responseAuth(false, error.details[0].message))
		);
	}

	//sprawdzenie, czy podany email znajduje się w bazie - wyszukujemy usera o takim emailu
	//wyciagniecie usera o podanym emailu z bazy
	const user = await User.findOne({
		email: request.body.email,
	});

	if (!user) {
		console.log("EMAIL DOESN'T EXIST IN DB");
		// return response.status(400).json({ errorMessage: "Email doesn't exist" });
		return response.json(responseAuth(false, "User doesn't exist"));
	}

	//porównanie hasła usytkownika z podanym haslem
	const validPassword = await bcrypt.compare(
		request.body.password,
		user.password
	);
	if (!validPassword) {
		console.log('PASSWORD IS A SHIT');
		return response.json(responseAuth(false, 'Wrong Password'));
	}

	//wystawienie tokenu
	const token = jwt.sign({ _id: user._id }, process.env.TOKEN_SECRET);
	// response.header('auth-token', token).json({ user: user.email, token: token });
	console.log({ user: user, token: token });
	response.header('auth-token', token).json(responseAuth(true, 'Login', token));
});

module.exports = router;
