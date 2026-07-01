// src/context/AuthContext.jsx

import { createContext, useState, useEffect } from "react";
import api from "../utils/api";
import { toast } from "react-toastify";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check if user is logged in on mount
  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (err) {
        console.error("Error parsing saved user:", err);
        localStorage.removeItem("user");
      }
    }
    setLoading(false);
  }, []);

  // Login function
  const login = async (email, password) => {
    try {
      const response = await api.post("/auth/login", { email, password });
      const { user: userData, token } = response.data;
      const userWithToken = { ...userData, token };
      
      setUser(userWithToken);
      localStorage.setItem("user", JSON.stringify(userWithToken));
      
      // Trigger custom event for TransactionContext to refresh
      window.dispatchEvent(new Event("userChanged"));
      toast.success("Login successful!");
      return true;
    } catch (error) {
      console.error("Login error:", error);
      const errMsg = error.response?.data?.message || "Failed to login. Please try again.";
      toast.error(errMsg);
      return false;
    }
  };

  // Register function
  const register = async (username, email, password) => {
    try {
      const response = await api.post("/auth/register", { username, email, password });
      const { user: userData, token } = response.data;
      const userWithToken = { ...userData, token };

      setUser(userWithToken);
      localStorage.setItem("user", JSON.stringify(userWithToken));
      
      // Trigger custom event for TransactionContext to refresh
      window.dispatchEvent(new Event("userChanged"));
      toast.success("Account created successfully!");
      return true;
    } catch (error) {
      console.error("Registration error:", error);
      const errMsg = error.response?.data?.message || "Failed to create account. Please try again.";
      toast.error(errMsg);
      return false;
    }
  };

  // Google Login function
  const googleLogin = async (token) => {
    try {
      const response = await api.post("/auth/google", { token });
      if (response.data.isNewUser) {
        return { isNewUser: true, email: response.data.email, googleId: response.data.googleId };
      }
      
      const { user: userData, token: localToken } = response.data;
      const userWithToken = { ...userData, token: localToken };

      setUser(userWithToken);
      localStorage.setItem("user", JSON.stringify(userWithToken));
      
      window.dispatchEvent(new Event("userChanged"));
      toast.success("Google Login successful!");
      return { isNewUser: false };
    } catch (error) {
      console.error("Google login error:", error);
      const errMsg = error.response?.data?.message || "Google Login failed. Please try again.";
      toast.error(errMsg);
      return null;
    }
  };

  // Google Register completion function
  const googleRegister = async (username, email, googleId, token) => {
    try {
      const response = await api.post("/auth/google/register", {
        username,
        email,
        googleId,
        token
      });
      const { user: userData, token: localToken } = response.data;
      const userWithToken = { ...userData, token: localToken };

      setUser(userWithToken);
      localStorage.setItem("user", JSON.stringify(userWithToken));
      
      window.dispatchEvent(new Event("userChanged"));
      toast.success("Account created successfully with Google!");
      return true;
    } catch (error) {
      console.error("Google registration completion error:", error);
      const errMsg = error.response?.data?.message || "Failed to complete Google registration.";
      toast.error(errMsg);
      return false;
    }
  };

  // Logout function
  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
    // Trigger custom event for TransactionContext to refresh
    window.dispatchEvent(new Event("userChanged"));
    toast.info("Logged out successfully!");
  };

  return (
    <AuthContext.Provider value={{ user, login, register, googleLogin, googleRegister, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

