import { ServiceInterface } from "../service/serviceRepository";
import { HandlerInterface } from "./handlerRepository";
import { Product } from "../../domain/products/entity";
import { GetAllProductResponse } from "./response";
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
			page: page,
			pageSize: limit,
			data: products
		};

		return h.response(dataResponse).code(HttpCode.Ok);
	}

}
