"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

type Question = {
  id: number;
  category: string;
  question: string;
  choices: string[];
  correct_index: number;
  explanation: string;
};

export default function Practice() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);

  useEffect(() => {
    async function loadQuestions() {
      const { data, error } = await supabase.from("questions").select("*");
      if (error) {
        console.error("Error loading questions:", error);
      } else {
        setQuestions(data as Question[]);
      }
      setLoading(false);
    }
    loadQuestions();
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <p className="text-slate-500">Loading questions...</p>
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <p className="text-slate-500">No questions found.</p>
      </div>
    );
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
        <Link href="/" className="text-sm text-slate-500 hover:underline">
          ← Back to Home
        </Link>

        <p className="mt-4 text-sm font-medium text-blue-600">
          {current.category} · Question {currentIndex + 1} of {questions.length}
        </p>

        <h1 className="mt-2 text-xl font-bold text-slate-900">
          {current.question}
        </h1>

        <div className="mt-6 flex flex-col gap-3">
          {current.choices.map((choice, index) => {
            const isSelected = selected === index;
            const isRightAnswer = index === current.correct_index;

            let styles = "border-slate-300 hover:bg-slate-100";
            if (isAnswered && isRightAnswer) {
              styles = "border-green-500 bg-green-50";
            } else if (isAnswered && isSelected && !isCorrect) {
              styles = "border-red-500 bg-red-50";
            }

            return (
              <button
                key={index}
                onClick={() => handleSelect(index)}
                className={`rounded-xl border-2 px-4 py-3 text-left font-medium text-slate-800 ${styles}`}
              >
                {choice}
              </button>
            );
          })}
        </div>

        {isAnswered && (
          <div className="mt-6 rounded-xl bg-white p-4 shadow-sm">
            <p className={`font-semibold ${isCorrect ? "text-green-600" : "text-red-600"}`}>
              {isCorrect ? "Correct!" : "Not quite."}
            </p>
            <p className="mt-1 text-sm text-slate-600">{current.explanation}</p>
            <button
              onClick={handleNext}
              className="mt-4 w-full rounded-xl bg-blue-600 px-4 py-3 font-semibold text-white hover:bg-blue-700"
            >
              Next Question
            </button>
          </div>
        )}
      </div>
    </div>
  );
}