"use client";
import { useAuth } from "@/context/AuthContext";
import { useEffect, useState } from "react";

export default function Students() {
  const { loading, hasPrivilege } = useAuth();
  const [students, setStudents] = useState([]);

  useEffect(() => {
    if (hasPrivilege("DELETE_PRIVILEGE")) {
      fetch("/api/students")
        .then(res => res.json())
        .then(data => setStudents(data));
    }
  }, [hasPrivilege]);

  if (loading) return <p>Loading...</p>;

  if (!hasPrivilege("DELETE_PRIVILEGE"))
    return <p>🚫 You do not have permission to view students</p>;

  return (
    <div>
      <h1>Students</h1>
      <pre>{JSON.stringify(students, null, 2)}</pre>
    </div>
  );
}
