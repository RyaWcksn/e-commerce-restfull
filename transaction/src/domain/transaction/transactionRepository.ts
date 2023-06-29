import { JsonRequest, ParamRequest, QueryParamRequest } from "../../application/handler/request";
import { TransactionEntity } from "./entity";

export interface TransactionInterface {
	createTransaction(payload: JsonRequest): Promise<void>;
	getAllTransactions(payload: QueryParamRequest): Promise<TransactionEntity[]>;
	deleteTransaction(payload: ParamRequest): Promise<void>;
	getTransactionDetails(payload: ParamRequest): Promise<TransactionEntity>;
	updateTransaction(param: ParamRequest, body: JsonRequest): Promise<void>;
}
