"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

type Attempt = {
  date: string;
  score: number;
  total: number;
  percentage: number;
  passed: boolean;
};

export default function History() {
  const [attempts, setAttempts] = useState<Attempt[]>([]);

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("examHistory") || "[]");
    setAttempts(stored);
  }, []);

  return (
    <div className="flex min-h-screen flex-col items-center bg-slate-50 px-6 py-10">
      <div className="w-full max-w-md">
        <Link href="/" className="text-sm text-slate-500 hover:underline">
          ← Back to Home
        </Link>

        <h1 className="mt-4 text-2xl font-bold text-slate-900">Exam History</h1>

        {attempts.length === 0 ? (
          <p className="mt-6 text-slate-500">
            No mock exams taken yet. Complete one to see your history here.
          </p>
        ) : (
          <div className="mt-6 flex flex-col gap-3">
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
                  key={i}
                  className="flex items-center justify-between rounded-xl bg-white p-4 shadow-sm"
                >
                  <div>
                    <p className="font-medium text-slate-900">{formattedDate}</p>
                    <p className="text-sm text-slate-500">
                      {attempt.score} / {attempt.total} ({attempt.percentage}%)
                    </p>
                  </div>
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-semibold ${
                      attempt.passed
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
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