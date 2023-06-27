import { Product } from "../../domain/products/entity";

export interface GetAllProductResponse {
	code: Number
	page: Number
	pageSize: Number
	data: Product[]
}
