"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import type { User } from "@supabase/supabase-js";

export default function Home() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user);
      setLoading(false);
    });

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  async function handleSignIn() {
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: window.location.origin },
    });
  }

  async function handleSignOut() {
    await supabase.auth.signOut();
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-slate-50 px-6 py-12">
      <div className="w-full max-w-md">
        <div className="text-center">
          <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-[#1E40AF] shadow-lg shadow-blue-900/20">
            <svg viewBox="0 0 24 24" className="h-8 w-8" fill="none" stroke="white" strokeWidth="2">
              <circle cx="12" cy="12" r="8" />
              <circle cx="12" cy="12" r="1.5" fill="white" />
              <path d="M12 4v3M12 17v3M4 12h3M17 12h3" />
            </svg>
          </div>
          <h1 className="font-display text-3xl font-bold text-slate-900">
            LTO Exam Practice
          </h1>
          <p className="mt-2 text-slate-500">
            Prepare for your written driver&apos;s exam
          </p>

          {!loading && (
            <div className="mt-5">
              {user ? (
                <div className="inline-flex items-center gap-3 rounded-full bg-white px-4 py-2 shadow-sm">
                  <span className="h-2 w-2 rounded-full bg-[#16A34A]" />
                  <p className="text-sm text-slate-600">{user.email}</p>
                  <button
                    onClick={handleSignOut}
                    className="text-sm font-medium text-[#1E40AF] hover:underline"
                  >
                    Sign out
                  </button>
                </div>
              ) : (
                <button
                  onClick={handleSignIn}
                  className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 shadow-sm ring-1 ring-slate-200 hover:ring-slate-300"
                >
                  Sign in with Google
                </button>
              )}
            </div>
          )}
        </div>

        {/* Dashed lane-line divider — signature element */}
        <div className="my-8 flex items-center justify-center gap-1.5" aria-hidden="true">
          {Array.from({ length: 14 }).map((_, i) => (
            <span key={i} className="h-1 w-4 rounded-full bg-[#F59E0B]/70" />
          ))}
        </div>

        <div className="flex flex-col gap-3">
          <Link
            href="/practice"
            className="group flex items-center gap-4 rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-100 transition hover:shadow-md hover:ring-slate-200"
          >
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-[#1E40AF]">
              <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M9 11l3 3L22 4M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11" />
              </svg>
            </span>
            <div className="text-left">
              <p className="font-display font-semibold text-slate-900">Practice Mode</p>
              <p className="text-sm text-slate-500">Instant feedback, by category</p>
            </div>
          </Link>

          <Link
            href="/exam"
            className="group flex items-center gap-4 rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-100 transition hover:shadow-md hover:ring-slate-200"
          >
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-amber-50 text-[#B45309]">
              <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="9" />
                <path d="M12 7v5l3 3" />
              </svg>
            </span>
            <div className="text-left">
              <p className="font-display font-semibold text-slate-900">Mock Exam</p>
              <p className="text-sm text-slate-500">Timed, with a pass/fail score</p>
            </div>
          </Link>

          <Link
            href="/flashcards"
            className="group flex items-center gap-4 rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-100 transition hover:shadow-md hover:ring-slate-200"
          >
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-green-50 text-[#16A34A]">
              <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="4" width="14" height="16" rx="2" />
                <path d="M7 8h6M7 12h6M7 16h3" />
              </svg>
            </span>
            <div className="text-left">
              <p className="font-display font-semibold text-slate-900">Sign Flashcards</p>
              <p className="text-sm text-slate-500">Flip to learn road signs</p>
            </div>
          </Link>

          <Link
            href="/history"
            className="group flex items-center gap-4 rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-100 transition hover:shadow-md hover:ring-slate-200"
          >
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-600">
              <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="9" />
                <path d="M12 7v5l4 2" />
              </svg>
            </span>
            <div className="text-left">
              <p className="font-display font-semibold text-slate-900">Exam History</p>
              <p className="text-sm text-slate-500">Track your past attempts</p>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}