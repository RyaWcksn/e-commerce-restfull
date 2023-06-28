import { ServiceInterface } from "../service/serviceRepository";
import { HandlerInterface } from "./handlerRepository";
import { Product } from "../../domain/products/entity";
import { CommonResponse, ProductResponse } from "./response";
import { HttpCode } from "../../constants/const";
import { Request, ResponseObject, ResponseToolkit } from "@hapi/hapi";
import { GetAllQueryParam, ParamRequest } from "./request";
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
			const dataResponse: ProductResponse<Product[]> = {
				code: HttpCode.Ok,
				page: Number(page),
				pageSize: Number(limit),
				message: "ok",
				data: products,
			};
			return h.response(dataResponse).code(HttpCode.Ok);

		} catch (e) {
			this.log.error(`Error on service layer : ${e}`)
			const newErr = new Error(`${e}`);
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
			const dataResponse: CommonResponse = {
				code: HttpCode.Ok,
				message: "syncted"
			};
			return h.response(dataResponse).code(HttpCode.Ok);

		} catch (e) {
			this.log.error(`Error on service layer : ${e}`)
			const newErr = new Error(`${e}`);
			throw new CustomError(newErr, HttpCode.InternalServerError);
		}

	}
}

export class GetProductDetailHandler implements HandlerInterface {
	private serviceRepo: ServiceInterface;
	private log: Logger;
	constructor(service: ServiceInterface, logger: Logger) {
		this.serviceRepo = service;
		this.log = logger;
	}

	async handle(req: Request, h: ResponseToolkit): Promise<ResponseObject> {
		const { sku } = req.params;
		const payload: ParamRequest = { sku };
		try {
			const product: Product = await this.serviceRepo.getProductDetail(payload);
			const dataResponse: ProductResponse<Product> = {
				code: HttpCode.Ok,
				message: "ok",
				data: product,
			}
			return h.response(dataResponse).code(HttpCode.Ok);
		} catch (e) {
			this.log.error(`Error on service layer : ${e}`)
			const newErr = new Error(`${e}`);
			throw new CustomError(newErr, HttpCode.InternalServerError);

		}

	}
}

export class DeleteProductHandler implements HandlerInterface {
	private serviceRepo: ServiceInterface;
	private log: Logger;
	constructor(service: ServiceInterface, logger: Logger) {
		this.serviceRepo = service;
		this.log = logger;
	}

	async handle(req: Request, h: ResponseToolkit): Promise<ResponseObject> {
		const { sku } = req.params;
		const payload: ParamRequest = { sku };
		try {
			await this.serviceRepo.deleteProduct(payload);
			const dataResponse: CommonResponse = {
				code: HttpCode.Ok,
				message: "deleted"
			};
			return h.response(dataResponse).code(HttpCode.NoContent);

		} catch (e) {
			this.log.error(`Error on service layer : ${e}`)
			const newErr = new Error(`${e}`);
			throw new CustomError(newErr, HttpCode.InternalServerError);
		}
	}
}
