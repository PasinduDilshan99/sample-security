"use client";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";

export default function Dashboard() {
  const { user, loading, hasRole, hasPrivilege, logout } = useAuth();
  const router = useRouter();

  const uniqueCode = sessionStorage.getItem("uniqueCode");

  if (loading) return <p>Loading...</p>;

  if (!uniqueCode) {
    router.push("/login");
    return null;
  }

  const handleLogout = async () => {
    await logout();
    router.push("/login");
  };

  return (
    <div>
      <h1>Welcome {user?.username}</h1>

      <button
        onClick={handleLogout}
        className="bg-red-500 text-white px-4 py-2 rounded my-3"
      >
        Logout
      </button>

      {hasPrivilege("READ_PRIVILEGE") && <div>📘 You can VIEW students</div>}
      {hasPrivilege("WRITE_PRIVILEGE") && <div>✏️ You can ADD students</div>}
      {hasRole("ADMIN") && <div>🛡 Admin Panel</div>}
    </div>
  );
}
