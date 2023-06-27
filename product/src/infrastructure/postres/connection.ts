import { Client } from "pg";
import * as dotenv from "dotenv"

dotenv.config()
export const pgConn: Client = new Client({
	user: process.env.PGUSER,
	host: process.env.PGHOST,
	database: process.env.PGDATABASE,
	password: process.env.PGPASSWORD,
	port: Number(process.env.PGPORT)
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
        name VARCHAR(255),
        sku VARCHAR(50),
        image VARCHAR(255),
        price INTEGER,
        description TEXT
      )
    `;
		await pgConn.query(createTableQuery);
		console.log("Products table created successfully");
	} catch (error) {
		console.error("Failed to create products table:", error);
	}
}

createProductsTable();
