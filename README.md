<<<<<<< HEAD
# Workspace Reservation System

A Single Page Application (SPA) for booking shared workspaces inside a company. Employees can create and manage their own reservations, while administrators have full control over all bookings and spaces.

## Description

The app lets users authenticate, navigate protected routes, and perform CRUD operations on reservations. It uses hash-free routing via the History API, role-based access control, and session persistence through localStorage.

## Technologies Used

- **Vite** — build tool and dev server
- **Vanilla JavaScript (ES Modules)** — no frontend framework
- **TailwindCSS v4** — utility-first styling via `@tailwindcss/vite`
- **json-server** — simulated REST API
- **concurrently** — runs Vite and json-server simultaneously
- **localStorage** — session persistence

## Installation

```bash
npm install
```

## Running the Project

```bash
npm run dev
```

This single command starts both servers at once using concurrently:
- Vite dev server → `http://localhost:5173`
- json-server API → `http://localhost:3001`

## Running json-server Separately

```bash
npx json-server --watch db.json --port 3001
```

## Test Users

| Role  | Email           | Password |
|-------|-----------------|----------|
| Admin | admin@test.com  | A123456  |
| User  | user@test.com   | A123456  |
| User  | user2@test.com  | A123456  |

## Project Structure

```
src/
├── api/
│   └── http.js                        # Base fetch wrapper (GET, POST, PATCH, DELETE)
├── components/
│   ├── Modal.js                       # Reusable modal dialog + toast notifications
│   ├── ReservationCard.js             # Reservation card with conditional action buttons
│   └── Sidebar.js                     # Navigation sidebar with role-based links
├── controllers/
│   ├── login.controller.js            # Login form logic and credential validation
│   ├── home.controller.js             # Reservation list, edit, cancel, approve, reject
│   ├── newReservation.controller.js   # New reservation form with conflict detection
│   ├── adminReservations.controller.js# Admin table view with full CRUD
│   └── spaces.controller.js           # Spaces CRUD for admin
├── router/
│   └── router.js                      # History API router with auth and role guards
├── services/
│   ├── reservation.service.js         # Reservation API calls + overlap validation
│   └── space.service.js              # Space API calls
├── views/
│   ├── loginView.js
│   ├── homeView.js
│   ├── newReservationView.js
│   ├── adminReservationsView.js
│   ├── spacesView.js
│   ├── accessDenied.js
│   └── notFound.js
├── utils.js                           # Session helpers, formatting, overlap check
├── main.js                            # Entry point
└── style.css                          # Tailwind directives
```
=======
# Prueba-M3-JavaScript
>>>>>>> f68584c15b97e759a040331293ee8b56c4956787
