const { inspect } = require("node:util");

const color = {
	// Foreground colors
	red: "\x1b[31m",
	orange: "\x1b[38;5;202m",
	yellow: "\x1b[33m",
	green: "\x1b[32m",
	blue: "\x1b[34m",
	pink: "\x1b[38;5;213m",
	torquise: "\x1b[38;5;45m",
	purple: "\x1b[38;5;57m",
	cyan: "\x1b[36m",
	white: "\x1b[37m",
	black: "\x1b[30m",
	magenta: "\x1b[35m",
	
	// Background colors (auto-bold + white text)
	bgRed: "\x1b[41m\x1b[1m\x1b[37m",
	bgOrange: "\x1b[48;5;202m\x1b[1m\x1b[37m",
	bgYellow: "\x1b[43m\x1b[1m\x1b[37m",
	bgGreen: "\x1b[42m\x1b[1m\x1b[37m",
	bgBlue: "\x1b[44m\x1b[1m\x1b[37m",
	bgPink: "\x1b[48;5;213m\x1b[1m\x1b[37m",
	bgCyan: "\x1b[46m\x1b[1m\x1b[37m",
	bgWhite: "\x1b[47m\x1b[1m\x1b[30m",
	bgBlack: "\x1b[40m\x1b[1m\x1b[37m",
	bgMagenta: "\x1b[45m\x1b[1m\x1b[37m",
	bgPurple: "\x1b[48;5;57m\x1b[1m\x1b[37m",
	
	// Text styles
	bold: "\x1b[1m",
	dim: "\x1b[2m",
	italic: "\x1b[3m",
	underline: "\x1b[4m",
	blink: "\x1b[5m",
	reverse: "\x1b[7m",
	
	// Reset
	reset: "\x1b[0m",
};

function getTimestamp() {
	const date = new Date();
	const year = date.getFullYear();
	const month = date.getMonth() + 1;
	const day = String(date.getDate()).padStart(2, "0");
	const hours = String(date.getHours()).padStart(2, "0");
	const minutes = String(date.getMinutes()).padStart(2, "0");
	const seconds = String(date.getSeconds()).padStart(2, "0");
	return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}

function write(message = "", prefix = "", colors = true) {
	const properties = inspect(message, { depth: 3, colors: Boolean(colors && typeof message !== "string") });

	const regex = /^\s*["'`](.*)["'`]\s*\+?$/gm;

	const lines = properties.split("\n");
	for (let i = 0; i < lines.length; i++) {
		const line = lines[i].replace(regex, "$1");
		if (i === 0) {
			console.log(prefix + line);
		} else {
			console.log(line);
		}
	}
}

function info(message) {
	return write(message, `${color.yellow}[${getTimestamp()}]${color.reset} `);
}

function warn(message) {
	return write(message, `${color.orange}[${getTimestamp()}]${color.reset} `);
}

function error(message) {
	return write(message, `${color.red}[${getTimestamp()}] `, false);
}

function success(message) {
	return write(message, `${color.green}[${getTimestamp()}]${color.reset} `);
}

function debug(message) {
	return write(message, `${color.blue}[${getTimestamp()}]${color.reset} `);
}

function logging(message) {
	return write(message, `${color.pink}[${getTimestamp()}]${color.reset} `);
}

function torquise(message) {
	return write(message, `${color.torquise}[${getTimestamp()}]${color.reset} `);
}

function purple(message) {
	return write(message, `${color.purple}[${getTimestamp()}]${color.reset} `);
}

module.exports = { write, info, warn, error, success, debug, logging, torquise, purple, color, getTimestamp };
