const mongoose = require('mongoose');

const UserSchema = mongoose.Schema({
	email: {
		type: String,
		required: true,
		max: 128,
	},
	password: {
		type: String,
		required: true,
		minlength: 5,
	},
});

const User = mongoose.model('User', UserSchema);
module.exports = User;
