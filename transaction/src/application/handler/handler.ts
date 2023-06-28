import { Request, ResponseToolkit, ResponseObject } from "@hapi/hapi";
import { HandlerInterface } from "./handlerRepository";
import { ServiceInterface } from "../service/serviceRepository";
import { CreateTransactionRequest } from "./request";
import { CustomError } from "../../utils/error/error";
import { HttpCode } from "../../constants/const";
import { CreateTransactionResponse } from "./response";
import { Logger } from "../../utils/logger/logger";
import Joi, { ObjectSchema } from "joi";

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
		const payload: CreateTransactionRequest = value as CreateTransactionRequest;
		try {
			await this.serviceRepo.createTransaction(payload);
			const resp: CreateTransactionResponse = {
				code: HttpCode.Created,
				message: "Created"
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
