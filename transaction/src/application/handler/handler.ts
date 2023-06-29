import { Request, ResponseToolkit, ResponseObject } from "@hapi/hapi";
import { HandlerInterface } from "./handlerRepository";
import { ServiceInterface } from "../service/serviceRepository";
import { JsonRequest, ParamRequest, QueryParamRequest } from "./request";
import { CustomError } from "../../utils/error/error";
import { HttpCode } from "../../constants/const";
import { CommonResponse, TransactionResponse } from "./response";
import { Logger } from "../../utils/logger/logger";
import Joi, { ObjectSchema } from "joi";
import { TransactionEntity } from "../../domain/transaction/entity";

export class CreateTransactionHandler implements HandlerInterface {
	private serviceRepo: ServiceInterface;
	private log: Logger;
	constructor(service: ServiceInterface, logger: Logger) {
		this.serviceRepo = service;
		this.log = logger;
	}
	async handle(req: Request, res: ResponseToolkit): Promise<ResponseObject> {
		const schema: ObjectSchema = Joi.object({
			sku: Joi.string().required(),
			qty: Joi.number().required()
		})

		const { error, value } = schema.validate(req.payload);
		if (error) {
			const errorMessage = error.details.map((detail) => detail.message).join(', ');
			this.log.error(`${errorMessage}`)
			const newErr = new Error(`${errorMessage}`);
			throw new CustomError(newErr, HttpCode.BadRequest);
		}
		const payload: JsonRequest = value as JsonRequest;
		try {
			await this.serviceRepo.createTransaction(payload);
			const resp: TransactionResponse<JsonRequest> = {
				code: HttpCode.Created,
				message: "ok",
				data: payload
			}
			this.log.log("Transaction created");
			return res.response(resp).code(HttpCode.Created);
		} catch (e) {
			this.log.error(`Error on service layer : ${e}`)
			const newErr = new Error(`${e}`);
			throw new CustomError(newErr, HttpCode.InternalServerError);
		}
	}
}

export class GetAllTransactionHandler implements HandlerInterface {
	private serviceRepo: ServiceInterface;
	private log: Logger;
	constructor(service: ServiceInterface, logger: Logger) {
		this.serviceRepo = service;
		this.log = logger;
	}
	async handle(req: Request, res: ResponseToolkit): Promise<ResponseObject> {
		var { page, limit } = req.query;
		if (page == undefined) {
			page = "1"
		}
		if (limit == undefined) {
			limit = "10"
		}
		const payload: QueryParamRequest = { page, limit };
		try {

			const transactions = await this.serviceRepo.getAllTransactions(payload);
			const resp: TransactionResponse<TransactionEntity[]> = {
				code: HttpCode.Ok,
				message: "ok",
				data: transactions
			}
			return res.response(resp).code(HttpCode.Ok);
		} catch (e) {
			this.log.error(`Error on service layer : ${e}`)
			const newErr = new Error(`${e}`);
			throw new CustomError(newErr, HttpCode.InternalServerError);
		}

	}
}

export class DeleteTransactionHandler implements HandlerInterface {
	private serviceRepo: ServiceInterface;
	private log: Logger;
	constructor(service: ServiceInterface, logger: Logger) {
		this.serviceRepo = service;
		this.log = logger;
	}
	async handle(req: Request, res: ResponseToolkit): Promise<ResponseObject> {
		const { id } = req.params;
		const payload: ParamRequest = { id };
		try {
			await this.serviceRepo.deleteTransaction(payload);
			const dataResponse: CommonResponse = {
				code: HttpCode.NoContent,
				message: "deleted"
			};
			return res.response(dataResponse).code(HttpCode.NoContent);
		} catch (e) {
			this.log.error(`Error on service layer : ${e}`)
			const newErr = new Error(`${e}`);
			throw new CustomError(newErr, HttpCode.InternalServerError);
		}

	}
}

export class GetTransactionDetailHandler implements HandlerInterface {
	private serviceRepo: ServiceInterface;
	private log: Logger;
	constructor(service: ServiceInterface, logger: Logger) {
		this.serviceRepo = service;
		this.log = logger;
	}
	async handle(req: Request, res: ResponseToolkit): Promise<ResponseObject> {
		const { id } = req.params;
		const payload: ParamRequest = { id };
		try {
			const transaction = await this.serviceRepo.getTransactionDetails(payload);
			const dataResponse: TransactionResponse<TransactionEntity> = {
				code: HttpCode.Ok,
				message: "ok",
				data: transaction
			};
			return res.response(dataResponse).code(HttpCode.Ok);
		} catch (e) {
			this.log.error(`Error on service layer : ${e}`)
			const newErr = new Error(`${e}`);
			throw new CustomError(newErr, HttpCode.InternalServerError);
		}
	}

}
