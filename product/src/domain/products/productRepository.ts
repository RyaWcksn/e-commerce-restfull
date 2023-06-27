import { GetAllQueryParam } from "../../application/handler/request";
import { Product } from "./entity";

export interface ProductInterface {
	getAllProduct(payload: GetAllQueryParam): Promise<Product[]>
}
