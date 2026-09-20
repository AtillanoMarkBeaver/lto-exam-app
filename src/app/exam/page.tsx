"use client";

import { useState, useEffect, useRef } from "react";
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

// Exam length scales with how many questions are selected, instead of a
// fixed 120s regardless of category size (previously the same 2-minute
// budget applied whether you picked 1 category or all 63 questions).
const SECONDS_PER_QUESTION = 45;

export default function Exam() {
  const [allQuestions, setAllQuestions] = useState<Question[]>([]);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);
  const [started, setStarted] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<(number | null)[]>([]);
  const [timeLeft, setTimeLeft] = useState(0);
  const [finished, setFinished] = useState(false);
  const hasSavedAttempt = useRef(false);

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

  // Countdown: setFinished is only ever called from inside the timeout
  // callback (an async event, not the effect body itself), which is what
  // React's rules-of-hooks linter requires — calling setState synchronously
  // in the body of an effect can trigger cascading renders.
  useEffect(() => {
    if (!started || loading || finished || questions.length === 0) return;

    const timer = setTimeout(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          setFinished(true);
          return 0;
        }
        return t - 1;
      });
    }, 1000);

    return () => clearTimeout(timer);
  }, [timeLeft, finished, loading, questions.length, started]);

  useEffect(() => {
    if (!finished || questions.length === 0 || hasSavedAttempt.current) return;
    hasSavedAttempt.current = true;

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
        try {
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
        } catch (err) {
          console.error("Error saving attempt to local storage:", err);
        }
      }
    }

    saveAttempt();
    // questions/answers/selectedCategory are intentionally read once via the
    // hasSavedAttempt guard above rather than re-triggering this effect —
    // they don't change again once `finished` is true.
  }, [finished, questions, answers, selectedCategory]);

  if (loading) {
    return <Loading message="Loading questions..." />;
  }

  if (loadError) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-3 bg-slate-50 px-6 text-center">
        <p className="text-slate-700">Couldn&apos;t load exam questions. Check your connection and try again.</p>
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

  function handleStart(category: string) {
    setSelectedCategory(category);
    const filtered =
      category === "All" ? allQuestions : allQuestions.filter((q) => q.category === category);
    setQuestions(filtered);
    setAnswers(Array(filtered.length).fill(null));
    setCurrentIndex(0);
    setTimeLeft(filtered.length * SECONDS_PER_QUESTION);
    setFinished(false);
    hasSavedAttempt.current = false;
    setStarted(true);
  }

  if (!started) {
    return (
      <div className="flex min-h-screen flex-col items-center bg-slate-50 px-6 py-10">
        <div className="w-full max-w-md">
          <Link href="/" className="text-sm font-medium text-slate-500 hover:text-slate-700">
            ← Back to Home
          </Link>
          <h1 className="font-display mt-4 text-2xl font-bold text-slate-900">Mock Exam</h1>
          <p className="mt-1 text-slate-500">Choose a category to focus on, or take the full exam.</p>

          <div className="mt-6 flex flex-col gap-2.5">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => handleStart(category)}
                className={`rounded-xl border-2 px-4 py-3.5 text-left font-medium transition ${
                  category === "All"
                    ? "border-[#1E40AF] bg-blue-50 text-[#1E40AF]"
                    : "border-slate-200 bg-white text-slate-700 hover:border-slate-300"
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
          <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-100">
            <h1 className="font-display text-2xl font-bold text-slate-900">Exam Results</h1>
            <p className="mt-1 text-sm text-slate-500">{selectedCategory}</p>
            <p className="mt-3 text-lg text-slate-700">
              Score: <span className="font-bold">{score}</span> / {questions.length}{" "}
              ({percentage}%)
            </p>
            <span
              className={`mt-2 inline-block rounded-full px-3 py-1 text-sm font-semibold ${
                passed ? "bg-green-100 text-[#16A34A]" : "bg-red-100 text-[#DC2626]"
              }`}
            >
              {passed ? "PASSED" : "FAILED"}
            </span>
          </div>

          <div className="mt-4 flex flex-col gap-3">
            {questions.map((q, i) => {
              const correct = answers[i] === q.correct_index;
              return (
                <div
                  key={q.id}
                  className={`rounded-xl border-l-4 bg-white p-4 shadow-sm ${
                    correct ? "border-[#16A34A]" : "border-[#DC2626]"
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
              className="w-full rounded-xl bg-slate-900 px-6 py-4 text-center text-lg font-semibold text-white transition hover:bg-slate-800"
            >
              Try Another Category
            </button>
            <Link
              href="/"
              className="block rounded-xl bg-[#1E40AF] px-6 py-4 text-center text-lg font-semibold text-white transition hover:bg-blue-800"
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
          <Link href="/" className="text-sm font-medium text-slate-500 hover:text-slate-700">
            ← Back to Home
          </Link>
          <span className="rounded-full bg-slate-900 px-3 py-1 text-sm font-semibold text-white">
            {minutes}:{seconds.toString().padStart(2, "0")}
          </span>
        </div>

        <div className="mt-4 rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-100">
          <p className="text-xs font-semibold uppercase tracking-wide text-[#1E40AF]">
            {selectedCategory} · {currentIndex + 1} of {questions.length}
          </p>
          <h1 className="font-display mt-2 text-xl font-bold text-slate-900">{current.question}</h1>

          <div className="mt-5 flex flex-col gap-2.5">
            {current.choices.map((choice, index) => {
              const isSelected = answers[currentIndex] === index;
              return (
                <button
                  key={index}
                  onClick={() => handleSelect(index)}
                  aria-pressed={isSelected}
                  className={`rounded-xl border-2 px-4 py-3 text-left font-medium text-slate-800 transition ${
                    isSelected ? "border-[#1E40AF] bg-blue-50" : "border-slate-200 hover:border-slate-300"
                  }`}
                >
                  {choice}
                </button>
              );
            })}
          </div>

          <button
            onClick={handleNext}
            className="mt-5 w-full rounded-xl bg-slate-900 px-6 py-3.5 font-semibold text-white transition hover:bg-slate-800"
          >
            {currentIndex < questions.length - 1 ? "Next Question" : "Finish Exam"}
          </button>
        </div>
      </div>
    </div>
  );
}