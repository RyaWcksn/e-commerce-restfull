import { TransactionEntity } from "../../domain/transaction/entity";
import { CreateTransactionRequest, GetAllQueryParam } from "../handler/request";

export interface ServiceInterface {
	createTransaction(payload: CreateTransactionRequest): Promise<void>;
	getAllTransactions(payload: GetAllQueryParam): Promise<TransactionEntity[]>;
}
