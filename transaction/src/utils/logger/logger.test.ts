import { LogLevel, Logger } from './logger';

describe('Logger', () => {
	let logger: Logger;

	beforeEach(() => {
		logger = Logger.getInstance();
		logger.setLogLevel(LogLevel.INFO);
	});

	afterEach(() => {
		// Reset the logger after each test
		logger.setLogLevel(LogLevel.INFO);
	});

	it('should log messages with the correct log level', () => {
		const consoleSpy = jest.spyOn(console, 'log').mockImplementation();

		logger.log('This is an info message');
		logger.log('This is a warning message', LogLevel.WARNING);
		logger.error('This is an error message');

		expect(consoleSpy).toHaveBeenCalledTimes(2);
		expect(consoleSpy).toHaveBeenNthCalledWith(1, '[INFO] This is an info message');
		expect(consoleSpy).toHaveBeenNthCalledWith(2, '[WARNING] This is a warning message');
	});

	it('should not log messages below the log level', () => {
		const consoleSpy = jest.spyOn(console, 'log').mockImplementation();

		logger.setLogLevel(LogLevel.WARNING);

		logger.log('This is an info message');
		logger.log('This is a warning message', LogLevel.WARNING);

		expect(consoleSpy).toHaveBeenCalledTimes(3);
		expect(consoleSpy).toHaveBeenCalledWith('[INFO] This is an info message');
		expect(consoleSpy).toHaveBeenCalledWith('[WARNING] This is a warning message');
	});

	it('should log error messages to the error console', () => {
		const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();

		logger.error('This is an error message');

		expect(consoleErrorSpy).toHaveBeenCalledTimes(1);
		expect(consoleErrorSpy).toHaveBeenCalledWith('[ERROR] This is an error message');
	});
});
