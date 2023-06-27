import { Request, ResponseObject, ResponseToolkit } from "@hapi/hapi";

export interface HandlerInterface {
	handle(req: Request, res: ResponseToolkit): Promise<ResponseObject>;
}
