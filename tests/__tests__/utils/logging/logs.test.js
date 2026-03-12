const { write, info, warn, error, success, debug, logging, torquise, purple, color, getTimestamp } = require('../../../../src/utils/logging/logs');

describe('logs.js', () => {

    beforeEach(() => {
        jest.spyOn(console, 'log').mockImplementation(() => {});
        jest.spyOn(process.stdout, 'write').mockImplementation(() => {});
    });

    afterEach(() => {
        jest.restoreAllMocks();
    });

    describe('color', () => {
        test('exports a color object', () => {
            expect(typeof color).toBe('object');
        });

        test('contains all expected color keys', () => {
            expect(color).toHaveProperty('red');
            expect(color).toHaveProperty('orange');
            expect(color).toHaveProperty('yellow');
            expect(color).toHaveProperty('green');
            expect(color).toHaveProperty('blue');
            expect(color).toHaveProperty('pink');
            expect(color).toHaveProperty('torquise');
            expect(color).toHaveProperty('purple');
            expect(color).toHaveProperty('reset');
        });

        test('all color values are ANSI escape strings', () => {
            Object.values(color).forEach((val) => {
                expect(val).toMatch(/^\x1b\[/);
            });
        });

        test('reset is the standard ANSI reset code', () => {
            expect(color.reset).toBe('\x1b[0m');
        });
    });

    describe('getTimestamp', () => {
        test('returns a string', () => {
            expect(typeof getTimestamp()).toBe('string');
        });

        test('matches the format YYYY-M-DD HH:MM:SS', () => {
            expect(getTimestamp()).toMatch(/^\d{4}-\d{1,2}-\d{2} \d{2}:\d{2}:\d{2}$/);
        });

        test('reflects the current year', () => {
            expect(getTimestamp()).toContain(String(new Date().getFullYear()));
        });
    });

    describe('write', () => {
        test('calls console.log at least once', () => {
            write('hello');
            expect(console.log).toHaveBeenCalled();
        });

        test('includes the message in the output', () => {
            write('test message', '');
            expect(console.log).toHaveBeenCalledWith(expect.stringContaining('test message'));
        });

        test('includes the prefix in the first line', () => {
            write('hello', 'PREFIX ');
            expect(console.log).toHaveBeenCalledWith(expect.stringContaining('PREFIX'));
        });

        test('calls process.stdout.write with reset when addReset is true', () => {
            write('hello', '', true, true);
            expect(process.stdout.write).toHaveBeenCalledWith(color.reset);
        });

        test('does not call process.stdout.write when addReset is false', () => {
            write('hello', '', true, false);
            expect(process.stdout.write).not.toHaveBeenCalled();
        });
    });

    describe('log level functions', () => {
        const levels = { info, warn, error, success, debug, logging, torquise, purple };

        test.each(Object.entries(levels))('%s calls console.log', (name, fn) => {
            fn('test');
            expect(console.log).toHaveBeenCalled();
        });

        test.each(Object.entries(levels))('%s includes a timestamp in output', (name, fn) => {
            fn('test');
            const output = console.log.mock.calls[0][0];
            expect(output).toMatch(/\d{4}-\d{1,2}-\d{2} \d{2}:\d{2}:\d{2}/);
        });

        test('error calls process.stdout.write with reset', () => {
            error('something went wrong');
            expect(process.stdout.write).toHaveBeenCalledWith(color.reset);
        });

        test('info does not call process.stdout.write', () => {
            info('hello');
            expect(process.stdout.write).not.toHaveBeenCalled();
        });
    });
});
