function traverseNode({ node, parent, visitor }) {
	const methods = visitor[node.type];

	if (methods && methods.enter) {
		methods.enter({ node, parent });
	}

	if (node.arguments) {
		node.arguments.forEach((arg) => {
			traverseNode({ node: arg, parent: node, visitor });
		});
	}

	if (methods && methods.exit) {
		methods.exit({ node, parent });
	}
}

const traverse = (node, visitor) => traverseNode({ node, visitor });

module.exports = { traverse };
