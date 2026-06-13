# Viatiway — Personal Use

**Platforms:** PC / iOS / Android (PWA)

> This document describes the current, **personal-use** direction of Viatiway. The earlier enterprise specification lives in [`viatiway_spec.md`](viatiway_spec.md) and is deferred — it will return later as an extension of this app.

---

## 1. Introduction and goals

**Context:** Viatiway was originally built to settle business-trip expenses for a company. The owner no longer works there, so the product pivots to **personal use** — mainly for the owner. It stays **open-source**.

**Goal:** Plan trips and track travel spending against a live budget, keep a personal vehicle in good shape, and let accumulated history make future trips predictable.

**Non-goals (for now):** Legal *delegacja* settlement (diet/km rates per Ministry of Finance regulations), approval workflow, B&A/accounting export. These belong to the deferred enterprise edition.

---

## 2. Core concept — a trip is a live budget

The central object is no longer a business trip to be settled, but an **open budget**:

- You open a trip with a target budget (e.g. **500 zł**).
- The trip runs **live** — you add expenses as they happen (fuel, small purchases, accommodation, tolls, parking).
- **Mileage is not legal-rate based.** The real cost of driving comes from your **fuel receipts/invoices**, not from a PLN/km regulation.
- A closed trip drops into **history**, which feeds the prediction layer.

There is **no approval/submission workflow** — no `DRAFT → SUBMITTED → APPROVED`. A trip is simply open or closed.

---

## 3. Three pillars

### 3.1 Live budget *(core concept)*
- Open budget with real-time expense tracking.
- Each expense is a line item: amount, category, optional receipt photo, who paid (for splitting).
- **Cost splitting** among co-travelers: when several people travel together, the app shows who owes what and for what (e.g. their share of fuel).

### 3.2 Garage — vehicle management
- Register one or more vehicles.
- **Reminders** for: technical inspection (*przegląd*), insurance, fluid changes, mileage milestones.
- Independent of trips — the garage works on its own schedule.

### 3.3 Prediction layer *(grows with history)*
- Travel-time estimates from past trips.
- Fuel-price estimates (see model below).
- Typical-expense suggestions when planning a new trip.
- Turns on once there is enough history; starts collecting from day one.

---

## 4. Milestones

| Stage | Scope |
|---|---|
| **MVP** *(in progress)* | Add a new trip, view trip history, user login, and profile management — the foundational skeleton. |
| **v1.0** | Live budgets & real-time expense entry, cost splitting among travelers, the vehicle garage with reminders, attachments. |
| **v2.0** | Prediction layer (travel time, fuel price, expenses), pre-planning, live tracking of an ongoing stay. |
| **Later** | Enterprise edition revived as an extension (see §9). |

> The MVP is intentionally a thin vertical slice — auth, profile, and trip CRUD with history — so there's a working app to live with and start collecting history. The live-budget and garage richness (the heart of the product) lands in v1.0.

---

## 5. Future scope (beyond MVP)

- **Pre-planning trips and stays ahead of time** — e.g. a trip to Mazury in two months with an open budget split across travel, accommodation, and food, set up in advance.
- **Live tracking of an ongoing stay (e.g. a vacation)** — a longer trip you follow in real time throughout: budget burn-down, running expenses, and the routes you've driven during the stay, all in one place.

---

## 6. Decisions & open questions

| Topic | Decision |
|---|---|
| **Fuel prices** | **Hybrid.** The owner's receipts are the base data — self-sufficient, fully open-source, works offline. Optional enrichment from an external retail-price source when available. |
| **Cost-splitting / co-travelers** | **Undecided.** Model must stay flexible to support both *labels-only* (name + amount, no account) and *in-app accounts* (each traveler logs in, sees their share). Tied to the auth decision. |
| **Auth** | **Undecided.** Single-user with login, no-auth local, or multi-user — TBD by owner. Don't assume. |
| **Routing / travel time** | Prefer an **open-source, self-hostable** engine (OSRM / Valhalla / GraphHopper + OpenStreetMap), not Google Maps (paid, not OSS). |

---

## 7. External dependencies / risks

- **Fuel-price enrichment source** — no free official API for Polish retail prices; candidates (e-petrol, autocentrum) are scrape-based and fragile. Mitigated by the hybrid model: receipts always work; enrichment is best-effort.
- **Routing engine** — self-hosting OSM-based routing adds ops overhead; acceptable for an open-source personal app.

---

## 8. Tech stack

Unchanged from the enterprise edition — see [`viatiway_spec.md` §5](viatiway_spec.md). React + Vite (PWA) · Node.js + Express · PostgreSQL + Prisma · MUI · Docker + Cloudflare Tunnel. New: an open-source routing engine for travel-time prediction.

**Design system — Moss & Clay.** The UI runs on a custom design system layered over MUI: warm, earthy, tactile (moss greens, clay, sand), deliberately a step away from the rigid, cold feel of typical utility/expense apps. Built from CSS design tokens (`frontend/src/styles/tokens.css`) and component classes (`frontend/src/styles/components.css`). It expresses the personal, friendly character of the app — this is something you live with on a trip, not a corporate form.

---

## 9. Relation to the enterprise edition

The enterprise edition (delegacje, legal rates, approval workflow, admin panel) is **deferred, not deleted**. It will return as an **extension** built on top of the personal app. Existing enterprise code and models (roles, `accessLevel`, admin middleware/routes, `DRAFT/SUBMITTED/APPROVED`, diet/km rate logic) are **kept and deprioritized**, not removed.
