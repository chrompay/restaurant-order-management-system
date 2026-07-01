# AI_CONTEXT.md

# AI Context File

## Restaurant Order Management API

> Purpose: This file provides persistent project context for AI coding
> assistants such as ChatGPT and Codex. Read this file before generating
> or modifying code.

------------------------------------------------------------------------

# Project Summary

This project is a backend-only Restaurant Order Management System built
with:

-   Node.js
-   Express.js
-   MongoDB Atlas
-   Mongoose
-   JWT
-   Joi

Architecture follows a layered REST API approach.

------------------------------------------------------------------------

# Current Folder Structure

config/ controllers/ middleware/ models/ routes/ validators/ utils/
docs/

------------------------------------------------------------------------

# Completed Features

Authentication - User Registration - Login - JWT Authentication - User
Profile

Authorization - Admin - Customer

Menus - Create - List

Foods - CRUD - Pagination - Search - Sorting

Orders - Create - View Own Orders - View All Orders - Update Status -
Cancel Order - Pagination - Filtering - Sorting - Snapshotting

Infrastructure - Joi Validation - AppError - Global Error Middleware

------------------------------------------------------------------------

# Coding Conventions

-   Keep controllers thin.
-   Reuse middleware.
-   Use async/await.
-   Pass operational errors using next(new AppError()).
-   Do not duplicate validation logic.
-   Use PATCH for state changes.
-   Maintain RESTful endpoint naming.

------------------------------------------------------------------------

# Response Style

Success

{ "success": true, "data": {} }

Error

{ "success": false, "status": "fail", "message": "..." }

------------------------------------------------------------------------

# Design Decisions

1.  JWT chosen for stateless authentication.
2.  Joi validates requests before controllers.
3.  Order snapshotting preserves historical pricing.
4.  Global error middleware centralizes error handling.
5.  Pagination implemented for scalability.

------------------------------------------------------------------------

# Known Technical Debt

-   Introduce response utility.
-   Convert remaining middleware responses to AppError.
-   Add database indexes.
-   Add Swagger.
-   Add Service Layer.
-   Add DTO Layer.
-   Add structured logging.
-   Add Docker and CI/CD.

------------------------------------------------------------------------

# Rules for AI Assistants

Always preserve:

-   Layered architecture
-   Existing folder structure
-   REST conventions
-   JWT authentication
-   RBAC
-   Joi validation
-   Global error handling
-   Snapshot-based orders

Do not introduce breaking changes without updating documentation.

When adding features:

1.  Update validators.
2.  Update routes.
3.  Update controllers.
4.  Update documentation.
5.  Keep code consistent with existing style.

------------------------------------------------------------------------

# Current Development Roadmap

Next priorities:

1.  Response utility
2.  Database indexing
3.  Helmet
4.  Rate limiting
5.  Swagger/OpenAPI
6.  Service layer
7.  DTO layer
8.  Logging
9.  Docker
10. Automated testing

This document should be updated after every significant architectural
change.
