import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign Flashcards | LTO Exam Practice",
  description: "Flip through Philippine road sign flashcards to learn their names and meanings.",
};

export default function FlashcardsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
