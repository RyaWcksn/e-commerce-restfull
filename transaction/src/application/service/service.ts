import { TransactionInterface } from "../../domain/transaction/transactionRepository";
import { CreateTransactionRequest } from "../handler/request";
import { ServiceInterface } from "./serviceRepository";

export class ServiceImpl implements ServiceInterface {
	private transactionRepo: TransactionInterface;
	constructor(transaction: TransactionInterface) {
		this.transactionRepo = transaction;
	}
	createTransaction(payload: CreateTransactionRequest): Promise<void> {
		throw new Error("Method not implemented.");
	}
}
