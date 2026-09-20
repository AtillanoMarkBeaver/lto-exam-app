import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Exam History | LTO Exam Practice",
  description: "Review your past LTO mock exam attempts, scores, and pass/fail results.",
};

export default function HistoryLayout({ children }: { children: React.ReactNode }) {
  return children;
}
