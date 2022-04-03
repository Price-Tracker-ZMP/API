const responseStandard = (status, message, content) => {
	const response = {
		status: status,
		message: message,
		content: content,
	};
	return response;
};

module.exports = responseStandard;
