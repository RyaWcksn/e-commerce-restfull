import { Product } from "../../domain/products/entity";
import { QueryParamRequest, JsonRequest, ParamRequest } from "../handler/request";

export interface ServiceInterface {
	getAllProduct(payload: QueryParamRequest): Promise<Product[]>;
	syncAllProduct(): Promise<void>;
	getProductDetail(payload: ParamRequest): Promise<Product>;
	deleteProduct(payload: ParamRequest): Promise<void>;
	createProduct(payload: JsonRequest): Promise<void>;
	updateProduct(param: ParamRequest, body: JsonRequest): Promise<void>;
}
