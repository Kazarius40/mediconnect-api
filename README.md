# 🚀 Getting Started

## 📋 Prerequisites

Make sure you have the following software installed:

-   **Docker Desktop** – [Download and Install](https://www.docker.com/products/docker-desktop/) (includes Docker Compose)

## Start the Docker environment and initialize the database:
## Navigate to the root directory of your project in your terminal and run the following commands:

# Build and start all services in detached mode
```bash
docker-compose up -d --build
```
---

🗂 Database Migrations
This project uses TypeORM for database migrations.

Generate a new migration
Run the following command, replacing MigrationName with a descriptive name (no spaces):

```bash
npm run migration:generate:local -- ./src/database/MyMigrationName
```
This will create a new migration file in:

./src/database/migrations/

🌐 API Endpoints
Base URL: http://localhost:3000

🔑 Authentication

## User Registration:

HTTP
```bash
POST /auth/register
```

JSON
```bash
{
"email": "patient@example.com",
"password": "StrongPassword123!"
}
```

## User Login:

HTTP
```bash
POST /auth/login
```

JSON
```bash
{
    "email": "test@example.com",
    "password": "StrongPassword123!"
}
```
Returns accessToken and refreshToken.

## Password Recovery:

HTTP
```bash
POST /auth/forgot-password
```
JSON
```bash
{
    "email": "registered@example.com"
}
```
⚠️ Email is not sent; the token needs to be retrieved from the DB (users table, resetPasswordToken field).

## Password Reset:
HTTP
```bash
POST /auth/reset-password
```
JSON
```bash
{
    "token": "TOKEN_FROM_DATABASE",
    "password": "NewStrongPassword456!"
}
```

## 🛠️ User Management (Admin Only)
🔒 These endpoints require an accessToken from a user with the ADMIN role.

Update User Role:

HTTP
```bash
PATCH /auth/users/:id/role
```
JSON
```bash
{
    "role": "DOCTOR"
}
```
Possible roles: ADMIN, DOCTOR, PATIENT.

Delete User:

HTTP
```bash
DELETE /auth/users/:id
```
Password Recovery:

HTTP
```bash
POST /auth/forgot-password
```
JSON
```bash
{
    "email": "registered@example.com"
}
```
## 👩‍⚕️ Doctors
🔒 Admin endpoints require an accessToken from a user with the ADMIN role.

    Create – POST /doctors
    Get All – GET /doctors
    Filter/Sort – GET /doctors?firstName=...
    Get by ID – GET /doctors/:id
    Update Completely – PUT /doctors/:id
    Update Partially – PATCH /doctors/:id
    Delete – DELETE /doctors/:id

## 🏥 Clinics
🔒 Admin endpoints require an accessToken from a user with the ADMIN role.

    Create – POST /clinics
    Get All – GET /clinics
    Filter/Sort – GET /clinics?name=...
    Get by ID – GET /clinics/:id
    Update Completely – PUT /clinics/:id
    Update Partially – PATCH /clinics/:id
    Delete – DELETE /clinics/:id

## 🧰 Services
🔒 Admin endpoints require an accessToken from a user with the ADMIN role.

    Create – POST /services
    Get All – GET /services
    Filter/Sort – GET /services?name=...
    Get by ID – GET /services/:id
    Update Completely – PUT /services/:id
    Update Partially – PATCH /services/:id
    Delete – DELETE /services/:id

## 📄 API Documentation (Swagger UI)
    After starting, it's available at:

    http://localhost:3000/api/docs

✅ Authorize via the "Authorize" button, inserting the token in the format:
Bearer YOUR_ACCESS_TOKEN

## 🧹 Code Quality & Architecture

This project follows modern backend best practices:

- ✅ Modular architecture with clearly separated features (auth, doctors, clinics, etc.)
- ✅ Clean folder structure (controllers, services, DTOs, guards, swagger)
- ✅ DTO validation and transformation via `class-validator` / `class-transformer`
- ✅ Full Swagger documentation for all endpoints
- ✅ Role-based access control (RBAC) with guards
- ✅ Typed responses using custom Swagger DTOs
- ✅ RESTful conventions across all routes
- ✅ Designed for easy extension and maintenance
