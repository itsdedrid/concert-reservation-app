🎵 Concert Reservation App

A simple full-stack application for managing concerts and reservations, built with NestJS (backend API), Next.js/React (frontend), and Prisma + SQLite (database).

⚙️ Setup & Local Development

1. Clone & install dependencies

```bash
git clone https://github.com/itsdedrid/concert-reservation-app.git
cd concert-reservation-app
```

Backend:

```bash
cd api
npm install
```

Frontend:

```bash
cd web
npm install
```

2. Database setup
The app uses Prisma with SQLite by default.
Run migrations:

```bash
cd api
npx prisma migrate dev --name init
```

3. Environment variables
Backend (api/.env):

```bash
DATABASE_URL="file:./dev.db"
WEB_ORIGIN=http://localhost:3000
```

Frontend (web/.env.local):

```bash
NEXT_PUBLIC_API_URL=http://localhost:3001
```

4. Run servers
Backend (NestJS API):

```bash
cd api
npm run start:dev
# runs on http://localhost:3001
```

Frontend (Next.js):

```bash
cd web
npm run dev
# runs on http://localhost:3000
```

🌱 Database Seeding

This project includes a Prisma seed script that populates initial data.

Seed data created:
User
id: user-1
email: test@test
name: test
isAdmin: false

Run seed:

```bash
cd api
npm run db:seed
```

Or reset database and reseed:

```bash
npm run db:reset
```

🏗️ Application Architecture

Frontend (web/)
Built with Next.js 13 (App Router) + React + TailwindCSS
Provides UI for:
- Admin: create concerts, view list/history, delete concerts
- User: view concerts, reserve/cancel seats

Backend (api/)
Framework: NestJS
Database: Prisma ORM + SQLite
Modules:
- ConcertModule → CRUD concerts
- ReservationModule → reserve/cancel seats with business rules (no duplicate, sold out handling)

Validation & Error Handling
class-validator + global ValidationPipe → request DTO validation
Standardized error responses → shown in frontend Toasts

Testing
Jest unit tests for services & controllers
Prisma is mocked for fast isolated tests

📦 Libraries & Packages

Backend (NestJS)
@nestjs/core / common → NestJS framework core
prisma / @prisma/client → ORM for DB access
class-validator / class-transformer → DTO validation
jest / ts-jest → unit testing

Frontend (Next.js)
next / react / react-dom → Next.js frontend
tailwindcss → styling
axios → HTTP client
lucide-react → icons

🧪 Running Unit Tests

Backend:

```bash
cd api
npm run test
```

src/concert/concert.service.spec.ts → tests concert CRUD logic
src/reservation/reservation.service.spec.ts → tests reservation business rules
src/concert/concert.controller.spec.ts / src/reservation/reservation.controller.spec.ts → controller unit tests with mocked services

Run in watch mode:

```bash
npm run test:watch

View coverage:
npm run test:cov
```

🚀 Summary

With this setup you can:
1. Start both backend and frontend locally
2. Seed the database with sample data (user-1 and concerts)
3. Run unit tests to verify backend logic

This makes development reproducible, easy to set up, and ready for further extension.
