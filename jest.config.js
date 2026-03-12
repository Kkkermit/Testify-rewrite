module.exports = {
    testEnvironment: 'node',
    testMatch: ['**/tests/**/*.test.js'],
    moduleNameMapper: {
        '^@utils$': '<rootDir>/src/utils',
        '^@config$': '<rootDir>/src/config.js',
        '^@commands$': '<rootDir>/src/commands',
        '^@events$': '<rootDir>/src/events',
        '^@functions$': '<rootDir>/src/functions',
        '^@schemas$': '<rootDir>/src/schemas',
        '^@lib$': '<rootDir>/src/lib',
        '^@src$': '<rootDir>/src',
        '^@root$': '<rootDir>',
    },
    setupFilesAfterEnv: ['<rootDir>/tests/setup/schemaSetup.js'],
    clearMocks: true,
    verbose: true,
};
