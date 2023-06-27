export class CustomError extends Error {
	public statusCode: number;
	constructor(e: Error, statusCode: number) {
		super(e.message);
		this.statusCode = statusCode;
		Object.setPrototypeOf(this, CustomError.prototype);
	}
}
