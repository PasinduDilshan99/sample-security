"use client";

import { useRouter } from "next/navigation";
import React, { useState } from "react";

type LoginResponse = {
  message: string;
  username: string;
  uniqueCode: string;
  accessTokenExpiresAt: string;
  refreshTokenExpiresAt: string;
};

export default function Page() {
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [response, setResponse] = useState<LoginResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const route = useRouter()

  const handleLogin = async () => {
    try {
      setError(null);
      setResponse(null);

      const res = await fetch("/api/login", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      if (!res.ok) {
        const err = await res.json();
        setError(err.message || "Login failed");
        return;
      }

      const data: LoginResponse = await res.json();

      sessionStorage.setItem("uniqueCode", data.uniqueCode);

      setResponse(data);
      route.push("/dashboard")
    } catch (err) {
      setError("Something went wrong");
    }
  };

  return (
    <div className="p-4">
      <h1>Login</h1>

      <input
        className="border p-2 block"
        value={username}
        placeholder="Username"
        onChange={(e) => setUsername(e.target.value)}
      />

      <input
        className="border p-2 block mt-2"
        value={password}
        type="password"
        placeholder="Password"
        onChange={(e) => setPassword(e.target.value)}
      />

      <button
        className="mt-3 bg-blue-500 text-white p-2"
        onClick={handleLogin}
      >
        Login
      </button>

      {error && <p className="text-red-500 mt-3">{error}</p>}

      {response && (
        <pre className="mt-3">{JSON.stringify(response, null, 2)}</pre>
      )}
    </div>
  );
}
