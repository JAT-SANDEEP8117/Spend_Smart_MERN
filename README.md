# Spend Smart

Spend Smart is a modern full-stack MERN (MongoDB, Express.js, React, Node.js) personal finance management application that helps users track their income, expenses, and overall financial health. It features secure JWT authentication, Google OAuth login, responsive analytics with charts, PDF report export, and personalized AI-powered financial insights.

---

## Table of Contents

- [Overview](#overview)
- [Key Features](#key-features)
- [Tech Stack & Libraries](#tech-stack--libraries)
- [Project Architecture](#project-architecture)
- [Environment Variables](#environment-variables)
- [Installation & Setup](#installation--setup)
- [API Endpoints](#api-endpoints)
- [AI Financial Insights Workflow](#ai-financial-insights-workflow)
- [Developer Info](#developer-info)
- [License](#license)

---

## Overview

**Spend Smart** allows users to:
- Register accounts and securely sign in via JWT-based credentials.
- Login instantly using Google OAuth (Google Sign-In integration).
- Create, read, update, and delete (CRUD) user-specific income and expense transactions.
- Filter, sort, and search transactions to find historical logs easily.
- Analyze monthly budgets, category-wise spending, and savings trends using interactive Recharts graphs.
- Export transaction summaries and tables to structured PDF reports.
- Generate personalized, smart financial advice, budget tips, and a financial health score via secure backend integration with Groq API.
- Use the application seamlessly in both Dark Mode and Light Mode on mobile, tablet, and desktop screens.

---

## Key Features

- **MERN Architecture:** React frontend, Express/Node backend API, MongoDB Atlas cloud database.
- **Dual Authentication:** Email/password credentials (hashed with bcryptjs) and Google OAuth Client Sign-In.
- **AI-Powered Analytics:** Real transaction statistics are summarized securely on the backend and analyzed by Groq API, returning actionable budget insights and financial health assessments.
- **Interactive Visualizations:** Line and Pie charts rendering spending breakdown and income trends (Recharts).
- **PDF Report Exporter:** High-fidelity client-side PDF document generation.
- **Responsive Spacing:** Tailwind CSS media queries ensure absolute compatibility on screens as small as 320px up to widescreen monitors.
- **State Management & Notifications:** React Context-driven authentication and real-time React Toastify alerts.

---

## Tech Stack & Libraries

### Frontend (`client/`)
- **React** (^19.2.0): UI framework.
- **React Router DOM** (^7.9.6): Client-side path navigation and auth protection.
- **Axios** (^1.13.2): Centralized client request interceptors.
- **Recharts** (^3.5.0): Responsive analytical graphs.
- **@react-pdf/renderer** (^4.3.1): Document generation engine.
- **React Hook Form** (^7.53.2): Validated inputs.
- **React Icons** (^5.5.0): High fidelity UI icons.
- **React Toastify** (^11.0.5): User-friendly alerts.
- **Tailwind CSS** (^4.1.17) & **@tailwindcss/vite**: Utility styling.

### Backend (`server/`)
- **Node.js** & **Express.js** (^4.19.2): Secure REST API router.
- **Mongoose** (^8.4.1): Database models & validation.
- **groq-sdk** (^0.12.0): Groq Node.js SDK.
- **jsonwebtoken** (^9.0.2): Secure JWT auth token signing and validation.
- **bcryptjs** (^2.4.3): Secure password hashing.
- **google-auth-library** (^9.11.0): Token validation for Google Sign-In.
- **dotenv** (^16.4.5): Secure environmental configs.
- **cors** (^2.8.5): Cross-Origin Request configuration.

---

## Project Architecture

```
Spend_Smart_MERN/
├── client/                     # React Frontend
│   ├── src/
│   │   ├── components/         # Reusable layouts (Navbar, Sidebar, Charts)
│   │   ├── context/            # Global contexts (Auth, Theme, Transaction)
│   │   ├── features/           # Transaction cards, forms, PDF structures
│   │   ├── pages/              # Routing viewpages (AIInsights, Analytics, Home, Login, About)
│   │   ├── utils/              # Centralized Axios client (api.js), calculateTotals
│   │   ├── App.jsx             # Routes declaration
│   │   └── main.jsx            # Entry point
│   ├── index.html              # HTML shell (GSI accounts script included)
│   └── package.json
└── server/                     # Node.js Express API Backend
    ├── config/                 # DB configuration (db.js)
    ├── controllers/            # Controller layers (auth, transactions, ai)
    ├── middleware/             # Route protections (authMiddleware.js)
    ├── models/                 # Database Schemas (User.js, Transaction.js)
    ├── routes/                 # Endpoint routers (authRoutes, transactionRoutes, aiRoutes)
    ├── utils/                  # Sign helpers (jwt.js)
    ├── index.js                # Core app listener
    ├── package.json
    └── .env                    # Credentials configuration
```

---

## Environment Variables

### Backend (`server/.env`)
Create a `.env` file in the `server` directory and declare:
```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
GOOGLE_CLIENT_ID=your_google_oauth_client_id
GOOGLE_CLIENT_SECRET=your_google_oauth_client_secret
AI_API_KEY=your_gemini_api_key
```

### Frontend (`client/.env`)
Create a `.env` file in the `client` directory (or rely on fallbacks):
```env
VITE_GOOGLE_CLIENT_ID=your_google_oauth_client_id
```

---

## Installation & Setup

Ensure you have **Node.js** (v18+ recommended) and **MongoDB** (or a MongoDB Atlas URI) ready.

### 1. Clone the project
```bash
git clone <repository-url>
cd Spend_Smart_MERN
```

### 2. Configure Backend Credentials
Navigate to `server` and create `.env`:
```bash
cd server
npm install
# Add MONGODB_URI, JWT_SECRET, GOOGLE_CLIENT_ID and AI_API_KEY values to .env
```

### 3. Configure Frontend Credentials
Navigate to `client` and create `.env`:
```bash
cd ../client
npm install
# Add VITE_GOOGLE_CLIENT_ID values to .env
```

### 4. Start the Application

**Run Express Server (Terminal 1):**
```bash
cd server
npm run dev
```

**Run React Vite Client (Terminal 2):**
```bash
cd client
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your web browser.

---

## API Endpoints

All protected endpoints require a valid header signature: `Authorization: Bearer <JWT_Token>`.

### Authentication (`/api/auth`)
- `POST /register` - User credentials registration.
- `POST /login` - User credentials sign-in.
- `POST /google` - Verify Google OIDC credential token.
- `POST /google/register` - Create username/profile for a new Google user.

### Transactions (`/api/transactions`)
- `GET /` - Fetch transactions belonging to the authenticated user.
- `POST /` - Add a new transaction (income/expense).
- `PUT /:id` - Update a transaction.
- `DELETE /:id` - Delete a transaction.
- `DELETE /` - Bulk deletion/reset of all user transactions.

### AI Analytics (`/api/ai`)
- `GET /insights` - Summarize transactions, query Groq API, and retrieve structured financial analysis.

---

## AI Financial Insights Workflow

The application employs a highly privacy-conscious architecture to generate insights:
1. **User Authentication:** The client requests insights securely using their JWT signature.
2. **Transaction Query:** The Express server queries only that user's transactions from MongoDB.
3. **Data Aggregation:** The server calculates statistical fields (savings rates, high category sums, monthly trends) locally.
4. **LLM Query:** The aggregated stats (and *no raw descriptions or sensitive user emails*) are sent to Groq API with a structured JSON request configuration.
5. **Structured Display:** The model responds in JSON, which is safely validated and returned to the client to render visual gauges, recommendations, and health indicators.

---

## Developer Info

- **Lead Developer:** Sandeep Jat
- **Github Profile:** [JAT-SANDEEP8117](https://github.com/JAT-SANDEEP8117)
- **University:** SRM University AP (B.Tech Computer Science & Engineering)

---

## License

This project is licensed under the MIT License - see the LICENSE file for details.
