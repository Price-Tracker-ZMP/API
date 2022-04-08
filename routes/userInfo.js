const router = require('express').Router();
const jwt = require('jsonwebtoken');

const User = require('../models/User.js');

const responseStandard = require('../controller.js');

router.get('/user-email', async (req, res) => {
	const { _id } = jwt.verify(
		req.body.token,
		process.env.TOKEN_SECRET,
		(err, decode) => {
			if (err) {
				return res.json(responseStandard(false, 'Token Invalid - ', err));
			}
			return decode;
		}
	);
	const userById = await User.findById(_id);
	if (userById) {
		return res.json(
			responseStandard(true, 'User Found', { email: userById.email })
		);
	}
	if (!userById) {
		return res.json(responseStandard(false, 'Something went wrong'));
	}
});

module.exports = router;
