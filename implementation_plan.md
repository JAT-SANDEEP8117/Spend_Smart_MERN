# MERN Stack Migration, JWT Auth, Google Sign-In & UI Polish

This plan details the steps required to transition the Spend Smart application from a mock backend (JSON Server) to a production-ready MERN Stack (MongoDB, Express.js, React, Node.js). It preserves all existing functionality while implementing a secure database, JWT authentication, Google Sign-In, theme selection persistence, and mobile responsiveness.

---

## User Review Required

> [!IMPORTANT]
> **Google Sign-In Configuration:**
> You will need to create a **Google Cloud Developer Console** project and obtain a **OAuth 2.0 Client ID**.
> We will configure the application to read this client ID from environment variables (`VITE_GOOGLE_CLIENT_ID` for frontend and `GOOGLE_CLIENT_ID` for backend).
> We will display a graceful warning if it's missing, so the app does not crash.
> 
> **Database Credentials:**
> We will read the MongoDB connection URI from the server's `.env` file (`MONGODB_URI`). For zero-config local development, we will automatically fallback to `mongodb://127.0.0.1:27017/spend_smart` if no URI is provided.

> [!WARNING]
> **API Port & URL Mapping:**
> The frontend baseURL in [api.js](file:///d:/PROJECTS/Spend_Smart_MERN/client/src/utils/api.js) will be changed to `http://localhost:5000/api`. The express server will run on port `5000` to avoid conflicts and serve API requests behind the `/api` prefix.

---

## Open Questions

> [!NOTE]
> There are no blocking open questions at this stage. We have designed the Google Sign-In flow to check if a user is logging in for the first time, and if so, show a clean inline display-name form before registering them in the database.

---

## Proposed Changes

### Backend Setup (Node.js + Express.js)

We will implement a production-ready backend under the `server` directory using a clean, scalable architectural structure.

#### [NEW] [db.js](file:///d:/PROJECTS/Spend_Smart_MERN/server/config/db.js)
Establish MongoDB connection with Atlas / Local fallback.

#### [NEW] [User.js](file:///d:/PROJECTS/Spend_Smart_MERN/server/models/User.js)
Define User Schema including `username`, `email` (unique), `password` (required if not Google user), `isGoogleUser`, and `googleId`. Include password bcrypt hashing on pre-save.

#### [NEW] [Transaction.js](file:///d:/PROJECTS/Spend_Smart_MERN/server/models/Transaction.js)
Define Transaction Schema including `userId` (ObjectId ref), `type`, `amount`, `category`, `date` (YYYY-MM-DD), and `description`. Returns a virtual `id` mapping to support the existing React code.

#### [NEW] [jwt.js](file:///d:/PROJECTS/Spend_Smart_MERN/server/utils/jwt.js)
Helper to sign JWT tokens.

#### [NEW] [authMiddleware.js](file:///d:/PROJECTS/Spend_Smart_MERN/server/middleware/authMiddleware.js)
JWT token validation middleware to protect API endpoints and assign `req.user`.

#### [NEW] [authController.js](file:///d:/PROJECTS/Spend_Smart_MERN/server/controllers/authController.js)
Handle user registration, login, Google verification, and Google username completion.

#### [NEW] [transactionController.js](file:///d:/PROJECTS/Spend_Smart_MERN/server/controllers/transactionController.js)
Handle CRUD operations and bulk reset for transactions, scoped to the authenticated user.

#### [NEW] [aiController.js](file:///d:/PROJECTS/Spend_Smart_MERN/server/controllers/aiController.js)
Define stubs and TODO comments outlining the RAG pipeline structure for future implementation.

#### [NEW] [authRoutes.js](file:///d:/PROJECTS/Spend_Smart_MERN/server/routes/authRoutes.js)
Endpoints: `POST /api/auth/register`, `POST /api/auth/login`, `POST /api/auth/google`, `POST /api/auth/google/register`.

#### [NEW] [transactionRoutes.js](file:///d:/PROJECTS/Spend_Smart_MERN/server/routes/transactionRoutes.js)
Endpoints: `GET /api/transactions`, `POST /api/transactions`, `PUT /api/transactions/:id`, `DELETE /api/transactions/:id`, `DELETE /api/transactions` (bulk reset). All endpoints are JWT-protected.

#### [NEW] [aiRoutes.js](file:///d:/PROJECTS/Spend_Smart_MERN/server/routes/aiRoutes.js)
Endpoints: `POST /api/ai/insights` (protected placeholder).

#### [NEW] [AI_INTEGRATION.md](file:///d:/PROJECTS/Spend_Smart_MERN/server/AI_INTEGRATION.md)
Detailed documentation detailing the plans, endpoints, and future RAG pipeline implementation.

#### [NEW] [.env](file:///d:/PROJECTS/Spend_Smart_MERN/server/.env)
Server environment variables config template.

#### [MODIFY] [index.js](file:///d:/PROJECTS/Spend_Smart_MERN/server/index.js)
Initialize Express, configure middlewares (CORS, body parser, logging), establish MongoDB connection, mount routes, and configure global error handling.

---

### React Frontend Modifications

#### [MODIFY] [api.js](file:///d:/PROJECTS/Spend_Smart_MERN/client/src/utils/api.js)
- Update `baseURL` to `http://localhost:5000/api`.
- Add an axios interceptor to dynamically inject the JWT token (from `localStorage`'s user details) into the `Authorization` header.

#### [MODIFY] [AuthContext.jsx](file:///d:/PROJECTS/Spend_Smart_MERN/client/src/context/AuthContext.jsx)
- Update `login` and `register` to use the backend's `/auth/login` and `/auth/register` endpoints.
- Store the JWT token within the user object saved to `localStorage` (guaranteeing backward compatibility for components expecting the existing structure).

#### [MODIFY] [TransactionContext.jsx](file:///d:/PROJECTS/Spend_Smart_MERN/client/src/context/TransactionContext.jsx)
- Adjust the `fetchTransactions`, `addTransaction`, `deleteTransaction`, and `updateTransaction` functions to point to the simplified JWT-authenticated MERN routes.
- Update `resetAllTransactions` to call `DELETE /api/transactions` directly as a bulk deletion endpoint rather than sending multiple parallel API calls.

#### [MODIFY] [ThemeContext.jsx](file:///d:/PROJECTS/Spend_Smart_MERN/client/src/context/ThemeContext.jsx)
- Expose a `toggleTheme` function.
- Read theme from and persist it to `localStorage` under key `'theme'`.

#### [MODIFY] [index.css](file:///d:/PROJECTS/Spend_Smart_MERN/client/src/index.css)
- Add selector-based dark mode configuration: `@variant dark (&:where(.dark, .dark *));` to ensure Tailwind v4 correctly styles elements when the class `.dark` is added to the HTML tag.

#### [MODIFY] [Navbar.jsx](file:///d:/PROJECTS/Spend_Smart_MERN/client/src/components/Navbar.jsx)
- Add a theme toggle button showing `FaSun` in dark mode and `FaMoon` in light mode.
- Render a hamburger toggle menu button on the left (visible on mobile only) to open the navigation drawer.

#### [MODIFY] [Sidebar.jsx](file:///d:/PROJECTS/Spend_Smart_MERN/client/src/components/Sidebar.jsx)
- Add `isOpen` and `onClose` props.
- Implement mobile slide-in positioning (`-translate-x-full` default, `translate-x-0` when open) and backdrop overlay for screens smaller than `lg`.

#### [MODIFY] [App.jsx](file:///d:/PROJECTS/Spend_Smart_MERN/client/src/App.jsx)
- Manage `sidebarOpen` state and connect it to `Navbar` and `Sidebar`.
- Adjust main content layout responsiveness class (`ml-0 lg:ml-60`) to support sidebar collapsible menus.

#### [MODIFY] [Login.jsx](file:///d:/PROJECTS/Spend_Smart_MERN/client/src/pages/Login.jsx) & [Register.jsx](file:///d:/PROJECTS/Spend_Smart_MERN/client/src/pages/Register.jsx)
- Embed Google Sign-In script in `index.html` and initialize the Google Sign-In button.
- Integrate Google Sign-In handler: if new user, display inline form prompting them to choose a custom display name/username before finalizing registration.

#### [MODIFY] [index.html](file:///d:/PROJECTS/Spend_Smart_MERN/client/index.html)
- Include `<script src="https://accounts.google.com/gsi/client" async defer></script>` in the head.

---

### Archiving Mock Server Configuration

#### [NEW] [archive/](file:///d:/PROJECTS/Spend_Smart_MERN/archive)
Create directory `archive/` at the root.

#### [NEW] [archive/server/](file:///d:/PROJECTS/Spend_Smart_MERN/archive/server)
Move all original mock server configurations (`db.json`, `package.json`, `package-lock.json`, `users.json`, `transactions.json`) into the archive folder.

---

## Verification Plan

### Automated Tests
- Run backend linting or health checks.
- Test server start-up and connection fallback.

### Manual Verification
- **Authentication**: Perform user signup, login, and verify JWT is generated and stored. Verify logout clears tokens.
- **Google Sign-In**: Initiate Google Login, select/complete registration with a chosen display name, and verify credentials in MongoDB.
- **CRUD Operations**: Add, edit, delete, filter, and bulk-reset transactions. Verify MongoDB collections update correctly.
- **Light/Dark Toggle**: Click toggle, check theme propagation across the page, refresh page, and verify the theme persists.
- **Responsiveness**: Verify sidebar collapses on mobile screens (viewport < 1024px), toggle it using the hamburger menu, and click backdrop to close.
