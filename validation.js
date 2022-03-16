const Joi = require('@hapi/joi');

const registerValidation = request => {
	const registerValidationSchema = Joi.object({
		name: Joi.string().min(6).required(),
		email: Joi.string().min(6).required().email(),
		password: Joi.string().min(6).required(),
	});
	return registerValidationSchema.validate(request);
};

module.exports.registerValidation = registerValidation;

const loginValidation = request => {
	const loginValidationSchema = Joi.object({
		email: Joi.string().min(6).required().email(),
		password: Joi.string().min(6).required(),
	});
	return loginValidationSchema.validate(request);
};

module.exports.loginValidation = loginValidation;
