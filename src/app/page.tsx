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
      options: {
        redirectTo: window.location.origin,
      },
    });
  }

  async function handleSignOut() {
    await supabase.auth.signOut();
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-slate-50 px-6 py-12">
      <div className="w-full max-w-md text-center">
        <h1 className="text-3xl font-bold text-slate-900">
          LTO Exam Practice
        </h1>
        <p className="mt-2 text-slate-600">
          Prepare for your written driver&apos;s exam
        </p>

        {!loading && (
          <div className="mt-4">
            {user ? (
              <div className="flex items-center justify-center gap-3">
                <p className="text-sm text-slate-600">
                  Signed in as {user.email}
                </p>
                <button
                  onClick={handleSignOut}
                  className="text-sm font-medium text-blue-600 hover:underline"
                >
                  Sign out
                </button>
              </div>
            ) : (
              <button
                onClick={handleSignIn}
                className="inline-flex items-center gap-2 rounded-xl border-2 border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100"
              >
                Sign in with Google
              </button>
            )}
          </div>
        )}

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