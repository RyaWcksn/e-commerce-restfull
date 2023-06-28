import { Client } from "pg";
import { TransactionInterface } from "./transactionRepository";
import { CreateTransactionRequest } from "../../application/handler/request";
import { Logger } from "../../utils/logger/logger";
import { HttpCode } from "../../constants/const";
import { CustomError } from "../../utils/error/error";

export class TransactionImpl implements TransactionInterface {
	private pgConn: Client;
	private log: Logger;

	constructor(conn: Client, logger: Logger) {
		this.pgConn = conn;
		this.log = logger;
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
		if (adjustedStock < 0 ) {
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
