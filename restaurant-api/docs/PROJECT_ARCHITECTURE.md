# PROJECT_ARCHITECTURE.md

# Restaurant Order Management API

## Project Architecture Guide

## 1. Architecture Philosophy

The project follows a layered architecture to separate responsibilities,
improve maintainability, and prepare the codebase for future growth.

Current layers:

Client ↓ Routes ↓ Validation Middleware ↓ Authentication Middleware ↓
Authorization Middleware ↓ Controllers ↓ Mongoose Models ↓ MongoDB Atlas

Future target:

Client ↓ Routes ↓ Validation ↓ Authentication ↓ Authorization ↓
Controllers ↓ Services ↓ DTOs ↓ Repositories (optional) ↓ Models ↓
MongoDB

------------------------------------------------------------------------

## 2. Folder Responsibilities

config/ - Database connection

controllers/ - Handle HTTP requests - Coordinate business logic - Return
API responses

middleware/ - Authentication - RBAC - Validation - Error handling

models/ - Mongoose schemas

routes/ - Endpoint registration

validators/ - Joi request schemas

utils/ - Shared utilities - AppError - Future response helper

------------------------------------------------------------------------

## 3. Request Lifecycle

Incoming Request ↓ Express Router ↓ Joi Validation ↓ JWT Authentication
↓ Role Authorization ↓ Controller ↓ Database Operation ↓ Global Error
Handler (if required) ↓ JSON Response

------------------------------------------------------------------------

## 4. Database Model Relationships

User (1) │ └──────\< Order (Many)

Menu (1) │ └──────\< Food (Many)

Food (Many) │ └──────\< Order Items (Snapshot)

Order items intentionally store: - foodName - priceAtPurchase - quantity

This preserves historical order integrity after menu updates.

------------------------------------------------------------------------

## 5. Security Architecture

Current: - JWT Authentication - Password hashing (bcrypt) - Joi
validation - RBAC - Centralized error handling

Planned: - Helmet - Rate limiting - Request sanitization - Compression -
Structured logging

------------------------------------------------------------------------

## 6. API Design Principles

-   RESTful endpoints
-   PATCH for state transitions
-   Stateless authentication
-   JSON responses
-   Pagination metadata
-   Consistent error handling

------------------------------------------------------------------------

## 7. Current Strengths

-   Layered project structure
-   Snapshot-based order history
-   Global error middleware
-   Pagination, search, sorting and filtering
-   Modular validation
-   MongoDB Atlas integration

------------------------------------------------------------------------

## 8. Planned Evolution

Phase 1 - Response helper - Schema indexes

Phase 2 - Swagger/OpenAPI

Phase 3 - Service layer

Phase 4 - DTO layer

Phase 5 - Logging - Docker - CI/CD

------------------------------------------------------------------------

## 9. Design Goals

-   Maintainability
-   Scalability
-   Readability
-   Security
-   Testability
-   Extensibility

This architecture document should evolve together with the codebase
whenever new architectural decisions are introduced.
