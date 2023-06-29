import { Client } from "pg";
import { TransactionInterface } from "./transactionRepository";
import { JsonRequest, ParamRequest, QueryParamRequest } from "../../application/handler/request";
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
	async getTransactionDetails(payload: ParamRequest): Promise<TransactionEntity> {
		const query = `
		      SELECT at.id, at.sku, at.qty, p.price * at.qty AS amount
		      FROM adjustment_transaction at
		      INNER JOIN products p ON at.sku = p.sku
		      WHERE at.id = $1
		      ORDER BY at.id;
		`
		try {
			const row = await this.pgConn.query(query, [payload.id]);

			if (row.rowCount === 0) {
				this.log.error(`No record found for transaction id ${payload.id}`);
				const errMsg = new Error("No record");
				throw new CustomError(errMsg, HttpCode.BadRequest);
			}

			const transaction: TransactionEntity = {
				id: row.rows[0].id,
				sku: row.rows[0].sku,
				qty: row.rows[0].qty,
				amount: row.rows[0].amount,
			};
			return transaction;

		} catch (e) {
			this.log.error(`Error while get transaction details ${e}`);
			const errMsg = new Error(`${(e as Error).message}`);
			throw new CustomError(errMsg, HttpCode.InternalServerError);
		}
	}
	async deleteTransaction(payload: ParamRequest): Promise<void> {
		const query = `DELETE FROM adjustment_transaction WHERE id = $1;`;
		try {
			await this.pgConn.query(query, [payload.id]);
			this.log.log(`transaction with id ${payload.id} is deleted`);
		} catch (e) {
			this.log.error(`Error while delete transaction ${e}`);
			const errMsg = new Error(`${(e as Error).message}`);
			throw new CustomError(errMsg, HttpCode.InternalServerError);
		}
	}
	async getAllTransactions(payload: QueryParamRequest): Promise<TransactionEntity[]> {
		const query = `
		      SELECT at.id, at.sku, at.qty, p.price * at.qty AS amount
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
			this.log.error(`Error while get all transaction ${error}`);
			const errMsg = new Error(`${(error as Error).message}`);
			throw new CustomError(errMsg, HttpCode.InternalServerError);

		}
	}

	async createTransaction(payload: JsonRequest): Promise<void> {
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
			const errMsg = new Error(`${(e as Error).message}`);
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
