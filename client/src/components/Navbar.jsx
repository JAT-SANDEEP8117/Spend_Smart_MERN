// src/components/Navbar.jsx
import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaMoon,
  FaSun,
  FaUser,
  FaSignOutAlt,
  FaChevronDown,
  FaBars,
} from "react-icons/fa";
import { ThemeContext } from "../context/ThemeContext";
import { AuthContext } from "../context/AuthContext";

const Navbar = ({ onMenuClick }) => {
  const { theme, toggleTheme } = useContext(ThemeContext);
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [showDropdown, setShowDropdown] = useState(false);

  const handleToggle = () => {
    toggleTheme();
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
    setShowDropdown(false);
  };

  const handleProfile = () => {
    navigate("/profile");
    setShowDropdown(false);
  };

  return (
    <nav className="w-full px-6 py-4 bg-white dark:bg-gray-900 shadow-md flex justify-between items-center border-b border-gray-200 dark:border-gray-700 transition-colors">
      {/* Left side: Hamburger (mobile only) & Brand */}
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuClick}
          className="p-2 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 lg:hidden cursor-pointer"
          aria-label="Toggle Menu"
        >
          <FaBars />
        </button>
        <h1 className="text-xl font-bold bg-linear-to-r from-blue-600 to-blue-800 dark:from-blue-400 dark:to-blue-600 bg-clip-text text-transparent">
          Spend Smart
        </h1>
      </div>

      {/* Right side: Theme Toggle & User Info */}
      <div className="flex items-center gap-4">
        {/* Theme Toggle Button */}
        <button
          onClick={handleToggle}
          className="p-2.5 rounded-lg bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 transition-colors active:scale-95 cursor-pointer"
          aria-label="Toggle Theme"
        >
          {theme === "dark" ? (
            <FaSun className="text-amber-500" />
          ) : (
            <FaMoon className="text-indigo-600" />
          )}
        </button>

        {user && (
          <div className="relative">
            <button
              onClick={() => setShowDropdown(!showDropdown)}
              className="flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors cursor-pointer"
            >
              <FaUser className="text-gray-700 dark:text-gray-300" />
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                {user.username}
              </span>
              <FaChevronDown className="text-gray-700 dark:text-gray-300 text-xs" />
            </button>

            {showDropdown && (
              <>
                <div
                  className="fixed inset-0 z-10"
                  onClick={() => setShowDropdown(false)}
                ></div>
                <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 z-20">
                  <button
                    onClick={handleProfile}
                    className="w-full flex items-center gap-3 px-4 py-3 text-left text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors rounded-t-lg cursor-pointer"
                  >
                    <FaUser className="text-blue-600 dark:text-blue-400" />
                    <span>Profile</span>
                  </button>
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-4 py-3 text-left text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors rounded-b-lg cursor-pointer"
                  >
                    <FaSignOutAlt />
                    <span>Logout</span>
                  </button>
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
