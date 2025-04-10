"use client";
import { useEffect, useState } from "react";
import { getDoctors } from "@/firebase/firebase";
import { User2 } from "lucide-react"; // Optional: Icon for user avatar
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

import { Doctor } from "@/types";
export default function DoctorPage() {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchDoctors = async () => {
      const doctorList = await getDoctors();
      setDoctors(doctorList);
      setLoading(false);
    };

    fetchDoctors();
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-3xl font-semibold mb-6">Our Doctors</h2>

      {loading ? (
        <p className="text-muted">Loading doctors...</p>
      ) : doctors.length === 0 ? (
        <p>No doctors available.</p>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {doctors.map((doctor) => (
            <div
              key={doctor.uid}
              className="rounded-2xl shadow-md p-5 bg-white dark:bg-gray-900 hover:shadow-lg transition-shadow border border-muted"
            >
              <div className="flex items-center gap-4 mb-4">
                <div className="bg-secondary p-3 rounded-full">
                  <User2 className="text-secondary-foreground w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold">
                    {doctor.displayName}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {doctor.email}
                  </p>
                </div>
              </div>
              <p className="text-sm font-medium bg-primary text-primary-foreground px-3 py-1 inline-block rounded-full">
                {doctor.role}
              </p>
              <Button
                onClick={() => router.push(`/doctors/${doctor.uid}`)}
                className="ml-2"
              >
                Book an appointment
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
