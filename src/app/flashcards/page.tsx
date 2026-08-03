"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

type Sign = {
  id: number;
  name: string;
  meaning: string;
};

export default function Flashcards() {
  const [signs, setSigns] = useState<Sign[]>([]);
  const [loading, setLoading] = useState(true);
  const [index, setIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);

  useEffect(() => {
    async function loadSigns() {
      const { data, error } = await supabase.from("signs").select("*");
      if (error) {
        console.error("Error loading signs:", error);
      } else {
        setSigns(data as Sign[]);
      }
      setLoading(false);
    }
    loadSigns();
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <p className="text-slate-500">Loading flashcards...</p>
      </div>
    );
  }

  if (signs.length === 0) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <p className="text-slate-500">No flashcards found.</p>
      </div>
    );
  }

  const current = signs[index];

  function handleNext() {
    setFlipped(false);
    setIndex((i) => (i + 1) % signs.length);
  }

  function handlePrev() {
    setFlipped(false);
    setIndex((i) => (i - 1 + signs.length) % signs.length);
  }

  return (
    <div className="flex min-h-screen flex-col items-center bg-slate-50 px-6 py-10">
      <div className="w-full max-w-md">
        <Link href="/" className="text-sm text-slate-500 hover:underline">
          ← Back to Home
        </Link>

        <p className="mt-4 text-sm font-medium text-blue-600">
          Card {index + 1} of {signs.length}
        </p>

        <button
          onClick={() => setFlipped(!flipped)}
          className="mt-4 flex min-h-[220px] w-full flex-col items-center justify-center rounded-2xl bg-white p-6 text-center shadow-md"
        >
          {!flipped ? (
            <p className="text-xl font-bold text-slate-900">{current.name}</p>
          ) : (
            <p className="text-slate-700">{current.meaning}</p>
          )}
          <p className="mt-4 text-xs text-slate-400">(tap card to flip)</p>
        </button>

        <div className="mt-6 flex gap-3">
          <button
            onClick={handlePrev}
            className="flex-1 rounded-xl border-2 border-slate-300 px-4 py-3 font-semibold text-slate-700 hover:bg-slate-100"
          >
            Previous
          </button>
          <button
            onClick={handleNext}
            className="flex-1 rounded-xl bg-blue-600 px-4 py-3 font-semibold text-white hover:bg-blue-700"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}