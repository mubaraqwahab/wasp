const { environment } = require("./standard-library");
const last = (collection) => collection[collection.length - 1];

/** Evaluate a node top-down */
const evaluate = (node) => {
	// The value of a leaf node (a 'terminal') is its value property
	if ("value" in node) return node.value;

	if (node.type === "Identifier") {
		if (node.name in environment) return environment[node.name];
		throw new ReferenceError(`${node.name} is not defined`);
	}

	if (node.type === "CallExpression") {
		const fn = environment[node.name];
		if (typeof fn !== "function") {
			throw new TypeError(`${node.name} is not a function`);
		}
		const argsValues = node.arguments.map(evaluate);
		// null and undefined values are nil in Wasp
		return fn(...argsValues) ?? "nil";
	}
};

module.exports = { evaluate };
