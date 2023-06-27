import { Product } from "../../domain/products/entity";
import { GetAllQueryParam } from "../handler/request";

export interface ServiceInterface {
	getAllProduct(payload: GetAllQueryParam): Promise<Product[]>;
	syncAllProduct(): Promise<void>;
}
