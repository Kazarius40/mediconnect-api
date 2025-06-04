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

---

## 🚨 First-Time Setup (From Scratch) & Initial Migration Generation

If you have already successfully run the project (by following the steps in the "Initial Setup & Running the Application (Standard)" section), and all migrations have been applied, you **do not need** to repeat these steps.

1.  **Full Docker Environment Cleanup:**
    ```bash
    docker-compose down --volumes --rmi all
    ```
    * **Important:** After this command, **manually delete any existing migration files** from your local `backend/src/database/migrations/` directory.

2.  **Start only the database service (`db`):**
    ```bash
    docker-compose up -d db
    ```
    Wait until the `mediconnect-db` container becomes `healthy`. You can check its status with the command `docker-compose ps`.

3.  **Prepare `docker-compose.yml` for migration generation:**
    * Open your `docker-compose.yml` file.
    * **Comment out the `depends_on` sections** for the `migration` and `api` services. They should look approximately like this:

        ```yaml
        # ... other services ...

        migration:
          # ...
          # depends_on:
          #   db:
          #     condition: service_healthy

        api:
          # ...
          # depends_on:
          #   migration:
          #     condition: service_completed_successfully
          # ...
        ```
    * **Save `docker-compose.yml`**.

4.  **Start the `api` service (temporarily):**
    ```bash
    docker-compose up -d api
    ```

5.  **Generate the initial migration:**
    Ensure you are in the root directory of your project (`mediconnect-api`).
    ```bash
    docker-compose exec api npm run typeorm -- migration:generate -d ./src/data-source.ts ./src/database/migrations/InitialMigration
    ```

6.  **Restore `docker-compose.yml` and launch the full stack:**
    * **Stop the `api` container**:
        ```bash
        docker-compose stop api
        ```
    * **Uncomment the `depends_on` sections** back in your `docker-compose.yml` for the `migration` and `api` services, returning them to their original state.
    * **Save `docker-compose.yml`**.
    * Now, launch the entire Docker stack.
        ```bash
        docker-compose down
        docker-compose up --build
        ```

---

## 🛠 Generating & Applying New Migrations

This procedure is used when you make changes to your TypeORM entities (data models) and need to create and apply new migrations.

1.  **Make changes to your TypeORM entities**.
2.  **Generate a new migration:**
    Ensure your Docker stack (at least `db` and `api` containers) is running (`docker-compose ps`).
    * **There is NO need to comment out `depends_on`** at this stage. They should remain active.
    ```bash
    docker-compose exec api npm run typeorm -- migration:generate -d ./src/data-source.ts ./src/database/migrations/YourNewFeatureMigrationName
    ```
    🔧 Replace `YourNewFeatureMigrationName` with a descriptive name, e.g., `AddClinicEmailField`.

3.  **Apply the new migration and restart services:**
    To apply new migrations to the database, you need to restart the Docker stack.
    ```bash
    docker-compose down
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