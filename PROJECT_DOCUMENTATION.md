# Spend Smart — Project Documentation

**Project:** Spend Smart  
**Type:** Full-Stack Personal Finance Management Application  
**Stack:** MERN (MongoDB, Express.js, React, Node.js)  
**Developer:** Sandeep Jat — SRM University AP (B.Tech Computer Science & Engineering)

---

## Table of Contents

1. [Project Overview](#1-project-overview)
2. [Complete Feature Set](#2-complete-feature-set)
3. [Technology Stack](#3-technology-stack)
4. [Application Architecture](#4-application-architecture)
5. [Frontend Architecture](#5-frontend-architecture)
6. [Backend Architecture](#6-backend-architecture)
7. [Database Models](#7-database-models)
8. [Authentication & Session Security](#8-authentication--session-security)
9. [Transaction Management](#9-transaction-management)
10. [Dashboard & Analytics](#10-dashboard--analytics)
11. [PDF Export](#11-pdf-export)
12. [AI Insights Architecture](#12-ai-insights-architecture)
13. [API Endpoint Reference](#13-api-endpoint-reference)
14. [Security Considerations](#14-security-considerations)
15. [Error Handling](#15-error-handling)
16. [Responsive Design](#16-responsive-design)
17. [Implementation Decisions](#17-implementation-decisions)

---

## 1. Project Overview

Spend Smart is a comprehensive personal finance management web application that enables users to:

- Record and manage income and expense transactions.
- Visualize financial data through interactive charts and summaries.
- Export financial reports to PDF.
- Receive personalized, AI-generated financial analysis and recommendations powered by Groq.

The application uses the MERN stack: **React** (Vite) for the frontend, **Node.js + Express** for the REST API backend, and **MongoDB Atlas** for persistent cloud data storage. Authentication is provided via JWT and Google OAuth.

---

## 2. Complete Feature Set

### Functional Features
- **User registration** with email/password (bcrypt hashed).
- **User login** with email/password credentials.
- **Google OAuth sign-in** with username selection for new Google users.
- **JWT authentication** on all protected endpoints.
- **Absolute 24-hour session expiry** — mandatory logout regardless of activity.
- **10-hour inactivity auto-logout** — logout if no meaningful user interaction.
- **Transaction CRUD** — create, read, update, delete income and expense records.
- **Bulk transaction reset** — delete all user transactions.
- **Transaction filtering and sorting** — by type, category, date, amount.
- **Dashboard summary** — income, expense, and balance totals.
- **Category analytics** — pie charts, spending breakdowns.
- **Monthly trend analytics** — line charts for income/expense over time.
- **PDF report export** — client-side PDF generation with transaction tables.
- **Manual AI Insights generation** — on-demand Groq-powered financial analysis.
- **AI Insights persistence** — saved per user in MongoDB, restored on page load.
- **Dark/Light mode** — persistent theme preference.
- **Responsive layout** — works on mobile, tablet, and desktop.

### Non-Functional Requirements
- All API routes are JWT-protected except registration and login.
- Sensitive data (passwords) are never stored in plain text.
- API keys (Groq, Google) are backend-only and never exposed to the frontend.
- AI Insights ownership is enforced via `req.user._id` — never trusting frontend-supplied user IDs.
- Token expiry is enforced both on the backend (JWT) and frontend (AuthContext timers).

---

## 3. Technology Stack

### Frontend
| Package | Version | Role |
|---|---|---|
| React | ^19.2.0 | UI component framework |
| React Router DOM | ^7.9.6 | Client-side routing, protected routes |
| Axios | ^1.13.2 | HTTP client with interceptors |
| Recharts | ^3.5.0 | Charts (line, pie) |
| @react-pdf/renderer | ^4.3.1 | Client-side PDF generation |
| React Hook Form | ^7.53.2 | Form state and validation |
| React Toastify | ^11.0.5 | Notification toasts |
| React Icons | ^5.5.0 | Icon library |
| Tailwind CSS | ^4.1.17 | Utility-first CSS framework |
| Vite | 7.2.5 (rolldown) | Build tool and dev server |

### Backend
| Package | Version | Role |
|---|---|---|
| Express.js | ^4.19.2 | REST API framework |
| Mongoose | ^8.4.1 | MongoDB ODM |
| groq-sdk | ^1.3.0 | Groq LLM API integration |
| jsonwebtoken | ^9.0.2 | JWT signing and verification |
| bcryptjs | ^2.4.3 | Password hashing |
| google-auth-library | ^9.11.0 | Google OAuth token verification |
| dotenv | ^16.4.5 | Environment variable loading |
| cors | ^2.8.5 | Cross-origin request policy |
| nodemon | ^3.1.3 | Dev auto-restart |

---

## 4. Application Architecture

```
Browser (React SPA)
        │
        │  HTTP/JSON over HTTPS
        ▼
Express.js REST API (Node.js)
        │
        ├── JWT Authentication Middleware
        ├── Transaction Controller
        ├── Auth Controller (local + Google OAuth)
        └── AI Insights Controller (Groq SDK)
                │
                ├── MongoDB Atlas
                │     ├── users collection
                │     ├── transactions collection
                │     └── aiinsights collection
                │
                └── Groq API (external)
                      llama-3.3-70b-versatile
```

---

## 5. Frontend Architecture

### Entry Point
- `client/src/main.jsx` — renders `<App />` wrapped in all context providers.

### Context Providers (wrapping order in `main.jsx`)
1. `ThemeProvider` — manages dark/light mode preference (localStorage).
2. `AuthProvider` — manages user state, session timers, and login/logout.
3. `TransactionProvider` — fetches and manages user transactions.

### Routing (`App.jsx`)
- `PublicRoute` — redirects authenticated users to `/`.
- `ProtectedRoute` — redirects unauthenticated users to `/login`. Wraps all app pages with Navbar, Sidebar, Footer layout.

### Pages
| Page | Route | Description |
|---|---|---|
| `Home.jsx` | `/` | Dashboard — totals, recent transactions |
| `Transactions.jsx` | `/transactions` | Transaction list with filters and CRUD |
| `Analytics.jsx` | `/analytics` | Charts and category breakdowns |
| `AIInsights.jsx` | `/insights` | Manual AI generation, saved insights display |
| `PDFExport.jsx` | `/pdf` | PDF report configuration and download |
| `About.jsx` | `/about` | Project info, tech stack, developer info |
| `Profile.jsx` | `/profile` | User account info |
| `Login.jsx` | `/login` | Login form + Google Sign-In |
| `Register.jsx` | `/register` | Registration form + Google Sign-In |

### Key Utilities
- `client/src/utils/api.js` — Axios instance with base URL from `VITE_API_BASE_URL` env, JWT auth header interceptor, and 401 response interceptor (triggers session expiry).
- `client/src/utils/calculateTotals.js` — Pure function for local income/expense/balance calculation.

---

## 6. Backend Architecture

### Entry Point (`server/index.js`)
- Loads dotenv, connects to MongoDB, registers Express middleware.
- CORS configured via `ALLOWED_ORIGINS` environment variable.
- Routes registered under `/api/auth`, `/api/transactions`, `/api/ai`.
- Health check at `GET /api/health`.

### Controllers
- `authController.js` — register, login, Google OAuth verification, Google registration completion.
- `transactionController.js` — CRUD + bulk reset, all filtered by `userId` from JWT.
- `aiController.js` — `getSavedInsights` (GET, no Groq) and `generateInsights` (POST, Groq + persist).

### Middleware
- `authMiddleware.js` — `protect` function: extracts Bearer token, verifies JWT, fetches user from DB, attaches to `req.user`.

### Utils
- `utils/jwt.js` — `generateToken(userId)`: signs JWT with 24-hour expiry.

---

## 7. Database Models

### User (`models/User.js`)
```
userId         ObjectId   (auto-generated _id)
username       String     required, trimmed
email          String     required, unique, lowercase
password       String     required unless isGoogleUser (bcrypt hashed)
isGoogleUser   Boolean    default false
googleId       String     optional
createdAt      Date       auto (timestamps)
updatedAt      Date       auto (timestamps)
```
- `toJSON` transform: exposes `id` (string), hides `_id`, `__v`, `password`.
- `comparePassword()` instance method for bcrypt comparison.

### Transaction (`models/Transaction.js`)
```
userId         ObjectId   ref User, required
type           String     enum: ["income", "expense"], required
amount         Number     required
category       String     required
date           String     format YYYY-MM-DD, required
description    String     default ""
createdAt      Date       auto
updatedAt      Date       auto
```
- All transaction queries filter by `userId: req.user._id` — users cannot access other users' data.

### AIInsights (`models/AIInsights.js`)
```
userId         ObjectId   ref User, required, unique (one per user)
data           Mixed      validated JSON from Groq
generatedAt    Date       updated on each successful generation
createdAt      Date       auto
updatedAt      Date       auto
```
- Upserted (findOneAndUpdate with `upsert: true`) on each successful generation.
- Retrieved on page load via GET without any Groq call.
- Ownership enforced: all queries use `userId: req.user._id`.

---

## 8. Authentication & Session Security

### JWT Flow
1. User submits credentials (or Google token).
2. Backend verifies and calls `generateToken(user._id)` → signs JWT with 24h expiry.
3. Token and user object returned in response body.
4. Frontend stores `{ ...userData, token }` in `localStorage` as key `"user"`.
5. Axios interceptor reads token from localStorage and adds `Authorization: Bearer <token>` to every request.
6. `authMiddleware.protect` verifies token, fetches user from DB, attaches to `req.user`.

### Absolute 24-Hour Session Expiry
- `generateToken` uses `expiresIn: "24h"` — JWT itself expires on the backend.
- At login/register, `AuthContext` writes `loginTimestamp = Date.now()` to localStorage.
- A `setInterval` running every 60 seconds checks: if `now - loginTimestamp >= 24h` → logout.
- On page load/mount, this check runs before restoring the user session.
- User activity **never** resets the `loginTimestamp`.
- When a JWT expires and a request is made, the 401 response triggers the `sessionExpired` event → AuthContext auto-logs out.

### 10-Hour Inactivity Logout
- `AuthContext` listens to `mousemove`, `keydown`, `click`, `touchstart`, `pointerdown` events (passive).
- Handler is throttled: `lastActivityTimestamp` in localStorage is updated at most once per minute.
- The 60-second interval also checks: if `now - lastActivityTimestamp >= 10h` → logout.
- On page load/mount, if `lastActivityTimestamp` is stale (>10h), the session is cleared before restoring.

### Logout
Clears `user`, `loginTimestamp`, `lastActivityTimestamp` from localStorage. Fires `userChanged` event so TransactionContext resets.

### Event Listeners & Memory Leak Prevention
- All activity event listeners and the session interval are cleaned up in the `useEffect` return function.
- Cleanup runs when the user state becomes null (logout) or on component unmount.

### Protected Routes
- Frontend: `ProtectedRoute` component redirects unauthenticated users to `/login`.
- Backend: `protect` middleware on all transaction and AI routes.

---

## 9. Transaction Management

- **Add** — POST `/api/transactions` with `{ type, amount, category, date, description }`.
- **Read** — GET `/api/transactions` — returns all transactions for `req.user._id`, sorted latest first.
- **Update** — PUT `/api/transactions/:id` — validates ownership via userId in the document.
- **Delete** — DELETE `/api/transactions/:id` — validates ownership.
- **Bulk reset** — DELETE `/api/transactions` — removes all documents for `req.user._id`.

State is managed in `TransactionContext`, which listens to `userChanged` and `storage` events to refresh when the user changes.

---

## 10. Dashboard & Analytics

### Dashboard (`Home.jsx`)
- Displays total income, total expense, and balance.
- Shows recent transactions list.
- Calculates totals using `calculateTotals(transactions)` locally in the browser.

### Analytics (`Analytics.jsx`)
- **Line Chart** — monthly income vs expense trends using Recharts `LineChart`.
- **Pie Chart** — category-wise spending breakdown.
- Data computed from the `transactions` array in `TransactionContext`.
- No additional API calls — all calculations are client-side.

---

## 11. PDF Export

- Implemented with `@react-pdf/renderer` — entirely client-side.
- Generates a structured PDF document with:
  - User info and report generation date.
  - Summary table (income, expense, balance).
  - Full transaction table sorted by date.
- PDF is downloaded directly in the browser without any server request.

---

## 12. AI Insights Architecture

### Design Principles
1. **Manual trigger only** — Groq is never called automatically.
2. **Persistent storage** — one MongoDB document per user (`AIInsights` model).
3. **Load vs Generate separation** — GET retrieves saved data; POST calls Groq.
4. **Privacy-first** — only aggregated numbers (no raw descriptions) sent to Groq.
5. **Failure safety** — failed refreshes preserve previous successful insights.

### Frontend Flow (`AIInsights.jsx`)

**On mount (page load):**
```
GET /api/ai/insights
  → hasData: true  → display saved insights (no Groq)
  → hasData: false → show "Get AI Insights" button (first-time user)
```

**On button click ("Get AI Insights" or "Refresh AI Insights"):**
```
useRef lock check (isGeneratingRef) → if in-flight, return
  → isGeneratingRef.current = true
  → setGenerating(true), disable button
  → POST /api/ai/insights
  → on success: setInsightsData(result.data), setGeneratedAt(...)
  → on failure: setError(msg), preserve existing insightsData
  → finally: isGeneratingRef.current = false, setGenerating(false)
```

### Backend Flow (`aiController.js`)

**GET `/api/ai/insights` — `getSavedInsights`:**
```
req.user._id → AIInsights.findOne({ userId })
  → found:     return { hasData: true, data, generatedAt }
  → not found: return { hasData: false }
```

**POST `/api/ai/insights` — `generateInsights`:**
```
Check inFlightRequests Map (per-user lock) → if locked, return 429
Set inFlightRequests[userId] = true
  → check GROQ_API_KEY
  → fetch user transactions from MongoDB
  → calculate aggregated stats locally
  → call Groq SDK (llama-3.3-70b-versatile, JSON mode)
  → parse and validate JSON response
  → AIInsights.findOneAndUpdate({ userId }, { data, generatedAt }, { upsert: true })
  → return { success: true, data, generatedAt }
finally: inFlightRequests.delete(userId)
```

### Groq Prompt Configuration
- **Model:** `llama-3.3-70b-versatile`
- **Response format:** `{ type: "json_object" }` (JSON mode)
- **System prompt:** Enforces exact JSON schema with `summary`, `financialHealth`, `insights`, `recommendations`, `spendingAnalysis`, `savingsAnalysis`.
- **User message:** Aggregated stats object (no raw transaction descriptions).

### Duplicate Request Prevention
| Layer | Mechanism |
|---|---|
| Frontend | `useRef` boolean lock (`isGeneratingRef`) + disabled button state |
| Backend | Server-side `Map` per userId (`inFlightRequests`) — returns 429 if in-flight |

---

## 13. API Endpoint Reference

Base URL: `http://localhost:5000/api` (dev) / `VITE_API_BASE_URL` (production)

### Auth (`/api/auth`) — Public
| Method | Path | Body | Response |
|---|---|---|---|
| POST | `/register` | `{ username, email, password }` | `{ user, token }` |
| POST | `/login` | `{ email, password }` | `{ user, token }` |
| POST | `/google` | `{ token }` | `{ isNewUser, user?, token? }` |
| POST | `/google/register` | `{ username, email, googleId, token }` | `{ user, token }` |

### Transactions (`/api/transactions`) — Protected
| Method | Path | Body | Response |
|---|---|---|---|
| GET | `/` | — | `[Transaction]` |
| POST | `/` | `{ type, amount, category, date, description }` | `Transaction` |
| PUT | `/:id` | `{ type, amount, category, date, description }` | `Transaction` |
| DELETE | `/:id` | — | 200 |
| DELETE | `/` | — | 200 |

### AI Insights (`/api/ai`) — Protected
| Method | Path | Body | Response |
|---|---|---|---|
| GET | `/insights` | — | `{ success, hasData, data?, generatedAt? }` |
| POST | `/insights` | — | `{ success, data, generatedAt }` or `{ success, empty }` |

### Health
| Method | Path | Response |
|---|---|---|
| GET | `/api/health` | `{ status: "ok", message }` |

---

## 14. Security Considerations

### Implemented
- **Password hashing** — bcrypt with salt rounds of 10.
- **JWT backend expiry** — 24h enforced by `jsonwebtoken`.
- **Frontend session enforcement** — 24h absolute and 10h inactivity checks.
- **API key isolation** — `GROQ_API_KEY` only exists server-side; never sent to the client.
- **Data ownership** — All queries use `req.user._id` from the verified JWT; frontend-supplied user IDs are never trusted.
- **CORS** — Configurable `ALLOWED_ORIGINS` environment variable; not open in production.
- **Env file protection** — `.env` is in `.gitignore`; `.env.example` has no real secrets.
- **Google token verification** — Re-verified on `googleRegister` flow.
- **401 handling** — Expired tokens trigger automatic frontend logout via Axios response interceptor.
- **Duplicate request prevention** — Server-side Map + frontend ref lock for AI generation.
- **Input validation** — Required fields checked at controller level before DB writes.

### Notes
- The fallback JWT secret in source code is a development convenience. In production, always set `JWT_SECRET` in environment variables.
- Google OAuth fallback decoding (when `GOOGLE_CLIENT_ID` is not set) is intended for development only and should not be relied on in production.

---

## 15. Error Handling

### Backend
- Missing required fields → 400 with descriptive message.
- Invalid/expired JWT → 401 `{ message: "Not authorized, token failed" }`.
- Resource not found (e.g., transaction) → 404.
- Server errors → 500 with `message`. Stack trace only returned in development (`NODE_ENV !== "production"`).
- Groq parse failure → 500 `{ message: "Failed to parse insights generated by AI." }`.
- In-flight duplicate request → 429 `{ message: "A generation request is already in progress." }`.
- Missing Groq API key → 400 `{ errorType: "MISSING_API_KEY", message }`.

### Frontend
- All API errors display via `react-toastify` notifications.
- AI Insights errors are displayed non-destructively — previous successful insights remain visible.
- `MISSING_API_KEY` error shows an instructions card with setup steps.
- 401 responses trigger automatic logout and redirect to `/login`.
- Component-level error state avoids white screens (no unhandled promise rejections thrown to React).

---

## 16. Responsive Design

- **Tailwind CSS** responsive breakpoints used throughout.
- **Sidebar** — fixed on desktop (≥1024px), collapsible overlay on mobile/tablet.
- **Grids** — responsive grid layouts for cards (1 col mobile → 2 col tablet → 3-4 col desktop).
- **Charts** — Recharts `ResponsiveContainer` ensures chart sizing adapts to viewport.
- **Navigation** — Hamburger menu trigger on mobile via `Navbar`.
- **Forms** — full-width on mobile, constrained on larger screens.

---

## 17. Implementation Decisions

### Why Manual AI Generation (not auto-fetch)?
Auto-fetching on page load would call Groq every time a user visits the page, navigates away, or refreshes. This wastes API quota and creates unnecessary latency. Manual generation gives users control, reduces API costs, and ensures insights load instantly from the database on subsequent visits.

### Why MongoDB for AI Insights Persistence?
The project already uses MongoDB for users and transactions. Adding a `AIInsights` model is the cleanest path — it reuses the existing infrastructure, Mongoose schema validation, and authentication pattern without introducing a new service.

### Why One Document Per User (`unique: true` on `userId`)?
Only the most recent successful analysis is useful. Using `findOneAndUpdate` with `upsert: true` ensures exactly one record per user, kept up to date. This avoids unbounded growth of historical AI data.

### Why `useRef` for Duplicate Prevention (not just disabled button)?
The disabled button prevents UI-level duplicate clicks, but React's state updates are async — a user could theoretically double-click before the state re-render. `useRef` is synchronous and provides an immediate lock at function call time.

### Why 60-Second Check Interval for Session Expiry?
Polling every second would create unnecessary CPU work. 60 seconds provides a reasonable balance — in the worst case, the user might remain logged in up to 60 seconds past expiry before the check fires. This is acceptable for UI-side enforcement, since the backend (JWT expiry) enforces the hard limit on every API call.

### Why `ALLOWED_ORIGINS` Instead of Open CORS?
Open `cors()` allows any origin to make credentialed requests to the API. In production, this would allow any site to attempt cross-origin requests. Restricting to known origins is a basic but important security practice.

### AI Privacy Design
Only aggregated statistical values (totals, rates, category sums) are sent to Groq. Raw transaction descriptions, user emails, and IDs are never forwarded. This ensures users' personal financial details are not processed by the external AI service.
