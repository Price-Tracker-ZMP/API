const Joi = require('@hapi/joi');

const addingGameValidation = request => {
	const addingGameValidationSchema = Joi.object({
		token: Joi.string().required(),
		gameName: Joi.string().required(),
	});
	return addingGameValidationSchema.validate(request);
};

module.exports.addingGameValidation = addingGameValidation;
