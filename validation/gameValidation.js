const Joi = require('@hapi/joi');

const addingGameByIdValidation = request => {
	const addingGameValidationSchema = Joi.object({
		gameId: Joi.number().required(),
	});
	return addingGameValidationSchema.validate(request);
};

module.exports.addingGameByIdValidation = addingGameByIdValidation;

const addingGameByLinkValidation = request => {
	const addingGameByLinkValidationSchema = Joi.object({
		link: Joi.string().required(),
	});
	return addingGameByLinkValidationSchema.validate(request);
};

module.exports.addingGameByLinkValidation = addingGameByLinkValidation;
