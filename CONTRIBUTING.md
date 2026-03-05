# Contributing to Testify (Rewrite)

Thank you for considering contributing to Testify! This document outlines the process and guidelines for contributing to this project.

## Table of Contents
- [Setting Up Your Development Environment](#setting-up-your-development-environment)
- [Project Structure](#project-structure)
- [Available Scripts](#available-scripts)
- [Making Changes](#making-changes)
- [Linting](#linting)
- [Committing Your Changes](#committing-your-changes)
- [Pull Request Process](#pull-request-process)
- [Pull Request Requirements](#pull-request-requirements)
- [Code Review Process](#code-review-process)
- [Additional Guidelines](#additional-guidelines)

## How to Contribute

### Setting Up Your Development Environment

1. Fork the repository
2. Clone your fork: `git clone https://github.com/Kkkermit/Testify-rewrite.git`
3. Navigate to the project directory: `cd Testify-rewrite`
4. Install dependencies: `npm install`
5. Set up your environment file: `npm run setup-env`
6. Create a new branch for your feature: `git checkout -b feature/your-feature-name`

> [!NOTE]
> Running `npm install` will automatically set up Husky git hooks via the `prepare` script. This means the linter will run automatically on every commit.

---

## Project Structure

```
src/
├── commands/
│   ├── SlashCommands/     # Slash command files organised by category
│   └── PrefixCommands/    # Prefix command files organised by category
├── events/                # Discord event handlers
├── functions/             # Core handler functions (commands, events, prefix)
├── lib/                   # Internal libraries (ascii text, version handler)
├── schemas/               # MongoDB schema definitions
├── scripts/               # Runnable utility scripts
└── utils/                 # Shared utilities, helpers and logging
```

---

## Available Scripts

| Script | Command | Description |
|--------|---------|-------------|
| Start | `npm run start` | Start the bot |
| Start (nodemon) | `npm run start:nodemon` | Start the bot with auto-restart on file changes |
| Production | `npm run prod` | Run the bot in production mode |
| Development | `npm run dev` | Run the bot in development mode |
| Lint | `npm run lint` | Run ESLint across all source files and print a full report |
| Lint & Fix | `npm run lint:fix` | Run ESLint and automatically fix any fixable issues |
| Commit | `npm run commit` | Launch the interactive conventional commit runner |
| Setup Env | `npm run setup-env` | Generate your `.env` file interactively |

---

## Making Changes

- Only make necessary changes related to your feature or bug fix
- Follow the existing code style and patterns
- Use meaningful variable and function names
- Add comments where necessary to explain complex logic
- Use `const` and `let` — never `var`
- Always use `===` instead of `==`
- Use template literals instead of string concatenation
- Keep command files within their correct category folder under `SlashCommands` or `PrefixCommands`

### Package.json Etiquette

> [!IMPORTANT]
> Do not modify `package.json` unless:
> - You need to add a new dependency that is required for your feature
> - You need to update a dependency version to fix a critical issue
> - You are adding a new npm script that benefits all contributors

For version bumps, let the maintainers handle version changes in `package.json` as part of the release process.

---

## Linting

This project uses **ESLint** to enforce consistent code quality. The linter is configured in `eslint.config.js` and covers all files under `src/`.

**Before opening a PR, always run:**
```bash
npm run lint
```

If there are fixable issues, you can run:
```bash
npm run lint:fix
```

> [!NOTE]
> Husky is configured to run `npm run lint` automatically as a pre-commit hook. **Your commit will be blocked if there are any lint errors.** Fix all errors before committing.

Key rules enforced:
- No undefined variables (`no-undef`)
- Always use `===` (`eqeqeq`)
- No `var` declarations (`no-var`)
- Prefer `const` where possible (`prefer-const`)
- Use template literals over string concatenation (`prefer-template`)

---

## Committing Your Changes

We use a standardised commit message format to keep our git history clean and informative. Use our interactive commit runner:

```bash
npm run commit
```

This will guide you through creating a properly formatted commit message:
```
type: Concise description of the change
```

Available commit types:

| Type | Description |
|------|-------------|
| `feat` | A new feature |
| `fix` | A bug fix |
| `docs` | Documentation changes |
| `style` | Code style changes (formatting, etc) |
| `refactor` | Code refactoring with no feature changes |
| `perf` | Performance improvements |
| `test` | Adding or updating tests |
| `chore` | Maintenance tasks, dependency updates |
| `add` | Adding new features or files |
| `update` | Updating existing features or files |
| `remove` | Removing features or files |

> [!IMPORTANT]
> Do not use `git commit` directly — always use `npm run commit` to ensure your message follows the correct format.

---

## Pull Request Process

1. Make sure `npm run lint` passes with zero errors before opening a PR
2. Update this `CONTRIBUTING.md` or the `README.md` if your change affects how the project is used
3. Push your changes to your fork: `git push origin feature/your-feature-name`
4. Create a Pull Request from your fork to the main repository
5. In your Pull Request description, include:
   - What changes you've made and why
   - How the changes work
   - Any screenshots for UI or console output changes
   - Any relevant issue numbers (e.g., `Fixes #123`)

---

## Pull Request Requirements

For your PR to be considered:

1. It must focus on a single feature or fix — keep PRs small and focused
2. It must pass `npm run lint` with zero errors
3. It should not include unrelated changes or unnecessary `package.json` modifications
4. The commit history must follow the conventional commit format (`npm run commit`)
5. It must not break existing functionality

---

## Code Review Process

1. A maintainer will review your PR
2. They may request changes or clarifications
3. Once approved, your PR will be merged into the main branch

---

## Additional Guidelines

- **Bug Reports**: Use the Issues tab with the bug report template
- **Feature Requests**: Use the Issues tab with the feature request template
- **Questions**: Join our [Discord server](https://discord.gg/xcMVwAVjSD) for questions rather than opening an issue

Thank you for contributing to Testify!
