"use client";

import { useAuth } from "@/context/AuthContext";
import { useEffect, useState } from "react";

type Student = {
  id: number;
  firstname: string;
  lastName: string;
  email: string;
};

export default function Students() {
  const { loading, hasPrivilege } = useAuth();
  const [students, setStudents] = useState<Student[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!hasPrivilege("READ_PRIVILEGE")) return;

    fetch("http://localhost:8080/api/v0/students", {
      method: "GET",
      credentials: "include",
    })
      .then(async (res) => {
        if (!res.ok) {
          const err = await res.json();
          throw new Error(err.message || "Failed to load students");
        }
        return res.json();
      })
      .then((data: Student[]) => setStudents(data))
      .catch((err) => setError(err.message));
  }, [hasPrivilege]);

  if (loading) return <p>Loading...</p>;

  if (!hasPrivilege("READ_PRIVILEGE"))
    return <p>🚫 You do not have permission to view students</p>;

  if (error) return <p className="text-red-500">Error: {error}</p>;

  return (
    <div>
      <h1 className="text-xl font-bold mb-4">Students List</h1>

      <table className="min-w-full border border-gray-300">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-2 border">ID</th>
            <th className="p-2 border">First Name</th>
            <th className="p-2 border">Last Name</th>
            <th className="p-2 border">Email</th>
          </tr>
        </thead>

        <tbody>
          {students.map((s) => (
            <tr key={s.id}>
              <td className="p-2 border">{s.id}</td>
              <td className="p-2 border">{s.firstname}</td>
              <td className="p-2 border">{s.lastName}</td>
              <td className="p-2 border">{s.email}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
