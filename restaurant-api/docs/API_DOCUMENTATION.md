# API_DOCUMENTATION.md

# Restaurant Order Management API

## REST API Reference

## Base URL

    http://localhost:5000/api

------------------------------------------------------------------------

# Authentication

Protected endpoints require:

    Authorization: Bearer <JWT_TOKEN>

Roles: - Customer - Admin - Manager - Staff - Kitchen - Delivery

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

## PATCH /auth/profile

Authentication Required

Updates the authenticated user's own profile. At least one field is required. Accepts an optional `avatar` image file (multipart/form-data).

### Body

  Field     Type     Required
  --------- -------- ----------
  fullName  string   No
  phone     string   No
  address   string   No
  avatar    file     No

------------------------------------------------------------------------

## PATCH /auth/change-password

Authentication Required

Changes the authenticated user's own password. Requires correctly re-entering the current password.

### Body

  Field             Type     Required
  ----------------- -------- ----------
  currentPassword   string   Yes
  newPassword       string   Yes

Possible errors

-   Current password is incorrect

------------------------------------------------------------------------

# Menu Endpoints

## POST /menus

Admin only.

Creates a menu category.

### Body

  Field           Type     Required
  --------------- -------- ----------
  categoryName    string   Yes
  description     string   No
  icon            string   No
  status          string   No

`status` must be one of: Active, Draft (defaults to Active). `icon` is a lucide icon name.

------------------------------------------------------------------------

## GET /menus

Public endpoint.

Returns a paginated list of menu categories, each with a computed `itemCount` (foods currently assigned) and `revenue` (this menu's % share of total order revenue, attributed via each food's current menu assignment).

Supports:

-   page
-   limit

Returns pagination metadata.

------------------------------------------------------------------------

## GET /menus/:id

Public endpoint.

Returns a single menu category.

Possible errors

-   Menu not found

------------------------------------------------------------------------

## PATCH /menus/:id

Admin only.

Updates selected fields.

### Body

  Field           Type     Required
  --------------- -------- ----------
  categoryName    string   No
  description     string   No
  icon            string   No
  status          string   No

Possible errors

-   Menu not found

------------------------------------------------------------------------

## DELETE /menus/:id

Admin only.

Deletes a menu category.

Possible errors

-   Menu not found

------------------------------------------------------------------------

# Food Endpoints

## POST /foods

Admin only.

Creates a new food item. Accepts multipart/form-data with an optional `image` file.

### Body

  Field             Type      Required
  ----------------- --------- ----------
  name              string    Yes
  description       string    Yes
  ingredients       array     Yes
  price             number    Yes
  preparationTime   number    Yes
  menu              string    Yes
  availability      boolean   No
  station           string    No
  image             file      No

`station` must be one of: Bakery, Beverages, Breakfast, Fryer, Grill, Legumes & Pots, Pepper Soup, Protein Prep, Rice & Grains, Swallow & Soup.

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

Authentication Required.

Creates a new order for the authenticated user. An admin may instead create the order on behalf of an existing registered customer by passing an optional `customerId` in the body (ignored for any other role).

Stores historical snapshots including:

-   foodName
-   priceAtPurchase
-   quantity

### Body

  Field         Type     Required
  ------------- -------- ----------
  items         array    Yes
  customerId    string   No

Each `items` entry has: food (id, required), quantity (number, required), notes (string, optional).

------------------------------------------------------------------------

## GET /orders/my-orders

Authentication Required.

Returns orders belonging to the authenticated customer.

------------------------------------------------------------------------

## GET /orders/all-orders

Admin or Manager only.

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

Admin, Manager, or Kitchen only.

Allowed statuses

-   Pending
-   Confirmed
-   Preparing
-   Out For Delivery
-   Delivered
-   Cancelled

------------------------------------------------------------------------

## PATCH /orders/:orderId/items/:itemId/toggle

Admin, Manager, or Kitchen only.

Toggles the prep-complete state of a single order item (kitchen bump/recall).

Possible errors

-   Order not found
-   Order item not found

------------------------------------------------------------------------

## PATCH /orders/:orderId/assign-rider

