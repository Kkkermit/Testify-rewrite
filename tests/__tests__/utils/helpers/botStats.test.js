const { getBotStats } = require('../../../../src/utils/helpers/botStats');
const config = require('../../../../src/config');
const { createMockClient } = require('../../../mocks/discordMocks');

jest.mock('../../../../src/utils/helpers/getGuildPrefix', () => ({
    getGuildPrefix: jest.fn(),
}));

const { getGuildPrefix } = require('../../../../src/utils/helpers/getGuildPrefix');

describe('getBotStats', () => {

    let client;

    beforeEach(() => {
        client = createMockClient({
            // 1 day, 2 hours, 3 minutes, 4 seconds in ms
            uptime: ((86400 + 7384) * 1000),
            ws: { ping: 42.6 },
            guilds: {
                cache: {
                    size: 3,
                    reduce: jest.fn().mockReturnValue(75),
                },
            },
            commands:  { size: 10 },
            pcommands: { size: 8 },
            aliases:   { size: 4 },
        });

        getGuildPrefix.mockResolvedValue(config.defaultPrefix);
    });

    afterEach(() => jest.clearAllMocks());

    describe('return shape', () => {
        test('returns an object', async () => {
            expect(typeof await getBotStats(client)).toBe('object');
        });

        test('returns all expected keys', async () => {
            const stats = await getBotStats(client);
            expect(stats).toHaveProperty('username');
            expect(stats).toHaveProperty('version');
            expect(stats).toHaveProperty('prefix');
            expect(stats).toHaveProperty('ping');
            expect(stats).toHaveProperty('uptime');
            expect(stats).toHaveProperty('uptimeRaw');
            expect(stats).toHaveProperty('serverCount');
            expect(stats).toHaveProperty('memberCount');
            expect(stats).toHaveProperty('slashCommandCount');
            expect(stats).toHaveProperty('prefixCommandCount');
            expect(stats).toHaveProperty('aliasCount');
            expect(stats).toHaveProperty('developer');
        });
    });

    describe('static config values', () => {
        test('username comes from client.user.username', async () => {
            expect((await getBotStats(client)).username).toBe(client.user.username);
        });

        test('version comes from config.botVersion', async () => {
            expect((await getBotStats(client)).version).toBe(config.botVersion);
        });

        test('prefix comes from config.defaultPrefix', async () => {
            expect((await getBotStats(client)).prefix).toBe(config.defaultPrefix);
        });

        test('developer comes from config.dev', async () => {
            expect((await getBotStats(client)).developer).toBe(config.dev);
        });
    });

    describe('prefix', () => {
        test('falls back to config.defaultPrefix when no guildId provided', async () => {
            expect((await getBotStats(client)).prefix).toBe(config.defaultPrefix);
        });

        test('falls back to config.defaultPrefix when no db record exists', async () => {
            getGuildPrefix.mockResolvedValue(config.defaultPrefix);
            expect((await getBotStats(client, '123')).prefix).toBe(config.defaultPrefix);
        });

        test('falls back to config.defaultPrefix when prefix system is disabled', async () => {
            getGuildPrefix.mockResolvedValue(config.defaultPrefix);
            expect((await getBotStats(client, '123')).prefix).toBe(config.defaultPrefix);
        });

        test('uses custom prefix when prefix system is enabled', async () => {
            getGuildPrefix.mockResolvedValue('!');
            expect((await getBotStats(client, '123')).prefix).toBe('!');
        });

        test('does not query the database when no guildId is passed', async () => {
            await getBotStats(client);
            expect(getGuildPrefix).toHaveBeenCalledWith(null);
        });
    });

    describe('ping', () => {
        test('rounds the ping value', async () => {
            expect((await getBotStats(client)).ping).toBe(43);
        });

        test('ping is a number', async () => {
            expect(typeof (await getBotStats(client)).ping).toBe('number');
        });
    });

    describe('uptime', () => {
        test('formats uptime as bold days, hours, minutes, seconds', async () => {
            const { uptime } = await getBotStats(client);
            expect(uptime).toContain('**1**d');
            expect(uptime).toContain('**2**h');
        });

        test('uptime string matches the expected bold format', async () => {
            expect((await getBotStats(client)).uptime).toMatch(/\*\*\d+\*\*d \*\*\d+\*\*h \*\*\d+\*\*m \*\*\d+\*\*s/);
        });

        test('uptimeRaw is the raw client.uptime value', async () => {
            expect((await getBotStats(client)).uptimeRaw).toBe(client.uptime);
        });

        test('returns "**0**d **0**h **0**m **0**s" when client.uptime is 0', async () => {
            client.uptime = 0;
            expect((await getBotStats(client)).uptime).toBe('**0**d **0**h **0**m **0**s');
        });

        test('returns "**0**d **0**h **0**m **0**s" when client.uptime is undefined', async () => {
            client.uptime = undefined;
            expect((await getBotStats(client)).uptime).toBe('**0**d **0**h **0**m **0**s');
        });
    });

    describe('guild stats', () => {
        test('serverCount comes from guilds.cache.size', async () => {
            expect((await getBotStats(client)).serverCount).toBe(3);
        });

        test('memberCount comes from guilds.cache.reduce', async () => {
            expect((await getBotStats(client)).memberCount).toBe(75);
        });
    });

    describe('command counts', () => {
        test('slashCommandCount comes from client.commands.size', async () => {
            expect((await getBotStats(client)).slashCommandCount).toBe(10);
        });

        test('prefixCommandCount comes from client.pcommands.size', async () => {
            expect((await getBotStats(client)).prefixCommandCount).toBe(8);
        });

        test('aliasCount comes from client.aliases.size', async () => {
            expect((await getBotStats(client)).aliasCount).toBe(4);
        });

        test('defaults to 0 when commands is undefined', async () => {
            client.commands = undefined;
            expect((await getBotStats(client)).slashCommandCount).toBe(0);
        });

        test('defaults to 0 when pcommands is undefined', async () => {
            client.pcommands = undefined;
            expect((await getBotStats(client)).prefixCommandCount).toBe(0);
        });

        test('defaults to 0 when aliases is undefined', async () => {
            client.aliases = undefined;
            expect((await getBotStats(client)).aliasCount).toBe(0);
        });
    });
});
