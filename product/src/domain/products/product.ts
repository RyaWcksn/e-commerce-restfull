import { Client } from "pg";
import { ProductInterface } from "./productRepository";
import { Product } from "./entity";
import { CustomError } from "../../utils/error/error";
import { Logger } from "../../utils/logger/logger";
import { GetAllQueryParam, ParamRequest } from "../../application/handler/request";
import { config } from "../../config/config";
import axios from "axios";
import { HttpCode } from "../../constants/const";

export class ProductImpl implements ProductInterface {
	private pgClient: Client
	private logger: Logger

	constructor(pg: Client, log: Logger) {
		this.pgClient = pg;
		this.logger = log;
	}
	async deleteProduct(payload: ParamRequest): Promise<void> {
		const query = `DELETE FROM products WHERE sku = $1;`;
		try {
			await this.pgClient.query(query, [payload.sku]);
			this.logger.log(`product with SKU ${payload.sku} is deleted`);
		} catch (e) {
			this.logger.error(`Error while delete product ${e}`);
			const errMsg = new Error(`${(e as Error).message}`);
			throw new CustomError(errMsg, HttpCode.InternalServerError);
		}
	}
	async getProductDetail(payload: ParamRequest): Promise<Product> {
		try {
			const query = `
      SELECT p.*, COALESCE(SUM(at.qty), 0) AS stock
      FROM products AS p
      LEFT JOIN adjustment_transaction AS at ON p.sku = at.sku
      WHERE p.sku = $1
      GROUP BY p.id
    `;
			const values = [payload.sku]; // Assuming the payload contains the ID of the product

			const result = await this.pgClient.query(query, values);

			if (result.rows.length === 0) {
				const errMsg = new Error(`Product not found for SKU: ${payload.sku}`);
				throw new CustomError(errMsg, HttpCode.InternalServerError);
			}

			const product = result.rows[0] as Product;
			return product;
		} catch (e) {
			this.logger.error(`Error while get products data ${e}`)
			const errMsg = new Error(`${e}`);
			throw new CustomError(errMsg, HttpCode.InternalServerError);
		}
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
			const errMsg = new Error(`${(error as Error).message}`);
			throw new CustomError(errMsg, HttpCode.InternalServerError);
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
			const errMsg = new Error(`${(error as Error).message}`);
			throw new CustomError(errMsg, HttpCode.InternalServerError);
		}
	}

	async syncProduct(): Promise<void> {
		try {
			const products = await this.fetchProducts();
			await this.saveProductsToDatabase(products);
			this.logger.log("Finish sync data")
		} catch (error) {
			this.logger.error(`Error while sync products data ${error}`)
			const errMsg = new Error(`${(error as Error).message}`);
			throw new CustomError(errMsg, HttpCode.InternalServerError);

		}
	}

	async getAllProduct(payload: GetAllQueryParam): Promise<Product[]> {
		var { page, limit } = payload;

		if (page == undefined) {
			page = "1";
		}
		if (limit == undefined) {
			limit = "10";
		}

		const offset = (Number(page) - 1) * Number(limit);
		const query = `
			SELECT p.id, p.name, p.sku, p.image, p.price, CASE WHEN SUM(at.Qty) < 0 THEN 0 ELSE SUM(at.Qty) END AS stock
			FROM products p
			LEFT JOIN adjustment_transaction at ON p.SKU = at.SKU
			GROUP BY p.id
			ORDER BY p.id
			OFFSET $1 LIMIT $2

		`;
		try {
			const result = await this.pgClient.query(query, [offset, limit]);
			return result.rows as Product[];
		} catch (error) {
			this.logger.error(`Error while get all product ${error}`);
			const errMsg = new Error(`${(error as Error).message}`);
			throw new CustomError(errMsg, HttpCode.InternalServerError);

		}
	}
}
