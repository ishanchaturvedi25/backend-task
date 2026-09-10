# Backend Task

REST API for user registration, login, JWT authentication, PostgreSQL persistence, and Redis-based login rate limiting.

## Requirements

- Node.js 22+
- PostgreSQL
- Redis

## Setup

1. Install dependencies:

```bash
npm install
```

2. Copy `.env.example` to `.env` and set the PostgreSQL, Redis, and JWT values.

3. Generate the Prisma client and create the database table:

```bash
npx prisma generate
npx prisma db push
```

4. Start the API:

```bash
npm run dev
```

The server listens on `http://localhost:3000` by default.

## API

### Register

`POST /api/users/sign-up`

```json
{
  "name": "Ada Lovelace",
  "email": "ada@example.com",
  "password": "strong-password"
}
```

### Login

`POST /api/users/login`

The JWT is returned in an HTTP-only `token` cookie. Login is limited to five attempts per IP in a 60-second Redis window. Requests above the limit return `429 Too Many Requests` and include `Retry-After`.

### Protected profile

`GET /api/users/`

Requires the `token` cookie created by registration or login.

## Database

The `User` model is defined in `prisma/schema.prisma`. Passwords are hashed with bcrypt and are never returned by the API.

## Redis failure behavior

If Redis is unavailable, the API remains available and the limiter fails open. Start Redis to enforce the login limit:

```bash
redis-server
```

## Project structure

- `controllers/`: HTTP request handlers
- `services/`: authentication and database operations
- `middleware/`: authentication and rate limiting
- `routes/`: API routes
- `prisma/`: Prisma schema and client
- `config/`: Redis configuration