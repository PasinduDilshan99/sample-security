"use client";
import { useAuth } from "@/context/AuthContext";

export default function Dashboard() {
  const { user, loading, hasRole, hasPrivilege } = useAuth();

  if (loading) return <p>Loading...</p>;

  return (
    <div>
      <h1>Welcome {user?.username}</h1>

      {hasPrivilege("READ_PRIVILEGE") && <div>📘 You can VIEW students</div>}

      {hasPrivilege("WRITE_PRIVILEGE") && <div>✏️ You can ADD students</div>}

      {hasRole("ADMIN") && <div>🛡 Admin Panel</div>}
    </div>
  );
}
