// src/context/AuthContext.jsx

import { createContext, useState, useEffect, useRef, useCallback } from "react";
import api from "../utils/api";
import { toast } from "react-toastify";

export const AuthContext = createContext();

// Session constants
const ABSOLUTE_SESSION_MS = 24 * 60 * 60 * 1000;   // 24 hours
const INACTIVITY_LIMIT_MS = 10 * 60 * 60 * 1000;   // 10 hours
const ACTIVITY_THROTTLE_MS = 60 * 1000;              // update localStorage at most once/min
const SESSION_CHECK_INTERVAL_MS = 60 * 1000;         // check expiry every 60 seconds

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Refs for cleanup
  const sessionIntervalRef = useRef(null);
  const lastActivityWriteRef = useRef(0); // timestamp of last localStorage write

  // ─── Helpers ──────────────────────────────────────────────────────────────

  const clearSession = useCallback((silent = false) => {
    setUser(null);
    localStorage.removeItem("user");
    localStorage.removeItem("loginTimestamp");
    localStorage.removeItem("lastActivityTimestamp");
    window.dispatchEvent(new Event("userChanged"));
    if (!silent) {
      toast.info("You have been logged out.");
    }
  }, []);

  const recordLogin = () => {
    const now = Date.now();
    localStorage.setItem("loginTimestamp", String(now));
    localStorage.setItem("lastActivityTimestamp", String(now));
    lastActivityWriteRef.current = now;
  };

  // ─── Session expiry checker (runs every 60s) ───────────────────────────────

  const checkSessionExpiry = useCallback(() => {
    const savedUser = localStorage.getItem("user");
    if (!savedUser) return;

    const now = Date.now();

    // 1. Absolute 24-hour expiry (never resets)
    const loginTimestamp = parseInt(localStorage.getItem("loginTimestamp") || "0", 10);
    if (loginTimestamp && now - loginTimestamp >= ABSOLUTE_SESSION_MS) {
      clearSession();
      toast.warning("Your session has expired after 24 hours. Please log in again.");
      return;
    }

    // 2. 10-hour inactivity expiry
    const lastActivity = parseInt(
      localStorage.getItem("lastActivityTimestamp") || "0",
      10
    );
    if (lastActivity && now - lastActivity >= INACTIVITY_LIMIT_MS) {
      clearSession();
      toast.warning("You were logged out due to inactivity. Please log in again.");
    }
  }, [clearSession]);

  // ─── Activity tracker (throttled) ─────────────────────────────────────────

  const handleActivity = useCallback(() => {
    const now = Date.now();
    // Throttle: write to localStorage at most once per minute
    if (now - lastActivityWriteRef.current >= ACTIVITY_THROTTLE_MS) {
      lastActivityWriteRef.current = now;
      localStorage.setItem("lastActivityTimestamp", String(now));
    }
  }, []);

  // ─── Mount: restore user + start session monitoring ───────────────────────

  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      try {
        const parsed = JSON.parse(savedUser);
        // Immediately check expiry before restoring session
        const now = Date.now();
        const loginTimestamp = parseInt(
          localStorage.getItem("loginTimestamp") || "0",
          10
        );
        const lastActivity = parseInt(
          localStorage.getItem("lastActivityTimestamp") || "0",
          10
        );

        const absoluteExpired =
          loginTimestamp && now - loginTimestamp >= ABSOLUTE_SESSION_MS;
        const inactivityExpired =
          lastActivity && now - lastActivity >= INACTIVITY_LIMIT_MS;

        if (absoluteExpired || inactivityExpired) {
          // Session expired while browser was closed — clear silently
          clearSession(true);
        } else {
          setUser(parsed);
        }
      } catch {
        localStorage.removeItem("user");
      }
    }
    setLoading(false);
  }, [clearSession]);

  // ─── Start/stop session monitoring when user state changes ────────────────

  useEffect(() => {
    if (!user) {
      // Stop monitoring when logged out
      if (sessionIntervalRef.current) {
        clearInterval(sessionIntervalRef.current);
        sessionIntervalRef.current = null;
      }
      return;
    }

    // Start periodic expiry check
    sessionIntervalRef.current = setInterval(checkSessionExpiry, SESSION_CHECK_INTERVAL_MS);

    // Activity events (throttled via handleActivity)
    const events = ["mousemove", "keydown", "click", "touchstart", "pointerdown"];
    events.forEach((evt) => window.addEventListener(evt, handleActivity, { passive: true }));

    // Listen for sessionExpired event from api.js 401 interceptor
    const onSessionExpired = () => {
      clearSession(true);
      toast.warning("Your session has expired. Please log in again.");
    };
    window.addEventListener("sessionExpired", onSessionExpired);

    return () => {
      if (sessionIntervalRef.current) {
        clearInterval(sessionIntervalRef.current);
        sessionIntervalRef.current = null;
      }
      events.forEach((evt) => window.removeEventListener(evt, handleActivity));
      window.removeEventListener("sessionExpired", onSessionExpired);
    };
  }, [user, checkSessionExpiry, handleActivity, clearSession]);

  // ─── Auth functions ────────────────────────────────────────────────────────

  const login = async (email, password) => {
    try {
      const response = await api.post("/auth/login", { email, password });
      const { user: userData, token } = response.data;
      const userWithToken = { ...userData, token };

      setUser(userWithToken);
      localStorage.setItem("user", JSON.stringify(userWithToken));
      recordLogin();

      window.dispatchEvent(new Event("userChanged"));
      toast.success("Login successful!");
      return true;
    } catch (error) {
      const errMsg =
        error.response?.data?.message || "Failed to login. Please try again.";
      toast.error(errMsg);
      return false;
    }
  };

  const register = async (username, email, password) => {
    try {
      const response = await api.post("/auth/register", { username, email, password });
      const { user: userData, token } = response.data;
      const userWithToken = { ...userData, token };

      setUser(userWithToken);
      localStorage.setItem("user", JSON.stringify(userWithToken));
      recordLogin();

      window.dispatchEvent(new Event("userChanged"));
      toast.success("Account created successfully!");
      return true;
    } catch (error) {
      const errMsg =
        error.response?.data?.message || "Failed to create account. Please try again.";
      toast.error(errMsg);
      return false;
    }
  };

  const googleLogin = async (token) => {
    try {
      const response = await api.post("/auth/google", { token });
      if (response.data.isNewUser) {
        return {
          isNewUser: true,
          email: response.data.email,
          googleId: response.data.googleId,
        };
      }

      const { user: userData, token: localToken } = response.data;
      const userWithToken = { ...userData, token: localToken };

      setUser(userWithToken);
      localStorage.setItem("user", JSON.stringify(userWithToken));
      recordLogin();

      window.dispatchEvent(new Event("userChanged"));
      toast.success("Google Login successful!");
      return { isNewUser: false };
    } catch (error) {
      const errMsg =
        error.response?.data?.message || "Google Login failed. Please try again.";
      toast.error(errMsg);
      return null;
    }
  };

  const googleRegister = async (username, email, googleId, token) => {
    try {
      const response = await api.post("/auth/google/register", {
        username,
        email,
        googleId,
        token,
      });
      const { user: userData, token: localToken } = response.data;
      const userWithToken = { ...userData, token: localToken };

      setUser(userWithToken);
      localStorage.setItem("user", JSON.stringify(userWithToken));
      recordLogin();

      window.dispatchEvent(new Event("userChanged"));
      toast.success("Account created successfully with Google!");
      return true;
    } catch (error) {
      const errMsg =
        error.response?.data?.message || "Failed to complete Google registration.";
      toast.error(errMsg);
      return false;
    }
  };

  const logout = () => {
    clearSession(true);
    toast.info("Logged out successfully!");
  };

  return (
    <AuthContext.Provider
      value={{ user, login, register, googleLogin, googleRegister, logout, loading }}
    >
      {children}
    </AuthContext.Provider>
  );
};
