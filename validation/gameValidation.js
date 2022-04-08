const Joi = require('@hapi/joi');

const addingGameValidation = request => {
	const addingGameValidationSchema = Joi.object({
		token: Joi.string().required(),
		gameId: Joi.number().required(),
	});
	return addingGameValidationSchema.validate(request);
};

module.exports.addingGameValidation = addingGameValidation;
