const router = require('express').Router();
//TODO: checking what express.Router() method makes - exactly
const User = require('../models/User.js');
const bcrypt = require('bcryptjs');
const {
	registerValidation,
	loginValidation,
} = require('../validation/authValidation');
const jwt = require('jsonwebtoken');

const responseStandard = require('../controller.js');

router.post('/register', async (request, response) => {
	console.log('---------------------------------');
	console.log('Got request.body:', request.body);

	const { error } = registerValidation(request.body);
	if (error) {
		console.log('REQUEST DATA ERROR');
		console.log(error.details[0].message);
		return response.json(responseStandard(false, error.details[0].message));
	}

	const emailExist = await User.findOne({
		email: request.body.email,
	});
	if (emailExist) {
		console.log('EMAIL ALREADY EXIST');
		return response.json(responseStandard(false, 'Email already exist'));
	}

	const salt = await bcrypt.genSalt(10);
	const hashedPassword = await bcrypt.hash(request.body.password, salt);

	const user = new User({
		email: request.body.email,
		password: hashedPassword,
	});

	try {
		const savedUser = await user.save();
		console.log('Saved user: ', savedUser);
		response.json(responseStandard(true, 'Users created'));
	} catch (err) {
		console.log(err);
		response.json(responseStandard(false, err));
	}
	console.log('REGISTER COMPLETED');
});

router.post('/login', async (request, response) => {
	console.log('-----------------------------------------------');
	console.log("Got order: '/auth/login/' -> ", request.body);

	const { error } = loginValidation(request.body);
	if (error) {
		console.log('REQUEST DATA ERROR');
		return response
			.status(400)
			.json(responseStandard(false, error.details[0].message));
	}

	const user = await User.findOne({
		email: request.body.email,
	});

	if (!user) {
		console.log("EMAIL DOESN'T EXIST IN DB");
		return response.json(responseStandard(false, "User doesn't exist"));
	}

	const validPassword = await bcrypt.compare(
		request.body.password,
		user.password
	);
	if (!validPassword) {
		console.log('PASSWORD IS A SHIT');
		return response.json(responseStandard(false, 'Wrong Password'));
	}

	const token = jwt.sign({ _id: user._id }, process.env.TOKEN_SECRET);
	console.log({ user: user, token: token });
	response
		.header('authentication', token)
		.json(responseStandard(true, 'Login', token));
});

module.exports = router;
