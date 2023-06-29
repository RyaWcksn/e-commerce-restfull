export interface QueryParamRequest {
	page: string,
	limit: string,
}

export interface ParamRequest {
	sku: string
}

export interface JsonRequest {
	name: string
	sku: string
	image: string
	price: number
	description?: string
}
