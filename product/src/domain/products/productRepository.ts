import { GetAllQueryParam, JsonRequest, ParamRequest } from "../../application/handler/request";
import { Product } from "./entity";

export interface ProductInterface {
	getAllProduct(payload: GetAllQueryParam): Promise<Product[]>;
	syncProduct(): Promise<void>;
	getProductDetail(payload: ParamRequest): Promise<Product>;
	deleteProduct(payload: ParamRequest): Promise<void>;
	createProduct(payload: JsonRequest): Promise<void>;
}
