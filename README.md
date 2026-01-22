# Suhaas BD Backend

Refactored Express.js backend with TypeScript and Prisma.

## Features

- **TypeScript**: Static typing for better developer experience and code quality.
- **Express.js**: Fast, unopinionated, minimalist web framework for Node.js.
- **Prisma**: Next-generation ORM for Node.js and TypeScript.
- **PostgreSQL**: Robust, open-source object-relational database system.
- **Modular Structure**: Professional folder structure for scalability.
- **Middleware**: Built-in error handling and logging.

## Project Structure

```
src/
├── config/          # Configuration files (database, env)
├── controllers/     # Route controllers
├── services/        # Business logic
├── routes/          # API routes
├── middlewares/     # Custom middleware
├── utils/           # Utility functions
├── types/           # TypeScript type definitions
└── index.ts         # Application entry point
```

## Setup

1.  **Clone the repository**

2.  **Install dependencies**

    ```bash
    npm install
    ```

3.  **Configure Environment Variables**
    Copy `.env.example` to `.env` and update the values:

    ```bash
    cp .env.example .env
    ```

    Make sure to update `DATABASE_URL` with your PostgreSQL connection string.

4.  **Database Setup**
    Ensure your PostgreSQL database is running, then allow Prisma to manage the schema:

    ```bash
    npm run db:push
    ```

    Or if you want to create a migration:

    ```bash
    npm run db:migrate
    ```

5.  **Start the server**
    ```bash
    npm run dev
    ```

## Scripts

- `npm run dev`: Start the development server with hot-reloading.
- `npm run build`: Build the project (using tsx build).
- `npm run db:generate`: Generate Prisma Client.
- `npm run db:push`: Push the Prisma schema state to the database without creating a migration.
- `npm run db:migrate`: Create and apply a migration.
- `npm run db:studio`: Open Prisma Studio to view and edit data.

## API Endpoints

### Users

- `GET /api/users`: Get all users
- `GET /api/users/:id`: Get user by ID
- `POST /api/users`: Create a new user
  - Body: `{ "email": "user@example.com", "password": "password", "name": "John Doe" }`
- `PUT /api/users/:id`: Update a user
- `DELETE /api/users/:id`: Delete a user

## License

ISC
