const Joi = require('@hapi/joi');

const gameDeleteValidation = request => {
	const gameDeleteValidationSchema = Joi.object({
		gameId: Joi.number().required(),
	});
	return gameDeleteValidationSchema.validate(request);
};

module.exports.gameDeleteValidation = gameDeleteValidation;
