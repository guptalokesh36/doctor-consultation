import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export const useProtectedRoute = (allowedRoles: string[]) => {
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const checkRole = async () => {
      const res = await fetch("/api/get-role");
      const { role } = await res.json();
      console.log("Role fetched:", role);
      if (!allowedRoles.includes(role)) {
        router.replace("/");
      } else {
        setLoading(false);
      }
    };
    checkRole();
  }, [router, allowedRoles]);

  return loading;
};