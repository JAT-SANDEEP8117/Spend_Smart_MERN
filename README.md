# Spend Smart

A modern, full-stack MERN personal finance management application with secure authentication, AI-powered financial insights, interactive analytics, and PDF report export.

---

## Table of Contents

- [Overview](#overview)
- [Key Features](#key-features)
- [AI Financial Insights](#ai-financial-insights)
- [Authentication & Session Security](#authentication--session-security)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Installation & Setup](#installation--setup)
- [API Endpoints](#api-endpoints)
- [Deployment](#deployment)
- [Developer Info](#developer-info)

---

## Overview

Spend Smart helps users track income, expenses, and financial health through a clean and responsive interface. It supports secure credential-based and Google OAuth authentication, full transaction CRUD, category analytics, PDF exports, and on-demand personalized AI financial analysis powered by Groq.

---

## Key Features

- **Transaction Management** — Add, edit, delete, and reset income/expense transactions with full history.
- **Financial Analytics** — Interactive line and pie charts for spending patterns, monthly trends, and category breakdowns.
- **PDF Export** — Generate and download detailed financial reports.
- **AI Financial Insights** — On-demand, personalized analysis powered by Groq (llama-3.3-70b-versatile). Insights are saved per-user in MongoDB and restored on next visit.
- **Dual Authentication** — Email/password with bcrypt hashing and Google OAuth.
- **Session Security** — Absolute 24-hour session expiry + 10-hour inactivity auto-logout.
- **Dark/Light Mode** — Persistent theme toggle.
- **Responsive Design** — Works across mobile, tablet, and desktop.

---

## AI Financial Insights

The AI Insights feature is powered by Groq API and works as follows:

- **Manual generation only** — Groq is **never** called automatically. The page loads saved insights from the database without any API call.
- **First-time users** see a "Get AI Insights" button. Clicking it triggers exactly one Groq request.
- **Returning users** see their previously generated insights immediately. A "Refresh AI Insights" button allows generating a new analysis.
- **Persistence** — Each successful generation is saved to MongoDB per authenticated user and restored on page load or browser refresh.
- **Failure safety** — If a refresh request fails, the previous successful insights remain displayed. Errors are shown non-destructively.
- **Duplicate prevention** — A `useRef` frontend lock and a server-side in-flight guard prevent concurrent duplicate requests.

### AI Data Privacy

Only aggregated financial statistics (totals, rates, category sums) are sent to Groq. Raw transaction descriptions and personal identifiers are never forwarded.

---

## Authentication & Session Security

- **JWT-based** — Tokens expire after **24 hours** (enforced on the backend).
- **Absolute 24-hour expiry** — The session ends 24 hours after login regardless of activity.
- **10-hour inactivity logout** — The user is logged out after 10 continuous hours without interaction.
- **Inactivity tracking** — Mouse, keyboard, click, and touch events update a throttled `lastActivityTimestamp` in localStorage (at most once per minute).
- **Token expiry handling** — The API interceptor catches 401 responses and triggers automatic logout.
- **Rule** — User activity resets only the inactivity timer. It never extends the absolute 24-hour session.

---

## Tech Stack

### Frontend (`client/`)
| Technology | Version | Purpose |
|---|---|---|
| React | ^19.2.0 | UI framework |
| React Router DOM | ^7.9.6 | Client-side navigation and route protection |
| Axios | ^1.13.2 | HTTP client with request/response interceptors |
| Recharts | ^3.5.0 | Analytics charts |
| @react-pdf/renderer | ^4.3.1 | PDF document generation |
| React Hook Form | ^7.53.2 | Form validation |
| React Icons | ^5.5.0 | Icon set |
| React Toastify | ^11.0.5 | Notifications |
| Tailwind CSS | ^4.1.17 | Utility-first styling |
| Vite | ^7.2.5 | Build tool |

### Backend (`server/`)
| Technology | Version | Purpose |
|---|---|---|
| Node.js + Express | ^4.19.2 | REST API server |
| Mongoose | ^8.4.1 | MongoDB ODM |
| groq-sdk | ^1.3.0 | Groq API integration for AI insights |
| jsonwebtoken | ^9.0.2 | JWT signing and verification |
| bcryptjs | ^2.4.3 | Password hashing |
| google-auth-library | ^9.11.0 | Google OAuth token verification |
| dotenv | ^16.4.5 | Environment variable loading |
| cors | ^2.8.5 | Cross-origin request configuration |

---

## Project Structure

```
Spend_Smart_MERN/
├── README.md
├── SETUP_GUIDE.md
├── PROJECT_DOCUMENTATION.md
├── client/                         # React + Vite Frontend
│   ├── .env.example                # Client env variable template
│   ├── src/
│   │   ├── App.jsx                 # Routes and protected route logic
│   │   ├── main.jsx                # Entry point
│   │   ├── components/             # Navbar, Sidebar, Footer, charts
│   │   ├── context/                # AuthContext, ThemeContext, TransactionContext
│   │   ├── features/               # Transaction forms/cards, PDF components
│   │   ├── pages/                  # AIInsights, Analytics, Home, About, Login, Register, etc.
│   │   └── utils/                  # api.js (Axios instance), calculateTotals.js
│   └── package.json
└── server/                         # Node.js + Express Backend
    ├── .env.example                # Server env variable template
    ├── config/db.js                # MongoDB connection
    ├── controllers/
    │   ├── aiController.js         # GET saved / POST generate Groq insights
    │   ├── authController.js       # Login, register, Google OAuth
    │   └── transactionController.js
    ├── middleware/authMiddleware.js # JWT protect middleware
    ├── models/
    │   ├── User.js
    │   ├── Transaction.js
    │   └── AIInsights.js           # Per-user AI insights persistence
    ├── routes/
    │   ├── aiRoutes.js
    │   ├── authRoutes.js
    │   └── transactionRoutes.js
    ├── utils/jwt.js                # Token generation (24h expiry)
    ├── index.js                    # App entry, CORS, middleware, server
    └── package.json
```

---

## Installation & Setup

See [SETUP_GUIDE.md](./SETUP_GUIDE.md) for detailed step-by-step instructions.

### Quick Start

```bash
# 1. Install backend dependencies
cd server && npm install

# 2. Configure server environment
cp .env.example .env
# Edit .env with your MongoDB URI, JWT secret, Groq API key

# 3. Start backend
npm run dev

# 4. In a new terminal — install frontend dependencies
cd ../client && npm install

# 5. Configure client environment (optional for dev — defaults to localhost)
cp .env.example .env

# 6. Start frontend
npm run dev
```

Open [http://localhost:5173](http://localhost:5173).

---

## API Endpoints

All protected endpoints require: `Authorization: Bearer <JWT_Token>`

### Auth (`/api/auth`)
| Method | Endpoint | Description |
|---|---|---|
| POST | `/register` | Register with email/password |
| POST | `/login` | Login with email/password |
| POST | `/google` | Verify Google OAuth token |
| POST | `/google/register` | Complete Google user registration |

### Transactions (`/api/transactions`) — Protected
| Method | Endpoint | Description |
|---|---|---|
| GET | `/` | Get user's transactions |
| POST | `/` | Add transaction |
| PUT | `/:id` | Update transaction |
| DELETE | `/:id` | Delete transaction |
| DELETE | `/` | Reset all user transactions |

### AI Insights (`/api/ai`) — Protected
| Method | Endpoint | Description |
|---|---|---|
| GET | `/insights` | Get saved insights (no Groq call) |
| POST | `/insights` | Generate new insights via Groq and persist |

---

## Deployment

Before deploying:

1. Set `VITE_API_BASE_URL` in `client/.env` to your production backend URL.
2. Set `ALLOWED_ORIGINS` in `server/.env` to your production frontend URL.
3. Build the frontend: `cd client && npm run build` — output in `client/dist/`.
4. Start backend in production: `NODE_ENV=production node index.js` (or use a process manager like PM2).
5. Ensure all environment variables are configured on your hosting platform.

See [SETUP_GUIDE.md](./SETUP_GUIDE.md) for full deployment environment variable reference.

---

## Developer Info

- **Developer:** Sandeep Jat
- **GitHub:** [JAT-SANDEEP8117](https://github.com/JAT-SANDEEP8117)
- **University:** SRM University AP — B.Tech Computer Science & Engineering

---

## License

This project is licensed under the MIT License.
