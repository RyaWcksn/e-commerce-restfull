export interface TransactionResponse<transaction> {
	code: Number
	message: string
	data: transaction
}

export interface CommonResponse {
	code: Number
	message: string
}
