import { Product } from "../../domain/products/entity";

export interface ServiceInterface {
	getAllProduct(): Promise<Product[]>;
}
