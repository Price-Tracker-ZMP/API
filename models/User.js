const mongoose = require('mongoose');

const userRegisterSchema = mongoose.Schema({
	name: {
		type: String,
		required: true,
		min: 6,
		max: 32,
	},
	email: {
		type: String,
		required: true,
		max: 128,
	},
	password: {
		type: String,
		required: true,
		min: 6,
		max: 128,
	},
});

module.exports = mongoose.model('User', userRegisterSchema);
