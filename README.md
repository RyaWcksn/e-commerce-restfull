# e-commerce-restfull

# Technical Requirements Document

[Url to kanban project board](https://github.com/users/RyaWcksn/projects/8/views/1)

## Database Design:

- Design a relational database schema that includes tables for Product and AdjustmentTransaction.
- The Product table should have columns for Name, SKU, Image, Price, and Description.
- The AdjustmentTransaction table should have columns for SKU, Qty.

## API Endpoints:

### Products

- GET /products: Get a paginated list of products with Name, SKU, Image, Price, and Stock.
- GET /product/{sku}: Get the details of a specific product including Name, SKU, Image, Price, Stock, and Description.
- POST /product: Create a new product with Name, SKU, Image, Price, and Description.
- PUT /product/{sku}: Update an existing product with Name, SKU, Image, Price, and Description.
- DELETE /product/{sku}: Delete a product by ID.
- GET /product/sync: Fetch products from the WooCommerce Web Store and save them to the database, ensuring no duplicates.

### Adjustment Transaction

- GET /transaction: Get a paginated list of transactions with SKU, Qty, and Amount. [10]
- GET /transaction/{id}: Get the details of a specific transaction including SKU, Qty, and Amount. [5]
- POST /transaction: Create a new transaction with SKU and Qty. [15]
- PUT /transactions/{id}: Update an existing transaction with SKU and Qty. [15]
- DELETE /transactions/{id}: Delete a transaction by ID. [10]

### Additional Requirements:

- GET /products/search: Search products by name or SKU.
- GET /products/low-stock: Get a list of products with low stock (Stock below a certain threshold).
- GET /products/high-price: Get a list of products with a high price (Price above a certain threshold).
- GET /transactions/total-amount: Get the total amount of all transactions.


## Integration with WooCommerce Web Store:

- Implement a module or service that connects to the WooCommerce Web Store API and retrieves product data.
- Create a periodic task or webhook to sync the product data from the web store to local database.

## Business Logic:

- Implement the necessary business logic to enforce the system requirements:
  - Validate SKU uniqueness and other input validations when creating or updating products.
  - Validate stock availability before creating an adjustment transaction.
  - Calculate and update stock values based on adjustment transactions.
  - Calculate the amount based on the price and quantity of adjustment transactions.

## Error Handling:

- Implement appropriate error handling and validation checks for input data.
- Return meaningful error messages and proper HTTP status codes for different scenarios.

## Testing:

- Write unit tests and integration tests to ensure the correctness of your API endpoints and business logic.
- Test various scenarios, including valid and invalid inputs, error cases, and edge cases.

## Monitoring and Logging:

- Implement logging mechanisms to record application events and errors.
- Set up monitoring tools to track the performance, availability, and health of the API.

Remember to adhere to software engineering principles such as separation of concerns, modularity, and maintainability throughout the development process. Consider scalability, security, and performance optimizations as the system grows and handles larger traffic and data volumes.
