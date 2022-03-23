const responseStandard = (statusCode, content) => {
	const response = {
		status: statusCode,
		content: content,
	};
	return response;
};

module.exports = responseStandard;
