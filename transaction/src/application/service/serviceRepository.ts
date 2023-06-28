import { TransactionEntity } from "../../domain/transaction/entity";
import { JsonRequest, ParamRequest, QueryParamRequest } from "../handler/request";

export interface ServiceInterface {
	createTransaction(payload: JsonRequest): Promise<void>;
	getAllTransactions(payload: QueryParamRequest): Promise<TransactionEntity[]>;
	deleteTransaction(payload: ParamRequest): Promise<void>;
}
