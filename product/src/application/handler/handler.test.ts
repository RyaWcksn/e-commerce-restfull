import { GetProductsHandler } from './handler';
import { ServiceInterface } from '../service/serviceRepository';
import { HttpCode } from '../../constants/const';
import { Request, ResponseToolkit } from '@hapi/hapi';

describe('GetProductsHandler', () => {
	it('should return the correct response', async () => {
		// Mock the service
		const mockService: ServiceInterface = {
			getAllProduct: jest.fn().mockResolvedValue([
				{
					"id": "123",
					"name": "test",
					"sku": "123",
					"image": "123",
					"price": 123,
					"stock": 123
				}
			]),
			syncAllProduct: jest.fn().mockResolvedValue([
			]),
		};

		// Create an instance of the handler
		const handler = new GetProductsHandler(mockService);

		// Create mock request and response objects
		const request = {} as Request;
		const responseToolkit = {} as ResponseToolkit;

		// Call the handle method
		const result = await handler.handle(request, responseToolkit);

		// Define the expected response
		const expectedResponse = {
			code: HttpCode.Ok,
			page: 1,
			pageSize: 1,
			data: [
				{
					"id": "123",
					"name": "test",
					"sku": "123",
					"image": "123",
					"price": 123,
					"stock": 123
				}
			],
		};

		// Assert that the result matches the expected response
		expect(result).toEqual(expectedResponse);

		// Assert that the service method was called
		expect(mockService.getAllProduct).toHaveBeenCalledTimes(1);
	});
});
