import { Request, ReqRefDefaults, ResponseToolkit, ResponseObject } from "@hapi/hapi";
import { HandlerInterface } from "./handlerRepository";
import { ServiceInterface } from "../service/serviceRepository";

export class CreateTransactionHandler implements HandlerInterface {
	private serviceRepo: ServiceInterface;
	constructor(service: ServiceInterface) {
		this.serviceRepo = service;
	}
	handle(req: Request<ReqRefDefaults>, res: ResponseToolkit<ReqRefDefaults>): Promise<ResponseObject> {
		throw new Error("Method not implemented.");
	}
}
