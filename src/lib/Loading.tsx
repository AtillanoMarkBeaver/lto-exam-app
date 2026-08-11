export default function Loading({ message = "Loading..." }: { message?: string }) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-3 bg-slate-50">
      <div className="h-9 w-9 animate-spin rounded-full border-4 border-slate-200 border-t-[#1E40AF]" />
      <p className="font-body text-sm text-slate-500">{message}</p>
    </div>
  );
}