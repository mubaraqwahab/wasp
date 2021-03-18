const {
	isLetter,
	isNumber,
	isWhitespace,
	isParenthesis,
	isQuote,
} = require("./identify");

/**
 * Creates an array of tokens from a string of Wasp code.
 * @param {string} input
 * @returns An array of tokens
 */
function tokenize(input) {
	const tokens = [];
	return tokens;
}

// TODO: Check unified ast spec!

module.exports = { tokenize };
