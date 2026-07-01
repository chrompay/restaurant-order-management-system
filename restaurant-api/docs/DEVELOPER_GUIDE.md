# DEVELOPER_GUIDE.md

# Restaurant Order Management API

## Developer Guide (Version 1.0)

> This document serves as the engineering handbook for the Restaurant
> Order Management API. It documents the current architecture, coding
> standards, development workflow, and future roadmap. It is intended
> for developers, reviewers, and AI coding assistants.

------------------------------------------------------------------------

# 1. Project Overview

## Purpose

The Restaurant Order Management API is a production-oriented RESTful
backend built with Node.js, Express.js and MongoDB Atlas. It provides
secure user authentication, role-based authorization, menu management,
food management, order processing and order lifecycle management.

## Current Features

-   JWT Authentication
-   Role-Based Access Control (Admin / Customer)
-   Menu Management
-   Food CRUD
-   Order Creation
-   Historical Order Snapshotting
-   Order Cancellation
-   Order Status Workflow
-   Joi Validation
-   Global Error Handling
-   Pagination
-   Searching
-   Sorting
-   Filtering

------------------------------------------------------------------------

# 2. Technology Stack

  Layer              Technology
  ------------------ ---------------
  Runtime            Node.js
  Framework          Express.js
  Database           MongoDB Atlas
  ODM                Mongoose
  Authentication     JWT
  Password Hashing   bcryptjs
  Validation         Joi
  Environment        dotenv
  Logging            Morgan
  Cross-Origin       CORS

------------------------------------------------------------------------

# 3. Current Folder Structure

``` text
restaurant-api/
├── config/
├── controllers/
├── middleware/
├── models/
├── routes/
├── utils/
├── validators/
├── server.js
└── package.json
```

Responsibilities:

-   config → database connection
-   controllers → request handling
-   middleware → authentication, authorization, validation, errors
-   models → mongoose schemas
-   routes → API endpoints
-   validators → Joi schemas
-   utils → reusable utilities

------------------------------------------------------------------------

# 4. Current Request Lifecycle

Client

↓

Routes

↓

Validation Middleware

↓

Authentication Middleware

↓

Authorization Middleware

↓

Controller

↓

MongoDB

↓

Response

------------------------------------------------------------------------

# 5. Authentication

Implemented:

-   Register
-   Login
-   JWT Generation
-   Protected Routes
-   Profile Endpoint

Roles:

-   customer
-   admin

------------------------------------------------------------------------

# 6. Authorization

Current RBAC:

Customer

-   Create Orders
-   View Own Orders
-   Cancel Own Orders

Admin

-   Manage Foods
-   Manage Menus
-   View All Orders
-   Update Order Status

------------------------------------------------------------------------

# 7. Validation

Validation uses Joi.

Modules:

-   Authentication
-   Foods
-   Menus
-   Orders

Validation occurs before controller execution.

------------------------------------------------------------------------

# 8. Error Handling

Architecture

Controller

↓

next(error)

↓

Global Error Middleware

↓

Client

Current handled errors:

-   Invalid ObjectId
-   Duplicate Keys
-   Validation Errors
-   JWT Errors
-   Token Expiration
-   AppError

------------------------------------------------------------------------

# 9. Food Module

Capabilities:

-   Create Food
-   List Foods
-   Get Single Food
-   Update Food
-   Delete Food

Supports:

-   Pagination
-   Search by name
-   Sorting

------------------------------------------------------------------------

# 10. Menu Module

Capabilities:

-   Create Menu
-   List Menus

Relationship:

Menu

↓

Foods

------------------------------------------------------------------------

# 11. Order Module

Workflow

Pending

↓

Confirmed

↓

Preparing

↓

Out For Delivery

↓

Delivered

Customers may cancel before delivery according to business rules.

Historical Snapshot:

Each order stores:

-   foodName
-   priceAtPurchase
-   quantity

This preserves historical accuracy when menu prices change.

------------------------------------------------------------------------

# 12. Coding Standards

Controllers

-   Keep business logic concise.
-   Pass errors using next(error).
-   Use AppError for operational errors.

Routes

-   Thin routing layer.
-   Delegate to controllers.

Models

-   One model per file.
-   Keep schemas focused.

------------------------------------------------------------------------

# 13. REST Standards

POST → Create

GET → Read

PATCH → Partial Updates

DELETE → Delete

PATCH is intentionally used for order status transitions.

------------------------------------------------------------------------

# 14. Security

Current

-   JWT
-   bcrypt
-   Joi
-   RBAC

Planned

-   Helmet
-   Rate Limiting
-   Request Sanitization
-   Response Compression

------------------------------------------------------------------------

# 15. Future Architecture

Target Architecture

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

Services

↓

DTOs

↓

Models

↓

MongoDB

------------------------------------------------------------------------

# 16. Planned Enhancements

-   Response Utility
-   Database Indexes
-   Swagger / OpenAPI
-   Service Layer
-   DTO Layer
-   Winston Logging
-   Docker
-   CI/CD
-   Automated Tests

------------------------------------------------------------------------

# 17. Development Roadmap

Completed

-   Authentication
-   Menu Module
-   Food Module
-   Order Module
-   Pagination
-   Filtering
-   Sorting
-   Global Error Handling

Next

1.  Response Utility
2.  Database Optimization
3.  Security Middleware
4.  Swagger
5.  Service Layer
6.  DTO Layer
7.  Logging
8.  Deployment

------------------------------------------------------------------------

# 18. AI Assistant Instructions

When continuing development:

-   Preserve RESTful design.
-   Preserve layered architecture.
-   Continue using AppError.
-   Continue using Joi validation.
-   Continue using JWT authentication.
-   Keep controllers thin.
-   Prefer reusable utilities over duplication.
-   Follow existing naming conventions.
-   Avoid introducing breaking changes without documentation.

This document should be updated whenever a new architectural decision is
introduced.
