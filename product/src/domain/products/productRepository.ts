import { Product } from "./entity";

export interface ProductInterface {
	getAllProduct(): Promise<Product[]>
}
