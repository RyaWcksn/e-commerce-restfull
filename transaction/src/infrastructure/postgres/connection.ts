import { Client } from "pg";
import * as dotenv from "dotenv"
import { config } from "../../config/config";

dotenv.config()
export const pgConn: Client = new Client({
	user: config.DB.user,
	host: config.DB.host,
	database: config.DB.database,
	password: config.DB.password,
	port: config.DB.port,
});

pgConn.connect()
	.then(() => {
		console.log("Connected to PostgreSQL database");
	})
	.catch((error) => {
		console.error("Failed to connect to PostgreSQL database:", error);
	});


async function createAdjustmentTable() {
	try {
		const createTableQuery = `
CREATE TABLE IF NOT EXISTS adjustment_transaction (
  id SERIAL PRIMARY KEY,
  sku VARCHAR(255) NOT NULL,
  qty INTEGER NOT NULL,
  FOREIGN KEY (sku) REFERENCES products (sku) ON DELETE CASCADE
);

    `;
		await pgConn.query(createTableQuery);
		console.log("Adjustment table created successfully");
	} catch (error) {
		console.error("Failed to create adjustment table:", error);
	}
}


createAdjustmentTable();
