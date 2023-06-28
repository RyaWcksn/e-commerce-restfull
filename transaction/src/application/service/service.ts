import { HttpCode } from "../../constants/const";
import { TransactionEntity } from "../../domain/transaction/entity";
import { TransactionInterface } from "../../domain/transaction/transactionRepository";
import { CustomError } from "../../utils/error/error";
import { Logger } from "../../utils/logger/logger";
import { JsonRequest, ParamRequest, QueryParamRequest } from "../handler/request";
import { ServiceInterface } from "./serviceRepository";

export class ServiceImpl implements ServiceInterface {
	private transactionRepo: TransactionInterface;
	private log: Logger;
	constructor(transaction: TransactionInterface, logger: Logger) {
		this.transactionRepo = transaction;
		this.log = logger;
	}
	async deleteTransaction(payload: ParamRequest): Promise<void> {
		try {
			await this.transactionRepo.deleteTransaction(payload);
		} catch (e) {
			this.log.error(`Error on domain layer : ${e}`);
			const errMsg = new Error(`${e}`)
			const err = new CustomError(errMsg, HttpCode.InternalServerError);
			throw err;
		}
	}
	async getAllTransactions(payload: QueryParamRequest): Promise<TransactionEntity[]> {
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
	async createTransaction(payload: JsonRequest): Promise<void> {
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
