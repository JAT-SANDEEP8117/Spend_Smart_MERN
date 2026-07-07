# Spend Smart - Comprehensive Setup Guide

This document describes the steps required to set up, configure, and launch the full-stack MERN (MongoDB, Express, React, Node.js) Spend Smart application on your local machine.

---

## 1. Prerequisites
Ensure you have the following installed locally:
- **Node.js** (Version 18+ recommended)
- **NPM** (Node Package Manager)
- A **MongoDB Atlas** database account (or a local MongoDB instance running at `mongodb://127.0.0.1:27017/spend_smart`)

---

## 2. Environment Variables Configurations

To run the full auth flows and the AI Insights engine, you need to create environment files on both the frontend client and the backend server.

### Server Environment Configuration (`server/.env`)
Create a new file named `.env` in the `server/` directory and configure the following variables:

```env
# The port where your Express API server will listen
PORT=5000

# MongoDB Connection String (Atlas cloud connection or local fallback)
MONGODB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/spend_smart?retryWrites=true&w=majority

# Secret key used for signing JWT login tokens
JWT_SECRET=your_custom_jwt_secret_token_signature_key

# Google OAuth Client Credentials (obtained from Google Cloud Developer Console)
GOOGLE_CLIENT_ID=your_google_client_id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your_google_client_secret_code

# Groq API Key (obtained from Groq Console)
GROQ_API_KEY=your_groq_api_key_string
```

### Client Environment Configuration (`client/.env`)
Create a new file named `.env` in the `client/` directory and configure the Google Client ID variable:

```env
VITE_GOOGLE_CLIENT_ID=your_google_client_id.apps.googleusercontent.com
```

*Note: The frontend client communicates with the server at `http://localhost:5000/api` using the centralized configuration inside `client/src/utils/api.js`.*

---

## 3. Obtaining API Keys

### Google OAuth Credentials
1. Go to the [Google Cloud Developer Console](https://console.cloud.google.com/).
2. Create a new project named **Spend Smart**.
3. Navigate to **APIs & Services > Credentials**.
4. Configure the **OAuth Consent Screen** (User Type: External) and add basic developer details.
5. Under **Credentials**, click **Create Credentials > OAuth Client ID**.
6. Select **Web Application**:
   - Authorized JavaScript origins: `http://localhost:5173` (Vite's dev URL)
   - Authorized redirect URIs: `http://localhost:5173`
7. Copy the generated **Client ID** and **Client Secret** and add them to your environment files.

### Groq API Key
1. Go to the [Groq Console](https://console.groq.com/keys).
2. Sign in or create a free Groq Cloud account.
3. Click **Create API Key**.
4. Give the key a description (e.g., `Spend Smart MERN`) and copy the generated key.
5. Insert it as `GROQ_API_KEY` in `server/.env`.

---

## 4. Local Installation & Development Launch

Follow these steps to download dependencies and launch the developer servers:

### Step 1: Install Dependencies
Open a command terminal and execute:

**Frontend dependencies:**
```bash
cd client
npm install
```

**Backend dependencies:**
```bash
cd ../server
npm install
```

### Step 2: Run Backend Dev Server
In the `server` directory, launch the Node API server:
```bash
npm run dev
```
*The server will start listening at `http://localhost:5000` and automatically establish a connection with MongoDB.*

### Step 3: Run Frontend Vite Dev Client
Open a second terminal window in the `client` directory and launch the client:
```bash
npm run dev
```
*The client dev server will launch at `http://localhost:5173`.*

---

## 5. Verification Check list
To ensure your local environment is correctly configured:
1. **Google OAuth Button:** Ensure the Google sign-in button renders on the `/login` page without console errors.
2. **Normal Registration:** Create an account using email/password. You should see a success toast and be redirected to the Dashboard.
3. **Database Check:** Verify that new transactions you add appear in your MongoDB Atlas collections.
4. **AI Insights:** Navigate to the AI Insights tab. If you have transactions and have added the `GROQ_API_KEY`, clicking "Refresh Analysis" should display your financial health metrics, savings rates, and AI advice boxes. If the key is missing, it should cleanly display a key configuration guide instead of crashing.
