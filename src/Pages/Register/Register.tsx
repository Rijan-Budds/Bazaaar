import type { FormEvent } from "react";
import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Register() {
  const navigate = useNavigate();
  const [fname, setFname] = useState<string>("");
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const handleLogin = () => {
    navigate("/login");
  };

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    axios
      .post("http://localhost:8081/register", { fname, username, password })
      .then((res) => {
        console.log(res);
        if (res.data.status === "success") {
          alert("Registration successful!");
          navigate("/login");
        } else {
          alert(res.data.message);
        }
      })
      .catch((err) => console.log(err));
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="max-w-md w-full bg-white p-8 rounded-xl shadow-lg font-poppins">
        <h2 className="text-center text-2xl font-semibold text-red-700 mb-6">
          Register
        </h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label
              htmlFor="fname"
              className="block text-sm font-medium text-gray-700 mb-1 cursor-pointer"
            >
              Username
            </label>
            <input
              type="text"
              id="fname"
              placeholder="Enter Username"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-transparent"
              value={fname}
              onChange={(e) => setFname(e.target.value)}
              required
            />
          </div>

          <div>
            <label
              htmlFor="username"
              className="block text-sm font-medium text-gray-700 mb-1 cursor-pointer"
            >
              Email
            </label>
            <input
              type="email"
              id="username"
              placeholder="Enter Email"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-transparent"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700 mb-1 cursor-pointer"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              placeholder="Enter Password"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-transparent"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-red-700 text-white font-semibold rounded-lg hover:bg-red-800 transition"
          >
            Register
          </button>
        </form>

        <button
          onClick={handleLogin}
          className="w-full mt-4 py-3 border border-red-700 text-red-700 font-semibold rounded-lg hover:bg-red-100 transition"
        >
          Login
        </button>
      </div>
    </div>
  );
}
