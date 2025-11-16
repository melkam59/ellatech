# Ellatech - NestJS User and Product Management API

A simple NestJS REST API for managing users, products, and tracking inventory transactions with PostgreSQL and TypeORM.

## Quick Start

### Prerequisites

- Node.js 20+ and pnpm
- Docker and Docker Compose

### Installation

1. **Clone and install dependencies:**

```bash
git clone https://github.com/melkam59/ellatech.git
cd ellatech
pnpm install
```

2. **Create `.env` file: or Refer .env.example file**

```env
POSTGRES_NAME=ellatech
POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres
DATABASE_HOST=localhost
DATABASE_PORT=5433
DATABASE_USERNAME=postgres
DATABASE_PASSWORD=postgres
DATABASE_NAME=ellatech
NODE_ENV=development
PORT=3000
```

3. **Start services:**

```bash
# Start PostgreSQL and Redis
docker-compose up -d ellatech_postgres ellatech_redis

# Start the API
pnpm run start:dev
```

The API will be available at `http://localhost:3000`

## API Endpoints

### Users

**POST** `/users` - Create a user

```json
{
  "name": "John Doe",
  "email": "john@example.com"
}
```

### Products

**POST** `/products` - Create a product

```json
{
  "name": "Laptop",
  "description": "Gaming laptop",
  "price": 1299.99,
  "quantity": 100
}
```

**PUT** `/products/update` - Update product quantity

```json
{
  "productId": "uuid",
  "quantity": -10,
  "type": "SALE",
  "userId": "uuid"
}
```

**GET** `/products/status/:productId` - Get product status

### Transactions

**GET** `/transactions` - Get all transactions

## Example Usage

```bash
# 1. Create a user
curl -X POST http://localhost:3000/users \
  -H "Content-Type: application/json" \
  -d '{"name":"John Doe","email":"john@example.com"}'

# 2. Create a product
curl -X POST http://localhost:3000/products \
  -H "Content-Type: application/json" \
  -d '{"name":"Laptop","description":"Gaming laptop","price":1299.99,"quantity":100}'

# 3. Update product quantity
curl -X PUT http://localhost:3000/products/update \
  -H "Content-Type: application/json" \
  -d '{"productId":"<product-id>","quantity":-10,"type":"SALE","userId":"<user-id>"}'

# 4. Get product status
curl http://localhost:3000/products/status/<product-id>

# 5. Get all transactions
curl http://localhost:3000/transactions
```

## Technical Implementation

This API uses several NestJS features to ensure reliability and consistency:

- **Response Interceptor**: All API responses are wrapped in a `{data: ...}` format for consistency
- **Validation Pipe**: Automatically validates all incoming requests using class-validator decorators
- **Database Transactions**: Product updates use database transactions to ensure data consistency (if product update fails, transaction record isn't created)
- **TypeORM Migrations**: Database schema is managed through migrations that run automatically on startup
- **Redis Cache**: Caching infrastructure is set up (ready for future use) to speed up frequent queries
- **Security Headers**: Helmet middleware adds security headers to all responses
- **Error Handling**: Proper HTTP status codes (400, 404, 409, 500) with clear error messages
- **CI/CD Pipeline**: GitHub Actions workflows automatically run tests, linting, and build checks on every push and pull request

## Project Structure

```
src/
├── entities/          # Database models (User, Product, Transaction)
├── users/             # Users module (controller, service, DTOs)
├── products/          # Products module
├── transactions/      # Transactions module
└── core/              # Shared modules (database, cache, interceptors)
```

## Features

- ✅ User management with email validation
- ✅ Product management with inventory tracking
- ✅ Automatic transaction history on quantity changes
- ✅ Input validation on all endpoints
- ✅ Error handling with proper HTTP status codes
- ✅ Docker Compose setup for easy local development
- ✅ Database migrations for schema management
- ✅ CI/CD pipeline with automated testing and deployment workflows

## Assumptions & Trade-offs

### Assumptions

- **No Authentication**: Users don't require passwords. The API focuses on inventory management without auth.
- **Simple Transaction Model**: Transactions track quantity changes only. No additional metadata like notes or approval workflows.
- **Auto-run Migrations**: Database schema is managed through migrations that run automatically on startup.

### Trade-offs

- **No Pagination**: `/transactions` returns all records. For large datasets, pagination would be needed.
- **No Soft Deletes**: Entities are permanently deleted. Soft deletes would preserve history.
- **Simple Error Messages**: Errors return basic messages. More detailed error codes could improve client handling.

## Future Improvements

- Add pagination for transactions endpoint
- Implement authentication and authorization
- Add filtering and sorting for transactions
- Implement soft deletes for data preservation
- Add product categories and tags
- Implement caching for frequently accessed products
- Add comprehensive API documentation (Swagger/OpenAPI)
- Add unit and integration tests
- Implement rate limiting
