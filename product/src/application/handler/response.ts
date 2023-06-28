import { Product } from "../../domain/products/entity";

export interface ProductResponse<product> {
	code: Number
	page?: Number
	pageSize?: Number
	message: string
	data: product
}


export interface CommonResponse {
	code: Number
	message: string
}
