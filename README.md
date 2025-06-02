## Getting Started

Follow these steps to set up and run the project for the first time.

### Prerequisites

Ensure you have the following installed:
* [Docker Desktop](https://www.docker.com/products/docker-desktop)
* [Node.js](https://nodejs.org/)
* [npm](https://www.npmjs.com/)

### Initial Setup

1.  **Clone the Repository:**
    ```bash
    git clone [https://github.com/Kazarius40/mediconnect-api.git](https://github.com/Kazarius40/mediconnect-api.git)
    cd mediconnect-api
    ```

2.  **Create Environment File:**
    Ensure you have a `.env` file in the **root of the project directory**. This file contains crucial environment variables for both Docker Compose and the NestJS application. An example `.env` file structure is as follows (replace placeholders with actual values):

    ```env
    # JWT
    JWT_SECRET=6f2d71035cefcefc5390dc1edc912f09a6738668d917bc87f75e07e5a01607d5ebd7945aa4e73564
    ACCESS_TOKEN_EXPIRATION_TIME=3600
    REFRESH_TOKEN_EXPIRATION_TIME=86400

    # MySQL
    DB_TYPE=mysql
    DB_HOST=db
    DB_PORT=3306
    DB_USERNAME=user
    DB_PASSWORD=user
    DB_ROOT_PASSWORD=superpass
    DB_DATABASE=mediconnect
    ```
    **Note:** `DB_HOST` must be `db` (the service name in `docker-compose.yml`) for inter-container communication.

3.  **Start Docker Containers:**
    Navigate to the project root (where `docker-compose.yml` is located) and run:
    ```bash
    docker-compose up --build
    ```
    This command will build your API service image and start both the `mediconnect-db` (MySQL) and `mediconnect-api` containers. The MySQL database will be initialized from scratch.

4.  **Run Database Migrations:**
    After the containers are up and running, you need to apply the database schema. This project uses TypeORM migrations to manage the database structure. **It is essential to run migrations after the first setup and whenever there are changes to database entities.**

    **Open a NEW terminal window** and navigate to the project root:
    ```bash
    cd mediconnect-api
    ```
    Now, proceed with the migration commands:

    * **Navigate to the backend directory:**
        ```bash
        cd backend
        ```

    * **Execute pending migrations (for initial setup or updates):**
        ```bash
        npm run migration:run
        ```
      This command will apply any pending database schema changes (that you've already generated and pushed), ensuring your database columns match the application's code entities. **This is the primary command for anyone cloning the repository or pulling updates.**

    * **Generate new migrations (for local development when you change entities):**
      If you make changes to TypeORM entities (e.g., add new fields, create new tables), you'll need to generate a new migration file.
        ```bash
        npm run migration:generate -- ./src/database/migrations/YourMigrationName
        # Replace 'YourMigrationName' with a descriptive name for your migration.
        # Ensure the path './src/database/migrations/' exists.
        ```
      After generating, you must run `npm run migration:run` again to apply these new changes to your database. Commit generated migration files to version control.

    * **Return to the project root (optional):**
        ```bash
        cd ..
        ```

### Usage

Once the setup is complete and migrations are successfully applied, your API will be running and connected to the database. You can now use tools like Postman to interact with your API endpoints. The API will be accessible at `http://localhost:3000`.