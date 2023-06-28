import { Product } from "../../domain/products/entity";

export interface GetAllProductResponse {
	code: Number
	page: Number
	pageSize: Number
	data: Product[]
}


export interface SyncProductResponse {
	code: Number
	message: string
}


export interface GetDetailsResponse {
	code: Number
	mesage: string
	data: Product
}

