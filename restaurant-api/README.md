# Restaurant Order Management API

A production-oriented backend API for managing restaurant menus, foods,
users and customer orders.

## Features

-   JWT Authentication
-   Role-Based Access Control (Admin & Customer)
-   Menu Management
-   Food CRUD
-   Order Management
-   Historical Order Snapshotting
-   Pagination
-   Search
-   Sorting
-   Filtering
-   Joi Validation
-   Global Error Handling

## Tech Stack

-   Node.js
-   Express.js
-   MongoDB Atlas
-   Mongoose
-   JWT
-   bcryptjs
-   Joi
-   dotenv
-   Morgan
-   CORS

## Project Structure

``` text
restaurant-api/
├── config/
├── controllers/
├── middleware/
├── models/
├── routes/
├── utils/
├── validators/
├── docs/
├── server.js
└── package.json
```

## Installation

``` bash
git clone <repository-url>
cd restaurant-api
npm install
```

## Environment Variables

Create a `.env` file:

``` env
PORT=5000
MONGO_URI=<mongodb-atlas-uri>
JWT_SECRET=<your-secret>
```

## Run

``` bash
npm run dev
```

## Authentication

Use:

    Authorization: Bearer <JWT_TOKEN>

Protected endpoints require a valid JWT.

## Main Modules

### Authentication

-   Register
-   Login
-   Profile

### Menu

-   Create Menu
-   Get Menus

### Food

-   Create
-   Read
-   Update
-   Delete
-   Pagination
-   Search
-   Sorting

### Orders

-   Create Order
-   View Own Orders
-   View All Orders (Admin)
-   Update Status
-   Cancel Order
-   Pagination
-   Filtering
-   Sorting

## Documentation

Additional project documentation is located in the `docs` directory.

-   DEVELOPER_GUIDE.md
-   PROJECT_ARCHITECTURE.md
-   API_DOCUMENTATION.md
-   AI_CONTEXT.md
-   PROJECT_ROADMAP.md
-   CONTRIBUTING.md
-   CHANGELOG.md

## Current Architecture

Client

↓

Routes

↓

Validation

↓

Authentication

↓

Authorization

↓

Controllers

↓

Models

↓

MongoDB Atlas

## Roadmap

Upcoming improvements:

-   Response utility
-   Database indexes
-   Helmet
-   Rate limiting
-   Swagger/OpenAPI
-   Service layer
-   DTO layer
-   Logging
-   Docker support

## License

This project is intended for educational and portfolio purposes.
