import { getDoctorById } from "@/firebase/firebase";
import { notFound } from "next/navigation";
import DoctorProfileClient from "@/components/DoctorProfileClient";

interface DoctorProfilePageProps {
  params: Promise<{ doctorId: string }>;
}

export default async function DoctorProfilePage({
  params,
}: DoctorProfilePageProps) {
  const { doctorId } = await params;
  const doctor = await getDoctorById(doctorId);

  if (!doctor) return notFound();

  return (
    <div className="p-6 m-4 flex flex-row justify-between">
      <div className="flex flex-col">
        <h1 className="text-3xl font-bold mb-4">{doctor.displayName}</h1>
        <p className="text-muted-foreground mb-2">{doctor.email}</p>
        <p className="text-muted-foreground mb-2">{doctor.bio}</p>
      </div>

      <DoctorProfileClient doctor={doctor} />
    </div>
  );
}
