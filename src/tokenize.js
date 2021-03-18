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
	let cursor = 0;

	while (cursor < input.length) {
		const char = input[cursor];

		if (isLetter(char)) {
			let name = char;
			while (isLetter(input[++cursor])) {
				name += input[cursor];
			}
			tokens.push({
				type: "Name",
				value: name,
			});
		} else if (isNumber(char)) {
			let number = char;
			while (isNumber(input[++cursor])) {
				number += input[cursor];
			}
			tokens.push({
				type: "Number",
				value: +number,
			});
			continue;
		} else if (isQuote(char)) {
			let string = "";
			while (!isQuote(input[++cursor])) {
				string += input[cursor];
			}
			tokens.push({
				type: "String",
				value: string,
			});
			cursor++;
		} else if (isParenthesis(char)) {
			tokens.push({
				type: "Parenthesis",
				value: char,
			});
			cursor++;
			continue;
		} else if (isWhitespace(char)) {
			cursor++;
			continue;
		} else {
			throw new SyntaxError(`invalid character ${char}`);
		}
	}

	return tokens;
}

// TODO: Check unified ast spec!

module.exports = { tokenize };
