import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-slate-50 px-6 text-center">
      <span className="text-6xl font-bold text-[#F59E0B]" aria-hidden="true">
        !
      </span>
      <h1 className="font-display text-2xl font-bold text-slate-900">Wrong turn</h1>
      <p className="max-w-xs text-slate-500">
        We couldn&apos;t find the page you&apos;re looking for.
      </p>
      <Link
        href="/"
        className="rounded-xl bg-[#1E40AF] px-5 py-2.5 font-semibold text-white transition hover:bg-blue-800"
      >
        Back to Home
      </Link>
    </div>
  );
}
