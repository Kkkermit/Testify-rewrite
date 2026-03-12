const { getBotStats } = require('../../../../src/utils/helpers/botStats');
const config = require('../../../../src/config');
const { createMockClient } = require('../../../mocks/discordMocks');

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
    });

    describe('return shape', () => {
        test('returns an object', () => {
            expect(typeof getBotStats(client)).toBe('object');
        });

        test('returns all expected keys', () => {
            const stats = getBotStats(client);
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
        test('username comes from client.user.username', () => {
            expect(getBotStats(client).username).toBe(client.user.username);
        });

        test('version comes from config.botVersion', () => {
            expect(getBotStats(client).version).toBe(config.botVersion);
        });

        test('prefix comes from config.prefix', () => {
            expect(getBotStats(client).prefix).toBe(config.prefix);
        });

        test('developer comes from config.dev', () => {
            expect(getBotStats(client).developer).toBe(config.dev);
        });
    });

    describe('ping', () => {
        test('rounds the ping value', () => {
            expect(getBotStats(client).ping).toBe(43);
        });

        test('ping is a number', () => {
            expect(typeof getBotStats(client).ping).toBe('number');
        });
    });

    describe('uptime', () => {
        test('formats uptime as bold days, hours, minutes, seconds', () => {
            const { uptime } = getBotStats(client);
            expect(uptime).toContain('**1**d');
            expect(uptime).toContain('**2**h');
        });

        test('uptime string matches the expected bold format', () => {
            expect(getBotStats(client).uptime).toMatch(/\*\*\d+\*\*d \*\*\d+\*\*h \*\*\d+\*\*m \*\*\d+\*\*s/);
        });

        test('uptimeRaw is the raw client.uptime value', () => {
            expect(getBotStats(client).uptimeRaw).toBe(client.uptime);
        });

        test('returns "**0**d **0**h **0**m **0**s" when client.uptime is 0', () => {
            client.uptime = 0;
            expect(getBotStats(client).uptime).toBe('**0**d **0**h **0**m **0**s');
        });

        test('returns "**0**d **0**h **0**m **0**s" when client.uptime is undefined', () => {
            client.uptime = undefined;
            expect(getBotStats(client).uptime).toBe('**0**d **0**h **0**m **0**s');
        });
    });

    describe('guild stats', () => {
        test('serverCount comes from guilds.cache.size', () => {
            expect(getBotStats(client).serverCount).toBe(3);
        });

        test('memberCount comes from guilds.cache.reduce', () => {
            expect(getBotStats(client).memberCount).toBe(75);
        });
    });

    describe('command counts', () => {
        test('slashCommandCount comes from client.commands.size', () => {
            expect(getBotStats(client).slashCommandCount).toBe(10);
        });

        test('prefixCommandCount comes from client.pcommands.size', () => {
            expect(getBotStats(client).prefixCommandCount).toBe(8);
        });

        test('aliasCount comes from client.aliases.size', () => {
            expect(getBotStats(client).aliasCount).toBe(4);
        });

        test('defaults to 0 when commands is undefined', () => {
            client.commands = undefined;
            expect(getBotStats(client).slashCommandCount).toBe(0);
        });

        test('defaults to 0 when pcommands is undefined', () => {
            client.pcommands = undefined;
            expect(getBotStats(client).prefixCommandCount).toBe(0);
        });

        test('defaults to 0 when aliases is undefined', () => {
            client.aliases = undefined;
            expect(getBotStats(client).aliasCount).toBe(0);
        });
    });
});
