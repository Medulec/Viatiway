# **Viatiway**
**Platforms:** PC / iOS / Android

---

## 1. Introduction and goals

**Context:** Facilitating the registration of business trips, commuting time registration, cost registration, route and travel planning, notepad. Important due to in-house use, making it easier for consultants to settle accounts with the B&A department.

**Goals:** Optimization of delivering documents that will facilitate the settlement of business trips. Elimination of manual Excel filling.

**Non-goals:** No hotel reservation system, no integration with external ERP systems. No support for foreign business trips in the MVP. No native app for iOS / Android.

**MVP:** User (consultant) fills in the business trip data in the application → the application generates a ready PDF/Excel according to the company format → The generated PDF is sent as an attachment via an e-mail client.

> This document mainly concerns the MVP version of the product. Functions mentioned but not detailed in the structure of views, data, etc. will be systematically added in subsequent updates.

---

## 2. Personas

### Consultant *(primary user)*
- Field worker, often on the road
- Mainly uses a phone (iOS/Android) or a PC browser
- Wants to quickly register a trip right after arriving at the client's
- Doesn't want to think about rates or calculations - the app is supposed to do it for them
- Wants to quickly and conveniently settle accounts with B&A without having to enter data in Excel.

### B&A Employee (admin)
- Processes business trips submitted by consultants
- Mainly uses a PC
- Needs a complete, correct document for settlement
- Doesn't want to ask the consultant about missing data
- Manages mileage and per diem rates
- Manages user accounts
- Ultimately can view the business trips of all users
- Uses exclusively a PC

---

## 3. User Stories

| ID | As a... | I want to... | So that I can... |
|----|---------|---------|---------------|
| US-01 | consultant | register a trip (from, to, km, purpose) | settle it |
| US-02 | consultant | see the history of my business trips | have insight into previous trips |
| US-03 | consultant | duplicate a previous business trip | not enter the same data from scratch |
| US-04 | consultant | export the business trip to PDF | send a ready document to B&A |
| US-05 | B&A employee | receive a PDF compliant with the company format | immediately proceed to settlement without corrections |
| US-06 | B&A employee | update the mileage rate | the app uses current values from the Ministry of Finance regulation |
| US-07 | B&A employee | manage user accounts | control access to the system |

---

## 4. MoSCoW

| Must Have (MVP) | Should Have | Could Have | Won't Have (for now) |
|:---|:---|:---|:---|
| Route registration, commuting time | Viewing travel history | OCR of receipts and invoices (AI) | Hotel reservation system |
| Automatic per diem calculation | Duplicating business trips | Route planning based on historical data | Sending push messages via Teams/mail related to business trips |
| Mileage calculation | Registration of the place of stay from the map | Simulation of fuel consumption/time before travel | Approving status via Teams/API |
| Data export to Excel/PDF | Viewing business trip statistics | SSO Authentication via Microsoft Azure | Full management of the company vehicle fleet |
| iOS/Android/PC compatibility (PWA) | Viewing the client base and commuting costs summary | Extensive permissions system with additional access levels (e.g. Manager) | |
| Classic authentication (e-mail and password) | Completing data on mileage and per diems from the Admin level | Managing user teams based on `department`, viewing statistics. | |
| Basic vehicle data | Administrator panel with specific accesses and an overview of currently ongoing business trips | | |
| Sending business trips via e-mail client | Note system for each route / client visit, storing receipts and photos | | |

---

## 5. Architecture and tech stack

| Layer | Technology |
|---------|-------------|
| Frontend | React + Vite + vite-plugin-pwa |
| Backend | Node.js + Express |
| Database | PostgreSQL + Prisma |
| UI | Material Design 3 (MUI) |
| PDF Generation | Puppeteer |
| Hosting (MVP) | Home server via Docker + Cloudflare Tunnel |

**Justification:**

The choice of the above tools was dictated by the *"JavaScript Everywhere"* philosophy, which will significantly shorten the development time for a creator familiar with this language, and will also facilitate subsequent maintenance and development of the project. React and Vite were chosen due to their optimal performance for projects of this size. In the future, it is possible to create a native application for iOS and Android systems using the `ionic` framework.

