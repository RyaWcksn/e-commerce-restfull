import { HttpCode } from "../../constants/const";
import { Product } from "../../domain/products/entity";
import { ProductInterface } from "../../domain/products/productRepository";
import { CustomError } from "../../utils/error/error";
import { Logger } from "../../utils/logger/logger";
import { GetAllQueryParam } from "../handler/request";
import { ServiceInterface } from "./serviceRepository";

export class ServiceImpl implements ServiceInterface {

	private log: Logger;
	private productRepo: ProductInterface;

	constructor(log: Logger, product: ProductInterface) {
		this.log = log;
		this.productRepo = product;
	}

	async syncAllProduct(): Promise<void> {
		try {
			await this.productRepo.syncProduct();
		} catch (e) {
			this.log.error(`Error on service layer : ${e}`)
			const err = new CustomError(e as Error, HttpCode.InternalServerError);
			throw err;
		}
	}

	async getAllProduct(payload: GetAllQueryParam): Promise<Product[]> {
		this.log.log("Service layer")
		try {
			const dummyData = await this.productRepo.getAllProduct(payload);
			return dummyData

		} catch (e) {
			this.log.error(`Error on service layer : ${e}`)
			const err = new CustomError(e as Error, HttpCode.InternalServerError);
			throw err;

		}
	}
}
