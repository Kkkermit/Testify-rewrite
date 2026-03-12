const fs = require("fs");
const path = require("path");
const dotenv = require("dotenv");
const { color, getTimestamp } = require("@utils");

function loadEnvironment() {
	const envFile = process.env.NODE_ENV === "development" ? ".env.development" : ".env";
	const envPath = path.resolve(process.cwd(), envFile);

	console.log(
		`${color.green}[${getTimestamp()}]${color.reset} [PROCESS] Loading environment variables from: ${color.torquise}${envPath}${color.reset}`,
	);
	if (process.env.NODE_ENV === "development") {
		console.log(
			`${color.green}[${getTimestamp()}]${color.reset} ${color.yellow}⚠ Running in development mode${color.reset}`,
		);
	} else {
		console.log(`${color.green}[${getTimestamp()}]${color.reset} ${color.green}✓${color.reset} Environment loaded`);
	}

	if (fs.existsSync(envPath)) {
		dotenv.config({ path: envPath });
	} else {
		console.log(`${color.red}[${getTimestamp()}] [ERROR] Environment file ${envFile} not found${color.reset}`);
		process.exit(1);
	}
}

module.exports = loadEnvironment;
