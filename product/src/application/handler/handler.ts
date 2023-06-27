import { ServiceInterface } from "../service/serviceRepository";
import { HandlerInterface } from "./handlerRepository";
import { Product } from "../../domain/products/entity";
import { GetAllProductResponse, SyncProductResponse } from "./response";
import { HttpCode } from "../../constants/const";
import { Request, ResponseObject, ResponseToolkit } from "@hapi/hapi";
import { GetAllQueryParam } from "./request";

export class GetProductsHandler implements HandlerInterface {
	private serviceRepo: ServiceInterface;
	constructor(service: ServiceInterface) {
		this.serviceRepo = service;
	}
	async handle(req: Request, h: ResponseToolkit): Promise<ResponseObject> {
		const { page, limit } = req.query;
		const getAllPayload: GetAllQueryParam = { page, limit };
		const products: Product[] = await this.serviceRepo.getAllProduct(getAllPayload);

		const dataResponse: GetAllProductResponse = {
			code: HttpCode.Ok,
			page: Number(page),
			pageSize: Number(limit),
			data: products
		};

		return h.response(dataResponse).code(HttpCode.Ok);
	}

}

export class SyncProductHandler implements HandlerInterface {
	private serviceRepo: ServiceInterface;
	constructor(service: ServiceInterface) {
		this.serviceRepo = service;
	}
	async handle(req: Request, h: ResponseToolkit): Promise<ResponseObject> {
		await this.serviceRepo.syncAllProduct();
		const dataResponse: SyncProductResponse = {
			code: HttpCode.Ok,
			message: "syncted"
		};

		return h.response(dataResponse).code(HttpCode.Ok);
	}
}
