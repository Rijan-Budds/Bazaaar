import React, { useState, useEffect } from "react";
import type {FormEvent} from 'react';
import axios, { AxiosError } from "axios";
import { useNavigate } from "react-router-dom";

axios.defaults.withCredentials = true;

interface AuthStatusResponse {
  authenticated: boolean;
}

interface LoginResponse {
  status: string;
  user?: object;
  message?: string;
}

export default function Login(): React.JSX.Element {
  const navigate = useNavigate();
  const [fname, setFname] = useState<string>("");
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const response = await axios.get<AuthStatusResponse>(
          "http://localhost:8081/api/auth/status"
        );
        if (response.data.authenticated) {
          navigate("/profile");
        }
      } catch (error) {
        console.error("Error checking auth status:", error);
      }
    };

    checkAuthStatus();
  }, [navigate]);

  const handleRegister = (): void => {
    navigate("/register");
  };

  const handleHome = (): void => {
    navigate("/");
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>): Promise<void> => {
    event.preventDefault();
    setError("");
    setLoading(true);

    if (!fname.trim() || !username.trim() || !password.trim()) {
      setError("All fields are required");
      setLoading(false);
      return;
    }

    if (
      fname.trim() === "admin" &&
      username.trim() === "admin@admin.com" &&
      password.trim() === "admin"
    ) {
      setLoading(false);
      navigate("/admin");
      return;
    }

    try {
      const response = await axios.post<LoginResponse>("http://localhost:8081/login", {
        fname: fname.trim(),
        username: username.trim(),
        password: password.trim(),
      });

      if (response.data.status === "success") {
        localStorage.setItem("isLoggedIn", "true");
        if (response.data.user) {
          localStorage.setItem("user", JSON.stringify(response.data.user));
        }
        navigate("/profile");
      } else {
        if (response.data.status === "no_record") {
          setError("Invalid credentials. Please check your username and password.");
        } else {
          setError(response.data.message || "Login failed. Please try again.");
        }
      }
    } catch (err) {
      console.error("Login error:", err);
      const error = err as AxiosError<{ message?: string }>;

      if (error.response) {
        setError(error.response.data.message || "Login failed. Please try again.");
      } else if (error.request) {
        setError("Unable to connect to server. Please check your connection.");
      } else {
        setError("An unexpected error occurred. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 px-4">
      <div className="bg-white border border-gray-200 rounded-2xl shadow-lg p-10 max-w-md w-full font-sans">
        <div className="flex justify-between mb-6">
          <button
            onClick={handleHome}
            disabled={loading}
            className="btn-outline-secondary inline-flex items-center px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100 disabled:opacity-50"
            type="button"
          >
            <i className="bi bi-house-door mr-2"></i> Home
          </button>
        </div>

        <div className="text-center mb-8">
          <h2 className="text-2xl font-semibold text-[#bb2649] mb-2">Welcome Back</h2>
          <p className="text-gray-500 text-sm">Please sign in to your account</p>
        </div>

        {error && (
          <div
            className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-6"
            role="alert"
          >
            <i className="bi bi-exclamation-triangle-fill mr-2 inline"></i>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-5">
            <label htmlFor="fname" className="block mb-2 font-medium text-gray-700">
              <i className="bi bi-person mr-2 inline"></i> Username
            </label>
            <input
              type="text"
              id="fname"
              placeholder="Enter your username"
              value={fname}
              onChange={(e) => setFname(e.target.value)}
              disabled={loading}
              required
              className="w-full h-11 px-4 rounded-lg border border-gray-300 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#bb2649] focus:border-[#bb2649]"
            />
          </div>

          <div className="mb-5">
            <label htmlFor="username" className="block mb-2 font-medium text-gray-700">
              <i className="bi bi-envelope mr-2 inline"></i> Email
            </label>
            <input
              type="email"
              id="username"
              placeholder="Enter your email"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              disabled={loading}
              required
              className="w-full h-11 px-4 rounded-lg border border-gray-300 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#bb2649] focus:border-[#bb2649]"
            />
          </div>

          <div className="mb-8">
            <label htmlFor="password" className="block mb-2 font-medium text-gray-700">
              <i className="bi bi-lock mr-2 inline"></i> Password
            </label>
            <input
              type="password"
              id="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
              required
              className="w-full h-11 px-4 rounded-lg border border-gray-300 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#bb2649] focus:border-[#bb2649]"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full h-11 bg-[#bb2649] hover:bg-[#9a1d3a] text-white font-semibold rounded-lg transition-colors disabled:opacity-50 flex items-center justify-center mb-6"
          >
            {loading ? (
              <>
                <span
                  className="spinner-border spinner-border-sm mr-2"
                  role="status"
                  aria-hidden="true"
                ></span>
                Signing in...
              </>
            ) : (
              <>
                <i className="bi bi-box-arrow-in-right mr-2"></i> Sign In
              </>
            )}
          </button>
        </form>

        <div className="text-center">
          <p className="text-gray-600 mb-3 text-sm">Don't have an account?</p>
          <button
            onClick={handleRegister}
            disabled={loading}
            type="button"
            className="inline-flex items-center px-6 py-2 border border-[#bb2649] text-[#bb2649] font-medium rounded-lg hover:bg-[#bb2649] hover:text-white transition-colors disabled:opacity-50"
          >
            <i className="bi bi-person-plus mr-2"></i> Create Account
          </button>
        </div>
      </div>
    </div>
  );
}
