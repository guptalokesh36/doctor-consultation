import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-center p-4">
      <h2 className="text-3xl font-semibold text-red-500 mb-4">Not Found</h2>
      <p className="text-lg  mb-6">Could not find requested resource</p>
      <Link
        href="/"
        className="text-blue-600 hover:text-blue-800 text-lg font-medium"
      >
        Return Home
      </Link>
    </div>
  );
}
