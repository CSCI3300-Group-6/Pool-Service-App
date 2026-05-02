# PSA
Hosted on vercel at: https://pool-service-app.vercel.app/login

A pool service management platform built with Next.js App Router, TypeScript, Tailwind CSS, Prisma, PostgreSQL, Zod, React Hook Form, and date-fns.
This project was made using nextjs.org/learn and templates/formatting from vercel.com/templates. 


It supports:

- Role-based authentication
- Customer and pool management
- Technician scheduling
- Job Checklists
- Service logs and chemical logs
- Automated chemistry alerts
- Compliance and financial reports
- CSV export
- Customer updates

## Demo credentials

All demo users use the password `demo1234`.

- Owner: `john@poolcleaners.test`
- Operations Manager: `scylla@poolcleaners.test`
- Technician: `alex@poolcleaners.test`
- Technician: `maya@poolcleaners.test`
- Technician: `diego@poolcleaners.test`

## Local setup

1. Copy the environment file:

```bash
cp .env.example .env
```

or if using the docker image:

```bash
cp .env.docker.example .env
```

2. Install dependencies:

```bash
npm install
```

3. Create a Neon PostgreSQL database and add its connection strings to `.env`:

```bash
DATABASE_URL="postgresql://..."
DIRECT_URL="postgresql://..."
```

`DATABASE_URL` should be the pooled Neon connection string and `DIRECT_URL` should be the direct connection string for Prisma migrations.

or if you're using the docker image, you must remove line 8 from [schema.prisma](prisma/schema.prisma).
```
8 | directUrl = env("DIRECT_URL") [delete this line]
```
 run
```bash
docker compose up -d
```
close the docker image after use with
```bash
docker compose down
```

4. Generate Prisma client and run the database migrations:

```bash
npm run db:generate
npm run db:migrate
```

5. Seed demo data:

```bash
npm run db:seed
```

6. Start the app:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## SMTP behavior

If these environment variables are present, customer updates send as real emails:

- `SMTP_HOST`
- `SMTP_PORT`
- `SMTP_USER`
- `SMTP_PASS`
- `SMTP_FROM`

## Vercel deployment

Set these environment variables in Vercel for `Production`, `Preview`, and `Development`:

- `DATABASE_URL`
- `DIRECT_URL`
- `SMTP_HOST`
- `SMTP_PORT`
- `SMTP_USER`
- `SMTP_PASS`
- `SMTP_FROM`

Deploy-time database workflow:

```bash
npm run db:migrate:deploy
```

After the first migration, run the seed once against your Neon database if you want the demo accounts and sample data:

```bash
npm run db:seed
```

## Seeded scenarios

The seed includes:

- Pool Cleaners Inc organization
- John, Scylla, Alex, Maya, and Diego
- residential, community, resort, splash zone, and hot tub pools
- jobs scheduled for today and upcoming days
- historical service logs and chemical logs
- incidents
- out-of-range chemistry that creates alerts
- equipment expenses

## Core routes

- `/login`
- `/dashboard`
- `/customers`
- `/pools`
- `/schedule`
- `/jobs`
- `/my-jobs`
- `/checklists`
- `/reports/compliance`
- `/reports/financial`
- `/team`
- `/settings`

## Architecture notes

- `app/`: App Router routes, layouts, dashboards, pages, and API handlers
- `components/`: reusable UI and client-side forms
- `lib/`: auth, permissions, reports, alerts, email, validation, and Prisma helpers
- `prisma/`: schema and seed data

## Database reset

To refresh local demo data:

```bash
npm run db:migrate
npm run db:seed
```
