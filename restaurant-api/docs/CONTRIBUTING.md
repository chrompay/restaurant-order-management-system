# CONTRIBUTING.md

# Contributing Guide

Thank you for contributing to the Restaurant Order Management API.

## Development Principles

-   Follow the existing layered architecture.
-   Keep controllers focused on request/response handling.
-   Place reusable logic in utilities (and future services).
-   Validate requests with Joi.
-   Use AppError for operational errors.
-   Follow RESTful conventions.

## Project Structure

-   config/
-   controllers/
-   middleware/
-   models/
-   routes/
-   utils/
-   validators/
-   docs/

## Branch Strategy

Recommended branches:

-   main
-   develop
-   feature/`<feature-name>`{=html}
-   bugfix/`<bug-name>`{=html}

## Commit Messages

Examples:

-   feat: add food pagination
-   fix: handle invalid order id
-   docs: update API documentation
-   refactor: simplify order controller

## Coding Standards

-   Use async/await.
-   Prefer const over let where appropriate.
-   Use descriptive variable names.
-   Keep functions small.
-   Avoid duplicated logic.

## Pull Request Checklist

Before opening a pull request:

-   Code compiles.
-   Server starts successfully.
-   MongoDB connection works.
-   Validation passes.
-   Error handling uses AppError.
-   Endpoints tested in Postman.
-   Documentation updated if required.

## Testing Checklist

Authentication

-   Register
-   Login
-   Profile

Foods

-   CRUD
-   Pagination
-   Search
-   Sorting

Menus

-   Create
-   List

Orders

-   Create
-   View own
-   View all
-   Update status
-   Cancel
-   Filtering
-   Pagination

## Documentation

Keep these files current:

-   README.md
-   docs/DEVELOPER_GUIDE.md
-   docs/PROJECT_ARCHITECTURE.md
-   docs/API_DOCUMENTATION.md
-   docs/AI_CONTEXT.md
-   docs/PROJECT_ROADMAP.md
-   docs/CHANGELOG.md

## Future Contributors

Before implementing new features:

1.  Read README.md.
2.  Read docs/AI_CONTEXT.md.
3.  Review PROJECT_ROADMAP.md.
4.  Follow existing architecture.

Consistency is preferred over introducing new patterns.
