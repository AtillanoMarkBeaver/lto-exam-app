import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Mock Exam | LTO Exam Practice",
  description: "Take a timed LTO mock exam and see if you'd pass the real written test.",
};

export default function ExamLayout({ children }: { children: React.ReactNode }) {
  return children;
}
