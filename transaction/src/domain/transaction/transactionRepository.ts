import { CreateTransactionRequest } from "../../application/handler/request";

export interface TransactionInterface {
	createTransaction(payload: CreateTransactionRequest): Promise<void>;
}
