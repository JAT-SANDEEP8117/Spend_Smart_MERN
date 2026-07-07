# Spend Smart — Setup Guide

This guide covers everything needed to configure, install, and run the Spend Smart MERN application locally and prepare it for production deployment.

---

## 1. Prerequisites

Ensure the following are installed:

- **Node.js** v18 or higher
- **npm** (bundled with Node.js)
- A **MongoDB** instance — either:
  - [MongoDB Atlas](https://www.mongodb.com/atlas) (cloud, recommended)
  - Local MongoDB running at `mongodb://127.0.0.1:27017/spend_smart`

---

## 2. Clone the Repository

```bash
git clone <repository-url>
cd Spend_Smart_MERN
```

---

## 3. Backend Setup (`server/`)

### 3.1 Install Dependencies

```bash
cd server
npm install
```

### 3.2 Configure Environment Variables

Copy the example file and fill in your values:

```bash
cp .env.example .env
```

Edit `server/.env`:

```env
# Server port
PORT=5000

# MongoDB connection string
MONGODB_URI=mongodb+srv://<user>:<password>@cluster.mongodb.net/spend_smart?retryWrites=true&w=majority

# JWT secret — use a long, random string in production
JWT_SECRET=your_strong_random_jwt_secret_here

# Google OAuth credentials (from Google Cloud Console)
GOOGLE_CLIENT_ID=your_google_client_id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your_google_client_secret

# Groq API key (from https://console.groq.com/keys)
GROQ_API_KEY=gsk_your_groq_api_key_here

# Allowed CORS origins — comma-separated (production: your frontend URL)
ALLOWED_ORIGINS=http://localhost:5173,http://localhost:4173

# Node environment
NODE_ENV=development
```

### 3.3 Start the Backend

**Development (auto-restart):**
```bash
npm run dev
```

**Production:**
```bash
NODE_ENV=production npm start
```

The server starts at `http://localhost:5000`.

---

## 4. Frontend Setup (`client/`)

### 4.1 Install Dependencies

```bash
cd client
npm install
```

### 4.2 Configure Environment Variables

Copy the example file:

```bash
cp .env.example .env
```

Edit `client/.env`:

```env
# Backend API URL
# Development: defaults to http://localhost:5000/api if not set
# Production: set to your deployed backend URL
VITE_API_BASE_URL=http://localhost:5000/api
```

> **Note:** In development with the backend running locally, you can skip this step — the default localhost URL is used.

### 4.3 Start the Frontend

**Development:**
```bash
npm run dev
```

The client starts at `http://localhost:5173`.

**Production build:**
```bash
npm run build
```

Output is in `client/dist/`. Serve with any static file host or `npm run preview` to preview locally.

---

## 5. MongoDB Setup

### Using MongoDB Atlas (recommended)

1. Create a free account at [mongodb.com/atlas](https://www.mongodb.com/atlas).
2. Create a **Cluster** (free tier is sufficient).
3. Under **Database Access**, create a user with read/write access.
4. Under **Network Access**, whitelist your IP (or `0.0.0.0/0` for development).
5. Click **Connect > Drivers** and copy the connection string.
6. Replace `<username>` and `<password>` and set it as `MONGODB_URI` in `server/.env`.

The database and collections (`users`, `transactions`, `aiinsights`) are created automatically by Mongoose on first use.

---

## 6. Obtaining API Keys

### JWT Secret

Generate a secure random string for `JWT_SECRET`:

```bash
node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"
```

Tokens expire after **24 hours** — this is enforced on the backend.

### Google OAuth Credentials

1. Go to [Google Cloud Console](https://console.cloud.google.com/).
2. Create a project (e.g., **Spend Smart**).
3. Go to **APIs & Services > OAuth Consent Screen** — configure as External.
4. Go to **APIs & Services > Credentials > Create Credentials > OAuth Client ID**.
5. Select **Web Application**:
   - Authorized JavaScript origins: `http://localhost:5173`
   - Authorized redirect URIs: `http://localhost:5173`
6. Copy **Client ID** → `GOOGLE_CLIENT_ID` in `server/.env`.
7. Copy **Client Secret** → `GOOGLE_CLIENT_SECRET` in `server/.env`.

> **Note:** Google OAuth is optional. If `GOOGLE_CLIENT_ID` is not configured, the Google sign-in button will still render, but token verification falls back to basic JWT decoding in development.

### Groq API Key

1. Go to [console.groq.com/keys](https://console.groq.com/keys).
2. Sign in or create a free Groq account.
3. Click **Create API Key**, name it (e.g., `spend-smart`), and copy it.
4. Set it as `GROQ_API_KEY` in `server/.env`.

> **Note:** Without `GROQ_API_KEY`, the AI Insights page will display a configuration guide instead of generating insights.

---

## 7. Development Commands Reference

### Backend (`server/`)
```bash
npm run dev     # Start with nodemon (auto-restart)
npm start       # Start without nodemon (production)
```

### Frontend (`client/`)
```bash
npm run dev     # Start Vite dev server (http://localhost:5173)
npm run build   # Build for production → client/dist/
npm run preview # Preview production build locally
npm run lint    # Run ESLint
```

---

## 8. Production Deployment

### Environment Variables Required

**Backend (`server/.env` or hosting platform):**
```
PORT=5000 (or your hosting platform's assigned port)
MONGODB_URI=<atlas_production_uri>
JWT_SECRET=<strong_random_secret>
GOOGLE_CLIENT_ID=<your_client_id>
GOOGLE_CLIENT_SECRET=<your_client_secret>
GROQ_API_KEY=<your_groq_key>
ALLOWED_ORIGINS=https://yourdomain.com
NODE_ENV=production
```

**Frontend (`client/.env` or build-time env vars):**
```
VITE_API_BASE_URL=https://api.yourdomain.com/api
```

### Steps

1. Set all environment variables on your hosting platform.
2. **Frontend:** Run `npm run build` in `client/` and deploy `client/dist/` to a static host (Vercel, Netlify, etc.).
3. **Backend:** Deploy `server/` to a Node.js host (Railway, Render, Heroku, etc.) and run `npm start`.
4. Update Google OAuth **Authorized JavaScript origins** and **redirect URIs** to your production frontend URL.

---

## 9. Troubleshooting

| Symptom | Likely Cause | Fix |
|---|---|---|
| `MongoDB Connection Error` | Wrong URI or IP not whitelisted | Check `MONGODB_URI` and Atlas Network Access |
| `Not authorized, no token provided` | JWT missing or expired | Log in again |
| AI Insights shows "AI Integration Key Required" | `GROQ_API_KEY` missing | Add key to `server/.env` and restart |
| Google Sign-In button missing or broken | `GOOGLE_CLIENT_ID` not configured | Add Client ID to `server/.env` |
| Frontend cannot reach backend | Wrong `VITE_API_BASE_URL` or CORS | Check `VITE_API_BASE_URL` and `ALLOWED_ORIGINS` |
| CORS errors in browser | `ALLOWED_ORIGINS` not set correctly | Add frontend origin to `ALLOWED_ORIGINS` in `server/.env` |
| Session expires unexpectedly | 24h absolute or 10h inactivity limit reached | Normal behavior — log in again |

---

## 10. Verification Checklist

After setup, verify:

- [ ] Backend starts without errors, logs `MongoDB Connected Successfully`
- [ ] Health check responds: `GET http://localhost:5000/api/health`
- [ ] Frontend loads at `http://localhost:5173`
- [ ] Registration and login work (email/password)
- [ ] Google Sign-In renders and functions
- [ ] Transactions can be added, edited, deleted
- [ ] Analytics charts render with data
- [ ] PDF export generates a downloadable file
- [ ] AI Insights page loads saved insights (or empty state) without calling Groq
- [ ] Clicking "Get AI Insights" or "Refresh AI Insights" generates insights once
- [ ] Refreshing the browser page shows saved insights without a new Groq call
- [ ] Dark/Light mode toggle works
