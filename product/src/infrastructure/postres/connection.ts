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
		// Perform additional operations here
	})
	.catch((error) => {
		console.error("Failed to connect to PostgreSQL database:", error);
		// Handle the connection error appropriately
	});


async function createProductsTable() {
	try {
		const createTableQuery = `
CREATE TABLE IF NOT EXISTS products (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  sku VARCHAR(50) NOT NULL,
  image VARCHAR(255),
  price DECIMAL(10, 2) NOT NULL,
  description TEXT,
  UNIQUE(sku)
);
    `;
		await pgConn.query(createTableQuery);
		console.log("Products table created successfully");
	} catch (error) {
		console.error("Failed to create products table:", error);
	}
}


createProductsTable();

