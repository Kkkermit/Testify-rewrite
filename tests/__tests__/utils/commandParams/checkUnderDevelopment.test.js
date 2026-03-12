const { checkUnderDevelopment, checkMessageUnderDevelopment } = require('../../../../src/utils/commandParams/checkUnderDevelopment');
const { createMockInteraction, createMockMessage } = require('../../../mocks/discordMocks');

describe('checkUnderDevelopment', () => {

    let command;

    beforeEach(() => {
        command = { data: { name: 'test' }, underDevelopment: false };
    });

    describe('command not under development', () => {
        test('returns true when underDevelopment is false', () => {
            const interaction = createMockInteraction();
            expect(checkUnderDevelopment(command, interaction)).toBe(true);
        });

        test('returns true when underDevelopment is undefined', () => {
            delete command.underDevelopment;
            const interaction = createMockInteraction();
            expect(checkUnderDevelopment(command, interaction)).toBe(true);
        });

        test('does not call interaction.reply when not under development', () => {
            const interaction = createMockInteraction();
            checkUnderDevelopment(command, interaction);
            expect(interaction.reply).not.toHaveBeenCalled();
        });
    });

    describe('command under development', () => {
        beforeEach(() => {
            command.underDevelopment = true;
        });

        test('returns false when underDevelopment is true', () => {
            const interaction = createMockInteraction();
            expect(checkUnderDevelopment(command, interaction)).toBe(false);
        });

        test('calls interaction.reply when under development', () => {
            const interaction = createMockInteraction();
            checkUnderDevelopment(command, interaction);
            expect(interaction.reply).toHaveBeenCalledTimes(1);
        });

        test('reply is ephemeral', () => {
            const interaction = createMockInteraction();
            checkUnderDevelopment(command, interaction);
            const replyArg = interaction.reply.mock.calls[0][0];
            expect(replyArg.flags).toBeDefined();
        });

        test('reply content includes the command name', () => {
            const interaction = createMockInteraction();
            checkUnderDevelopment(command, interaction);
            const replyArg = interaction.reply.mock.calls[0][0];
            expect(replyArg.content).toContain('test');
        });

        test('reply content includes "under development"', () => {
            const interaction = createMockInteraction();
            checkUnderDevelopment(command, interaction);
            const replyArg = interaction.reply.mock.calls[0][0];
            expect(replyArg.content).toContain('under development');
        });

        test('reply content tells user to try again later', () => {
            const interaction = createMockInteraction();
            checkUnderDevelopment(command, interaction);
            const replyArg = interaction.reply.mock.calls[0][0];
            expect(replyArg.content).toContain('try again later');
        });
    });
});

describe('checkMessageUnderDevelopment', () => {

    let command;

    beforeEach(() => {
        command = { name: 'test', underDevelopment: false };
    });

    describe('command not under development', () => {
        test('returns true when underDevelopment is false', () => {
            const message = createMockMessage();
            expect(checkMessageUnderDevelopment(command, message)).toBe(true);
        });

        test('returns true when underDevelopment is undefined', () => {
            delete command.underDevelopment;
            const message = createMockMessage();
            expect(checkMessageUnderDevelopment(command, message)).toBe(true);
        });

        test('does not call message.reply when not under development', () => {
            const message = createMockMessage();
            checkMessageUnderDevelopment(command, message);
            expect(message.reply).not.toHaveBeenCalled();
        });
    });

    describe('command under development', () => {
        beforeEach(() => {
            command.underDevelopment = true;
        });

        test('returns false when underDevelopment is true', () => {
            const message = createMockMessage();
            expect(checkMessageUnderDevelopment(command, message)).toBe(false);
        });

        test('calls message.reply when under development', () => {
            const message = createMockMessage();
            checkMessageUnderDevelopment(command, message);
            expect(message.reply).toHaveBeenCalledTimes(1);
        });

        test('reply content includes the command name', () => {
            const message = createMockMessage();
            checkMessageUnderDevelopment(command, message);
            expect(message.reply.mock.calls[0][0]).toContain('test');
        });

        test('reply content includes "under development"', () => {
            const message = createMockMessage();
            checkMessageUnderDevelopment(command, message);
            expect(message.reply.mock.calls[0][0]).toContain('under development');
        });

        test('reply content tells user to try again later', () => {
            const message = createMockMessage();
            checkMessageUnderDevelopment(command, message);
            expect(message.reply.mock.calls[0][0]).toContain('try again later');
        });
    });
});
