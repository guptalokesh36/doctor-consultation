export default function LoadingPage() {
  return (
    <div className="flex items-center justify-center h-screen bg-background text-foreground">
      <div className="relative w-16 h-16">
        <div className="absolute inset-0 rounded-full border-4 border-t-transparent border-primary animate-spin" />
        <span className="sr-only">Loading...</span>
      </div>
    </div>
  );
}
