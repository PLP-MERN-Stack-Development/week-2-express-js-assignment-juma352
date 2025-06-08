[![Open in Visual Studio Code](https://classroom.github.com/assets/open-in-vscode-2e0aaae1b6195c2367325f4f02e2d04e9abb55f0b24a779b69b11b9e10269abc.svg)](https://classroom.github.com/online_ide?assignment_repo_id=19729120&assignment_repo_type=AssignmentRepo)
# Express.js RESTful API Assignment

This assignment focuses on building a RESTful API using Express.js, implementing proper routing, middleware, and error handling.

## Getting Started

1. Install dependencies:
   ```
   npm install
   ```
2. Run the server:
   ```
   npm start
   ```
3. The server listens on port 3000 by default.

## API Endpoints

### Root
- `GET /`
  - Returns a welcome message.

### Products
- `GET /api/products`
  - Returns a list of products.
  - Supports query parameters:
    - `category` (string): filter products by category.
    - `search` (string): search products by name.
    - `page` (number): page number for pagination (default 1).
    - `limit` (number): number of products per page (default 10).
  - Response:
    ```json
    {
      "page": 1,
      "limit": 10,
      "total": 3,
      "products": [
        {
          "id": "1",
          "name": "Laptop",
          "description": "High-performance laptop with 16GB RAM",
          "price": 1200,
          "category": "electronics",
          "inStock": true
        },
        ...
      ]
    }
    ```

- `GET /api/products/:id`
  - Returns a specific product by ID.
  - Response:
    ```json
    {
      "id": "1",
      "name": "Laptop",
      "description": "High-performance laptop with 16GB RAM",
      "price": 1200,
      "category": "electronics",
      "inStock": true
    }
    ```
  - Error: 404 if product not found.

- `POST /api/products`
  - Creates a new product.
  - Requires JSON body with fields: `name` (string), `description` (string), `price` (number), `category` (string), `inStock` (boolean).
  - Requires header `x-api-key` with value `12345`.
  - Response: 201 Created with the new product object.
  - Error: 400 for validation errors, 401 for missing/invalid API key.

- `PUT /api/products/:id`
  - Updates an existing product by ID.
  - Requires JSON body with fields as in POST.
  - Requires header `x-api-key` with value `12345`.
  - Response: updated product object.
  - Error: 400 for validation errors, 401 for missing/invalid API key, 404 if product not found.

- `DELETE /api/products/:id`
  - Deletes a product by ID.
  - Requires header `x-api-key` with value `12345`.
  - Response: 204 No Content.
  - Error: 401 for missing/invalid API key, 404 if product not found.

- `GET /api/products/stats/category-count`
  - Returns count of products grouped by category.
  - Response example:
    ```json
    {
      "electronics": 2,
      "kitchen": 1
    }
    ```

## Middleware

- Logger middleware logs request method, URL, and timestamp.
- Authentication middleware checks for API key in `x-api-key` header.
- Validation middleware validates product data on creation and update.
- Global error handling middleware returns 500 Internal Server Error for unhandled errors.

## Testing

Use Postman, Insomnia, or curl to test the API endpoints. Include the `x-api-key` header with value `12345` for protected routes.

## Notes

- The API uses an in-memory data store; data will reset on server restart.
- Pagination defaults to page 1 and 10 items per page if not specified.

## Resources

- [Express.js Documentation](https://expressjs.com/)
- [RESTful API Design Best Practices](https://restfulapi.net/)
- [HTTP Status Codes](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status)
