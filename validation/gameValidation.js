const Joi = require('@hapi/joi');

const addingGameByIdValidation = request => {
	const addingGameValidationSchema = Joi.object({
		token: Joi.string().required(),
		gameId: Joi.number().required(),
	});
	return addingGameValidationSchema.validate(request);
};

module.exports.addingGameByIdValidation = addingGameByIdValidation;

const addingGameByLinkValidation = request => {
	const addingGameByLinkValidationSchema = Joi.object({
		token: Joi.string().required(),
		link: Joi.string().required(),
	});
	return addingGameByLinkValidationSchema.validate(request);
};

module.exports.addingGameByLinkValidation = addingGameByLinkValidation;
