export default function Loading({ message = "Loading..." }: { message?: string }) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-3 bg-slate-50">
      <div className="h-8 w-8 animate-spin rounded-full border-4 border-slate-200 border-t-blue-600" />
      <p className="text-sm text-slate-500">{message}</p>
    </div>
  );
}