const { isOpeningParenthesis, isClosingParenthesis } = require("./identify");
const { specialForms } = require("./special-forms");
const { pop } = require("./utilities");

/**
 *
 * @param {array} tokens
 */
function parenthesize(tokens) {
	const token = tokens.shift();

	if (isOpeningParenthesis(token.value)) {
		const expression = [];
		// What happens if there is no closing parenthesis?
		while (!isClosingParenthesis(tokens[0].value)) {
			expression.push(parenthesize(tokens));
		}
		tokens.shift();
		return expression;
	}

	return token;
}

/** Construct an abstract syntax tree from an array of tokens. */
function parse(tokens) {
	if (Array.isArray(tokens)) {
		const [first, ...rest] = tokens;
		return {
			type: "CallExpression",
			name: first.value,
			arguments: rest.map(parse),
		};
	}

	const token = tokens;

	if (token.type === "Number") {
		return {
			type: "NumericLiteral",
			value: token.value,
		};
	} else if (token.type === "String") {
		return {
			type: "StringLiteral",
			value: token.value,
		};
	} else if (token.type === "Name") {
		return {
			type: "Identifier",
			name: token.value,
		};
	}
}

module.exports = {
	parse: (tokens) => parse(parenthesize(tokens)),
};
