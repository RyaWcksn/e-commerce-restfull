import { Client } from "pg";
import { TransactionInterface } from "./transactionRepository";
import { CreateTransactionRequest, GetAllQueryParam } from "../../application/handler/request";
import { Logger } from "../../utils/logger/logger";
import { HttpCode } from "../../constants/const";
import { CustomError } from "../../utils/error/error";
import { TransactionEntity } from "./entity";

export class TransactionImpl implements TransactionInterface {
	private pgConn: Client;
	private log: Logger;

	constructor(conn: Client, logger: Logger) {
		this.pgConn = conn;
		this.log = logger;
	}
	async getAllTransactions(payload: GetAllQueryParam): Promise<TransactionEntity[]> {
		const query = `
		      SELECT at.sku, at.qty, p.price * at.qty AS amount
		      FROM adjustment_transaction at
		      INNER JOIN products p ON at.sku = p.sku
		      ORDER BY at.id
		      OFFSET $1
		      LIMIT $2
		    `;

		var { page, limit } = payload;

		if (page == undefined) {
			page = "1";
		}
		if (limit == undefined) {
			limit = "10";
		}

		const offset = (Number(page) - 1) * Number(limit);

		this.log.log("Select All Transactions impl");
		try {
			const result = await this.pgConn.query(query, [offset, limit]);
			return result.rows as TransactionEntity[];
		} catch (error) {
			this.log.error(`Error while get all product ${error}`);
			const errMsg = new Error(`${(error as Error).message}`);
			throw new CustomError(errMsg, HttpCode.InternalServerError);

		}
	}

	async createTransaction(payload: CreateTransactionRequest): Promise<void> {
		let stock = await this.calculateStock(payload.sku);
		this.log.log(stock);
		if (stock == null) {
			stock = 0;
			if (payload.qty <= 0) {
				this.log.error(`Stock for ${payload.sku} is: ${stock}`)
				const errMsg = new Error("Cannot create transaction, stock is 0");
				throw new CustomError(errMsg, HttpCode.InternalServerError)
			}
		}
		const adjustedStock: number = stock + payload.qty;
		if (adjustedStock < 0) {
			this.log.error(`Stock for ${payload.sku} is: ${stock}`)
			const errMsg = new Error("Cannot create transaction, stock is 0");
			throw new CustomError(errMsg, HttpCode.InternalServerError)
		}
		const query = `INSERT INTO adjustment_transaction (sku, qty) VALUES ($1, $2)`
		try {
			await this.pgConn.query(query, [payload.sku, payload.qty]);
			this.log.log("Adjustment transaction created");
		} catch (e) {
			this.log.error(`Error while creating transaction for SKU: ${payload.sku} error: ${e}`)
			const errMsg = new Error(`Failed to get product data: ${(e as Error).message}`);
			throw new CustomError(errMsg, HttpCode.InternalServerError)
		}
	}

	async calculateStock(sku: string): Promise<number> {
		const adjustmentQuery = `SELECT qty FROM adjustment_transaction WHERE sku = $1`;
		const adjustmentResult = await this.pgConn.query(adjustmentQuery, [sku]);
		const adjustmentTransactions = adjustmentResult.rows.map((row) => row.qty || 0);

		const initialStock = adjustmentTransactions.reduce((a, b) => a + b, 0);

		const totalStock = initialStock;

		const stock = Math.max(totalStock, 0);

		return stock;
	}
}
