// src/pages/About.jsx

import {
  FaGithub,
  FaUser,
  FaCode,
  FaChartPie,
  FaFilePdf,
  FaBrain,
  FaDatabase,
  FaServer,
  FaGoogle,
  FaLock,
  FaBell,
  FaMoon,
  FaCloud,
  FaMobileAlt,
  FaUserShield
} from "react-icons/fa";

const About = () => {
  const features = [
    {
      icon: FaCode,
      title: "Transaction Management",
      desc: "Add, edit, delete, and manage income and expense transactions with ease"
    },
    {
      icon: FaChartPie,
      title: "Financial Analytics",
      desc: "Interactive charts and visual insights to understand income, expenses, savings, and spending patterns"
    },
    {
      icon: FaFilePdf,
      title: "PDF Export",
      desc: "Generate and export detailed financial reports with transactions, summaries, and financial data"
    },
    {
      icon: FaBrain,
      title: "AI-Powered Insights",
      desc: "Intelligent financial analysis, personalized insights, and smart spending recommendations"
    },
    {
      icon: FaGoogle,
      title: "Google Authentication",
      desc: "Secure and convenient user authentication powered by Google OAuth"
    },
    {
      icon: FaDatabase,
      title: "Cloud Database",
      desc: "Secure and scalable cloud data storage powered by MongoDB Atlas"
    },
    {
      icon: FaLock,
      title: "Secure Authentication",
      desc: "Protected user sessions and application routes using JWT-based authentication"
    },
    {
      icon: FaServer,
      title: "RESTful API",
      desc: "Full-stack backend architecture built with Node.js and Express.js"
    },
    {
      icon: FaMoon,
      title: "Dark & Light Mode",
      desc: "Seamlessly switch between dark and light themes for a personalized viewing experience"
    },
    {
      icon: FaBell,
      title: "Smart Notifications",
      desc: "Real-time success, error, and information notifications powered by React Toastify"
    },
    {
      icon: FaMobileAlt,
      title: "Responsive Design",
      desc: "Modern and responsive interface designed to provide a smooth experience across different screen sizes"
    },
    {
      icon: FaUserShield,
      title: "Data Privacy",
      desc: "User-specific financial data is securely managed and protected through authenticated access"
    }
  ];

  const techStack = [
    { name: "MongoDB Atlas", color: "bg-green-600" },
    { name: "Express.js", color: "bg-gray-700" },
    { name: "React", color: "bg-blue-500" },
    { name: "Node.js", color: "bg-green-500" },
    { name: "Tailwind CSS", color: "bg-cyan-500" },
    { name: "React Router", color: "bg-pink-500" },
    { name: "Axios", color: "bg-indigo-500" },
    { name: "React Hook Form", color: "bg-rose-500" },
    { name: "Recharts", color: "bg-orange-500" },
    { name: "React PDF", color: "bg-red-600" },
    { name: "React Toastify", color: "bg-emerald-500" },
    { name: "React Icons", color: "bg-purple-500" },
    { name: "Google OAuth", color: "bg-red-500" },
    { name: "JWT", color: "bg-violet-600" },
    { name: "Vite", color: "bg-purple-600" }
  ];

  return (
    <div className="text-gray-900 dark:text-white animate-fadeIn min-h-screen py-10 px-4">
      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-24 h-24 bg-linear-to-br from-blue-500 to-purple-600 rounded-full mb-6 animate-float">
            <FaChartPie className="text-white text-5xl" />
          </div>

          <h1 className="text-5xl font-bold mb-4 bg-linear-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent">
            About Spend Smart
          </h1>

          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
            A modern full-stack personal finance management platform built
            with the MERN stack, cloud technologies, and intelligent financial
            analytics.
          </p>
        </div>

        {/* Developer Card */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 mb-8 border border-gray-200 dark:border-gray-700 animate-slideIn">
          <div className="flex flex-col md:flex-row items-center gap-6 mb-6">

            <div className="p-4 bg-linear-to-br from-blue-500 to-purple-600 rounded-2xl shadow-lg">
              <FaUser className="text-white text-6xl" />
            </div>

            <div className="text-center md:text-left">
              <h2 className="text-3xl font-bold mb-2">
                Sandeep Jat
              </h2>

              <p className="text-lg text-gray-600 dark:text-gray-400 mb-2">
                Full Stack Developer
              </p>

              <p className="text-gray-500 dark:text-gray-500">
                B.Tech Computer Science & Engineering | SRM University AP
              </p>
            </div>
          </div>

          <div className="flex justify-center md:justify-start gap-4">
            <a
              href="https://github.com/JAT-SANDEEP8117"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-6 py-3 bg-gray-900 dark:bg-gray-700 text-white rounded-lg hover:bg-gray-800 dark:hover:bg-gray-600 transition-all transform hover:scale-105"
            >
              <FaGithub className="text-xl" />
              <span>GitHub Profile</span>
            </a>
          </div>
        </div>

        {/* Project Overview */}
        <div className="bg-linear-to-br from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-2xl p-8 mb-8 border border-blue-200 dark:border-blue-800">

          <h3 className="text-2xl font-bold mb-4 flex items-center gap-3">
            <FaCloud className="text-blue-600 dark:text-blue-400" />
            Project Overview
          </h3>

          <p className="text-lg leading-relaxed text-gray-700 dark:text-gray-300">
            <strong className="text-blue-600 dark:text-blue-400">
              Spend Smart
            </strong>{" "}
            is a full-stack personal finance management application designed
            to help users efficiently track their income, expenses, savings,
            and overall financial activity.
          </p>

          <p className="text-lg leading-relaxed text-gray-700 dark:text-gray-300 mt-4">
            Built using the{" "}
            <strong className="text-blue-600 dark:text-blue-400">
              MERN Stack
            </strong>
            , the application combines a modern React frontend with a Node.js
            and Express.js backend and MongoDB Atlas cloud database.
          </p>

          <p className="text-lg leading-relaxed text-gray-700 dark:text-gray-300 mt-4">
            Spend Smart provides secure authentication, Google OAuth,
            interactive financial analytics, PDF report generation, dark and
            light themes, real-time notifications, and AI-powered financial
            insights to help users better understand and manage their money.
          </p>
        </div>

        {/* Features Grid */}
        <div className="mb-8">
          <h3 className="text-3xl font-bold mb-6 text-center">
            Key Features
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => {
              const Icon = feature.icon;

              return (
                <div
                  key={index}
                  className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg hover:shadow-xl border border-gray-200 dark:border-gray-700 transition-all duration-300 transform hover:scale-105 animate-slideIn"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="flex items-center gap-4 mb-3">
                    <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                      <Icon className="text-blue-600 dark:text-blue-400 text-2xl" />
                    </div>

                    <h4 className="text-lg font-semibold">
                      {feature.title}
                    </h4>
                  </div>

                  <p className="text-gray-600 dark:text-gray-400 text-sm">
                    {feature.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Technology Stack */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 border border-gray-200 dark:border-gray-700">

          <h3 className="text-3xl font-bold mb-6 text-center flex items-center justify-center gap-3">
            <FaCode className="text-blue-500" />
            Technology Stack
          </h3>

          <div className="flex flex-wrap justify-center gap-3">
            {techStack.map((tech, index) => (
              <span
                key={index}
                className={`${tech.color} text-white px-6 py-3 rounded-full font-semibold shadow-md hover:shadow-lg transition-all transform hover:scale-110`}
              >
                {tech.name}
              </span>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};

export default About;