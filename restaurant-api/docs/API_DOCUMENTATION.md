# API_DOCUMENTATION.md

# Restaurant Order Management API

## REST API Reference

## Base URL

    http://localhost:5000/api

------------------------------------------------------------------------

# Authentication

Protected endpoints require:

    Authorization: Bearer <JWT_TOKEN>

Roles: - Customer - Admin

------------------------------------------------------------------------

# Authentication Endpoints

## POST /auth/register

Registers a new customer.

### Body

  Field      Type     Required
  ---------- -------- ----------
  fullName   string   Yes
  email      string   Yes
  password   string   Yes

### Success

201 Created

### Errors

-   Validation failed
-   User already exists

------------------------------------------------------------------------

## POST /auth/login

Authenticates a user and returns a JWT.

Body:

  Field      Required
  ---------- ----------
  email      Yes
  password   Yes

Returns:

-   JWT Token
-   Success message

------------------------------------------------------------------------

## GET /auth/profile

Authentication Required

Returns the authenticated user's profile.

------------------------------------------------------------------------

# Menu Endpoints

## POST /menus

Admin only.

Creates a menu category.

Required fields:

-   categoryName
-   description

------------------------------------------------------------------------

## GET /menus

Public endpoint.

Returns all menu categories.

------------------------------------------------------------------------

# Food Endpoints

## POST /foods

Admin only.

Creates a new food item.

Fields

-   name
-   description
-   ingredients
-   price
-   preparationTime
-   menu

------------------------------------------------------------------------

## GET /foods

Public endpoint.

Supports:

-   page
-   limit
-   name
-   sort

Examples

    GET /foods?page=1&limit=5
    GET /foods?name=rice
    GET /foods?sort=-price

Returns pagination metadata.

------------------------------------------------------------------------

## GET /foods/:id

Returns a single food item.

Possible errors

-   Invalid ID
-   Food not found

------------------------------------------------------------------------

## PATCH /foods/:id

Admin only.

Updates selected fields.

------------------------------------------------------------------------

## DELETE /foods/:id

Admin only.

Deletes a food item.

------------------------------------------------------------------------

# Order Endpoints

## POST /orders

Customer only.

Creates a new order.

Stores historical snapshots including:

-   foodName
-   priceAtPurchase
-   quantity

------------------------------------------------------------------------

## GET /orders/my-orders

Customer only.

Returns orders belonging to the authenticated customer.

------------------------------------------------------------------------

## GET /orders/all-orders

Admin only.

Supports

-   page
-   limit
-   status
-   sort

Examples

    GET /orders/all-orders?page=1
    GET /orders/all-orders?status=Pending
    GET /orders/all-orders?sort=-createdAt

------------------------------------------------------------------------

## PATCH /orders/:orderId/status

Admin only.

Allowed statuses

-   Pending
-   Confirmed
-   Preparing
-   Out For Delivery
-   Delivered
-   Cancelled

------------------------------------------------------------------------

## PATCH /orders/:orderId/cancel

Customer only.

Business Rules

-   Customer must own the order.
-   Delivered orders cannot be cancelled.
-   Out For Delivery orders cannot be cancelled.

------------------------------------------------------------------------

# Standard Success Response

``` json
{
  "success": true,
  "data": {}
}
```

------------------------------------------------------------------------

# Standard Error Response

``` json
{
  "success": false,
  "status": "fail",
  "message": "Description"
}
```

------------------------------------------------------------------------

# Validation

Request validation is implemented using Joi before controller execution.

------------------------------------------------------------------------

# Error Handling

Operational errors are handled using:

-   AppError
-   Global Error Middleware

Handled errors include:

-   Invalid ObjectId
-   Duplicate keys
-   Validation errors
-   Invalid JWT
-   Expired JWT

------------------------------------------------------------------------

# Future API Enhancements

-   Swagger / OpenAPI
-   Versioned APIs (/api/v1)
-   Response utility
-   DTO responses
-   Service layer
-   Automated integration tests
