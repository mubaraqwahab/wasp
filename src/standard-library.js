const all = (fn) => (...list) => list.reduce(fn);

const environment = {
	add: all((a, b) => a + b),
	subtract: all((a, b) => a - b),
	multiply: all((a, b) => a * b),
	divide: all((a, b) => a / b),
	modulo: all((a, b) => a % b),
	log: console.log,
	max: Math.max,
	min: Math.min,
	pi: Math.PI,
};

module.exports = { environment };
