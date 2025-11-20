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
  hasRole: (role: string) => boolean;
  hasPrivilege: (priv: string) => boolean;
  fetchMe: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  hasRole: () => false,
  hasPrivilege: () => false,
  fetchMe: async () => {},
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

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
        headers: {
          "Content-Type": "application/json",
        },
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
      console.error("Failed to fetch user data:", error);
      setUser(null);
      sessionStorage.removeItem("uniqueCode");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMe();
  }, []);

  const hasRole = (role: string) => {
    return user?.roles?.includes(role) ?? false;
  };

  const hasPrivilege = (priv: string) => {
    return user?.privileges?.includes(priv) ?? false;
  };

  return (
    <AuthContext.Provider value={{ user, loading, hasRole, hasPrivilege, fetchMe }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);