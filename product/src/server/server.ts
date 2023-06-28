import { Client } from "pg";
import { pgConn } from "../infrastructure/postres/connection";
import { ServiceInterface } from "../application/service/serviceRepository";
import { ServiceImpl } from "../application/service/service";
import { HandlerInterface } from "../application/handler/handlerRepository";
import { GetProductDetailHandler, GetProductsHandler, SyncProductHandler } from "../application/handler/handler";
import { LogLevel, Logger } from "../utils/logger/logger";
import { CustomError } from "../utils/error/error";
import { Request, ResponseToolkit, Server, ServerRoute } from "@hapi/hapi";
import { ProductInterface } from "../domain/products/productRepository";
import { ProductImpl } from "../domain/products/product";

const server: Server = new Server({
	port: 3000,
	host: '0.0.0.0',
	routes: {
		payload: {
			parse: true,
			allow: 'application/json'
		}
	}
});

// Initiate all domains and utilities

const logger: Logger = Logger.getInstance();
logger.setLogLevel(LogLevel.INFO);

const dbConn: Client = pgConn
const productImpl: ProductInterface = new ProductImpl(dbConn, logger);
const serviceImpl: ServiceInterface = new ServiceImpl(logger, productImpl);


const getProducts: HandlerInterface = new GetProductsHandler(serviceImpl, logger);
const syncProducts: HandlerInterface = new SyncProductHandler(serviceImpl, logger);
const getDetail: HandlerInterface = new GetProductDetailHandler(serviceImpl, logger);

const router: ServerRoute[] = [
	{
		method: "GET",
		path: "/products",
		handler: getProducts.handle.bind(getProducts)
	},
	{
		method: "GET",
		path: "/product/sync",
		handler: syncProducts.handle.bind(syncProducts)
	},
	{
		method: "GET",
		path: "/product/{sku}",
		handler: getDetail.handle.bind(getDetail)
	},
]

// Error handling
server.route(router);

server.ext('onPreResponse', (req: Request, res: ResponseToolkit) => {
	const response = req.response;

	// Check if the response is an error
	if (response instanceof CustomError) {
		// Get the HTTP status code from the error object (if provided)
		const statusCode = response.statusCode || 500;

		// Create an error JSON response
		const errorResponse = {
			code: statusCode,
			error: response.name || 'Internal Server Error',
			message: response.message
		};

		// Return the error JSON response
		return res.response(errorResponse).code(statusCode);
	}

	return res.continue;
});


export const startServer = async () => {
	try {
		await server.start()
		console.log(`Running on ${server.info.uri}`);
	} catch (error) {
		console.error("Error while starting server: ", error);
	}
}
