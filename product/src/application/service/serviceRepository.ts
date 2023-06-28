import { Product } from "../../domain/products/entity";
import { GetAllQueryParam, ParamRequest } from "../handler/request";

export interface ServiceInterface {
	getAllProduct(payload: GetAllQueryParam): Promise<Product[]>;
	syncAllProduct(): Promise<void>;
	getProductDetail(payload: ParamRequest): Promise<Product>;
	deleteProduct(payload: ParamRequest): Promise<void>;
}
