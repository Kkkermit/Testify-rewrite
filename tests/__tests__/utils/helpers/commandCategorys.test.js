const { SlashCategory, PrefixCategory } = require('../../../../src/utils/helpers/commandCategorys');

describe('SlashCategory', () => {

    describe('exports', () => {
        test('is defined', () => {
            expect(SlashCategory).toBeDefined();
        });

        test('is an object', () => {
            expect(typeof SlashCategory).toBe('object');
        });

        test('is frozen', () => {
            expect(Object.isFrozen(SlashCategory)).toBe(true);
        });

        test('cannot be mutated', () => {
            SlashCategory.NEW_KEY = 'test';
            expect(SlashCategory.NEW_KEY).toBeUndefined();
        });
    });

    describe('keys', () => {
        test('contains all expected keys', () => {
            expect(SlashCategory).toHaveProperty('AI');
            expect(SlashCategory).toHaveProperty('AUTOMOD');
            expect(SlashCategory).toHaveProperty('COMMUNITY');
            expect(SlashCategory).toHaveProperty('DEVS');
            expect(SlashCategory).toHaveProperty('ECONOMY');
            expect(SlashCategory).toHaveProperty('FUN');
            expect(SlashCategory).toHaveProperty('GIVEAWAY');
            expect(SlashCategory).toHaveProperty('HELP');
            expect(SlashCategory).toHaveProperty('INFO');
            expect(SlashCategory).toHaveProperty('LEVEL_AND_ECONOMY');
            expect(SlashCategory).toHaveProperty('LEVEL_SYSTEM');
            expect(SlashCategory).toHaveProperty('MINI_GAMES');
            expect(SlashCategory).toHaveProperty('MISC');
            expect(SlashCategory).toHaveProperty('OWNER');
            expect(SlashCategory).toHaveProperty('PREFIX_SETTINGS');
        });

        test('has no unexpected extra keys', () => {
            const expectedKeys = [
                'AI', 'AUTOMOD', 'COMMUNITY', 'DEVS', 'ECONOMY', 'FUN',
                'GIVEAWAY', 'HELP', 'INFO', 'LEVEL_AND_ECONOMY', 'LEVEL_SYSTEM',
                'MINI_GAMES', 'MISC', 'OWNER', 'PREFIX_SETTINGS',
            ];
            expect(Object.keys(SlashCategory)).toEqual(expectedKeys);
        });
    });

    describe('values', () => {
        test('AI resolves to "AiCommands"', () => {
            expect(SlashCategory.AI).toBe('AiCommands');
        });

        test('AUTOMOD resolves to "Automod"', () => {
            expect(SlashCategory.AUTOMOD).toBe('Automod');
        });

        test('COMMUNITY resolves to "Community"', () => {
            expect(SlashCategory.COMMUNITY).toBe('Community');
        });

        test('DEVS resolves to "Devs"', () => {
            expect(SlashCategory.DEVS).toBe('Devs');
        });

        test('ECONOMY resolves to "Economy"', () => {
            expect(SlashCategory.ECONOMY).toBe('Economy');
        });

        test('FUN resolves to "Fun"', () => {
            expect(SlashCategory.FUN).toBe('Fun');
        });

        test('GIVEAWAY resolves to "Giveaway"', () => {
            expect(SlashCategory.GIVEAWAY).toBe('Giveaway');
        });

        test('HELP resolves to "Help"', () => {
            expect(SlashCategory.HELP).toBe('Help');
        });

        test('INFO resolves to "InfoCommands"', () => {
            expect(SlashCategory.INFO).toBe('InfoCommands');
        });

        test('LEVEL_AND_ECONOMY resolves to "LevelAndEconomy"', () => {
            expect(SlashCategory.LEVEL_AND_ECONOMY).toBe('LevelAndEconomy');
        });

        test('LEVEL_SYSTEM resolves to "LevelSystem"', () => {
            expect(SlashCategory.LEVEL_SYSTEM).toBe('LevelSystem');
        });

        test('MINI_GAMES resolves to "MiniGames"', () => {
            expect(SlashCategory.MINI_GAMES).toBe('MiniGames');
        });

        test('MISC resolves to "Misc"', () => {
            expect(SlashCategory.MISC).toBe('Misc');
        });

        test('OWNER resolves to "Owner"', () => {
            expect(SlashCategory.OWNER).toBe('Owner');
        });

        test('PREFIX_SETTINGS resolves to "PrefixSettings"', () => {
            expect(SlashCategory.PREFIX_SETTINGS).toBe('PrefixSettings');
        });

        test('all values are non-empty strings', () => {
            Object.values(SlashCategory).forEach(value => {
                expect(typeof value).toBe('string');
                expect(value.length).toBeGreaterThan(0);
            });
        });

        test('has no duplicate values', () => {
            const values = Object.values(SlashCategory);
            const unique = new Set(values);
            expect(unique.size).toBe(values.length);
        });
    });
});

