const { prompt } = require("inquirer");
const chalk = require("chalk");

const { parseAndEvaluate } = require("./parse-and-evaluate");

const repl = async () => {
	try {
		const questions = [
			{ name: "COMMAND", type: "input", message: chalk.blue(">") },
		];

		const answers = await prompt(questions);
		const COMMAND = answers.COMMAND.trim();

		if (COMMAND === ":q") {
			process.exit();
		} else if (COMMAND === ":h") {
		} else {
			console.log(chalk.yellow(parseAndEvaluate(COMMAND)));
		}
	} catch (err) {
		console.log(err);
	}

	repl();
};

// This only runs if this script is run directly from the command line.
if (require.main === module) {
	console.log(
		chalk.red(
			`Welcome to the ${chalk.bgYellow("Wasp")} Programming Language\n` +
				`Run :q to exit the REPL.`
		)
	);
	repl();
}

module.exports = repl;
