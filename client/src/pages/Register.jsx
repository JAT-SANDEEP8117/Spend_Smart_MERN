// src/pages/Register.jsx

import { useContext, useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import {
  FaUser,
  FaLock,
  FaEnvelope,
  FaWallet,
  FaEye,
  FaEyeSlash,
  FaGoogle
} from "react-icons/fa";

const Register = () => {
  const {
    register: registerUser,
    googleLogin,
    googleRegister
  } = useContext(AuthContext);

  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [isGoogleRegister, setIsGoogleRegister] = useState(false);
  const [googleEmail, setGoogleEmail] = useState("");
  const [googleId, setGoogleId] = useState("");
  const [googleToken, setGoogleToken] = useState("");
  const [chosenUsername, setChosenUsername] = useState("");

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  const password = watch("password");

  useEffect(() => {
    const initGoogle = () => {
      if (window.google) {
        window.google.accounts.id.initialize({
          client_id:
            import.meta.env.VITE_GOOGLE_CLIENT_ID ||
            "spend-smart-dev-placeholder-id.apps.googleusercontent.com",
          callback: handleGoogleCallback,
        });

        window.google.accounts.id.renderButton(
          document.getElementById("google-signup-btn"),
          {
            theme: "outline",
            size: "large",
            width: "100%",
            text: "signup_with",
            shape: "rectangular"
          }
        );
      } else {
        setTimeout(initGoogle, 300);
      }
    };

    initGoogle();
  }, []);

  const handleGoogleCallback = async (response) => {
    setIsLoading(true);

    const token = response.credential;

    setGoogleToken(token);

    const result = await googleLogin(token);

    setIsLoading(false);

    if (result) {
      if (result.isNewUser) {
        setGoogleEmail(result.email);
        setGoogleId(result.googleId);
        setIsGoogleRegister(true);
      } else {
        navigate("/");
      }
    }
  };

  const handleGoogleRegisterSubmit = async (e) => {
    e.preventDefault();

    if (!chosenUsername.trim()) return;

    setIsLoading(true);

    const success = await googleRegister(
      chosenUsername,
      googleEmail,
      googleId,
      googleToken
    );

    setIsLoading(false);

    if (success) {
      navigate("/");
    }
  };

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    return (
      emailRegex.test(email) ||
      "Please enter a valid email address"
    );
  };

  const validatePassword = (password) => {
    if (!password) {
      return "Password is required";
    }

    if (password.length < 8) {
      return "Password must be at least 8 characters long";
    }

    if (!/[A-Z]/.test(password)) {
      return "Password must contain at least one uppercase letter";
    }

    if (!/[a-z]/.test(password)) {
      return "Password must contain at least one lowercase letter";
    }

    if (!/[0-9]/.test(password)) {
      return "Password must contain at least one number";
    }

    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      return "Password must contain at least one special character";
    }

    return true;
  };

  const onSubmit = async (data) => {
    setIsLoading(true);

    const success = await registerUser(
      data.username,
      data.email,
      data.password
    );

    setIsLoading(false);

    if (success) {
      navigate("/");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-gray-900 via-blue-900 to-gray-900 dark:from-gray-900 dark:via-blue-950 dark:to-gray-900 px-4 py-8 relative overflow-hidden">

      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">

        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-float"></div>

        <div
          className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-float"
          style={{ animationDelay: "1s" }}
        ></div>

      </div>

      {/* Register Container */}
      <div className="w-full max-w-md md:max-w-lg relative z-10 animate-scaleIn px-2">
        <div className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm rounded-2xl shadow-2xl px-6 py-8 sm:px-10 sm:py-10 md:px-12 border border-gray-200/50 dark:border-gray-700/50 hover:shadow-3xl transition-all duration-300">

          {/* Logo / Header */}
          <div className="text-center mb-8 animate-slideUp">

            <div className="inline-flex items-center justify-center w-20 h-20 bg-linear-to-br from-blue-500 via-blue-600 to-purple-600 rounded-full mb-5 shadow-xl animate-bounce-slow">

              <FaWallet className="text-white text-2xl" />

            </div>

            <h1 className="text-4xl font-bold bg-linear-to-r from-blue-600 via-purple-600 to-blue-600 dark:from-blue-400 dark:via-purple-400 dark:to-blue-400 bg-clip-text text-transparent mb-2 animate-fadeIn">

              Create Account

            </h1>

            <p className="text-gray-600 dark:text-gray-400 text-sm">

              {isGoogleRegister
                ? "Choose display name for your Google account"
                : "Sign up to start managing your finances"}

            </p>

          </div>

          {isGoogleRegister ? (

            /* Google Display Name Selection Form */

            <form
              onSubmit={handleGoogleRegisterSubmit}
              className="space-y-6 animate-slideUp"
            >

              <div className="animate-fadeIn">

                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">

                  Choose Username / Display Name

                </label>

                <div className="relative group">

                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-blue-500 transition-colors">

                    <FaGoogle />

                  </div>

                  <input
                    type="text"
                    required
                    value={chosenUsername}
                    onChange={(e) =>
                      setChosenUsername(e.target.value)
                    }
                    className="w-full pl-11 pr-4 py-4 border-2 border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                    placeholder="Enter display name"
                  />

                </div>

                <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">

                  This is the name that will be used inside the
                  application for your account.

                </p>

              </div>

              <div className="space-y-3">

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-linear-to-r from-blue-500 to-purple-600 text-white font-semibold py-4 rounded-xl shadow-lg transition-all transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 cursor-pointer"
                >

                  {isLoading
                    ? "Saving..."
                    : "Complete Registration"}

                </button>

                <button
                  type="button"
                  onClick={() => setIsGoogleRegister(false)}
                  className="w-full border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-semibold py-3.5 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-750 transition-all cursor-pointer"
                >

                  Cancel

                </button>

              </div>

            </form>

          ) : (

            <>

              {/* Standard Signup Form */}

              <form
                onSubmit={handleSubmit(onSubmit)}
                className="space-y-5 animate-slideUp"
                style={{ animationDelay: "0.1s" }}
              >

                {/* Username Field */}

                <div
                  className="animate-fadeIn"
                  style={{ animationDelay: "0.2s" }}
                >

                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 transition-colors">

                    Username

                  </label>

                  <div className="relative group">

                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">

                      <FaUser className="text-gray-400 group-focus-within:text-blue-500 transition-colors duration-200" />

                    </div>

                    <input
                      type="text"
                      {...register("username", {
                        required: "Username is required",
                        minLength: {
                          value: 3,
                          message:
                            "Username must be at least 3 characters",
                        },
                      })}
                      className="w-full pl-11 pr-4 py-4 border-2 border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:focus:border-blue-400 transition-all duration-200 hover:border-gray-400 dark:hover:border-gray-500 placeholder:text-gray-400 dark:placeholder:text-gray-500"
                      placeholder="Choose a username"
                    />

                  </div>

                  {errors.username && (

                    <p className="mt-2 text-sm text-red-500 animate-fadeIn">

                      {errors.username.message}

                    </p>

                  )}

                </div>

                {/* Email Field */}

                <div
                  className="animate-fadeIn"
                  style={{ animationDelay: "0.3s" }}
                >

                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 transition-colors">

                    Email

                  </label>

                  <div className="relative group">

                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">

                      <FaEnvelope className="text-gray-400 group-focus-within:text-blue-500 transition-colors duration-200" />

                    </div>

                    <input
                      type="email"
                      {...register("email", {
                        required: "Email is required",
                        validate: validateEmail,
                      })}
                      className="w-full pl-11 pr-4 py-4 border-2 border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:focus:border-blue-400 transition-all duration-200 hover:border-gray-400 dark:hover:border-gray-500 placeholder:text-gray-400 dark:placeholder:text-gray-500"
                      placeholder="Enter your email"
                    />

                  </div>

                  {errors.email && (

                    <p className="mt-2 text-sm text-red-500 animate-fadeIn">

                      {errors.email.message}

                    </p>

                  )}

                </div>

                {/* Password Field */}

                <div
                  className="animate-fadeIn"
                  style={{ animationDelay: "0.4s" }}
                >

                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 transition-colors">

                    Password

                  </label>

                  <div className="relative group">

                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">

                      <FaLock className="text-gray-400 group-focus-within:text-blue-500 transition-colors duration-200" />

                    </div>

                    <input
                      type={showPassword ? "text" : "password"}
                      {...register("password", {
                        required: "Password is required",
                        validate: validatePassword,
                      })}
                      className="w-full pl-11 pr-12 py-4 border-2 border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:focus:border-blue-400 transition-all duration-200 hover:border-gray-400 dark:hover:border-gray-500 placeholder:text-gray-400 dark:placeholder:text-gray-500"
                      placeholder="Create a strong password"
                    />

                    <button
                      type="button"
                      onClick={() =>
                        setShowPassword(!showPassword)
                      }
                      className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-all duration-200 active:scale-95 cursor-pointer"
                      aria-label={
                        showPassword
                          ? "Hide password"
                          : "Show password"
                      }
                    >

                      {showPassword ? (
                        <FaEyeSlash className="text-lg" />
                      ) : (
                        <FaEye className="text-lg" />
                      )}

                    </button>

                  </div>

                  {errors.password && (

                    <p className="mt-2 text-sm text-red-500 animate-fadeIn">

                      {errors.password.message}

                    </p>

                  )}

                </div>

                {/* Confirm Password */}

                <div
                  className="animate-fadeIn"
                  style={{ animationDelay: "0.5s" }}
                >

                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 transition-colors">

                    Confirm Password

                  </label>

                  <div className="relative group">

                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">

                      <FaLock className="text-gray-400 group-focus-within:text-blue-500 transition-colors duration-200" />

                    </div>

                    <input
                      type={
                        showConfirmPassword
                          ? "text"
                          : "password"
                      }
                      {...register("confirmPassword", {
                        required:
                          "Please confirm your password",
                        validate: (value) =>
                          value === password ||
                          "Passwords do not match",
                      })}
                      className="w-full pl-11 pr-12 py-4 border-2 border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:focus:border-blue-400 transition-all duration-200 hover:border-gray-400 dark:hover:border-gray-500 placeholder:text-gray-400 dark:placeholder:text-gray-500"
                      placeholder="Re-enter your password"
                    />

                    <button
                      type="button"
                      onClick={() =>
                        setShowConfirmPassword(
                          !showConfirmPassword
                        )
                      }
                      className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-all duration-200 active:scale-95 cursor-pointer"
                      aria-label={
                        showConfirmPassword
                          ? "Hide password"
                          : "Show password"
                      }
                    >

                      {showConfirmPassword ? (
                        <FaEyeSlash className="text-lg" />
                      ) : (
                        <FaEye className="text-lg" />
                      )}

                    </button>

                  </div>

                  {errors.confirmPassword && (

                    <p className="mt-2 text-sm text-red-500 animate-fadeIn">

                      {errors.confirmPassword.message}

                    </p>

                  )}

                </div>

                {/* Create Account Button */}

                <div
                  className="animate-fadeIn"
                  style={{ animationDelay: "0.6s" }}
                >

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-linear-to-r from-blue-500 via-blue-600 to-purple-600 hover:from-blue-600 hover:via-blue-700 hover:to-purple-700 text-white font-semibold py-4 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 relative overflow-hidden group mt-5 cursor-pointer"
                  >

                    <span className="relative z-10 flex items-center justify-center gap-2">

                      {isLoading ? (

                        <>

                          <svg
                            className="animate-spin h-5 w-5 text-white"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                          >

                            <circle
                              className="opacity-25"
                              cx="12"
                              cy="12"
                              r="10"
                              stroke="currentColor"
                              strokeWidth="4"
                            ></circle>

                            <path
                              className="opacity-75"
                              fill="currentColor"
                              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                            ></path>

                          </svg>

                          Creating Account...

                        </>

                      ) : (

                        "Create Account"

                      )}

                    </span>

                    <div className="absolute inset-0 bg-linear-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>

                  </button>

                </div>

              </form>

              {/* Divider */}

              <div className="my-7 flex items-center justify-between text-gray-500 dark:text-gray-400">

                <span className="w-1/4 border-b border-gray-300 dark:border-gray-600"></span>

                <span className="text-xs uppercase px-3">

                  or sign up with

                </span>

                <span className="w-1/4 border-b border-gray-300 dark:border-gray-600"></span>

              </div>

              {/* Google Signup Button */}

              <div
                id="google-signup-btn"
                className="w-full flex justify-center mb-6"
              ></div>

              {/* Login Link */}

              <div
                className="mt-6 text-center animate-fadeIn"
                style={{ animationDelay: "0.7s" }}
              >

                <p className="text-sm text-gray-600 dark:text-gray-400">

                  Already have an account?{" "}

                  <button
                    onClick={() => navigate("/login")}
                    className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-semibold transition-all duration-200 hover:underline underline-offset-2 cursor-pointer"
                  >

                    Login

                  </button>

                </p>

              </div>

            </>

          )}

        </div>

      </div>

    </div>
  );
};

export default Register;