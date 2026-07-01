import { NavLink } from "react-router-dom";
import {
  FaHome,
  FaList,
  FaChartPie,
  FaBrain,
  FaFilePdf,
  FaInfoCircle,
  FaBars,
  FaTimes,
} from "react-icons/fa";

const Sidebar = ({ isOpen, onClose }) => {
  const linkClass = ({ isActive }) =>
    `flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
      isActive
        ? "bg-blue-600 text-white dark:bg-blue-700 shadow-md transform scale-105"
        : "text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 hover:transform hover:scale-105"
    }`;

  return (
    <>
      {/* Drawer Overlay for Mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 dark:bg-black/70 z-40 lg:hidden transition-opacity"
          onClick={onClose}
        ></div>
      )}

      {/* Sidebar aside */}
      <aside
        className={`fixed left-0 top-0 w-60 h-screen bg-white dark:bg-gray-900 shadow-xl border-r border-gray-200 dark:border-gray-700 z-50 transition-transform duration-300 transform ${
          isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        <div className="p-4 h-full flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-linear-to-br from-purple-500 to-pink-600 rounded-lg shadow-md">
                <FaBars className="text-white text-lg" />
              </div>
              <h2 className="text-lg font-bold text-gray-900 dark:text-white">Menu</h2>
            </div>
            {/* Close button for Mobile */}
            <button
              onClick={onClose}
              className="lg:hidden text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 p-2"
              aria-label="Close sidebar"
            >
              <FaTimes />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex flex-col gap-2 flex-1">
            <NavLink to="/" className={linkClass} onClick={onClose}>
              <FaHome /> Dashboard
            </NavLink>

            <NavLink to="/transactions" className={linkClass} onClick={onClose}>
              <FaList /> Transactions
            </NavLink>

            <NavLink to="/analytics" className={linkClass} onClick={onClose}>
              <FaChartPie /> Analytics
            </NavLink>

            <NavLink to="/pdf" className={linkClass} onClick={onClose}>
              <FaFilePdf /> PDF Export
            </NavLink>

            <NavLink to="/insights" className={linkClass} onClick={onClose}>
              <FaBrain /> AI Insights
            </NavLink>

            <NavLink to="/about" className={linkClass} onClick={onClose}>
              <FaInfoCircle /> About
            </NavLink>
          </nav>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
