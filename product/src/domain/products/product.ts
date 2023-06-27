import { Client } from "pg";
import { ProductInterface } from "./productRepository";
import { Product } from "./entity";
import { CustomError } from "../../utils/error/error";
import { Logger } from "../../utils/logger/logger";
import { GetAllQueryParam } from "../../application/handler/request";

export class ProductImpl implements ProductInterface {
	private pgClient: Client
	private logger: Logger
	constructor(pg: Client, log: Logger) {
		this.pgClient = pg;
		this.logger = log;
	}
	async getAllProduct(payload: GetAllQueryParam): Promise<Product[]> {
		const { page, limit } = payload;

		const offset = (Number(page) - 1) * Number(limit);
		const query = `SELECT * FROM products OFFSET $1 LIMIT $2`;
		this.logger.log("Select All Product impl")
		try {
			const result = await this.pgClient.query(query, [offset, limit]);

			return result.rows as Product[];
		} catch (error) {
			const errMsg = new Error(`Failed to get product data: ${(error as Error).message}`);
			throw new CustomError(errMsg, 500)

		}
	}
}
