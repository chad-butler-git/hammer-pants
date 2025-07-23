# Grocery API

Node.js + Express REST API for the grocery application.

## Description

This service provides the backend REST API for the grocery application, handling data operations and business logic.

## Installation

```bash
# Install dependencies
npm install
```

## Development

### Local Development

```bash
# Run the development server with hot-reload
npm run dev
```

### Docker Development

```bash
# Build the Docker image
docker build -t grocery-api .

# Run the container
docker run -p 3000:3000 grocery-api
```

## API Endpoints

### Base Endpoints

- `GET /` - API information
- `GET /health` - Health check endpoint

### Items Endpoints

- `GET /api/items` - List all items
- `GET /api/items/:id` - Get item by ID
- `POST /api/items` - Create a new item
- `PUT /api/items/:id` - Update an existing item
- `DELETE /api/items/:id` - Delete an item

### Stores Endpoints

- `GET /api/stores` - List all stores
- `GET /api/stores/:id` - Get store by ID
- `POST /api/stores` - Create a new store
- `PUT /api/stores/:id` - Update an existing store
- `DELETE /api/stores/:id` - Delete a store

### Shopping Lists Endpoints

- `GET /api/lists` - List all shopping lists
- `GET /api/lists/:id` - Get shopping list by ID
- `POST /api/lists` - Create a new shopping list
- `PUT /api/lists/:id` - Update an existing shopping list
- `DELETE /api/lists/:id` - Delete a shopping list

### Route Planning Endpoint

- `POST /api/route` - Generate an optimized shopping route

## API Examples

### Items

#### List all items
```
GET /api/items
```

Response:
```json
[
  {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "name": "Apples",
    "category": "Fruits"
  },
  {
    "id": "550e8400-e29b-41d4-a716-446655440001",
    "name": "Milk",
    "category": "Dairy"
  }
]
```

#### Get item by ID
```
GET /api/items/550e8400-e29b-41d4-a716-446655440000
```

Response:
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "name": "Apples",
  "category": "Fruits"
}
```

#### Create a new item
```
POST /api/items
```

Request body:
```json
{
  "name": "Bananas",
  "category": "Fruits"
}
```

Response:
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440002",
  "name": "Bananas",
  "category": "Fruits"
}
```

### Stores

#### Create a new store
```
POST /api/stores
```

Request body:
```json
{
  "name": "Downtown Grocery",
  "address": "123 Main St",
  "aisles": [
    {
      "number": 1,
      "categories": ["Fruits", "Vegetables"]
    },
    {
      "number": 2,
      "categories": ["Dairy", "Cheese"]
    }
  ]
}
```

### Shopping Lists

#### Create a new shopping list
```
POST /api/lists
```

Request body:
```json
{
  "storeId": "550e8400-e29b-41d4-a716-446655440010",
  "items": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "name": "Apples",
      "category": "Fruits"
    },
    {
      "id": "550e8400-e29b-41d4-a716-446655440001",
      "name": "Milk",
      "category": "Dairy"
    }
  ]
}
```

### Route Planning

#### Generate a shopping route
```
POST /api/route
```

Request body:
```json
{
  "storeId": "550e8400-e29b-41d4-a716-446655440010",
  "items": [
    "550e8400-e29b-41d4-a716-446655440000",
    "550e8400-e29b-41d4-a716-446655440001"
  ],
  "plannerType": "linear"
}
```

Parameters:
- `storeId` (required): UUID of the store to plan the route for
- `items` (required): Array of item UUIDs to include in the route
- `plannerType` (optional): Type of route planner to use
  - `linear` (default): Groups items by aisle and sorts aisles numerically

Response:
```json
[
  {
    "aisleNumber": 1,
    "items": [
      {
        "id": "550e8400-e29b-41d4-a716-446655440000",
        "name": "Apples",
        "category": "Fruits"
      }
    ]
  },
  {
    "aisleNumber": 2,
    "items": [
      {
        "id": "550e8400-e29b-41d4-a716-446655440001",
        "name": "Milk",
        "category": "Dairy"
      }
    ]
  }
]
```

## Data Layer & Seeding

The application uses an in-memory data store that is seeded with representative sample data at startup.

### Data Store

The data store is implemented as a singleton object that provides CRUD operations for the following entities:
- Items (~250 items across all categories)
- Stores (3 stores with 10-20 aisles each)
- Shopping Lists

Each entity is validated using Joi schemas from the `grocery-shared` package.

### Seeding

The application automatically seeds the data store at startup with:
- ~250 grocery items across 12 categories
- 3 stores with 10-20 aisles each
- Each aisle contains 3-6 categories

You can manually seed the data store using:

```bash
npm run seed
```

### Development

During development, you can use the following commands:

```bash
# Run the development server with hot-reload (includes seeding)
npm run dev

# Run tests with coverage
npm test
```

## License

MIT

## ⚠️ Known Vulnerabilities (intentional)

| CVE ID | Package | Version | Description | Location |
|--------|---------|---------|-------------|----------|
| CVE-2021-23337 | lodash | 4.17.19 | Prototype Pollution in lodash | src/routes/items.js |
| CVE-2022-23529 | jsonwebtoken (via jws) | 8.5.1 | Forgeable JWT tokens | src/utils/auth.js |

These vulnerabilities are intentionally included for security testing and educational purposes:
- The lodash vulnerability uses `_.template()` on user input without proper sanitization, which can lead to prototype pollution attacks.
- The jsonwebtoken vulnerability (via its transitive dependency jws) allows attackers to forge valid JWTs for accounts they don't own.

## 🔍 False-Positive Examples

| Package | Version | Pattern | Explanation | Why it's a false positive |
|---------|---------|---------|-------------|---------------------------|
| eslint | 6.8.0 | Dev-only vulnerable dep | Added to devDependencies | Not used in production; only for development |

This false-positive pattern demonstrates a common scenario where a vulnerable package is included only in development dependencies and doesn't affect the production application. Security scanners will still flag this vulnerability, but it poses no actual risk to users since it's not included in the production build.