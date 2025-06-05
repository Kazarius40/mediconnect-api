# 🚀 Getting Started

## 📋 Prerequisites

Make sure you have the following software installed:

-   **Docker Desktop** – [Download and Install](https://www.docker.com/products/docker-desktop/) (includes Docker Compose)
-   **Node.js (v18.x or higher)** – [Download](https://nodejs.org/)
-   **npm** (included with Node.js):
    Update to the latest version:
    ```bash
    npm install -g npm@latest
    ```

---

## ⚙️ Initial Setup & Running the Application (Standard)

    **Create a `.env` file in the root directory:**
    ```env
    # JWT Configuration
    JWT_SECRET=6f2d71035cefcefc5390dc1edc912f09a6738668d917bc87f75e07e5a01607d5ebd7945aa4e73564
    ACCESS_TOKEN_EXPIRATION_TIME=3600
    REFRESH_TOKEN_EXPIRATION_TIME=86400

    # MySQL Database Configuration
    DB_TYPE=mysql
    DB_HOST=db
    DB_PORT=3306
    DB_USERNAME=user
    DB_PASSWORD=user
    DB_ROOT_PASSWORD=superpass
    DB_DATABASE=mediconnect

    # Admin Account (automatically created if it doesn't exist)
    ADMIN_EMAIL=test@example.com
    ADMIN_PASSWORD=Qwerty1!
    ```

`DB_HOST` must be `db` as this is the service name in `docker-compose.yml`.

###  Initial Admin User: When the database is first initialized (i.e., if no data exists), an admin user with the credentials specified in ADMIN_EMAIL and ADMIN_PASSWORD in your .env file will be automatically created. This admin user has full control: they can assign the admin role to others, delete any user (including other admins), but cannot delete their own account.

     **Start the Docker containers:**

    ```bash
    docker-compose up --build
    ```

---

## 🚨 First-Time Setup (From Scratch) & Initial Migration Generation

If you have already successfully run the project (by following the steps in the "Initial Setup & Running the Application (Standard)" section), and all migrations have been applied, you **do not need** to repeat these steps.

1.  **Full Docker Environment Cleanup:**
    Ensure you are in the root directory of your project.
    ```bash
    docker-compose down --volumes --rmi all
    ```
2.  **Start only the database service (`db`):**
    ```bash
    docker-compose up -d db
    ```
    Wait until the `mediconnect-db` container becomes `healthy`. You can check its status with the command `docker-compose ps`.

3.  **Generate the initial migration:**
    ```bash
    docker-compose run --rm \
    --entrypoint "npm" \
    migration run migration:generate -- ./src/database/migrations/InitialMigration
    ```
4.  **Launch the entire Docker stack:**
    ```bash
    docker-compose up --build
    ```

---


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

## 💾 Database Dump
A database dump in .sql format will be provided separately. It can be imported into:

    DBeaver
    MySQL Workbench
    phpMyAdmin