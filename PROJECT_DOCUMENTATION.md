# Spend Smart - Project Documentation

**Project Name:** Spend Smart  
**Group:** GenX  
**Type:** Full Stack Personal Finance Management Application  
**Technology Stack:** React, JSON Server, Tailwind CSS

---

## Table of Contents

1. [Project Overview](#project-overview)
2. [Libraries and Dependencies](#libraries-and-dependencies)
3. [Project Structure](#project-structure)
4. [File Descriptions](#file-descriptions)
5. [Routes and Navigation](#routes-and-navigation)
6. [Features Implementation](#features-implementation)
7. [Data Flow](#data-flow)

---

## Project Overview

Spend Smart is a comprehensive personal finance management application that helps users track their income, expenses, and financial health. It features user authentication, transaction management, analytics, PDF export, and AI-powered insights.

**Key Features:**
- User authentication (Login/Register)
- Transaction CRUD operations
- User-specific transaction management
- Analytics dashboard with charts
- PDF export functionality
- AI insights and recommendations
- Dark/Light theme support
- Responsive design

---

## Libraries and Dependencies

### Frontend Dependencies (client/package.json)

#### Core Framework
- **react (^19.2.0)**: Core React library for building user interfaces
  - Used for: Component-based UI architecture, state management, lifecycle management

- **react-dom (^19.2.0)**: React DOM renderer
  - Used for: Rendering React components to the DOM

#### Routing
- **react-router-dom (^7.9.6)**: Client-side routing library
  - Used for: Navigation between pages, route protection, URL management
  - Implementation: App.jsx - handles all route definitions and navigation

#### HTTP Client
- **axios (^1.13.2)**: Promise-based HTTP client
  - Used for: API calls to JSON Server (GET, POST, PUT, DELETE)
  - Implementation: utils/api.js - centralized API configuration

#### Form Management
- **react-hook-form (^7.53.2)**: Form validation and management library
  - Used for: Login and Register forms with validation
  - Implementation: pages/Login.jsx, pages/Register.jsx
  - Features: Email validation, password strength validation, confirm password matching

#### UI Components & Icons
- **react-icons (^5.5.0)**: Icon library (FontAwesome, Material, etc.)
  - Used for: Icons throughout the application (wallet, charts, user, etc.)
  - Implementation: All components use icons for better UX

#### Styling
- **tailwindcss (^4.1.17)**: Utility-first CSS framework
  - Used for: All styling throughout the application
  - Implementation: Utility classes in all components

- **@tailwindcss/vite (^4.1.17)**: Vite plugin for Tailwind
  - Used for: Tailwind CSS integration with Vite build tool

#### Charts & Visualization
- **recharts (^3.5.0)**: Composable charting library built on React
  - Used for: Analytics charts (Line charts, Pie charts)
  - Implementation: 
    - components/charts/LineChart.jsx - Monthly income/expense trends
    - components/charts/CategoryChart.jsx - Expense category breakdown
    - components/charts/IncomeChart.jsx - Income category breakdown
    - components/charts/IncomeExpenseSavingsChart.jsx - Financial summary chart

#### PDF Generation
- **@react-pdf/renderer (^4.3.1)**: PDF generation library for React
  - Used for: Generating PDF reports of transactions
  - Implementation: features/pdf/PDFGenerator.jsx
  - Features: Custom PDF layout with transactions, summaries, username, timestamp

#### Notifications
- **react-toastify (^11.0.5)**: Toast notification library
  - Used for: User feedback (success, error, info messages)
  - Implementation: App.jsx - ToastContainer component
  - Usage: All CRUD operations show toast notifications

#### Build Tools
- **vite (npm:rolldown-vite@7.2.5)**: Fast build tool and dev server
  - Used for: Development server, building production bundle
  - Configuration: vite.config.js

### Backend Dependencies (server/package.json)

#### Mock API Server
- **json-server (^1.0.0-beta.3)**: Full fake REST API server
  - Used for: Mock backend API, data persistence
  - Implementation: server/db.json - database file
  - Endpoints: /users, /transactions
  - Features: GET, POST, PUT, DELETE operations

- **json-server-auth (^2.1.0)**: Authentication middleware for JSON Server
  - Used for: User authentication (though we implemented custom auth)
  - Note: Installed but using custom authentication logic

### Dev Dependencies

- **@vitejs/plugin-react**: Vite plugin for React
- **eslint**: Code linting and quality checks
- **@types/react**: TypeScript types for React
- **@types/react-dom**: TypeScript types for React DOM

---

## Project Structure

```
fsd_spend_xx/
├── client/                    # Frontend React Application
│   ├── src/
│   │   ├── components/        # Reusable UI components
│   │   │   ├── charts/        # Chart components
│   │   │   ├── Footer.jsx     # Footer component
│   │   │   ├── Loader.jsx     # Loading spinner
│   │   │   ├── Navbar.jsx     # Navigation bar
│   │   │   ├── ResetButton.jsx # Reset transactions button
│   │   │   └── Sidebar.jsx    # Side navigation
│   │   ├── context/           # React Context providers
│   │   │   ├── AuthContext.jsx      # User authentication state
│   │   │   ├── ThemeContext.jsx     # Theme (dark/light) state
│   │   │   └── TransactionContext.jsx # Transaction state management
│   │   ├── features/          # Feature-specific components
│   │   │   ├── pdf/           # PDF generation
│   │   │   └── transactions/  # Transaction management
│   │   ├── pages/             # Page components (routes)
│   │   ├── utils/             # Utility functions
│   │   ├── App.jsx            # Main app component with routing
│   │   └── main.jsx           # Application entry point
│   ├── package.json
│   └── vite.config.js
│
└── server/                    # Backend JSON Server
    ├── db.json               # Database file (users + transactions)
    └── package.json
```

---

## File Descriptions

### Core Application Files

#### **client/src/main.jsx**
- **Purpose:** Application entry point
- **What it does:**
  - Renders the root App component
  - Wraps app with Context providers (ThemeProvider, AuthProvider, TransactionProvider)
  - Initializes React application

#### **client/src/App.jsx**
- **Purpose:** Main application component with routing logic
- **What it does:**
  - Sets up React Router for navigation
  - Defines all application routes
  - Implements route protection (ProtectedRoute, PublicRoute)
  - Renders layout components (Sidebar, Navbar, Footer)
  - Configures ToastContainer for notifications
- **Routes:**
  - Public: `/login`, `/register`
  - Protected: `/`, `/transactions`, `/analytics`, `/pdf`, `/insights`, `/about`, `/profile`

### Context Providers (State Management)

#### **client/src/context/AuthContext.jsx**
- **Purpose:** Manages user authentication state
- **What it does:**
  - Stores current logged-in user
  - Provides login() function - authenticates user with email/password
  - Provides register() function - creates new user account
  - Provides logout() function - clears user session
  - Persists user in localStorage
  - Validates username uniqueness and email format
- **Used by:** Login, Register, Navbar, Profile pages

#### **client/src/context/TransactionContext.jsx**
- **Purpose:** Manages transaction data and operations
- **What it does:**
  - Fetches user-specific transactions from API
  - Provides addTransaction() - creates new transaction
  - Provides deleteTransaction() - removes transaction
  - Provides updateTransaction() - modifies existing transaction
  - Provides resetAllTransactions() - clears all user transactions
  - Sorts transactions by date (newest first)
  - Filters transactions by userId
- **Used by:** All pages that display or manage transactions

#### **client/src/context/ThemeContext.jsx**
- **Purpose:** Manages dark/light theme state
- **What it does:**
  - Toggles between dark and light themes
  - Persists theme preference
- **Used by:** App.jsx, Navbar (theme toggle)

### Pages (Route Components)

#### **client/src/pages/Login.jsx**
- **Purpose:** User login page
- **What it does:**
  - Displays login form (email, password)
  - Validates email format
  - Password visibility toggle
  - Calls AuthContext.login() on submit
  - Redirects to home on success
  - Shows error messages via toast
- **Route:** `/login`
- **Libraries used:** react-hook-form, react-icons

#### **client/src/pages/Register.jsx**
- **Purpose:** User registration page
- **What it does:**
  - Displays registration form (username, email, password, confirm password)
  - Validates email format
  - Validates password strength (8+ chars, uppercase, lowercase, number, special char)
  - Validates password confirmation match
  - Checks username uniqueness
  - Calls AuthContext.register() on submit
  - Redirects to home on success
- **Route:** `/register`
- **Libraries used:** react-hook-form, react-icons

#### **client/src/pages/Home.jsx**
- **Purpose:** Dashboard/home page
- **What it does:**
  - Displays financial summary cards (Total Income, Total Expense, Savings)
  - Shows 6 most recent transactions
  - Calculates totals using calculateTotals utility
  - Sorts transactions by date (newest first)
- **Route:** `/`
- **Libraries used:** react-icons

#### **client/src/pages/Transactions.jsx**
- **Purpose:** Transaction management page
- **What it does:**
  - Lists all transactions with filters and sorting
  - Integrates AddTransaction, EditTransaction, TransactionList components
  - Provides TypeFilter and SortFilter
  - Handles transaction CRUD operations
- **Route:** `/transactions`
- **Components used:** AddTransaction, EditTransaction, TransactionList, TypeFilter, SortFilter

#### **client/src/pages/Analytics.jsx**
- **Purpose:** Analytics and visualization page
- **What it does:**
  - Displays financial summary
  - Shows multiple charts:
    - Line chart for monthly trends
    - Pie charts for category breakdowns
    - Income/Expense/Savings comparison chart
  - Calculates category totals
- **Route:** `/analytics`
- **Libraries used:** recharts
- **Components used:** LineChart, CategoryChart, IncomeChart, IncomeExpenseSavingsChart

#### **client/src/pages/PDFExport.jsx**
- **Purpose:** PDF report generation page
- **What it does:**
  - Provides filters for transactions (type, category, month)
  - Shows summary of filtered transactions
  - Generates and downloads PDF report
  - Includes username and timestamp in PDF
- **Route:** `/pdf`
- **Libraries used:** @react-pdf/renderer
- **Components used:** PDFGenerator

#### **client/src/pages/AIInsights.jsx**
- **Purpose:** AI-powered financial insights page
- **What it does:**
  - Displays savings rate calculation
  - Shows average expense per transaction
  - Provides financial tips based on balance
  - Shows quick financial summary
- **Route:** `/insights`
- **Libraries used:** react-icons

#### **client/src/pages/Profile.jsx**
- **Purpose:** User profile page
- **What it does:**
  - Displays user information (username, email)
  - Shows user avatar
  - Read-only profile view
- **Route:** `/profile`
- **Libraries used:** react-icons

#### **client/src/pages/About.jsx**
- **Purpose:** About/Information page
- **What it does:**
  - Displays project information
  - Shows team details (GenX - Full Stack Developers)
  - Lists features and technology stack
  - Provides GitHub link
- **Route:** `/about`
- **Libraries used:** react-icons

### Components

#### **client/src/components/Navbar.jsx**
- **Purpose:** Top navigation bar
- **What it does:**
  - Displays app title
  - Shows user dropdown menu (username, profile, logout)
  - Handles logout functionality
  - Navigates to profile page
- **Used by:** App.jsx (all protected routes)

#### **client/src/components/Sidebar.jsx**
- **Purpose:** Left side navigation menu
- **What it does:**
  - Displays navigation links (Home, Transactions, Analytics, PDF, Insights, About)
  - Highlights active route
  - Provides quick navigation
- **Used by:** App.jsx (all protected routes)

#### **client/src/components/Footer.jsx**
- **Purpose:** Footer component
- **What it does:**
  - Displays footer information
  - Shows copyright/credits
- **Used by:** App.jsx (all protected routes)

#### **client/src/components/ResetButton.jsx**
- **Purpose:** Reset all transactions button
- **What it does:**
  - Provides confirmation dialog
  - Calls TransactionContext.resetAllTransactions()
  - Shows success/error toast
- **Used by:** Transactions page

### Chart Components

#### **client/src/components/charts/LineChart.jsx**
- **Purpose:** Monthly income/expense line chart
- **What it does:**
  - Displays monthly trends
  - Shows income and expense lines
  - Uses Recharts library
- **Used by:** Analytics page

#### **client/src/components/charts/CategoryChart.jsx**
- **Purpose:** Expense category pie chart
- **What it does:**
  - Shows expense breakdown by category
  - Displays percentages
  - Color-coded categories
- **Used by:** Analytics page

#### **client/src/components/charts/IncomeChart.jsx**
- **Purpose:** Income category pie chart
- **What it does:**
  - Shows income breakdown by category
  - Displays percentages
- **Used by:** Analytics page

#### **client/src/components/charts/IncomeExpenseSavingsChart.jsx**
- **Purpose:** Financial summary bar chart
- **What it does:**
  - Compares Income, Expense, and Savings
  - Visual representation of financial health
- **Used by:** Analytics page

### Transaction Features

#### **client/src/features/transactions/AddTransaction.jsx**
- **Purpose:** Add new transaction modal
- **What it does:**
  - Displays form (type, amount, category, date, description)
  - Toggle between income/expense
  - Validates required fields
  - Calls TransactionContext.addTransaction()
  - Shows success/error toast
- **Used by:** Transactions page

#### **client/src/features/transactions/EditTransaction.jsx**
- **Purpose:** Edit existing transaction modal
- **What it does:**
  - Pre-fills form with transaction data
  - Allows modification of all fields
  - Calls TransactionContext.updateTransaction()
  - Shows success/error toast
- **Used by:** Transactions page

#### **client/src/features/transactions/TransactionList.jsx**
- **Purpose:** Display list of transactions
- **What it does:**
  - Renders transaction cards
  - Shows transaction details (type, amount, category, date, description)
  - Provides edit and delete buttons
  - Color-coded by type (green for income, red for expense)
- **Used by:** Transactions page

#### **client/src/features/transactions/TransactionCard.jsx**
- **Purpose:** Individual transaction card component
- **What it does:**
  - Displays single transaction information
  - Shows edit/delete actions
- **Used by:** TransactionList

#### **client/src/features/transactions/filters/TypeFilter.jsx**
- **Purpose:** Filter transactions by type
- **What it does:**
  - Dropdown to filter by "All", "Income", or "Expense"
  - Updates filtered transaction list
- **Used by:** Transactions page

#### **client/src/features/transactions/filters/SortFilter.jsx**
- **Purpose:** Sort transactions
- **What it does:**
  - Options: Latest, Oldest, Amount High-Low, Amount Low-High
  - Updates sorted transaction list
- **Used by:** Transactions page

### PDF Feature

#### **client/src/features/pdf/PDFGenerator.jsx**
- **Purpose:** PDF report generation
- **What it does:**
  - Creates PDF document with transactions
  - Includes header with username and timestamp
  - Shows summary (income, expense, savings)
  - Displays category breakdown
  - Lists all transactions in table format
  - Downloads PDF file
- **Libraries used:** @react-pdf/renderer
- **Used by:** PDFExport page

### Utilities

#### **client/src/utils/api.js**
- **Purpose:** API configuration
- **What it does:**
  - Creates axios instance with base URL (http://localhost:5000)
  - Centralized API configuration
  - Used by all API calls
- **Used by:** All contexts that make API calls

#### **client/src/utils/calculateTotals.js**
- **Purpose:** Calculate financial totals
- **What it does:**
  - Calculates total income from transactions
  - Calculates total expense from transactions
  - Calculates balance (income - expense)
  - Returns totals object
- **Used by:** Home, Analytics, AIInsights pages

### Styling Files

#### **client/src/index.css**
- **Purpose:** Global styles and animations
- **What it does:**
  - Imports Tailwind CSS
  - Defines custom animations (fadeIn, slideIn, float, bounce, etc.)
  - Global CSS classes
- **Used by:** Entire application

#### **client/src/styles/global.css**
- **Purpose:** Additional global styles (currently unused)
- **Note:** Reserved for future global styles

### Backend Files

#### **server/db.json**
- **Purpose:** Database file for JSON Server
- **What it does:**
  - Stores all users data (id, username, email, password)
  - Stores all transactions (id, userId, type, amount, category, date, description)
  - Links transactions to users via userId
  - Used by JSON Server to create REST API endpoints
- **Endpoints created:**
  - GET/POST /users
  - GET/PUT/DELETE /users/:id
  - GET/POST /transactions
  - GET/PUT/DELETE /transactions/:id
  - GET /transactions?userId=:id (filter by user)

---

## Routes and Navigation

### Route Structure

The application uses **React Router DOM** for client-side routing. Routes are defined in `App.jsx`.

### Public Routes (No Authentication Required)

#### `/login`
- **Component:** Login.jsx
- **Purpose:** User login page
- **Protection:** PublicRoute - redirects to home if already logged in
- **Features:**
  - Email and password input
  - Form validation
  - Password visibility toggle
  - Link to register page
- **Why used:** Entry point for authenticated users

#### `/register`
- **Component:** Register.jsx
- **Purpose:** User registration page
- **Protection:** PublicRoute - redirects to home if already logged in
- **Features:**
  - Username, email, password, confirm password inputs
  - Email format validation
  - Password strength validation
  - Username uniqueness check
  - Link to login page
- **Why used:** Allows new users to create accounts

### Protected Routes (Authentication Required)

All protected routes are wrapped in `ProtectedRoute` component which:
- Checks if user is logged in
- Redirects to `/login` if not authenticated
- Shows loading state while checking authentication

#### `/` (Home/Dashboard)
- **Component:** Home.jsx
- **Purpose:** Main dashboard showing financial overview
- **Features:**
  - Financial summary cards (Income, Expense, Savings)
  - Recent 6 transactions
  - Quick financial overview
- **Why used:** Primary landing page after login, gives users immediate financial snapshot

#### `/transactions`
- **Component:** Transactions.jsx
- **Purpose:** Transaction management page
- **Features:**
  - View all transactions
  - Add new transactions
  - Edit existing transactions
  - Delete transactions
  - Filter by type
  - Sort transactions
  - Reset all transactions
- **Why used:** Core functionality - users need to manage their transactions

#### `/analytics`
- **Component:** Analytics.jsx
- **Purpose:** Financial analytics and visualizations
- **Features:**
  - Line chart for monthly trends
  - Pie charts for category breakdowns
  - Income/Expense/Savings comparison
  - Category-wise totals
- **Why used:** Helps users understand spending patterns and financial trends

#### `/pdf`
- **Component:** PDFExport.jsx
- **Purpose:** Generate and download PDF reports
- **Features:**
  - Filter transactions before export
  - Monthly report option
  - Category and type filters
  - PDF download with username and timestamp
- **Why used:** Users need to export their financial data for records or sharing

#### `/insights`
- **Component:** AIInsights.jsx
- **Purpose:** AI-powered financial insights
- **Features:**
  - Savings rate calculation
  - Average expense per transaction
  - Financial tips
  - Quick summary
- **Why used:** Provides intelligent insights to help users make better financial decisions

#### `/about`
- **Component:** About.jsx
- **Purpose:** Project information and team details
- **Features:**
  - Project overview
  - Team information (GenX)
  - Technology stack
  - Features list
  - GitHub link
- **Why used:** Provides information about the project and developers

#### `/profile`
- **Component:** Profile.jsx
- **Purpose:** User profile page
- **Features:**
  - Display username
  - Display email
  - User avatar
- **Why used:** Users need to view their account information

### Route Protection Logic

**ProtectedRoute Component:**
- Checks AuthContext for logged-in user
- Shows loading state while checking
- Redirects to `/login` if user not authenticated
- Renders children (protected content) if authenticated

**PublicRoute Component:**
- Checks AuthContext for logged-in user
- Shows loading state while checking
- Redirects to `/` (home) if user already logged in
- Renders children (login/register) if not authenticated

**Why Route Protection:**
- Prevents unauthorized access to user data
- Ensures transactions are user-specific
- Provides secure application experience
- Redirects users to appropriate pages based on auth state

---

## Features Implementation

### 1. User Authentication

**Implementation:**
- Login with email and password
- Registration with validation
- Session persistence (localStorage)
- Protected routes

**Files:**
- `context/AuthContext.jsx` - Authentication logic
- `pages/Login.jsx` - Login UI
- `pages/Register.jsx` - Registration UI
- `App.jsx` - Route protection

**Libraries:**
- react-hook-form - Form validation
- axios - API calls

### 2. Transaction Management

**Implementation:**
- CRUD operations (Create, Read, Update, Delete)
- User-specific transactions
- Filtering and sorting
- Real-time updates

**Files:**
- `context/TransactionContext.jsx` - Transaction state management
- `features/transactions/AddTransaction.jsx` - Add transaction
- `features/transactions/EditTransaction.jsx` - Edit transaction
- `features/transactions/TransactionList.jsx` - Display transactions
- `pages/Transactions.jsx` - Transaction management page

**Libraries:**
- axios - API calls to JSON Server

### 3. Analytics & Charts

**Implementation:**
- Multiple chart types (Line, Pie, Bar)
- Category breakdowns
- Monthly trends
- Financial summaries

**Files:**
- `components/charts/LineChart.jsx`
- `components/charts/CategoryChart.jsx`
- `components/charts/IncomeChart.jsx`
- `components/charts/IncomeExpenseSavingsChart.jsx`
- `pages/Analytics.jsx`

**Libraries:**
- recharts - Chart rendering

### 4. PDF Export

**Implementation:**
- Generate PDF reports
- Include username and timestamp
- Filter transactions before export
- Custom PDF layout

**Files:**
- `features/pdf/PDFGenerator.jsx`
- `pages/PDFExport.jsx`

**Libraries:**
- @react-pdf/renderer - PDF generation

### 5. UI/UX Features

**Implementation:**
- Dark/Light theme support
- Responsive design
- Animations and transitions
- Toast notifications
- Password visibility toggle

**Files:**
- `context/ThemeContext.jsx`
- `index.css` - Animations
- All components use Tailwind CSS

**Libraries:**
- tailwindcss - Styling
- react-toastify - Notifications
- react-icons - Icons

---

## Data Flow

### Authentication Flow

1. User visits `/login` or `/register`
2. Fills form (validated with react-hook-form)
3. Submits form → calls AuthContext.login() or register()
4. AuthContext makes API call to JSON Server
5. On success, user data stored in localStorage
6. User state updated in AuthContext
7. Redirect to home page
8. Protected routes now accessible

### Transaction Flow

1. User adds transaction → AddTransaction component
2. Form submitted → TransactionContext.addTransaction()
3. API call to POST /transactions with userId
4. JSON Server saves to db.json
5. TransactionContext updates local state
6. UI re-renders with new transaction
7. Toast notification shown

### Data Fetching Flow

1. App loads → TransactionContext.fetchTransactions()
2. Gets userId from localStorage (via AuthContext)
3. API call to GET /transactions?userId=:id
4. JSON Server returns user's transactions
5. Transactions stored in TransactionContext state
6. Components consume transactions via useContext
7. UI displays transactions

### PDF Generation Flow

1. User filters transactions on PDFExport page
2. Clicks "Download PDF"
3. PDFGenerator.generatePDF() called with filtered data
4. @react-pdf/renderer creates PDF document
5. PDF includes: username, timestamp, summary, transactions
6. PDF blob created and downloaded
7. Toast notification shown

---

## API Endpoints (JSON Server)

### Users Endpoints

- **GET /users** - Get all users
- **GET /users/:id** - Get specific user
- **POST /users** - Create new user
- **PUT /users/:id** - Update user
- **DELETE /users/:id** - Delete user

### Transactions Endpoints

- **GET /transactions** - Get all transactions
- **GET /transactions?userId=:id** - Get user-specific transactions
- **GET /transactions/:id** - Get specific transaction
- **POST /transactions** - Create new transaction
- **PUT /transactions/:id** - Update transaction
- **DELETE /transactions/:id** - Delete transaction

---

## Summary

This project is a full-stack personal finance management application built with:
- **Frontend:** React 19, React Router, Tailwind CSS, Recharts, React PDF
- **Backend:** JSON Server (mock REST API)
- **State Management:** React Context API
- **Form Handling:** React Hook Form
- **Styling:** Tailwind CSS with custom animations
- **Features:** Authentication, CRUD operations, Analytics, PDF Export, AI Insights

The application follows modern React best practices with component-based architecture, context-based state management, and protected routing for security.

---

**Document Generated:** 2025  
**Project:** Spend Smart  
**Developed by:** GenX - Full Stack Developers




