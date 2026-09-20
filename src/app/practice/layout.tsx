import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Practice Mode | LTO Exam Practice",
  description: "Answer LTO written exam questions one at a time with instant feedback and explanations.",
};

export default function PracticeLayout({ children }: { children: React.ReactNode }) {
  return children;
}
