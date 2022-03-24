const responseAuth = (statusCode, message, content = {}) => {
	const response = {
		status: statusCode,
		message: message,
		content: content,
	};
	return response;
};

module.exports = responseAuth;
