
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function SuccessPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-center p-6 bg-background text-foreground">
      <h1 className="text-3xl font-bold text-green-600 mb-4">Payment Successful 🎉</h1>
      <p className="text-lg text-muted-foreground mb-6">
        Your appointment has been successfully booked. You’ll receive a confirmation shortly.
      </p>
      <Link href="/bookings">
        <Button className="bg-blue-600 text-white hover:bg-blue-700">
          View My Bookings
        </Button>
      </Link>
    </div>
  );
}
