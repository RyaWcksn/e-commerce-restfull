import { Product } from "../../domain/products/entity";

export interface GetAllProductResponse {
	code: Number
	data: Product[]
}
