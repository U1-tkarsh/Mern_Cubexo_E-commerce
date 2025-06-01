import { useState } from "react";
import API from "../../api/axios";

export default function Auth({ setToken, setRole }) {
  const [authMode, setAuthMode] = useState("login");
  const [form, setForm] = useState({ username: "", password: "" });

  const handleAuth = async (e) => {
    e.preventDefault();
    const endpoint = authMode === "login" ? "login" : "register";
    try {
      const { data } = await API.post(`/auth/${endpoint}`, form);

      localStorage.setItem("token", data.token);
      
      const userRole = data.userRole || "user";
      localStorage.setItem("role", userRole);
      
      setToken(data.token);
      setRole(userRole);

    } catch (err) {
      alert(err.response?.data?.message || "Auth error");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="w-full max-w-sm bg-white shadow-xl rounded-2xl p-6 space-y-6">
        <h1 className="text-2xl font-bold text-center">
          {authMode === "login" ? "Login" : "Register"}
        </h1>
        <form className="space-y-4" onSubmit={handleAuth}>
          <input
            type="text"
            placeholder="Username"
            className="w-full p-2 border rounded-xl"
            value={form.username}
            onChange={(e) => setForm({ ...form, username: e.target.value })}
            required
          />
          <input
            type="password"
            placeholder="Password"
            className="w-full p-2 border rounded-xl"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            required
          />
          <button className="w-full bg-blue-600 text-white p-2 rounded-xl shadow hover:shadow-lg transition">
            {authMode === "login" ? "Login" : "Register"}
          </button>
        </form>
        <p className="text-center text-sm">
          {authMode === "login" ? "Don't have an account?" : "Already have an account?"}{" "}
          <button
            className="text-blue-600 underline"
            onClick={() => setAuthMode(authMode === "login" ? "register" : "login")}
          >
            {authMode === "login" ? "Register" : "Login"}
          </button>
        </p>
      </div>
    </div>
  );
}
