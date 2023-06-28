import { CreateTransactionRequest } from "../handler/request";

export interface ServiceInterface {
	createTransaction(payload: CreateTransactionRequest): Promise<void>;
}
