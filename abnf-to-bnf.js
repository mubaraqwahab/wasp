const fs = require("fs");

let abnf = fs.readFileSync("./wasp.abnf").toString();

// remove block comments
abnf = abnf.replace(/^;.*/g, "\n");

// remove inline comments
abnf = abnf.replace(/[^"];.*/g, "\n");

// update production heads
abnf = abnf.replace(/^([\w-]+) =\/(\s)/g, "/$2");
abnf = abnf.replace(/^([\w-]+) =(\s)/g, "<$1> ::=$2");

// update alternatives
abnf = abnf.replace(/(\s)\/(\s)/g, "$1|$2");

// update optionals
abnf = abnf.replace(/(\s)\[(\s*)(.+)(\s*)\]/g, "$1($2$3$4)?");

// collapse whitespace
abnf = abnf.replace(/\s*\n+/g, "\n");

// update one or more
abnf = abnf.replace(/1\*(\(.*\)|[\w-]+)/g, "$1+");

// update zero or more
abnf = abnf.replace(/\*(\(.*\)|[\w-]+)/g, "$1*");

// parenthesize non-terminals on the rhs
abnf = abnf.replace(/(?<=\s)([\w-]+)/g, "<$1>");

// change hypens in non-terminals to underscores
abnf = abnf.replace(/(\w+)-(\w+)/g, "$1_$2");

// decode encoded chars
abnf = abnf.replace(
	/%x([0-9a-fA-F]{2,6})(\.([0-9a-fA-F]{2,6}))?(?=\s)/g,
	(m, hex1, _, hex2) => {
		return String.fromCharCode(`0x${hex1}`, `0x${hex2}`);
	}
);

// decode encoded range chars
abnf = abnf.replace(
	/%x([0-9a-fA-F]{2,6})[_-]([0-9a-fA-F]{2,6})(?=\s)/g,
	(_, hex1, hex2) => {
		const char1 = String.fromCharCode(`0x${hex1}`),
			char2 = String.fromCharCode(`0x${hex2}`);
		return `[${char1}-${char2}]`;
	}
);
// abnf = abnf
// 	.replace("%x2E", ".")
// 	.replace("%x27", "'")
// 	.replace("%x20", " ")
// 	.replace("%x09", "\t")
// 	.replace("%x0A", "\n")
// 	.replace("%x0D.0A", "\r\n")
// 	.replace("%x30_39", "[0-9]")
// 	.replace("%x41_5A", "[A-Z]")
// 	.replace("%x61_7A", "[a-z]");

// Escape slashes
// abnf = abnf.replace("\\", "\\\\");

console.dir(abnf);
// console.dir(String.fromCharCode("0x0A"));
