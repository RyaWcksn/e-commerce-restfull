export interface CreateTransactionResponse {
	code: Number
	sku: string
	qty: number
}

export interface GetTransactionResponse<transaction> {
	code: Number
	message: string
	data: transaction
}
