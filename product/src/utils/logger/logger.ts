export enum LogLevel {
	INFO,
	WARNING,
	ERROR,
}

export class Logger {
	private static instance: Logger;
	private logLevel: LogLevel;

	private constructor() {
		this.logLevel = LogLevel.INFO;
	}

	static getInstance(): Logger {
		if (!Logger.instance) {
			Logger.instance = new Logger();
		}
		return Logger.instance;
	}

	setLogLevel(level: LogLevel): void {
		this.logLevel = level;
	}

	log(message: any, level: LogLevel = LogLevel.INFO): void {
		if (level >= this.logLevel) {
			const logLevelString = this.getLogLevelString(level);
			console.log(`[${logLevelString}] ${message}`);
		}
	}

	error(message: string): void {
		const logLevelString = this.getLogLevelString(LogLevel.ERROR);
		console.error(`[${logLevelString}] ${message}`);
	}

	private getLogLevelString(level: LogLevel): string {
		switch (level) {
			case LogLevel.INFO:
				return 'INFO';
			case LogLevel.WARNING:
				return 'WARNING';
			case LogLevel.ERROR:
				return 'ERROR';
			default:
				return '';
		}
	}
}
