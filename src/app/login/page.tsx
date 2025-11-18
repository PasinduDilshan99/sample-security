"use client";
import React, { useState } from "react";

export default function Page() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [response, setResponse] = useState<any>(null);

  const handleLogin = async () => {
    const res = await fetch("/api/login", {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password }),
    });

    const data = await res.json();
    setResponse(data);
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

      <pre className="mt-3">{JSON.stringify(response, null, 2)}</pre>
    </div>
  );
}
