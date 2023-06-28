import { Product } from "../../domain/products/entity";
import { GetAllQueryParam, GetParam } from "../handler/request";

export interface ServiceInterface {
	getAllProduct(payload: GetAllQueryParam): Promise<Product[]>;
	syncAllProduct(): Promise<void>;
	getProductDetail(payload: GetParam): Promise<Product>;
}
