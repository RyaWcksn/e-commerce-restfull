import { CreateTransactionRequest, GetAllQueryParam } from "../../application/handler/request";
import { TransactionEntity } from "./entity";

export interface TransactionInterface {
	createTransaction(payload: CreateTransactionRequest): Promise<void>;
	getAllTransactions(payload: GetAllQueryParam): Promise<TransactionEntity[]>;
}