The application is built as a **PWA (Progressive Web App)** available at the address `delegacje.firma.pl`. It eliminates distribution problems - the consultant enters through a browser on any device (iOS, Android, PC) without installation from the App Store. The `vite-plugin-pwa` plugin generates a Service Worker and Web App Manifest, allowing the application to be installed on the phone's desktop.

PostgreSQL together with Prisma eliminates most problems related to writing raw SQL queries and facilitates subsequent database migrations. PostgreSQL was chosen for its educational values, industry standard status, and a higher degree of security for storing sensitive data.

Material Design 3 as a temporary solution for consistent, responsive interfaces - intuitive, clean, and accessible. Over time, it is planned to create our own UI Kit.

In the advanced version of the application, there are plans to implement an AI agent acting as a travel planning and settlement assistant to further streamline trip registration and route planning (this is also related to planning multi-stop business trips to several clients in a single day). At this point, it has not yet been determined which specific AI agent will be used to power this feature.

---

## 6. Data model

> Optimal view available in the [dbdiagram.io](https://dbdiagram.io) tool. The final database code exported to PostgreSQL.

### `users` - System users

Stores accounts of all people in the application: consultants, B&A employees, and administrators. Each user is assigned an access level (`USER`, `MANAGER`, or `ADMIN`), which determines what they can see and do in the system.

| Field | Description |
|---|---|
| `id` | Unique account identifier (primary key) |
| `name` | First and last name |
| `email` | E-mail address - unique throughout the system, used for login |
| `department` | Department in the company, e.g. Consulting |
| `role` | Position in the company, e.g. Senior Consultant |
| `access_level` | Access level: `USER` / `ADMIN` |
| `phone` | Phone number (optional) |
| `home_address` | Home address - can serve as the default starting point of the route |
| `mpk` | Cost Center - MPK code assigned to the user, automatically transferred to the business trip |
| `created_at` | Date and time the account was created |

---

### `trips` - Business trips

The main table of the application. Each row is one business trip submitted by a consultant. The table supports both car trips (with mileage allowance) and other means of transport (with ticket cost). It also stores meal data necessary to calculate the per diem in accordance with the Ministry of Finance regulation.

| Field | Description |
|---|---|
| `id` | Unique business trip identifier (primary key) |
| `user_id` | Who submitted the business trip - link to the `users` table |
| `transport_mode` | Mode of transport: `CAR_PRIVATE`, `CAR_COMPANY`, `TRAIN`, `BUS`, `PLANE` |
| `vehicle_id` | Selected vehicle - filled in only when driving a car, link to `vehicles` |
| `ticket_cost` | Ticket cost - filled in only for train, bus or plane |
| `destination_from` | From where - place of departure |
| `destination_to` | To where - destination |
| `distance` | Distance in kilometers |
| `purpose` | Purpose of the visit / reason for the trip |
| `client` | Name of the client the business trip concerns |
| `breakfast_count` | Number of breakfasts provided by the employer / client - reduces the per diem |
| `lunch_count` | Number of lunches provided by the employer / client - reduces the per diem |
| `dinner_count` | Number of dinners provided by the employer / client - reduces the per diem |
| `start_date` | Date and time of departure |
| `end_date` | Date and time of return |
| `created_at` | Date and time the entry was added to the system |
| `status` | Status of the business trip: `DRAFT` → `SUBMITTED` → `APPROVED` |

---

### `trips_history` - Settlement history

A financial snapshot created when the business trip is approved. It saves the rates that were valid on the day of departure and the calculated amounts - thanks to this, subsequent rate changes by the admin do not affect already settled business trips. It also includes additional costs (fuel, accommodation, parking, tolls) according to the company's settlement form.

| Field | Description |
|---|---|
| `id` | Unique entry identifier (primary key) |
| `trip_id` | Link to a specific business trip |
| `km_rate` | Mileage rate valid on the day of departure (PLN/km) |
| `diet_rate` | Daily per diem rate valid on the day of departure (PLN/day) |
| `km_total` | Calculated mileage value: distance × rate per km |
| `diet_total` | Calculated per diem value: number of entitled days × per diem rate |
| `fuel_cost` | Additional fuel costs (optional) |
| `accommodation_cost` | Accommodation costs (optional) |
| `parking_cost` | Parking costs (optional) |
| `toll_cost` | Highway toll costs (optional) |
| `other_cost` | Other additional costs (optional) |
| `other_cost_desc` | Description of the "other costs" item |
| `total_amount` | Total amount to be paid - sum of all costs |
| `settled_by` | Who approved the business trip - link to `users` |
| `settled_at` | When the business trip was settled |
| `notes` | Optional note from a B&A employee |

---

### `attachments` - Attachments

Files and notes attached to the business trip. One record is one attachment. The type determines which fields are used: a text note stores content in `content`, and a photo/receipt stores the file path in `file_path`.

| Field | Description |
|---|---|
| `id` | Unique attachment identifier (primary key) |
| `trip_id` | The business trip the attachment belongs to |
| `type` | Type: `NOTE` (text note), `IMAGE` (photo/receipt), `RECORDING` (audio recording) |
| `content` | Text note content - used only when `type = NOTE` |
| `file_path` | File path on the server - used for `IMAGE` and `RECORDING` |
| `file_name` | Original file name |
| `mime_type` | File format, e.g. `image/jpeg`, `audio/mpeg` |
| `created_at` | Date the attachment was added |

---

### `rates` - Rates

History of mileage and per diem rates managed by the admin. Each entry is a new rate with a valid-from date - the system always retrieves the one that was active on the day of departure. The mileage rate depends on the engine capacity of the vehicle (up to 900cm³ or above 900cm³) in accordance with the Ministry of Finance regulation.

| Field | Description |
|---|---|
| `id` | Unique rate identifier (primary key) |
| `type` | Rate type: `KM_RATE_SMALL` (≤900cm³) / `KM_RATE_LARGE` (>900cm³) / `DIET_RATE` |
| `value` | Rate value in PLN |
| `valid_from` | Date from which the rate is valid |
| `created_at` | When the entry was added to the system |
| `updated_by` | Which administrator added this rate - link to `users` |

---

### `vehicles` - Vehicles

List of vehicles assigned to the user. A consultant can have several cars (e.g. private and company) - one marked as default, which is suggested automatically for a new business trip.

| Field | Description |
|---|---|
| `id` | Unique vehicle identifier (primary key) |
| `user_id` | Vehicle owner - link to `users` |
| `vehicle_type` | Type: `CAR_PRIVATE` (private) or `CAR_COMPANY` (company) |
| `license_plate` | License plate number |
| `is_default` | Whether the vehicle is selected by default in the business trip form |

---

### Dictionaries (enums)

**`Permission`** - access levels: `USER` (consultant, standard access) (team trip preview) / `ADMIN` (full access, system management)

**`TripStatus`** - business trip states: `DRAFT` (draft, editable) → `SUBMITTED` (submitted for settlement) → `APPROVED` (approved by B&A)

**`VehicleType`** - means of transport: `CAR_PRIVATE` / `CAR_COMPANY` / `TRAIN` / `BUS` / `PLANE`

**`FileType`** - attachment types: `IMAGE` (photo, receipt) / `TEXT` (note) / `RECORDING` (audio recording)

**`RateType`** - rate types: `KM_RATE_SMALL` (capacity ≤900cm³, currently PLN 0.89) / `KM_RATE_LARGE` (capacity >900cm³, currently PLN 1.15) / `DIET_RATE` (daily per diem)

---

### Database schema (DBML)

```dbml
Table users {
  id uuid [pk] 
  name varchar [not null] 
  email varchar [unique, not null] 
  department varchar 
  role varchar [note: 'Role in the company, e.g. Senior Consultant'] 
  access_level Permission [not null, note: 'USER | ADMIN'] 
  phone varchar 
  home_address varchar 
  mpk varchar [note: 'Cost Center'] 
  created_at timestamp 
}

Table trips {
  id uuid [pk] 
  user_id uuid [ref: > users.id] 
  transport_mode VehicleType [not null] 
  vehicle_id uuid [ref: > vehicles.id, note: 'nullable - only for CAR_PRIVATE / CAR_COMPANY'] 
  ticket_cost decimal [note: 'nullable - only for TRAIN / BUS / PLANE'] 
  destination_from varchar 
  destination_to varchar 
  distance decimal 
  purpose varchar [note: 'Purpose of the visit / reason for the trip'] 
  client varchar [note: 'Required for PDF'] 
  breakfast_count int [default: 0, note: 'Number of breakfasts - reduces the per diem'] 
  lunch_count int [default: 0, note: 'Number of lunches - reduces the per diem'] 
  dinner_count int [default: 0, note: 'Number of dinners - reduces the per diem'] 
  start_date timestamp 
  end_date timestamp 
  created_at timestamp 
  status TripStatus 
}

Table trips_history {
  id uuid [pk] 
  trip_id uuid [ref: > trips.id] 
  km_rate decimal [note: 'mileage rate at the time of settlement'] 
  diet_rate decimal [note: 'per diem rate at the time of settlement'] 
  km_total decimal [note: 'distance_km * km_rate'] 
  diet_total decimal [note: 'number of days * diet_rate'] 
  fuel_cost decimal [note: 'additional fuel costs'] 
  accommodation_cost decimal [note: 'accommodation costs'] 
  parking_cost decimal [note: 'parking costs'] 
  toll_cost decimal [note: 'highway toll costs'] 
  other_cost decimal [note: 'other additional costs'] 
  other_cost_desc varchar [note: 'description of the other costs item'] 
  total_amount decimal [note: 'sum of all costs'] 
  settled_by uuid [ref: > users.id] 
  settled_at timestamp 
  notes varchar [note: 'optional B&A note'] 
}

Table attachments {
  id uuid [pk] 
  trip_id uuid [ref: > trips.id] 
  type FileType [note: 'NOTE | IMAGE | RECORDING'] 
  content text [note: 'only for NOTE'] 
  file_path varchar [note: 'only for IMAGE / RECORDING'] 
  file_name varchar 
  mime_type varchar 
  created_at timestamp 
}

Table rates {
  id uuid [pk] 
  type RateType [not null] 
  value decimal [not null] 
  valid_from timestamp [not null] 
  created_at timestamp [not null] 
  updated_by uuid [ref: > users.id] 
}

Table vehicles {
  id uuid [pk] 
  user_id uuid [ref: > users.id] 
  vehicle_type VehicleType 
  license_plate varchar 
  is_default bool [default: true] 
}

enum Permission {
  USER 
  ADMIN 
}

enum FileType {
  IMAGE 
  TEXT 
  RECORDING 
}

enum TripStatus {
  DRAFT 
  SUBMITTED 
  APPROVED 
}

enum VehicleType {
  CAR_COMPANY 
  CAR_PRIVATE 
  TRAIN 
  PLANE 
  BUS 
}

enum RateType {
  KM_RATE_SMALL 
  KM_RATE_LARGE 
  DIET_RATE 
}
```

---

## 7. Requirements

### 7.1 Business trip registration
- The system must allow the registration of a route (from, to, distance, client, purpose of visit)
- The system must register the start and end date and time of the business trip
- The system must automatically calculate the mileage value based on rates and distance
- The system must retrieve the rate valid on the start date of the business trip
- The system must automatically calculate the per diem value based on the number of days and the current rate, and include ticket costs if the mode of transport is not a car
- The system must allow the registration of the number of meals (breakfasts, lunches, dinners) provided during the business trip to properly calculate the per diem
- The system should allow the selection of a vehicle or another mode of transport
- The system should allow duplicating a previous business trip *(P6)*

### 7.2 Attachments
- The system must allow adding a text note to the business trip
- The system must allow adding a photo of a receipt or invoice
- The system should store attachments linked to a specific business trip

### 7.3 Export and sending
- The system must generate a PDF based on the established company template
- The system should be able to generate an Excel file with the business trip data
- The system must allow sending the generated document via an e-mail client
- The generated document must contain: consultant data, route, purpose, client, distance, vehicle, calculated mileage, per diem, and additional costs (fuel, accommodation, parking, tolls, other)

### 7.4 History and viewing
- The system must display the business trip history of the logged-in user
- The system should allow filtering history by date, client, status
- The system should display business trip statistics

### 7.5 Authentication and accounts
- The system must allow user login via e-mail and password, ultimately Microsoft SSO
- The system must support two access levels: `USER`, `ADMIN`
- The system must prevent access to other users' data for the `USER` level

### 7.6 Administrator panel
- The system must allow the administrator to update the mileage and per diem rates
- The system must store the history of rate changes along with their effective dates
- The system must allow administrators to manage user accounts
- The system must allow the administrator to view the business trips of all users

> Access to all endpoints except `/api/v1/auth/login` requires a valid JWT token. Endpoints `/api/v1/admin/*` additionally require `access_level: ADMIN`.

---

## 8. Screens

### 8.1 List of screens

| Screen name | Screen ID | Purpose | Permissions |
|---|---|---|---|
| Login | ACC-001 | Gaining access to the system | ALL |
| Dashboard | SCR-001 | Preview of the last 3 trips + bottom tab | ALL |
| Business trip history | SCR-002 | List of trips with filtering (date, client, status) | ALL |
| Business trip preview | SCR-003 | Detailed preview of the selected trip | ALL |
| New business trip | ADD-001 | Adding a new trip for settlement | USER |
| Sending business trip | ADD-002 | Generating and sending output after success in ADD-001 | USER |
| Attachments list | SCR-004 | Preview of all files assigned to the trip | ALL |
| Profile | ACC-002 | Displaying the user profile | ALL |
| Vehicle management | ACC-003 | Displaying the user's vehicle list | USER |
| Admin Dashboard | ADM-001 | Wide PC dashboard: trip history, attachments, vehicles, users | ADMIN |
| Rate management | ADM-002 | Filling in mileage and per diem rates | ADMIN |
| User management | ADM-003 | Managing user accounts (CRUD) | ADMIN |

### 8.2 Views

#### USER (iOS / Android / PC)

| ID | Description | Where it leads to |
|---|---|---|
| ACC-001 (Login) | E-Mail + Password, ultimately SSO | Dashboard |
| SCR-001 (Dashboard) | View of the last 3 trips, CTA "New business trip", Bottom-bar with options | New business trip, History, Preview, Profile, Attachments list |
| ADD-001 (New business trip) | Form: from, to, date, client, purpose, mode of transport, number of meals, notes, attachments, additional costs (fuel, accommodation, parking, tolls, other) | Sending business trip |
| ADD-002 (Sending business trip) | READ-ONLY summary with calculated mileage, per diem, and additional costs. Buttons: "Send PDF" / "Send Excel" / "Save draft" / "Undo" | Business trip history |
| SCR-002 (Business trip history) | List of trips with title "Route from → to", date and client below | Business trip preview |
| SCR-003 (Business trip preview) | Business trip summary, actions: "Send" / "Export PDF" / "Duplicate" / "Delete" (DRAFT only) | Sending business trip, Attachments list |
| SCR-004 (Attachments list) | List of files and notes with type (NOTE / IMAGE / RECORDING), name, and date. CTA "Add attachment" opens modal | Business trip preview |
| ACC-002 (Profile) | User data, edit button, shortcut to vehicles, logout | Vehicle management |
| ACC-003 (Vehicle management) | Vehicle list: type + license plate + "default" tag. CTA "Add vehicle". Swipe / long press → delete / set as default | Profile |

#### ADMIN (PC only)

| ID | Description | Where it leads to |
|---|---|---|
| ACC-001 (Login) | E-Mail + Password, ultimately SSO | Admin Dashboard |
| ADM-001 (Admin Dashboard) | Table of all business trips with filtering. Actions per row: "Preview" / "Download PDF". Side panel: Business trips / Users / Rates | Business trip preview, ADM-003, ADM-002 |
| ADM-002 (Rate management) | Current mileage rate (≤900cm³ and >900cm³) and per diem highlighted at the top. Change history table. CTA "New rate" opens modal | ADM-001 |
| ADM-003 (User management) | Accounts table: name, e-mail, department, role, access level, status. CTA "Add user". Actions per row: edit / deactivate | ADM-001 |

### 8.3 Flow - Adding a business trip

```text
┌─────────────────────────────────────────────────────┐
│                     ADD-001                         │
│                 New business trip                   │
│      from / to / date / client / purpose of visit   │
└─────────────────────────┬───────────────────────────┘
                          │
                          ▼
              ┌───────────────────────┐
              │  Mode of transport?   │
              └──────┬────────┬───────┘
                     │        │
              CAR    │        │  TRAIN / BUS / PLANE
                     │        │
                     ▼        ▼
            ┌──────────┐  ┌──────────────┐
            │ Vehicle  │  │ Ticket cost  │
            │ selection│  │ ticket_cost  │
            └────┬─────┘  └──────┬───────┘
                 │               │
                 └───────┬───────┘
                         │
                         ▼
            ┌────────────────────────────┐
            │  Number of meals           │
            │  breakfasts / lunches /    │
            │  dinners (affects per diem)│
            └────────────┬───────────────┘
                         │
                         ▼
            ┌────────────────────────────┐
            │  Additional costs          │
            │  fuel / accommodation /    │
            │  parking / tolls /         │
            │  other (optional)          │
            └────────────┬───────────────┘
                         │
                         ▼
            ┌────────────────────────┐
            │  Notes / Attachments   │
            │      (optional)        │
            └────────────┬───────────┘
                         │
                         ▼
┌────────────────────────────────────────────────────┐
│                  ADD-002                           │
│           Summary (READ-ONLY)                      │
│ calculated mileage / per diem / sum of costs       │
└──────┬──────────────┬──────────────┬───────────────┘
       │              │              │
       ▼              ▼              ▼
  ┌─────────┐   ┌──────────┐   ┌──────────────┐
  │  Undo   │   │  Save    │   │  Send PDF    │
  │         │   │  draft   │   │  or Excel    │
  └────┬────┘   └────┬─────┘   └──────┬───────┘
       │              │                │
       │         status: DRAFT    status: SUBMITTED
       │              │                │
       │              └───────┬────────┘
       │                      │
       ▼                      ▼
  ADD-001               ┌───────────┐
  (return)              │  SCR-002  │
                        │  History  │
                        └───────────┘
```

---

## 9. API Design

All endpoints are preceded by the `/api/v1/` prefix. Authentication via JWT - token returned at `/api/v1/auth/login`, sent in the `Authorization: Bearer <token>` header. Token lifetime to be determined before implementation.

### 9.1 Auth

```text
POST   /api/v1/auth/login     # Login, generates token - PUBLIC
POST   /api/v1/auth/logout    # Logout
GET    /api/v1/auth/me        # Logged-in user's data
```

### 9.2 Trips *(JWT)*

```text
GET    /api/v1/trips              # Logged-in user's business trips list
POST   /api/v1/trips              # Create a new business trip
GET    /api/v1/trips/:id          # Business trip details
PUT    /api/v1/trips/:id          # Edit business trip (DRAFT)
DELETE /api/v1/trips/:id          # Delete business trip (DRAFT)
POST   /api/v1/trips/:id/copy     # Duplicate business trip
POST   /api/v1/trips/:id/submit   # Change status from DRAFT to SUBMITTED
POST   /api/v1/trips/:id/export   # Generate PDF or Excel
```

### 9.3 Attachments *(JWT)*

```text
GET    /api/v1/trips/:id/attachments            # Attachments list
GET    /api/v1/trips/:id/attachments/image      # All images from the trip
GET    /api/v1/trips/:id/attachments/notes      # All notes from the trip
POST   /api/v1/trips/:id/attachments            # Add attachment
DELETE /api/v1/trips/:id/attachments/:attId     # Delete attachment
```

### 9.4 Vehicles *(JWT)*

```text
GET    /api/v1/vehicles              # Vehicles list
POST   /api/v1/vehicles              # Add vehicle
PUT    /api/v1/vehicles/:id          # Edit vehicle
DELETE /api/v1/vehicles/:id          # Delete vehicle
PATCH  /api/v1/vehicles/:id/default  # Set as default
```

### 9.5 Admin *(JWT + ADMIN)*

```text
GET    /api/v1/admin/trips                        # All business trips
GET    /api/v1/admin/trips/:id                    # Details of any business trip
GET    /api/v1/admin/users                        # Users list
POST   /api/v1/admin/users                        # Create an account
PUT    /api/v1/admin/users/:id                    # Edit an account
PATCH  /api/v1/admin/users/:id/deactivate         # Deactivate an account
GET    /api/v1/admin/rates                        # Rates history
POST   /api/v1/admin/rates                        # Add a new rate
```

---

## 10. Non-functional requirements

**Performance**
- PDF generation - under 5 seconds
- API response time - under 500ms for most endpoints
- Excel export - under 3 seconds

**Security**
- All endpoints except `/api/v1/auth/login` require a valid JWT token
- A user with `access_level: USER` cannot read or modify data of other users - verification on the backend side with every request
- Endpoints `/api/v1/admin/*` are available only for `access_level: ADMIN`
- Passwords stored as a hash (bcrypt)
- The application is available exclusively via HTTPS (required by PWA)

**Platforms**
- Consultant: iOS, Android, PC browser - access via PWA at selected address, for example `viatiway.company.pl`
- Admin: exclusively PC browser

**Availability**
- MVP hosted locally - no SLA requirements at this stage
- Application run in Docker containers via `docker compose up -d --build`
- External traffic handled by Cloudflare Tunnel - no need to open ports on the router

**Scalability**
- MVP assumes a maximum of several dozen users - no need for optimization at this stage

**Offline**
- No offline mode support in the MVP - the application requires an internet connection
- Service Worker registered by `vite-plugin-pwa` - basic caching of static resources

**PWA**
- Application installable on a mobile device and PC directly from the browser
- Web App Manifest with name, icons, and theme color
- Administrator panel available exclusively via PC browser - does not provide administrative functions in the mobile view

---

## 11. Export format

Based on the company's XLSX template - the document must contain:

### Mandatory fields (PDF and Excel)

| Field | Source |
|------|--------|
| Business trip number | Generated by the system |
| Consultant's first and last name | `users.name` |
| Cost Center (MPK) | `users.mpk` |
| Client | `trips.client` |
| Purpose of the trip | `trips.purpose` |
| Mode of transport | `trips.transport_mode` |
| License plate number | `vehicles.license_plate` |
| Route (from → to) | `trips.destination_from` / `trips.destination_to` |
| Date and time of departure / return | `trips.start_date` / `trips.end_date` |
| Distance (km) | `trips.distance` |
| Mileage rate | `trips_history.km_rate` |
| Mileage value | `trips_history.km_total` |
| Number of breakfasts / lunches / dinners | `trips.breakfast_count` / `lunch_count` / `dinner_count` |
| Entitled per diem | `trips_history.diet_total` |
| Additional costs (fuel, accommodation, parking, tolls, other) | `trips_history.*_cost` |
| Total amount to be transferred | `trips_history.total_amount` |
| Document date | Generated by the system |

### File format
- **PDF** - generated by Puppeteer based on an HTML template compliant with the company format
- **Excel** - compliant with the current `DEL_MM_DD_Client.xlsx` file

### Sending
- Via the device's native e-mail client (`mailto:` with an attachment)

---

## 12. Risks and open questions

### Risks

| Risk | Impact | Mitigation |
|--------|-------|-----------|
| Puppeteer generates a PDF inconsistent with the company template | High | Implement an HTML template reflecting the XLSX before the first release |
| Change in the Ministry of Finance regulation regarding mileage/per diem rates | Medium | Admin updates rates via the panel - the system retrieves the current one from `rates` |
| Cloudflare Tunnel / home server unavailable | High | No SLA in the MVP - acceptable risk, to be resolved in v2 |
| Consultants do not adopt the application | High | In-house implementation - requires decision support from management |

---

## 13. Milestones

| Stage | Scope |
|------|--------|
| MVP | Business trip registration, mileage and per diem calculation, PDF export, sending by e-mail, JWT authentication, admin panel (rates, accounts) |
| v1.0 | Business trip history, filtering, duplicating, attachments (photos, notes), Excel export |
| v2.0 | Microsoft SSO, OCR of receipts, statistics, production hosting |