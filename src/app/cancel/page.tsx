
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function CancelPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-center p-6 bg-background text-foreground">
      <h1 className="text-3xl font-bold text-red-600 mb-4">Payment Cancelled</h1>
      <p className="text-lg text-muted-foreground mb-6">
        Your payment was cancelled. If this was a mistake, you can try booking again.
      </p>
      <Link href="/doctors">
        <Button className="bg-blue-600 text-white hover:bg-blue-700">
          Try Again
        </Button>
      </Link>
    </div>
  );
}
