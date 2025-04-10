"use client";

import { useEffect, useState } from "react";
import { getAllUsers } from "@/firebase/firebase";
import { changeUserRole } from "@/firebase/firebase";
import { useProtectedRoute } from "@/hooks/useProtectedRoute";

interface User {
  uid: string;
  email: string;
  displayName: string;
  role: "user" | "admin" | "doctor";
}

const roles = ["user", "admin", "doctor"];

export default function AdminPage() {
  const [users, setUsers] = useState<User[]>([]);
  const loading = useProtectedRoute(["admin"]);
  console.log(loading);

  const fetchUsers = async () => {
    const userList = await getAllUsers();
    setUsers(userList);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleRoleChange = async (uid: string, newRole: string) => {
    await changeUserRole(uid, newRole);
    fetchUsers(); // Refresh list after update
  };

  if (loading) return <div>Loading...</div>;
  return (
    <div>
      <h1 className="text-xl font-bold mb-4">User List</h1>
      <ul className="space-y-2">
        {users.map((user) => (
          <li
            key={user.uid}
            className="border p-3 rounded flex justify-between items-center"
          >
            <div>
              <strong>{user.displayName}</strong> ({user.email})<br />
              <span className="italic">Current role: {user.role}</span>
            </div>
            <select
              value={user.role}
              onChange={(e) => handleRoleChange(user.uid, e.target.value)}
              className="border p-1 rounded"
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
