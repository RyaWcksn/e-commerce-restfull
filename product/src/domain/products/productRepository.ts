import { GetAllQueryParam, GetParam } from "../../application/handler/request";
import { Product } from "./entity";

export interface ProductInterface {
	getAllProduct(payload: GetAllQueryParam): Promise<Product[]>;
	syncProduct(): Promise<void>;
	getProductDetail(payload: GetParam): Promise<Product>;
}
