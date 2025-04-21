import { getDoctorById } from "@/firebase/firebase";
import { notFound } from "next/navigation";
import DoctorProfileClient from "@/components/DoctorProfileClient";

interface DoctorProfilePageProps {
  params: { doctorId: string };
}

export default async function DoctorProfilePage({
  params,
}: DoctorProfilePageProps) {
  const { doctorId } = params;
  const doctor = await getDoctorById(doctorId);

  if (!doctor) return notFound();

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="bg-background border border-border rounded-xl shadow-sm p-6 flex flex-col md:flex-row gap-6 md:gap-12">
        {/* Doctor Info */}
        <div className="flex-1">
          <h1 className="text-3xl font-bold mb-2">{doctor.displayName}</h1>
          <p className="text-muted-foreground mb-1">{doctor.email}</p>

          {doctor.specialization && (
            <p className="text-sm font-medium text-foreground mb-1">
              <span className="text-muted-foreground">Specialization:</span>{" "}
              {doctor.specialization}
            </p>
          )}

          {doctor.bio && (
            <p className="text-sm text-muted-foreground mt-2 italic">
              {doctor.bio}
            </p>
          )}
        </div>

        {/* Booking/Actions */}
        <div className="w-full md:w-96">
          <DoctorProfileClient doctor={doctor} />
        </div>
      </div>
    </div>
  );
}
