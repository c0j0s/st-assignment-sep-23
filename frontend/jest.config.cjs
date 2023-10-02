module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'jsdom',
    moduleFileExtensions: ['js', 'ts', 'svelte'],
    transform: {
        '^.+\\.svelte$': 'svelte-jester',
        '^.+\\.ts$': 'ts-jest',
    },
    testPathIgnorePatterns: ['data.test.ts'],
};