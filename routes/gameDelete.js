const router = require('express').Router();

const User = require('../models/Game.js');

const responseStandard = require('../controller.js');

router.delete('/delete-game', async (req, res) => {
	console.log('---------------------------------');
	console.log(' Delete Order - delete.game:', request.body);
	console.log("header - 'authentication': ", request.header('authentication'));
});

module.exports = router;
