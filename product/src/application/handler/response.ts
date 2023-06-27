import { Product } from "../../domain/products/entity";

export interface GetAllProductResponse {
	code: Number
	page: string
	pageSize: string
	data: Product[]
}
