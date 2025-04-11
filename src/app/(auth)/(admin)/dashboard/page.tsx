"use client";

import { useEffect, useState } from "react";
import { getAllUsers, changeUserRole } from "@/firebase/firebase";
import { useProtectedRoute } from "@/hooks/useProtectedRoute";
import { toast } from "sonner";

interface User {
  uid: string;
  email: string;
  displayName: string;
  role: "user" | "admin" | "doctor";
}

const roles = ["user", "admin", "doctor"] as const;

export default function AdminPage() {
  const [users, setUsers] = useState<User[]>([]);
  const loading = useProtectedRoute(["admin"]);

  const fetchUsers = async () => {
    const userList = await getAllUsers();
    setUsers(userList);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleRoleChange = async (uid: string, newRole: string) => {
    try {
      await changeUserRole(uid, newRole);
      toast.success(`Role changed to "${newRole}"`);
      fetchUsers();
    } catch (err) {
      console.error(err);
      toast.error("Failed to update role");
    }
  };

  if (loading) return <div className="p-6">Loading...</div>;

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6 text-primary">User Management</h1>
      <ul className="space-y-4">
        {users.map((user) => (
          <li
            key={user.uid}
            className="bg-card border border-border rounded-lg shadow-sm p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
          >
            <div className="space-y-1">
              <p className="text-lg font-semibold text-foreground">
                {user.displayName}
              </p>
              <p className="text-sm text-muted-foreground">{user.email}</p>
              <p className="text-sm text-muted-foreground">
                Role:{" "}
                <span className="font-medium text-blue-600">
                  {user.role}
                </span>
              </p>
            </div>

            <select
              value={user.role}
              onChange={(e) => handleRoleChange(user.uid, e.target.value)}
              className="px-3 py-2 border border-input rounded-md bg-background text-foreground shadow-sm focus:outline-none focus:ring-2 focus:ring-primary"
            >
              {roles.map((role) => (
                <option key={role} value={role}>
                  {role}
                </option>
              ))}
            </select>
          </li>
        ))}
      </ul>
    </div>
  );
}
