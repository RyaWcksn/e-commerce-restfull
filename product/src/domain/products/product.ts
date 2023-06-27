import { Client } from "pg";
import { ProductInterface } from "./productRepository";
import { Product } from "./entity";
import { CustomError } from "../../utils/error/error";
import { Logger } from "../../utils/logger/logger";

export class ProductImpl implements ProductInterface {
	private pgClient: Client
	private logger: Logger
	constructor(pg: Client, log: Logger) {
		this.pgClient = pg;
		this.logger = log;
	}
	async getAllProduct(): Promise<Product[]> {
		this.logger.log("Select All Product impl")
		try {
			const query = 'SELECT * FROM products';
			const result = await this.pgClient.query(query);

			return result.rows as Product[];
		} catch (error) {
			const errMsg = new Error(`Failed to get product data: ${(error as Error).message}`);
			throw new CustomError(errMsg, 500)

		}
	}
}
