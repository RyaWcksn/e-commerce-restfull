import { HttpCode } from "../../constants/const";
import { TransactionEntity } from "../../domain/transaction/entity";
import { TransactionInterface } from "../../domain/transaction/transactionRepository";
import { CustomError } from "../../utils/error/error";
import { Logger } from "../../utils/logger/logger";
import { CreateTransactionRequest, GetAllQueryParam } from "../handler/request";
import { ServiceInterface } from "./serviceRepository";

export class ServiceImpl implements ServiceInterface {
	private transactionRepo: TransactionInterface;
	private log: Logger;
	constructor(transaction: TransactionInterface, logger: Logger) {
		this.transactionRepo = transaction;
		this.log = logger;
	}
	async getAllTransactions(payload: GetAllQueryParam): Promise<TransactionEntity[]> {
		try {
			const transactions = await this.transactionRepo.getAllTransactions(payload);
			this.log.log(transactions);
			return transactions;
		} catch (e) {
			this.log.error(`Error on domain layer : ${e}`)
			const errMsg = new Error(`${e}`)
			const err = new CustomError(errMsg, HttpCode.InternalServerError);
			throw err;
		}
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
