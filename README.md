# Viatiway

> A PWA for registering and settling business travel expenses for consultants.

[![React](https://img.shields.io/badge/React-+Vite-61DAFB?logo=react)](https://react.dev/)
[![Node.js](https://img.shields.io/badge/Node.js-Express-339933?logo=nodedotjs)](https://nodejs.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-+Prisma-4169E1?logo=postgresql)](https://www.postgresql.org/)
[![Docker](https://img.shields.io/badge/Docker-Compose-2496ED?logo=docker)](https://www.docker.com/)
[![Status](https://img.shields.io/badge/Status-In%20Development-orange)]()

---

## About

Viatiway is an simple Progressive Web App built for field consultants. It eliminates the need to manually fill out Excel spreadsheets. Consultant registers a business trip in the app, the system automatically calculates mileage reimbursement and daily allowances in accordance with Polish Ministry of Finance regulations, and generates a ready-to-send PDF or Excel document for the accounting department.

Because it's a PWA, the app works on any device (iOS, Android, PC) directly from the browser  no App Store installation required.

> For the full product specification see [`docs/viatiway_spec.md`](docs/viatiway_spec.md).

---

## Features

### Consultant (mobile-first & PC)
- Register a business trip  route, time, purpose, client, transport mode
- Automatic mileage and daily allowance calculation (Polish MF regulations)
- Trip history with full detail view
- Export to PDF and Excel (company-formatted template)
- Send the document via native email client (`mailto:`)
- Vehicle management (private / company car, engine displacement)
- Attachments  notes, photos and receipts per trip
- Duplicate a previous trip to avoid re-entering data

### Administrator / B&A (desktop only)
- User account management
- Manage mileage and allowance rates (rate changes do not affect already-approved trips)
- View trips submitted by all consultants

### Security
- JWT authentication (Bearer token)
- Two access levels: `USER` and `ADMIN`
- Passwords hashed with bcrypt
- HTTPS only

---

## Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | React + Vite + `vite-plugin-pwa` |
| Backend | Node.js + Express |
| Database | PostgreSQL + Prisma ORM |
| UI | Material UI (MUI)  Material Design 3 |
| PDF Generation | Puppeteer (HTML template) |
| Hosting | Docker Compose + Cloudflare Tunnel |

---

## Data Model

The application uses 6 database tables:

| Table | Description |
|-------|-------------|
| `users` | User accounts  consultants and administrators |
| `trips` | Business trip records |
| `trips_history` | Financial snapshot created on trip approval  freezes rates from the departure date |
| `attachments` | Notes, photos and receipts attached to a trip |
| `rates` | Mileage and allowance rate history managed by admins |
| `vehicles` | Vehicles registered to a user |

A trip moves through three statuses: `DRAFT` → `SUBMITTED` → `APPROVED`. Editing and deletion are only allowed in `DRAFT` status.

---

## API

REST API with `/api/v1/` prefix. Every endpoint except `/auth/login` requires a valid JWT token.

```
POST   /api/v1/auth/login
GET    /api/v1/auth/me

GET    /api/v1/trips
POST   /api/v1/trips
GET    /api/v1/trips/:id
PUT    /api/v1/trips/:id
DELETE /api/v1/trips/:id
POST   /api/v1/trips/:id/copy
POST   /api/v1/trips/:id/submit
POST   /api/v1/trips/:id/export

GET    /api/v1/vehicles
POST   /api/v1/vehicles
PUT    /api/v1/vehicles/:id
DELETE /api/v1/vehicles/:id

# Require access_level: ADMIN
GET    /api/v1/admin/trips
GET    /api/v1/admin/users
POST   /api/v1/admin/users
GET    /api/v1/admin/rates
POST   /api/v1/admin/rates
```

---

## Getting Started

### Requirements
- Docker & Docker Compose
- Node.js 20+

### Configuration

Copy the environment file and fill in your values:

```bash
cp .env.example .env
```

Required variables:

```env
DATABASE_URL=postgresql://user:password@db:5432/viatiway
JWT_SECRET=your_secret_key
```

### Run

```bash
docker compose up -d --build
```

The app will be available at the address configured in your Cloudflare Tunnel (e.g. `viatiway.company.pl`).

### Database migrations

```bash
npx prisma migrate deploy
```

---

## Roadmap

| Stage | Scope |
|-------|-------|
| **MVP** *(in progress)* | Trip registration, mileage & allowance calculation, PDF export, email delivery, JWT auth, admin panel |
| **v1.0** | Trip history, filtering, duplication, attachments (photos, notes), Excel export |
| **v2.0** | Microsoft Azure SSO, AI receipt OCR, statistics, production hosting |

---