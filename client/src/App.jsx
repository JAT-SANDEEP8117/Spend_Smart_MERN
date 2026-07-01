// src/App.jsx

import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useContext, useState } from "react";
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import Footer from "./components/Footer";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ThemeContext } from "./context/ThemeContext";
import { AuthContext } from "./context/AuthContext";

import Home from "./pages/Home";
import Transactions from "./pages/Transactions";
import Analytics from "./pages/Analytics";
import AIInsights from "./pages/AIInsights";
import About from "./pages/About";
import PDFExport from "./pages/PDFExport";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Profile from "./pages/Profile";

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useContext(AuthContext);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-gray-600 dark:text-gray-400">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

// Public Route Component (redirect to home if already logged in)
const PublicRoute = ({ children }) => {
  const { user, loading } = useContext(AuthContext);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-gray-600 dark:text-gray-400">Loading...</div>
      </div>
    );
  }

  if (user) {
    return <Navigate to="/" replace />;
  }

  return children;
};

const App = () => {
  const { theme } = useContext(ThemeContext);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <>
      <ToastContainer 
        position="top-right" 
        theme={theme === "dark" ? "dark" : "light"}
        toastClassName="dark:bg-gray-800 dark:text-white"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
          <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />
          
          {/* Protected Routes */}
          <Route
            path="/*"
            element={
              <ProtectedRoute>
                <div className="flex min-h-screen relative overflow-x-hidden">
                  {/* LEFT SIDEBAR - Fixed / Collapsible */}
                  <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

                  {/* MAIN CONTENT */}
                  <div className="flex-1 lg:ml-60 min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col w-full transition-all duration-300">
                    <Navbar onMenuClick={() => setSidebarOpen(!sidebarOpen)} />
                    
                    <div className="flex-1 p-4 lg:p-6 w-full max-w-7xl mx-auto">
                      <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/transactions" element={<Transactions />} />
                        <Route path="/analytics" element={<Analytics />} />
                        <Route path="/pdf" element={<PDFExport />} />
                        <Route path="/insights" element={<AIInsights />} />
                        <Route path="/about" element={<About />} />
                        <Route path="/profile" element={<Profile />} />
                      </Routes>
                    </div>

                    <Footer />
                  </div>
                </div>
              </ProtectedRoute>
            }
          />
        </Routes>
      </Router>
    </>
  );
};

export default App;
