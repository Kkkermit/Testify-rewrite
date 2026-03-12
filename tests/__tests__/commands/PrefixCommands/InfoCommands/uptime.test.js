const { createMockMessage, createMockClient } = require('../../../../mocks/discordMocks.js');
const uptimeCommand = require('../../../../../src/commands/PrefixCommands/InfoCommands/uptime.js');

describe('PrefixCommand ?uptime', () => {

    let message;
    let client;

    beforeEach(() => {
        message = createMockMessage({ content: '?uptime' });
        client = createMockClient({ uptime: ((86400 + 7384) * 1000) });
    });

    describe('Command structure', () => {
        test('has a name property', () => {
            expect(uptimeCommand.name).toBe('uptime');
        });

        test('has aliases', () => {
            expect(Array.isArray(uptimeCommand.aliases)).toBe(true);
            expect(uptimeCommand.aliases.length).toBeGreaterThan(0);
        });

        test('has an execute function', () => {
            expect(typeof uptimeCommand.execute).toBe('function');
        });
    });

    describe('Command behavior', () => {
        test('sends a message to the channel', async () => {
            await uptimeCommand.execute(message, client);
            expect(message.channel.send).toHaveBeenCalledTimes(1);
        });

        test('sends an embed', async () => {
            await uptimeCommand.execute(message, client);
            const callArgs = message.channel.send.mock.calls[0][0];
            expect(callArgs.embeds).toBeDefined();
            expect(callArgs.embeds.length).toBeGreaterThan(0);
        });

        test('embed contains uptime field', async () => {
            await uptimeCommand.execute(message, client);
            const embed = message.channel.send.mock.calls[0][0].embeds[0];
            const uptimeField = embed.data.fields.find(f => f.name === 'Uptime');
            expect(uptimeField).toBeDefined();
        });

        test('uptime field contains days, hours, minutes and seconds', async () => {
            await uptimeCommand.execute(message, client);
            const embed = message.channel.send.mock.calls[0][0].embeds[0];
            const uptimeField = embed.data.fields.find(f => f.name === 'Uptime');
            expect(uptimeField.value).toMatch(/\*\*\d+\*\*d/);
            expect(uptimeField.value).toMatch(/\*\*\d+\*\*h/);
            expect(uptimeField.value).toMatch(/\*\*\d+\*\*m/);
            expect(uptimeField.value).toMatch(/\*\*\d+\*\*s/);
        });

        test('calculates uptime correctly from client.uptime', async () => {
            await uptimeCommand.execute(message, client);
            const embed = message.channel.send.mock.calls[0][0].embeds[0];
            const uptimeField = embed.data.fields.find(f => f.name === 'Uptime');
            expect(uptimeField.value).toContain('**1**d');
            expect(uptimeField.value).toContain('**2**h');
        });
    });
});
