# Viatiway

> An open-source PWA for planning trips and tracking travel expenses on a live budget — with a personal vehicle garage and history-driven predictions.

[![React](https://img.shields.io/badge/React-+Vite-61DAFB?logo=react)](https://react.dev/)
[![Node.js](https://img.shields.io/badge/Node.js-Express-339933?logo=nodedotjs)](https://nodejs.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-+Prisma-4169E1?logo=postgresql)](https://www.postgresql.org/)
[![Docker](https://img.shields.io/badge/Docker-Compose-2496ED?logo=docker)](https://www.docker.com/)
[![Status](https://img.shields.io/badge/Status-In%20Development-orange)]()

---

## About

Viatiway is an open-source Progressive Web App for **personal travel and expense tracking**. You open a trip with a budget (e.g. 1000 zł), add expenses as they happen — fuel, small purchases, accommodation — and watch the budget in real time. Mileage isn't computed from legal rates; the real cost comes straight from your fuel receipts. Closed trips build a history that powers predictions for future travel time, fuel prices, and typical expenses.

It also keeps your vehicle in check: reminders for inspections, insurance, fluids, and mileage. And when you travel in a group, it splits the costs so everyone knows who owes what.

Because it's a PWA, the app runs on any device (iOS, Android, PC) directly from the browser — no App Store installation required.

The interface is built on **Moss & Clay**, a custom design system — warm, earthy, and tactile, a deliberate step away from the rigid, cold look of typical utility apps.

> **Project direction:** Viatiway started as an enterprise tool for settling business-trip expenses (*delegacje*). It has pivoted to **personal use**. The original enterprise edition is not abandoned — it will return later as an extension of the personal app. See [`docs/viatiway_personal.md`](docs/viatiway_personal.md) for the current vision and [`docs/viatiway_spec.md`](docs/viatiway_spec.md) for the deferred enterprise specification.

---

## Features

### Core — live trips & budgets
- Open a trip with a target budget and track spending against it in real time
- Add expenses on the go — fuel, purchases, accommodation, tolls, parking
- Mileage cost derived from real fuel receipts/invoices (no legal-rate calculation)
- Split costs among co-travelers — see who owes what and for what
- Trip history with full detail view

### Garage — vehicle management
- Register one or more vehicles
- Reminders for inspection, insurance, fluid changes, and mileage milestones
- Attach notes, photos, and receipts

### Predictions *(grows with your history)*
- Travel-time estimates based on past trips
- Fuel-price estimates — hybrid model: your receipts as the base, optionally enriched from external retail-price sources
- Typical-expense suggestions when planning a new trip

### Security
- JWT authentication (Bearer token)
- Passwords hashed with bcrypt
- HTTPS only

> The auth model (single-user vs multi-user) and the co-traveler model (labels vs accounts) are still being finalized — see the personal-use doc.

---

## Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | React + Vite + `vite-plugin-pwa` |
| Backend | Node.js + Express |
| Database | PostgreSQL + Prisma ORM |
| UI | **Moss & Clay** custom design system on Material UI (MUI) — warm, earthy, tactile |
| Routing / travel time | Open-source engine (OSRM / Valhalla / GraphHopper + OSM) — TBD |
| Hosting | Docker Compose + Cloudflare Tunnel |

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

### Database migrations

```bash
npx prisma migrate deploy
```

---

## Roadmap

| Stage | Scope |
|-------|-------|
| **MVP** *(in progress)* | Add a new trip, view trip history, user login, and profile management |
| **v1.0** | Live trip budgets & real-time expense entry, cost splitting among travelers, vehicle garage with reminders, attachments (photos, receipts) |
| **v2.0** | Predictions (travel time, fuel price, expenses), pre-planning future trips/stays, live tracking of an ongoing stay (e.g. a vacation) — budget, expenses, and routes driven |
| **Later** | Enterprise edition revived as an extension — delegacje, legal diet/km rates, approval workflow, admin panel |

---

> Open-source. Contributions and ideas welcome.
