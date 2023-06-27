import { Client } from "pg";
import { ProductInterface } from "./productRepository";
import { Product } from "./entity";
import { CustomError } from "../../utils/error/error";
import { Logger } from "../../utils/logger/logger";
import { GetAllQueryParam } from "../../application/handler/request";
import { config } from "../../config/config";
import axios from "axios";

export class ProductImpl implements ProductInterface {
	private pgClient: Client
	private logger: Logger

	constructor(pg: Client, log: Logger) {
		this.pgClient = pg;
		this.logger = log;
	}

	async fetchProducts(): Promise<Product[]> {
		try {
			const response = await axios.get(`${config.APP.APIURL}/wp-json/wc/v3/products`, {
				auth: {
					username: config.APP.APIKEY,
					password: config.APP.APISECRET,
				},
			});
			const products: Product[] = response.data.map((product: any) => {
				const { id, name, sku, price, description, images } = product;
				const image = images.length > 0 ? images[0].src : '';

				return {
					id,
					name,
					sku,
					image,
					price: parseFloat(price),
					description,
				};
			});

			return products as Product[];
		} catch (error) {
			this.logger.error(`Error while get products data ${error}`)
			const errMsg = new Error(`Failed to get product data: ${(error as Error).message}`);
			throw new CustomError(errMsg, 500)
		}
	}
	async saveProductsToDatabase(products: Product[]): Promise<void> {
		try {
			for (const product of products) {
				const { sku, name, image, price, description } = product;

				// Check if the product already exists in the database based on the SKU
				const query = 'SELECT COUNT(*) FROM products WHERE sku = $1';
				const existingProduct = await this.pgClient.query(query, [sku]);

				if (existingProduct.rows[0].count > 0) {
					// Product already exists, skip saving
					this.logger.log(`Product with SKU ${sku} already exists. Skipping...`);
					continue;
				}

				// Product doesn't exist, insert it into the database
				const insertQuery =
					'INSERT INTO products (sku, name, image, price, description) VALUES ($1, $2, $3, $4, $5)';
				await this.pgClient.query(insertQuery, [sku, name, image, price, description]);

				this.logger.log(`Product with SKU ${sku} inserted into the database.`);
			}
		} catch (error) {
			this.logger.error(`Error while save products data ${error}`)
			const errMsg = new Error(`Failed to set product data: ${(error as Error).message}`);
			throw new CustomError(errMsg, 500)
		}
	}

	async syncProduct(): Promise<void> {
		try {
			const products = await this.fetchProducts();
			await this.saveProductsToDatabase(products);
			this.logger.log("Finish sync data")
		} catch (error) {
			this.logger.error(`Error while sync products data ${error}`)
			const errMsg = new Error(`Failed to sync product data: ${(error as Error).message}`);
			throw new CustomError(errMsg, 500)
		}
	}

	async getAllProduct(payload: GetAllQueryParam): Promise<Product[]> {
		const { page, limit } = payload;

		const offset = (Number(page) - 1) * Number(limit);
		const query = `
			SELECT p.*, COALESCE(SUM(at.Qty), 0) AS stock
			FROM products p
			LEFT JOIN adjustment_transaction at ON p.SKU = at.SKU
			GROUP BY p.id
			ORDER BY p.id
			OFFSET $1 LIMIT $2

		`;
		this.logger.log("Select All Product impl")
		try {
			const result = await this.pgClient.query(query, [offset, limit]);
			return result.rows as Product[];
		} catch (error) {
			this.logger.error(`Error while get all product ${error}`)
			const errMsg = new Error(`Failed to get product data: ${(error as Error).message}`);
			throw new CustomError(errMsg, 500)

		}
	}
}
