// src/components/Footer.jsx
import { FaGithub, FaHeart, FaCode } from "react-icons/fa";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="mt-auto border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
      <div className="px-6 py-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
            <FaCode className="text-blue-600 dark:text-blue-400" />
            <span className="text-sm">
              Built with <FaHeart className="inline text-red-500 mx-1" /> 
            </span>
          </div>
          
          <div className="flex items-center gap-4">
            <a
              href="https://github.com/JAT-SANDEEP8117/Spend_Smart_MERN.git"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
            >
              <FaGithub className="text-lg" />
              <span className="text-sm">GitHub</span>
            </a>
          </div>

          <div className="text-sm text-gray-500 dark:text-gray-500">
            © {currentYear} Spend Smart. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;







