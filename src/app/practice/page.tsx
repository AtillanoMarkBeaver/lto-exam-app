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
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);

  useEffect(() => {
    async function loadQuestions() {
      const { data, error } = await supabase.from("questions").select("*");
      if (error) {
        console.error("Error loading questions:", error);
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

  if (allQuestions.length === 0) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <p className="text-slate-500">No questions found.</p>
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
        <Link href="/" className="text-sm text-slate-500 hover:underline">
          ← Back to Home
        </Link>

        <div className="mt-4 flex flex-wrap gap-2">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => handleCategoryChange(category)}
              className={`rounded-full px-3 py-1 text-sm font-medium ${
                selectedCategory === category
                  ? "bg-blue-600 text-white"
                  : "bg-white text-slate-600 border border-slate-300 hover:bg-slate-100"
              }`}
            >
              {category}
            </button>
          ))}
        </div>

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