Admin or Manager only.

Assigns a rider to an order and dispatches it. Sets the order's status to "Out For Delivery".

### Body

  Field     Type     Required
  --------- -------- ----------
  riderId   string   Yes

Possible errors

-   Order not found
-   Rider not found

------------------------------------------------------------------------

## PATCH /orders/:orderId/cancel

Customer only.

Business Rules

-   Customer must own the order.
-   Delivered orders cannot be cancelled.
-   Out For Delivery orders cannot be cancelled.

------------------------------------------------------------------------

## DELETE /orders/:orderId

Admin only.

Permanently deletes an order. Only allowed when the order's status is already "Delivered" or "Cancelled".

Possible errors

-   Order not found
-   Only delivered or cancelled orders can be deleted (400 if the order's status is anything else)

------------------------------------------------------------------------

# Dashboard Endpoints

## GET /dashboard/kpis

Admin or Manager only.

Returns headline KPIs for today versus yesterday: revenue, order count, pending orders, kitchen queue size and average wait time, and distinct customers, each with a day-over-day percentage delta where applicable.

------------------------------------------------------------------------

## GET /dashboard/revenue-series

Admin or Manager only.

Returns today's revenue broken down by hour of day.

------------------------------------------------------------------------

## GET /dashboard/peak-hours

Admin or Manager only.

Returns today's order volume broken down by hour of day.

------------------------------------------------------------------------

## GET /dashboard/prep-time-series

Admin or Manager only.

Returns today's average prep+delivery time (in minutes) for delivered orders, broken down by hour of day.

------------------------------------------------------------------------

## GET /dashboard/top-foods

Admin or Manager only.

Returns the top 5 best-selling foods for today, ranked by quantity sold.

------------------------------------------------------------------------

# Analytics Endpoints

## GET /analytics/overview

Admin or Manager only.

Returns overview analytics for the selected range compared to the immediately-preceding period of equal length: revenue, orders, average prep time, active customers, a revenue series, order status distribution, peak hours, top foods (with period-over-period growth), customer growth by month, and generated insights.

Supports:

-   range

Accepted `range` values: today, 7d (default), 30d, 90d, ytd.

Examples

    GET /analytics/overview?range=7d
    GET /analytics/overview?range=today
    GET /analytics/overview?range=ytd

------------------------------------------------------------------------

## GET /analytics/sales

Admin or Manager only.

Returns sales analytics for the selected range: gross sales, net sales, discounts, average ticket size, revenue by menu category, and hourly sales.

Supports:

-   range

Accepted `range` values: today, 7d (default), 30d, 90d, ytd.

Examples

    GET /analytics/sales?range=30d

------------------------------------------------------------------------

## GET /analytics/kitchen

Admin or Manager only.

Returns kitchen performance analytics for the selected range: average prep time, on-time/late percentages measured against the restaurant's configured target prep time, a daily prep time series, and station load.

Supports:

-   range

Accepted `range` values: today, 7d (default), 30d, 90d, ytd.

Examples

    GET /analytics/kitchen?range=90d

------------------------------------------------------------------------

## GET /analytics/customers

Admin or Manager only.

Returns customer analytics for the selected range: active customers, returning rate, average lifetime value, churn rate, customer growth by month, and customer tier segments (VIP / Regular / New).

Supports:

-   range

Accepted `range` values: today, 7d (default), 30d, 90d, ytd.

Examples

    GET /analytics/customers?range=ytd

------------------------------------------------------------------------

# Rider Endpoints

## POST /riders

Admin or Manager only.

Creates a new delivery rider.

### Body

  Field         Type     Required
  ------------- -------- ----------
  name          string   Yes
  phone         string   Yes
  vehicleType   string   Yes
  status        string   No

`vehicleType` must be one of: car, bike, scooter.
`status` must be one of: available, en_route, returning, offline (defaults to available).

------------------------------------------------------------------------

## GET /riders

Admin, Manager, or Delivery only.

Returns a paginated list of riders.

Supports:

-   page
-   limit
-   status

Examples

    GET /riders?page=1&limit=20
    GET /riders?status=available

Returns pagination metadata.

------------------------------------------------------------------------

## GET /riders/:id

Admin, Manager, or Delivery only.

Returns a single rider.

Possible errors

-   Rider not found

------------------------------------------------------------------------

## PATCH /riders/:id

Admin or Manager only.

Updates selected rider fields. At least one field is required.

### Body

  Field         Type     Required
  ------------- -------- ----------
  name          string   No
  phone         string   No
  vehicleType   string   No
  status        string   No

Possible errors

-   Rider not found

------------------------------------------------------------------------

## PATCH /riders/:id/location

Admin, Manager, or Delivery only.

Updates a rider's current location. Admin-manual stand-in until a rider-facing client exists.

### Body

  Field   Type     Required
  ------- -------- ----------
  lat     number   Yes
  lng     number   Yes

Possible errors

-   Rider not found

------------------------------------------------------------------------

# Settings Endpoints

## GET /settings/restaurant

Admin only.

Returns the restaurant's profile settings: name, contact info, address, business hours, and target prep time. This is a singleton document, created lazily on first read.

------------------------------------------------------------------------

## PATCH /settings/restaurant

Admin only.

Updates the restaurant's profile settings. At least one field is required.

### Body

  Field                   Type     Required
  ----------------------- -------- ----------
  name                    string   No
  email                   string   No
  phone                   string   No
  address                 string   No
  businessHours           array    No
  targetPrepTimeMinutes   number   No

Each `businessHours` entry has: day (one of Monday-Sunday, required), isOpen (boolean), openTime (string), closeTime (string).

------------------------------------------------------------------------

## GET /settings/notifications

Authentication Required

Returns the authenticated user's own notification preferences. Created lazily on first read.

------------------------------------------------------------------------

## PATCH /settings/notifications

Authentication Required

Updates the authenticated user's own notification preferences. At least one field is required. There is no `:id` param — this always acts on the requesting user's own record.

### Body

  Field            Type      Required
  ---------------- --------- ----------
  newOrders        boolean   No
  cancellations    boolean   No
  dailySummary     boolean   No
  productUpdates   boolean   No

------------------------------------------------------------------------

# Team Management Endpoints

Admin only. Manages internal staff accounts — `role` one of: admin, manager, staff, kitchen, delivery.

## GET /users/team

Admin only.

Returns all internal team members (non-customer roles), sorted by name.

------------------------------------------------------------------------

## POST /users/team

Admin only.

Creates a new team member account directly. There is no email-invite flow — the account is created immediately with the given password.

### Body

  Field      Type     Required
  ---------- -------- ----------
  fullName   string   Yes
  email      string   Yes
  password   string   Yes
  role       string   Yes

`role` must be one of: admin, manager, staff, kitchen, delivery.

Possible errors

-   A user with this email already exists

------------------------------------------------------------------------

## PATCH /users/team/:id/role

Admin only.

Changes a team member's role.

### Body

  Field   Type     Required
  ------- -------- ----------
  role    string   Yes

`role` must be one of: admin, manager, staff, kitchen, delivery.

Possible errors

-   You cannot change your own role
-   Team member not found

------------------------------------------------------------------------

## DELETE /users/team/:id

Admin only.

Removes a team member's account.

Possible errors

-   You cannot remove your own account
-   Team member not found

------------------------------------------------------------------------

# Customer Management Endpoints

Admin or Manager only. Operates on customer accounts (`role: "customer"`) specifically — distinct from Team Management above.

## GET /users

Admin or Manager only.

Returns a paginated list of customers with aggregated order stats (total orders, total spent, last order date) and a computed loyalty tier.

Supports:

-   page
-   limit
-   search

Examples

    GET /users?page=1&limit=10
    GET /users?search=jane

Returns pagination metadata.

------------------------------------------------------------------------

## GET /users/:id

Admin or Manager only.

Returns a single customer's detail: profile, aggregated order stats, loyalty tier, favorite foods, and order history.

Possible errors

-   Customer not found

------------------------------------------------------------------------

## PATCH /users/:id/block

Admin or Manager only.

Toggles a customer's blocked state (`isActive`).

Possible errors

-   Customer not found

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
