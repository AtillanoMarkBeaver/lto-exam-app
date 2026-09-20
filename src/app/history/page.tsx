"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import Loading from "@/lib/Loading";

type Attempt = {
  date: string;
  score: number;
  total: number;
  percentage: number;
  passed: boolean;
  category?: string;
};

export default function History() {
  const [attempts, setAttempts] = useState<Attempt[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);
  const [signedIn, setSignedIn] = useState(false);

  useEffect(() => {
    async function loadHistory() {
      setLoadError(false);
      const { data: userData } = await supabase.auth.getUser();

      if (userData.user) {
        setSignedIn(true);
        const { data, error } = await supabase
          .from("attempts")
          .select("*")
          .order("created_at", { ascending: false });

        if (error) {
          console.error("Error loading attempts:", error);
          setLoadError(true);
        } else {
          const formatted = data.map((row) => ({
            date: row.created_at,
            score: row.score,
            total: row.total,
            percentage: row.percentage,
            passed: row.passed,
            category: row.category,
          }));
          setAttempts(formatted);
        }
      } else {
        setSignedIn(false);
        try {
          const stored = JSON.parse(localStorage.getItem("examHistory") || "[]");
          setAttempts(stored);
        } catch (err) {
          console.error("Error reading local exam history:", err);
          setLoadError(true);
        }
      }
      setLoading(false);
    }
    loadHistory();
  }, []);

  return (
    <div className="flex min-h-screen flex-col items-center bg-slate-50 px-6 py-10">
      <div className="w-full max-w-md">
        <Link href="/" className="text-sm font-medium text-slate-500 hover:text-slate-700">
          ← Back to Home
        </Link>

        <h1 className="font-display mt-4 text-2xl font-bold text-slate-900">Exam History</h1>

        {!signedIn && !loading && (
          <p className="mt-2 text-sm text-slate-500">
            Sign in with Google on the home page to sync your history across devices.
          </p>
        )}

        {loading ? (
          <Loading message="Loading your history..." />
        ) : loadError ? (
          <div className="mt-6 flex flex-col items-start gap-3">
            <p className="text-slate-700">Couldn&apos;t load your history. Check your connection and try again.</p>
            <button
              onClick={() => window.location.reload()}
              className="rounded-xl bg-[#1E40AF] px-5 py-2.5 font-semibold text-white transition hover:bg-blue-800"
            >
              Retry
            </button>
          </div>
        ) : attempts.length === 0 ? (
          <p className="mt-6 text-slate-500">
            No mock exams taken yet. Complete one to see your history here.
          </p>
        ) : (
          <div className="mt-6 flex flex-col gap-2.5">
            {attempts.map((attempt, i) => {
              const date = new Date(attempt.date);
              const formattedDate = date.toLocaleDateString("en-PH", {
                month: "short",
                day: "numeric",
                year: "numeric",
                hour: "numeric",
                minute: "2-digit",
              });

              return (
                <div
                  key={`${attempt.date}-${i}`}
                  className={`flex items-center justify-between rounded-xl border-l-4 bg-white p-4 shadow-sm ${
                    attempt.passed ? "border-[#16A34A]" : "border-[#DC2626]"
                  }`}
                >
                  <div>
                    <p className="font-medium text-slate-900">{formattedDate}</p>
                    {attempt.category && (
                      <p className="text-xs text-slate-400">{attempt.category}</p>
                    )}
                    <p className="text-sm text-slate-500">
                      {attempt.score} / {attempt.total} ({attempt.percentage}%)
                    </p>
                  </div>
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-semibold ${
                      attempt.passed
                        ? "bg-green-100 text-[#16A34A]"
                        : "bg-red-100 text-[#DC2626]"
                    }`}
                  >
                    {attempt.passed ? "PASSED" : "FAILED"}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}