const { createMockMessage, createMockClient } = require('../../mocks/discordMocks');
const helpCommand = require('../../../src/commands/PrefixCommands/Community/help.js');

describe('PrefixCommand ?help', () => {

    let message;
    let client;

    beforeEach(() => {
        message = createMockMessage({ content: '?help' });
        client = createMockClient({
            pcommands: {
                size: 8,
                map: jest.fn().mockReturnValue(['> ping', '> help', '> uptime']),
            },
        });
    });

    describe('Command structure', () => {
        test('has a name property', () => {
            expect(helpCommand.name).toBe('help');
        });

        test('has aliases', () => {
            expect(Array.isArray(helpCommand.aliases)).toBe(true);
            expect(helpCommand.aliases.length).toBeGreaterThan(0);
        });

        test('has an execute function', () => {
            expect(typeof helpCommand.execute).toBe('function');
        });
    });

    describe('Command behavior', () => {
        test('sends a message to the channel', async () => {
            await helpCommand.execute(message, client);
            expect(message.channel.send).toHaveBeenCalledTimes(1);
        });

        test('sends an embed', async () => {
            await helpCommand.execute(message, client);
            const callArgs = message.channel.send.mock.calls[0][0];
            expect(callArgs.embeds).toBeDefined();
            expect(callArgs.embeds.length).toBeGreaterThan(0);
        });

        test('embed title includes the bot username', async () => {
            await helpCommand.execute(message, client);
            const embed = message.channel.send.mock.calls[0][0].embeds[0];
            expect(embed.data.title).toContain(client.user.username);
        });
    });
});
