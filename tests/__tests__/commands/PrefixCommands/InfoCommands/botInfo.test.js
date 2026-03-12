jest.mock('../../../../../src/schemas', () => ({
    prefixSystem: {
        findOne: jest.fn().mockResolvedValue(null),
    },
}));

const botInfo = require('../../../../../src/commands/PrefixCommands/InfoCommands/botInfo');
const { createMockMessage, createMockClient } = require('../../../../mocks/discordMocks');

describe('PrefixCommand ?bot-info', () => {

    let client;
    let message;
    let collector;
    let sentMessage;

    beforeEach(() => {
        collector = {
            on: jest.fn(),
        };

        sentMessage = {
            createMessageComponentCollector: jest.fn().mockReturnValue(collector),
        };

        message = createMockMessage({
            reply: jest.fn().mockResolvedValue(sentMessage),
        });

        client = createMockClient();
    });

    describe('command structure', () => {
        test('has a name property', () => {
            expect(botInfo.name).toBe('bot-info');
        });

        test('has aliases', () => {
            expect(Array.isArray(botInfo.aliases)).toBe(true);
            expect(botInfo.aliases).toContain('bi');
            expect(botInfo.aliases).toContain('botinfo');
        });

        test('has an execute function', () => {
            expect(typeof botInfo.execute).toBe('function');
        });
    });

    describe('command behaviour', () => {
        test('calls message.reply once', async () => {
            await botInfo.execute(message, client);
            expect(message.reply).toHaveBeenCalledTimes(1);
        });

        test('reply includes an embed', async () => {
            await botInfo.execute(message, client);
            const [payload] = message.reply.mock.calls[0];
            expect(payload.embeds).toHaveLength(1);
        });

        test('reply includes the refresh action row component', async () => {
            await botInfo.execute(message, client);
            const [payload] = message.reply.mock.calls[0];
            expect(payload.components).toHaveLength(1);
        });

        test('starts a message component collector', async () => {
            await botInfo.execute(message, client);
            expect(sentMessage.createMessageComponentCollector).toHaveBeenCalledTimes(1);
        });

        test('registers a collect handler on the collector', async () => {
            await botInfo.execute(message, client);
            expect(collector.on).toHaveBeenCalledWith('collect', expect.any(Function));
        });
    });

    describe('embed content', () => {
        let embed;

        beforeEach(async () => {
            await botInfo.execute(message, client);
            embed = message.reply.mock.calls[0][0].embeds[0];
        });

        test('embed title includes the bot username', () => {
            expect(embed.data.title).toContain(client.user.username);
        });

        test('embed title includes "Bot Information"', () => {
            expect(embed.data.title).toContain('Bot Information');
        });

        test('embed author includes devBy from config', () => {
            expect(embed.data.author.name).toContain(client.config.devBy);
        });

        test('embed footer mentions the bot username', () => {
            expect(embed.data.footer.text).toContain(client.user.username);
        });

        test('embed contains a Developer field', () => {
            const field = embed.data.fields.find(f => f.name === 'Developer');
            expect(field).toBeDefined();
        });

        test('embed contains a Version field', () => {
            const field = embed.data.fields.find(f => f.name === 'Version');
            expect(field).toBeDefined();
            expect(field.value).toContain(client.config.botVersion);
        });

        test('embed contains a Servers field', () => {
            const field = embed.data.fields.find(f => f.name === 'Servers');
            expect(field).toBeDefined();
        });

        test('embed contains a Members field', () => {
            const field = embed.data.fields.find(f => f.name === 'Members');
            expect(field).toBeDefined();
        });

        test('embed contains a Prefix field with the correct prefix', () => {
            const field = embed.data.fields.find(f => f.name === 'Prefix');
            expect(field).toBeDefined();
            expect(field.value).toContain(client.config.defaultPrefix);
        });

        test('embed contains a Latency field', () => {
            const field = embed.data.fields.find(f => f.name === 'Latency');
            expect(field).toBeDefined();
            expect(field.value).toContain('ms');
        });

        test('embed contains an Uptime field', () => {
            const field = embed.data.fields.find(f => f.name === 'Uptime');
            expect(field).toBeDefined();
        });

        test('embed contains all 10 expected fields', () => {
            expect(embed.data.fields).toHaveLength(10);
        });
    });

    describe('refresh button', () => {
        let collectHandler;

        beforeEach(async () => {
            await botInfo.execute(message, client);
            collectHandler = collector.on.mock.calls[0][1];
        });

        test('calls interaction.update when refresh button is pressed', async () => {
            const interaction = {
                customId: 'refresh',
                update: jest.fn().mockResolvedValue({}),
            };
            await collectHandler(interaction);
            expect(interaction.update).toHaveBeenCalledTimes(1);
        });

        test('refresh update includes a new embed', async () => {
            const interaction = {
                customId: 'refresh',
                update: jest.fn().mockResolvedValue({}),
            };
            await collectHandler(interaction);
            const [payload] = interaction.update.mock.calls[0];
            expect(payload.embeds).toHaveLength(1);
        });

        test('refresh update includes the action row component', async () => {
            const interaction = {
                customId: 'refresh',
                update: jest.fn().mockResolvedValue({}),
            };
            await collectHandler(interaction);
            const [payload] = interaction.update.mock.calls[0];
            expect(payload.components).toHaveLength(1);
        });

        test('does not call interaction.update for non-refresh custom IDs', async () => {
            const interaction = {
                customId: 'something-else',
                update: jest.fn().mockResolvedValue({}),
            };
            await collectHandler(interaction);
            expect(interaction.update).not.toHaveBeenCalled();
        });

        test('calls client.logs.error if interaction.update throws', async () => {
            const interaction = {
                customId: 'refresh',
                update: jest.fn().mockRejectedValue(new Error('update failed')),
            };
            await collectHandler(interaction);
            expect(client.logs.error).toHaveBeenCalled();
        });
    });
});
