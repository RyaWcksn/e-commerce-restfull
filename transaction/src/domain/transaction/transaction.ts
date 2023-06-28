import { Client } from "pg";
import { TransactionInterface } from "./transactionRepository";
import { CreateTransactionRequest } from "../../application/handler/request";

export class TransactionImpl implements TransactionInterface {
	private pgConn: Client;
	constructor(conn: Client) {
		this.pgConn = conn;
	}
	createTransaction(payload: CreateTransactionRequest): Promise<void> {
		throw new Error("Method not implemented.");
	}
	async checkStock(sku: string): Promise<Number> {
		return 0;
	}
}
