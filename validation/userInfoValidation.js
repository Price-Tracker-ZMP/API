const Joi = require('@hapi/joi');

const userEmailValidation = request => {
	const userEmailValidationSchema = new Joi.object({
		token: Joi.string().required(),
	});
	return userEmailValidationSchema.validate(request);
};

module.exports.userEmailValidation = userEmailValidation;
