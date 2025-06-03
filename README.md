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

## ⚙️ Initial Setup & Running the Application

1.  **Clone the repository:**

    ```bash
    git clone [https://github.com/Kazarius40/mediconnect-api.git](https://github.com/Kazarius40/mediconnect-api.git)
    cd mediconnect-api
    ```

2.  **Create a `.env` file in the root directory:**

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

    ❗ `DB_HOST` must be `db` as this is the service name in `docker-compose.yml`.

3.  **Start the Docker containers:**

    ```bash
    docker-compose up --build
    ```

    This will build the images, apply migrations, and start the NestJS API. The administrator account will be automatically created on the first run if it doesn't already exist.

---

## 🛠 Generating New Migrations

After changing entities:

```bash
cd mediconnect-api/backend
npm run migration:generate -- ./src/database/migrations/YourMigrationName
```

🔧 Replace YourMigrationName with something descriptive, for example AddClinicEmailField.

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
"password": "StrongPassword123"
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
    "password": "StrongPassword123"
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

## 👩‍⚕️ Doctors
🔒 Admin endpoints require an accessToken from a user with the ADMIN role.

    Create Doctor – POST /doctors
    Get All Doctors – GET /doctors
    Filter/Sort Doctors – GET /doctors?firstName=...
    Get by ID – GET /doctors/:id
    Update Completely – PUT /doctors/:id
    Update Partially – PATCH /doctors/:id
    Delete – DELETE /doctors/:id

## 🏥 Clinics
🔒 Admin endpoints require an accessToken from a user with the ADMIN role.

    Create Clinic – POST /clinics
    Get All Clinics – GET /clinics
    Filter/Sort – GET /clinics?name=...
    Get by ID – GET /clinics/:id
    Update Completely – PUT /clinics/:id
    Update Partially – PATCH /clinics/:id
    Delete – DELETE /clinics/:id

## 🧰 Services
🔒 Admin endpoints require an accessToken from a user with the ADMIN role.

    Create Service – POST /services
    Get All Services – GET /services
    Filter/Sort – GET /services?name=...
    Get by ID – GET /services/:id
    Update Completely – PUT /services/:id
    Update Partially – PATCH /services/:id
    Delete – DELETE /services/:id

## 📄 API Documentation (Swagger UI)
    After starting, it's available at:
    http://localhost:3000/api

✅ Authorize via the "Authorize" button, inserting the token in the format:
Bearer YOUR_ACCESS_TOKEN

## 💾 Database Dump
A database dump in .sql format will be provided separately. It can be imported into:

    DBeaver
    MySQL Workbench
    phpMyAdmin