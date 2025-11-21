"use client";
import React, { createContext, useContext, useEffect, useState } from "react";

export type User = {
  id: number;
  username: string;
  roles: string[];
  privileges: string[];
};

type AuthContextType = {
  user: User | null;
  loading: boolean;
  login: (username: string, password: string) => Promise<any>;
  logout: () => Promise<void>;
  hasRole: (role: string) => boolean;
  hasPrivilege: (priv: string) => boolean;
  fetchMe: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  login: async () => {},
  logout: async () => {},
  hasRole: () => false,
  hasPrivilege: () => false,
  fetchMe: async () => {},
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // -----------------------
  // LOGIN LOGIC (NEW)
  // -----------------------
  const login = async (username: string, password: string) => {
    const response = await fetch("/api/login", {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });

    if (!response.ok) {
      const err = await response.json();
      throw new Error(err.message || "Login failed");
    }

    const data = await response.json();

    // Store session identifier (like before)
    sessionStorage.setItem("uniqueCode", data.uniqueCode);

    // Fetch user after login
    await fetchMe();

    return data; // allow login page to show any message if needed
  };

  // -----------------------
  // FETCH USER DETAILS
  // -----------------------
  const fetchMe = async () => {
    const code = sessionStorage.getItem("uniqueCode");

    if (!code) {
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("http://localhost:8080/api/v0/user/me", {
        method: "GET",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
      });

      if (res.ok) {
        const data = await res.json();
        setUser({
          id: data.id,
          username: data.username,
          roles: data.roles,
          privileges: data.privileges,
        });
      } else {
        setUser(null);
        sessionStorage.removeItem("uniqueCode");
      }
    } catch (error) {
      console.error("Failed to fetch user:", error);
      setUser(null);
      sessionStorage.removeItem("uniqueCode");
    } finally {
      setLoading(false);
    }
  };

  // -----------------------
  // LOGOUT LOGIC
  // -----------------------
  const logout = async () => {
    try {
      await fetch("http://localhost:8080/api/v0/user/logout", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
      });
    } catch (err) {
      console.error("Logout failed:", err);
    }

    sessionStorage.removeItem("uniqueCode");
    setUser(null);
  };

  useEffect(() => {
    fetchMe();
  }, []);

  const hasRole = (role: string) => user?.roles?.includes(role) ?? false;
  const hasPrivilege = (priv: string) =>
    user?.privileges?.includes(priv) ?? false;

  return (
    <AuthContext.Provider
      value={{ user, loading, login, logout, hasRole, hasPrivilege, fetchMe }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
