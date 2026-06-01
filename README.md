# Hackathon Backend API

Backend API built with Node.js, Express.js, Prisma ORM, and PostgreSQL.

## Requirements

* Node.js 20+
* npm 10+
* PostgreSQL 15+

Check installed versions:

```bash
node -v
npm -v
psql --version
```

## Clone Repository

```bash
git clone <repository-url>
cd hackathon-BE-app
```

## Install Dependencies

```bash
npm install
```

## Environment Setup

Create a `.env` file in the project root:

```env
DATABASE_URL="postgresql://postgres:password@localhost:5432/hackathon_be_db"
PORT=3000
```

## Create Database

Login to PostgreSQL:

```bash
psql -U postgres
```

Create database:

```sql
CREATE DATABASE hackathon_be_db;
```

Verify database exists:

```sql
\l
```

## Prisma Setup

Generate Prisma Client:

```bash
npx prisma generate
```

Run existing migrations:

```bash
npx prisma migrate deploy
```

For local development:

```bash
npx prisma migrate dev
```

## Start Development Server

```bash
node cmd/main.js
```

Or if a dev script exists:

```bash
npm run dev
```

## Prisma Commands

Generate Prisma Client:

```bash
npx prisma generate
```

Create New Migration:

```bash
npx prisma migrate dev --name migration_name
```

Apply Migration:

```bash
npx prisma migrate deploy
```

Open Prisma Studio:

```bash
npx prisma studio
```

Reset Database:

```bash
npx prisma migrate reset
```

Pull Existing Database Schema:

```bash
npx prisma db pull
```

## Project Structure

```text
.
├── cmd
│   └── main.js
├── internal
│   ├── app
│   └── pkg
├── prisma
│   ├── migrations
│   └── schema.prisma
├── generated
│   └── prisma
├── package.json
└── prisma.config.ts
```

### Directory Description

| Directory        | Description                            |
| ---------------- | -------------------------------------- |
| cmd              | Application entrypoint                 |
| internal/app     | Business logic and application modules |
| internal/pkg     | Shared packages and utilities          |
| prisma           | Database schema and migrations         |
| generated/prisma | Generated Prisma Client                |

## Database Migration Workflow

After modifying `prisma/schema.prisma`:

```bash
npx prisma migrate dev --name your_migration_name
```

Then regenerate Prisma Client:

```bash
npx prisma generate
```

## API Health Check

After the server is running:

```bash
curl http://localhost:3000
```

or

```bash
curl http://localhost:3000/health
```

depending on the configured route.
