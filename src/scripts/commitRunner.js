const { exec } = require("child_process");
const readline = require("readline");
const { color, getTimestamp } = require("@utils");
const { asciiTextCommitRunner } = require("@lib");

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});

const askQuestion = (question) => {
    return new Promise((resolve) => {
        rl.question(question, resolve);
    });
};

asciiTextCommitRunner();

const log      = `${color.pink}[${getTimestamp()}]${color.reset} ${color.blue}[GIT]${color.reset}`;
const logError = `${color.pink}[${getTimestamp()}]${color.reset} ${color.red}[GIT_ERROR]${color.reset}`;
const logInfo  = `${color.pink}[${getTimestamp()}]${color.reset} ${color.torquise}[GIT_INFO]${color.reset}`;
const thin     = `${color.blue}${'─'.repeat(115)}${color.reset}`;

const commit = async () => {
    const types = [
        { type: "feat",     description: "A new feature"                            },
        { type: "fix",      description: "A bug fix"                                },
        { type: "docs",     description: "Documentation changes"                    },
        { type: "style",    description: "Code style changes (formatting, etc)"     },
        { type: "refactor", description: "Code refactoring with no feature changes" },
        { type: "perf",     description: "Performance improvements"                 },
        { type: "test",     description: "Adding or updating tests"                 },
        { type: "chore",    description: "Maintenance tasks, dependency updates"    },
        { type: "add",      description: "Adding new features or files"             },
        { type: "update",   description: "Updating existing features or files"      },
        { type: "remove",   description: "Removing features or files"               },
    ];

    let selectedType;
    while (!selectedType) {
        console.log(`\n${thin}`);
        console.log(`${log} ${color.green}Select a commit type:${color.reset}\n`);

        types.forEach((item, index) => {
            const num    = `${color.blue}[${String(index + 1).padStart(2)}]${color.reset}`;
            const type   = `${color.green}${item.type.padEnd(10)}${color.reset}`;
            const desc   = `${color.torquise}${item.description}${color.reset}`;
            console.log(`  ${num} ${type} — ${desc}`);
        });

        console.log(`\n${thin}`);
        const typeIndex = await askQuestion(`${log} Enter number: `);
        selectedType = types[parseInt(typeIndex) - 1];

        if (!selectedType) {
            console.log(`${logError} Invalid selection, please enter a number between 1 and ${types.length}.`);
        }
    }

    console.log(`${logInfo} Selected type: ${color.green}${selectedType.type}${color.reset} — ${color.torquise}${selectedType.description}${color.reset}`);

    let message = await askQuestion(`${log} Enter commit message: `);

    if (!message.trim()) {
        console.log(`${logError} Commit message cannot be empty. Aborting.`);
        rl.close();
        process.exit(1);
    }

    message = message.charAt(0).toUpperCase() + message.slice(1);

    const fullMessage = `${selectedType.type}: ${message}`;

    console.log(`\n${thin}`);
    console.log(`${log} Commit message will be: ${color.green}"${fullMessage}"${color.reset}`);
    console.log(`${thin}`);

    const confirmation = await askQuestion(`${log} Confirm commit? (${color.green}yes${color.reset}/${color.red}no${color.reset}, default ${color.green}yes${color.reset}): `);

    if (confirmation.toLowerCase() === "no") {
        console.log(`${logError} Commit aborted.`);
        rl.close();
        process.exit(0);
    }

    console.log(`${log} Committing...`);
    exec(`git commit -m "${fullMessage}"`, (error, stdout, stderr) => {
        if (error) {
            console.error(`${logError} ${color.red}${error.message}${color.reset}`);
            console.error(`${logError} ${color.yellow}Tip: make sure your files are staged with ${color.green}git add <file>${color.yellow} or ${color.green}git add .${color.reset}`);
            return;
        }

        const output = (stdout + stderr).trim();

        console.log(`\n${thin}`);
        console.log(`${log} ${color.green}✓ Commit successful!${color.reset}`);
        if (output) console.log(`${log}   ${color.torquise}${output}${color.reset}`);
        console.log(`${thin}\n`);
    });

    rl.close();
};

commit();
