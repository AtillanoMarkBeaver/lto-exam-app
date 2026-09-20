"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import Loading from "@/lib/Loading";

type Question = {
  id: number;
  category: string;
  question: string;
  choices: string[];
  correct_index: number;
  explanation: string;
};

export default function Practice() {
  const [allQuestions, setAllQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);

  useEffect(() => {
    async function loadQuestions() {
      setLoadError(false);
      const { data, error } = await supabase.from("questions").select("*");
      if (error) {
        console.error("Error loading questions:", error);
        setLoadError(true);
      } else {
        setAllQuestions(data as Question[]);
      }
      setLoading(false);
    }
    loadQuestions();
  }, []);

  if (loading) {
    return <Loading message="Loading questions..." />;
  }

  if (loadError) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-3 bg-slate-50 px-6 text-center">
        <p className="text-slate-700">Couldn&apos;t load questions. Check your connection and try again.</p>
        <button
          onClick={() => window.location.reload()}
          className="rounded-xl bg-[#1E40AF] px-5 py-2.5 font-semibold text-white transition hover:bg-blue-800"
        >
          Retry
        </button>
      </div>
    );
  }

  if (allQuestions.length === 0) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <p className="text-slate-500">No questions available yet.</p>
      </div>
    );
  }

  const categories = ["All", ...Array.from(new Set(allQuestions.map((q) => q.category)))];

  const questions =
    selectedCategory === "All"
      ? allQuestions
      : allQuestions.filter((q) => q.category === selectedCategory);

  function handleCategoryChange(category: string) {
    setSelectedCategory(category);
    setCurrentIndex(0);
    setSelected(null);
  }

  const current = questions[currentIndex];
  const isAnswered = selected !== null;
  const isCorrect = selected === current.correct_index;

  function handleSelect(index: number) {
    if (isAnswered) return;
    setSelected(index);
  }

  function handleNext() {
    setSelected(null);
    setCurrentIndex((prev) => (prev + 1) % questions.length);
  }

  return (
    <div className="flex min-h-screen flex-col items-center bg-slate-50 px-6 py-10">
      <div className="w-full max-w-md">
        <Link href="/" className="text-sm font-medium text-slate-500 hover:text-slate-700">
          ← Back to Home
        </Link>

        <div className="mt-4 flex flex-wrap gap-2">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => handleCategoryChange(category)}
              aria-pressed={selectedCategory === category}
              className={`rounded-lg border-l-4 px-3 py-1.5 text-sm font-medium transition ${
                selectedCategory === category
                  ? "border-[#F59E0B] bg-[#1E40AF] text-white"
                  : "border-slate-200 bg-white text-slate-600 hover:border-slate-300"
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        <div className="mt-6 rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-100">
          <p className="text-xs font-semibold uppercase tracking-wide text-[#1E40AF]">
            {current.category} · {currentIndex + 1} of {questions.length}
          </p>

          <h1 className="font-display mt-2 text-xl font-bold text-slate-900">
            {current.question}
          </h1>

          <div className="mt-5 flex flex-col gap-2.5">
            {current.choices.map((choice, index) => {
              const isSelected = selected === index;
              const isRightAnswer = index === current.correct_index;

              let styles = "border-slate-200 hover:border-slate-300 hover:bg-slate-50";
              let marker: string | null = null;
              if (isAnswered && isRightAnswer) {
                styles = "border-[#16A34A] bg-green-50";
                marker = "✓";
              } else if (isAnswered && isSelected && !isCorrect) {
                styles = "border-[#DC2626] bg-red-50";
                marker = "✗";
              }

              return (
                <button
                  key={index}
                  onClick={() => handleSelect(index)}
                  aria-pressed={isSelected}
                  className={`flex items-center justify-between rounded-xl border-2 px-4 py-3 text-left font-medium text-slate-800 transition ${styles}`}
                >
                  <span>{choice}</span>
                  {marker && (
                    <span
                      aria-hidden="true"
                      className={`ml-3 font-bold ${
                        marker === "✓" ? "text-[#16A34A]" : "text-[#DC2626]"
                      }`}
                    >
                      {marker}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {isAnswered && (
            <div className="mt-5 rounded-xl bg-slate-50 p-4" role="status" aria-live="polite">
              <p className={`font-semibold ${isCorrect ? "text-[#16A34A]" : "text-[#DC2626]"}`}>
                {isCorrect ? "Correct!" : "Not quite."}
              </p>
              <p className="mt-1 text-sm text-slate-600">{current.explanation}</p>
              <button
                onClick={handleNext}
                className="mt-4 w-full rounded-xl bg-[#1E40AF] px-4 py-3 font-semibold text-white transition hover:bg-blue-800"
              >
                Next Question
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}