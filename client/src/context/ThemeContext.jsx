// src/context/ThemeContext.jsx
import { createContext, useEffect, useState } from "react";

export const ThemeContext = createContext();

// Apply theme class to document root
const applyThemeClass = (theme) => {
  const root = document.documentElement;
  if (theme === "dark") {
    root.classList.add("dark");
    root.setAttribute("data-theme", "dark");
  } else {
    root.classList.remove("dark");
    root.setAttribute("data-theme", "light");
  }
};

// Get initial theme (localStorage → system preference → fallback)
const getInitialTheme = () => {
  try {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme) {
      applyThemeClass(savedTheme);
      return savedTheme;
    }

    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const systemTheme = prefersDark ? "dark" : "light";

    applyThemeClass(systemTheme);
    return systemTheme;
  } catch (error) {
    console.error("System theme detection failed:", error);
  }

  // fallback
  applyThemeClass("dark");
  return "dark";
};

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(getInitialTheme);

  const toggleTheme = () => {
    setTheme((prevTheme) => {
      const newTheme = prevTheme === "dark" ? "light" : "dark";
      localStorage.setItem("theme", newTheme);
      return newTheme;
    });
  };

  useEffect(() => {
    applyThemeClass(theme);
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
