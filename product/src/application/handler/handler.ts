import { ServiceInterface } from "../service/serviceRepository";
import { HandlerInterface } from "./handlerRepository";
import { Product } from "../../domain/products/entity";
import { GetAllProductResponse, SyncProductResponse } from "./response";
import { HttpCode } from "../../constants/const";
import { Request, ResponseObject, ResponseToolkit } from "@hapi/hapi";
import { GetAllQueryParam } from "./request";
import { Logger } from "../../utils/logger/logger";
import { CustomError } from "../../utils/error/error";

export class GetProductsHandler implements HandlerInterface {
	private serviceRepo: ServiceInterface;
	private log: Logger;
	constructor(service: ServiceInterface, logger: Logger) {
		this.serviceRepo = service;
		this.log = logger;
	}
	async handle(req: Request, h: ResponseToolkit): Promise<ResponseObject> {
		var { page, limit } = req.query;
		const getAllPayload: GetAllQueryParam = { page, limit };
		const products: Product[] = await this.serviceRepo.getAllProduct(getAllPayload);
		if (page == undefined) {
			page = "1"
		}
		if (limit == undefined) {
			limit = "10"
		}
		try {
			const dataResponse: GetAllProductResponse = {
				code: HttpCode.Ok,
				page: Number(page),
				pageSize: Number(limit),
				data: products
			};
			return h.response(dataResponse).code(HttpCode.Ok);

		} catch (e) {
			this.log.error(`Error on service layer : ${e}`)
			const newErr = new Error(`error from service layer ${e}`);
			throw new CustomError(newErr, HttpCode.InternalServerError);
		}
	}

}

export class SyncProductHandler implements HandlerInterface {
	private serviceRepo: ServiceInterface;
	private log: Logger;
	constructor(service: ServiceInterface, logger: Logger) {
		this.serviceRepo = service;
		this.log = logger;
	}
	async handle(req: Request, h: ResponseToolkit): Promise<ResponseObject> {
		try {
			await this.serviceRepo.syncAllProduct();
			const dataResponse: SyncProductResponse = {
				code: HttpCode.Ok,
				message: "syncted"
			};
			return h.response(dataResponse).code(HttpCode.Ok);

		} catch (e) {
			this.log.error(`Error on service layer : ${e}`)
			const newErr = new Error(`error from service layer ${e}`);
			throw new CustomError(newErr, HttpCode.InternalServerError);
		}

	}
}
