import { ServiceInterface } from "../service/serviceRepository";
import { HandlerInterface } from "./handlerRepository";
import { Product } from "../../domain/products/entity";
import { GetAllProductResponse } from "./response";
import { HttpCode } from "../../constants/const";
import { Request, ResponseObject, ResponseToolkit } from "@hapi/hapi";

export class GetProductsHandler implements HandlerInterface {
	private serviceRepo: ServiceInterface;
	constructor(service: ServiceInterface) {
		this.serviceRepo = service;
	}
	async handle(req: Request, h: ResponseToolkit): Promise<ResponseObject> {
		const products: Product[] = await this.serviceRepo.getAllProduct();

		const dataResponse: GetAllProductResponse = {
			code: HttpCode.Ok,
			data: products
		};

		return h.response(dataResponse).code(HttpCode.Ok);
	}

}
