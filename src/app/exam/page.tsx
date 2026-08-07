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

const EXAM_SECONDS = 120;

export default function Exam() {
  const [allQuestions, setAllQuestions] = useState<Question[]>([]);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [started, setStarted] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<(number | null)[]>([]);
  const [timeLeft, setTimeLeft] = useState(EXAM_SECONDS);
  const [finished, setFinished] = useState(false);

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

  useEffect(() => {
    if (!started || loading || finished || questions.length === 0) return;
    if (timeLeft <= 0) {
      setFinished(true);
      return;
    }
    const timer = setTimeout(() => setTimeLeft((t) => t - 1), 1000);
    return () => clearTimeout(timer);
  }, [timeLeft, finished, loading, questions.length, started]);

  useEffect(() => {
    if (!finished || questions.length === 0) return;

    async function saveAttempt() {
      const score = answers.reduce<number>(
        (total, answer, i) => (answer === questions[i].correct_index ? total + 1 : total),
        0
      );
      const percentage = Math.round((score / questions.length) * 100);
      const passed = percentage >= 75;

      const { data: userData } = await supabase.auth.getUser();

      if (userData.user) {
        const { error } = await supabase.from("attempts").insert({
          user_id: userData.user.id,
          category: selectedCategory,
          score,
          total: questions.length,
          percentage,
          passed,
        });
        if (error) console.error("Error saving attempt:", error);
      } else {
        const attempt = {
          date: new Date().toISOString(),
          score,
          total: questions.length,
          percentage,
          passed,
          category: selectedCategory,
        };
        const existing = JSON.parse(localStorage.getItem("examHistory") || "[]");
        const updated = [attempt, ...existing].slice(0, 20);
        localStorage.setItem("examHistory", JSON.stringify(updated));
      }
    }

    saveAttempt();
  }, [finished]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <p className="text-slate-500">Loading questions...</p>
      </div>
    );
  }

  if (allQuestions.length === 0) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <p className="text-slate-500">No questions found.</p>
      </div>
    );
  }

  const categories = ["All", ...Array.from(new Set(allQuestions.map((q) => q.category)))];

  function handleStart(category: string) {
    setSelectedCategory(category);
    const filtered =
      category === "All" ? allQuestions : allQuestions.filter((q) => q.category === category);
    setQuestions(filtered);
    setAnswers(Array(filtered.length).fill(null));
    setCurrentIndex(0);
    setTimeLeft(EXAM_SECONDS);
    setFinished(false);
    setStarted(true);
  }

  if (!started) {
    return (
      <div className="flex min-h-screen flex-col items-center bg-slate-50 px-6 py-10">
        <div className="w-full max-w-md">
          <Link href="/" className="text-sm text-slate-500 hover:underline">
            ← Back to Home
          </Link>
          <h1 className="mt-4 text-2xl font-bold text-slate-900">Mock Exam</h1>
          <p className="mt-2 text-slate-600">Choose a category to focus on, or take the full exam.</p>

          <div className="mt-6 flex flex-col gap-3">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => handleStart(category)}
                className={`rounded-xl border-2 px-4 py-3 text-left font-medium ${
                  category === "All"
                    ? "border-blue-600 bg-blue-50 text-blue-700"
                    : "border-slate-300 text-slate-700 hover:bg-slate-100"
                }`}
              >
                {category === "All" ? "All Categories (Full Exam)" : category}
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  if (finished) {
    const score = answers.reduce<number>(
      (total, answer, i) => (answer === questions[i].correct_index ? total + 1 : total),
      0
    );
    const percentage = Math.round((score / questions.length) * 100);
    const passed = percentage >= 75;

    return (
      <div className="flex min-h-screen flex-col items-center bg-slate-50 px-6 py-10">
        <div className="w-full max-w-md">
          <h1 className="text-2xl font-bold text-slate-900">Exam Results</h1>
          <p className="mt-1 text-sm text-slate-500">{selectedCategory}</p>
          <p className="mt-2 text-lg text-slate-700">
            Score: <span className="font-bold">{score}</span> / {questions.length}{" "}
            ({percentage}%)
          </p>
          <span
            className={`mt-2 inline-block rounded-full px-3 py-1 text-sm font-semibold ${
              passed ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
            }`}
          >
            {passed ? "PASSED" : "FAILED"}
          </span>

          <div className="mt-6 flex flex-col gap-3">
            {questions.map((q, i) => {
              const correct = answers[i] === q.correct_index;
              return (
                <div
                  key={q.id}
                  className={`rounded-xl border-2 p-4 ${
                    correct ? "border-green-500 bg-green-50" : "border-red-500 bg-red-50"
                  }`}
                >
                  <p className="font-medium text-slate-900">{q.question}</p>
                  <p className="mt-1 text-sm text-slate-600">
                    Your answer:{" "}
                    {answers[i] === null ? "No answer" : q.choices[answers[i]!]}
                  </p>
                  {!correct && (
                    <p className="text-sm text-slate-600">
                      Correct answer: {q.choices[q.correct_index]}
                    </p>
                  )}
                </div>
              );
            })}
          </div>

          <div className="mt-6 flex flex-col gap-3">
            <button
              onClick={() => setStarted(false)}
              className="w-full rounded-xl bg-slate-900 px-6 py-4 text-center text-lg font-semibold text-white hover:bg-slate-800"
            >
              Try Another Category
            </button>
            <Link
              href="/"
              className="block rounded-xl bg-blue-600 px-6 py-4 text-center text-lg font-semibold text-white hover:bg-blue-700"
            >
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const current = questions[currentIndex];

  function handleSelect(index: number) {
    const updated = [...answers];
    updated[currentIndex] = index;
    setAnswers(updated);
  }

  function handleNext() {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex((i) => i + 1);
    } else {
      setFinished(true);
    }
  }

  return (
    <div className="flex min-h-screen flex-col items-center bg-slate-50 px-6 py-10">
      <div className="w-full max-w-md">
        <div className="flex items-center justify-between">
          <Link href="/" className="text-sm text-slate-500 hover:underline">
            ← Back to Home
          </Link>
          <span className="rounded-full bg-slate-900 px-3 py-1 text-sm font-semibold text-white">
            {minutes}:{seconds.toString().padStart(2, "0")}
          </span>
        </div>

        <p className="mt-4 text-sm font-medium text-blue-600">
          {selectedCategory} · Question {currentIndex + 1} of {questions.length}
        </p>
        <h1 className="mt-2 text-xl font-bold text-slate-900">{current.question}</h1>

        <div className="mt-6 flex flex-col gap-3">
          {current.choices.map((choice, index) => {
            const isSelected = answers[currentIndex] === index;
            return (
              <button
                key={index}
                onClick={() => handleSelect(index)}
                className={`rounded-xl border-2 px-4 py-3 text-left font-medium text-slate-800 ${
                  isSelected ? "border-blue-600 bg-blue-50" : "border-slate-300 hover:bg-slate-100"
                }`}
              >
                {choice}
              </button>
            );
          })}
        </div>

        <button
          onClick={handleNext}
          className="mt-6 w-full rounded-xl bg-slate-900 px-6 py-4 text-lg font-semibold text-white hover:bg-slate-800"
        >
          {currentIndex < questions.length - 1 ? "Next Question" : "Finish Exam"}
        </button>
      </div>
    </div>
  );
}