describe('PrefixCategory', () => {

    describe('exports', () => {
        test('is defined', () => {
            expect(PrefixCategory).toBeDefined();
        });

        test('is an object', () => {
            expect(typeof PrefixCategory).toBe('object');
        });

        test('is frozen', () => {
            expect(Object.isFrozen(PrefixCategory)).toBe(true);
        });

        test('cannot be mutated', () => {
            PrefixCategory.NEW_KEY = 'test';
            expect(PrefixCategory.NEW_KEY).toBeUndefined();
        });
    });

    describe('keys', () => {
        test('contains all expected keys', () => {
            expect(PrefixCategory).toHaveProperty('DEV');
            expect(PrefixCategory).toHaveProperty('ECONOMY');
            expect(PrefixCategory).toHaveProperty('FUN');
            expect(PrefixCategory).toHaveProperty('INFO');
            expect(PrefixCategory).toHaveProperty('LEVEL');
            expect(PrefixCategory).toHaveProperty('MODERATION');
            expect(PrefixCategory).toHaveProperty('MUSIC');
            expect(PrefixCategory).toHaveProperty('OWNER');
            expect(PrefixCategory).toHaveProperty('TEST');
            expect(PrefixCategory).toHaveProperty('UTILITY');
            expect(PrefixCategory).toHaveProperty('COMMUNITY');
            expect(PrefixCategory).toHaveProperty('OTHER');
        });

        test('has no unexpected extra keys', () => {
            const expectedKeys = [
                'DEV', 'ECONOMY', 'FUN', 'INFO', 'LEVEL', 'MODERATION',
                'MUSIC', 'OWNER', 'TEST', 'UTILITY', 'COMMUNITY', 'OTHER',
            ];
            expect(Object.keys(PrefixCategory)).toEqual(expectedKeys);
        });
    });

    describe('values', () => {
        test('DEV resolves to "Dev"', () => {
            expect(PrefixCategory.DEV).toBe('Dev');
        });

        test('ECONOMY resolves to "EconomyCommands"', () => {
            expect(PrefixCategory.ECONOMY).toBe('EconomyCommands');
        });

        test('FUN resolves to "FunCommands"', () => {
            expect(PrefixCategory.FUN).toBe('FunCommands');
        });

        test('INFO resolves to "InfoCommands"', () => {
            expect(PrefixCategory.INFO).toBe('InfoCommands');
        });

        test('LEVEL resolves to "LevelCommands"', () => {
            expect(PrefixCategory.LEVEL).toBe('LevelCommands');
        });

        test('MODERATION resolves to "ModerationCommands"', () => {
            expect(PrefixCategory.MODERATION).toBe('ModerationCommands');
        });

        test('MUSIC resolves to "Music"', () => {
            expect(PrefixCategory.MUSIC).toBe('Music');
        });

        test('OWNER resolves to "OwnerCommands"', () => {
            expect(PrefixCategory.OWNER).toBe('OwnerCommands');
        });

        test('TEST resolves to "TestCommands"', () => {
            expect(PrefixCategory.TEST).toBe('TestCommands');
        });

        test('UTILITY resolves to "UtilityCommands"', () => {
            expect(PrefixCategory.UTILITY).toBe('UtilityCommands');
        });

        test('COMMUNITY resolves to "Community"', () => {
            expect(PrefixCategory.COMMUNITY).toBe('Community');
        });

        test('OTHER resolves to "Other"', () => {
            expect(PrefixCategory.OTHER).toBe('Other');
        });

        test('all values are non-empty strings', () => {
            Object.values(PrefixCategory).forEach(value => {
                expect(typeof value).toBe('string');
                expect(value.length).toBeGreaterThan(0);
            });
        });

        test('has no duplicate values', () => {
            const values = Object.values(PrefixCategory);
            const unique = new Set(values);
            expect(unique.size).toBe(values.length);
        });
    });
});
