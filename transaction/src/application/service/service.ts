import { HttpCode } from "../../constants/const";
import { TransactionInterface } from "../../domain/transaction/transactionRepository";
import { CustomError } from "../../utils/error/error";
import { Logger } from "../../utils/logger/logger";
import { CreateTransactionRequest } from "../handler/request";
import { ServiceInterface } from "./serviceRepository";

export class ServiceImpl implements ServiceInterface {
	private transactionRepo: TransactionInterface;
	private log: Logger;
	constructor(transaction: TransactionInterface, logger: Logger) {
		this.transactionRepo = transaction;
		this.log = logger;
	}
	async createTransaction(payload: CreateTransactionRequest): Promise<void> {
		try {
			await this.transactionRepo.createTransaction(payload);
		} catch (e) {
			this.log.error(`Error on domain layer : ${e}`)
			const errMsg = new Error(`${e}`)
			const err = new CustomError(errMsg, HttpCode.InternalServerError);
			throw err;
		}
	}
}
