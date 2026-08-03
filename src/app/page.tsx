import Link from "next/link";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-slate-50 px-6 py-12">
      <div className="w-full max-w-md text-center">
        <h1 className="text-3xl font-bold text-slate-900">
          LTO Exam Practice
        </h1>
        <p className="mt-2 text-slate-600">
          Prepare for your written driver&apos;s exam
        </p>

        <div className="mt-10 flex flex-col gap-4">
          <Link
            href="/practice"
            className="rounded-xl bg-blue-600 px-6 py-4 text-lg font-semibold text-white shadow-sm hover:bg-blue-700"
          >
            Practice Mode
          </Link>
          <Link
            href="/exam"
            className="rounded-xl bg-slate-900 px-6 py-4 text-lg font-semibold text-white shadow-sm hover:bg-slate-800"
          >
            Mock Exam
          </Link>
          <Link
            href="/flashcards"
            className="rounded-xl border-2 border-slate-300 px-6 py-4 text-lg font-semibold text-slate-700 hover:bg-slate-100"
          >
            Sign Flashcards
          </Link>
          <Link
            href="/history"
            className="rounded-xl border-2 border-slate-300 px-6 py-4 text-lg font-semibold text-slate-700 hover:bg-slate-100"
          >
            Exam History
          </Link>
        </div>
      </div>
    </div>
  );
}