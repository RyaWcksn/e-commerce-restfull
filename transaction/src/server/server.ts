import { Request, ResponseToolkit, Server, ServerRoute } from "@hapi/hapi";
import { LogLevel, Logger } from "../utils/logger/logger";
import { Client } from "pg";
import { pgConn } from "../infrastructure/postgres/connection";
import { CustomError } from "../utils/error/error";
import { TransactionImpl } from "../domain/transaction/transaction";
import { TransactionInterface } from "../domain/transaction/transactionRepository";
import { ServiceInterface } from "../application/service/serviceRepository";
import { ServiceImpl } from "../application/service/service";
import { CreateTransactionHandler } from "../application/handler/handler";
import { HandlerInterface } from "../application/handler/handlerRepository";

const server: Server = new Server({
	port: 4000,
	host: '0.0.0.0'
})


// Initiate all instances
const logger: Logger = Logger.getInstance();
logger.setLogLevel(LogLevel.INFO);

const dbConn: Client = pgConn;
const transactionImpl: TransactionInterface = new TransactionImpl(dbConn);
const serviceImpl: ServiceInterface = new ServiceImpl(transactionImpl);

// Handlers
const createTransactionHandler: HandlerInterface = new CreateTransactionHandler(serviceImpl);

const router: ServerRoute[] = [
	{
		method: "POST",
		path: "/transaction",
		handler: createTransactionHandler.handle.bind(createTransactionHandler)
	}
]

server.route(router);

server.ext('onPreResponse', (req: Request, res: ResponseToolkit) => {
	const response = req.response;

	if (response instanceof CustomError) {
		const statusCode = response.statusCode || 500;

		const errorResponse = {
			statusCode: statusCode,
			error: response.name || 'Internal Server Error',
			message: response.message
		};

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