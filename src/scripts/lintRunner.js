const { ESLint } = require("eslint");
const path = require("path");
const { color, getTimestamp } = require("@utils");

const LINT_TARGET = "src/**/*.js";
const FIX_MODE = process.argv.includes("--fix");

async function runLint() {
	console.log(
		`${color.blue}[${getTimestamp()}]${color.reset} [LINT] Starting ESLint${FIX_MODE ? " with auto-fix" : ""}...`,
	);

	const eslint = new ESLint({
		fix: FIX_MODE,
		overrideConfigFile: path.resolve(process.cwd(), "eslint.config.js"),
	});

	const results = await eslint.lintFiles([LINT_TARGET]);

	if (FIX_MODE) {
		await ESLint.outputFixes(results);
	}

	let totalErrors = 0;
	let totalWarnings = 0;
	let totalFiles = results.length;
	let filesWithProblems = 0;

	for (const result of results) {
		totalErrors += result.errorCount;
		totalWarnings += result.warningCount;
		if (result.errorCount > 0 || result.warningCount > 0) {
			filesWithProblems++;
		}
	}

	const cleanFiles = totalFiles - filesWithProblems;

	for (const result of results) {
		if (result.messages.length === 0) continue;

		const relativePath = path.relative(process.cwd(), result.filePath);
		console.log(
			`\n${color.yellow}[${getTimestamp()}]${color.reset} [LINT] ${color.yellow}${relativePath}${color.reset}`,
		);

		for (const msg of result.messages) {
			const position = `${color.blue}${String(msg.line).padStart(4)}:${String(msg.column).padEnd(4)}${color.reset}`;
			const level =
				msg.severity === 2 ? `${color.red}  error  ${color.reset}` : `${color.yellow} warning ${color.reset}`;
			const rule = msg.ruleId ? `${color.purple}(${msg.ruleId})${color.reset}` : "";
			console.log(`  ${position} ${level} ${msg.message} ${rule}`);
		}
	}

	console.log(`\n${color.blue}[${getTimestamp()}]${color.reset} [LINT] ${"─".repeat(60)}`);
	console.log(
		`${color.blue}[${getTimestamp()}]${color.reset} [LINT] ${color.green}Files scanned  : ${totalFiles}${color.reset}`,
	);
	console.log(
		`${color.blue}[${getTimestamp()}]${color.reset} [LINT] ${color.green}Files clean    : ${cleanFiles}${color.reset}`,
	);

	if (filesWithProblems > 0) {
		console.log(
			`${color.blue}[${getTimestamp()}]${color.reset} [LINT] ${color.yellow}Files with issues: ${filesWithProblems}${color.reset}`,
		);
	}

	if (totalErrors > 0) {
		console.log(
			`${color.blue}[${getTimestamp()}]${color.reset} [LINT] ${color.red}Errors         : ${totalErrors}${color.reset}`,
		);
	} else {
		console.log(
			`${color.blue}[${getTimestamp()}]${color.reset} [LINT] ${color.green}Errors         : ${totalErrors}${color.reset}`,
		);
	}

	if (totalWarnings > 0) {
		console.log(
			`${color.blue}[${getTimestamp()}]${color.reset} [LINT] ${color.yellow}Warnings       : ${totalWarnings}${color.reset}`,
		);
	} else {
		console.log(
			`${color.blue}[${getTimestamp()}]${color.reset} [LINT] ${color.green}Warnings       : ${totalWarnings}${color.reset}`,
		);
	}

	console.log(`${color.blue}[${getTimestamp()}]${color.reset} [LINT] ${"─".repeat(60)}`);

	if (totalErrors === 0 && totalWarnings === 0) {
		console.log(
			`${color.blue}[${getTimestamp()}]${color.reset} [LINT] ${color.green}✓ No errors or warnings found across all ${totalFiles} files!${color.reset}`,
		);
	} else if (totalErrors === 0) {
		console.log(
			`${color.blue}[${getTimestamp()}]${color.reset} [LINT] ${color.yellow}⚠ Lint passed with ${totalWarnings} warning(s).${color.reset}`,
		);
	} else {
		console.log(
			`${color.blue}[${getTimestamp()}]${color.reset} [LINT] ${color.red}✗ Lint failed with ${totalErrors} error(s) and ${totalWarnings} warning(s).${color.reset}`,
		);
	}

	if (totalErrors > 0) process.exit(1);
}

runLint().catch((err) => {
	console.error(`${color.red}[${getTimestamp()}] [LINT] Unexpected error running ESLint:${color.reset}`, err);
	process.exit(1);
});
