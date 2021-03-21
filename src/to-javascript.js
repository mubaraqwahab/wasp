const generate = require("@babel/generator").default;
const { traverse } = require("./traverse");

const babelVisitor = {
	CallExpression: {
		enter({ node }) {
			node.callee = { type: "Identifier" };
		},
	},
};

const toJavaScript = (ast) => {};

module.exports = {
	toJavaScript,
};
