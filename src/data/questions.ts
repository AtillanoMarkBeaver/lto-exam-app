export type Question = {
  id: number;
  category: string;
  question: string;
  choices: string[];
  correctIndex: number;
  explanation: string;
};

export const questions: Question[] = [
  {
    id: 1,
    category: "Road Signs",
    question: "A triangular sign with a red border usually means:",
    choices: ["Warning", "Regulatory / Prohibition", "Information", "Guide"],
    correctIndex: 0,
    explanation:
      "Triangular signs with a red border are warning signs, alerting drivers to hazards ahead.",
  },
  {
    id: 2,
    category: "Traffic Rules",
    question: "What is the general speed limit on Philippine expressways for cars, unless otherwise posted?",
    choices: ["60 km/h", "80 km/h", "100 km/h", "120 km/h"],
    correctIndex: 2,
    explanation:
      "The maximum speed limit on expressways is generally 100 km/h for cars, unless a lower limit is posted.",
  },
  {
    id: 3,
    category: "Right of Way",
    question: "At an uncontrolled intersection with no signs or signals, who has the right of way?",
    choices: [
      "The faster vehicle",
      "The vehicle on the right",
      "The vehicle on the left",
      "Whoever honks first",
    ],
    correctIndex: 1,
    explanation:
      "At uncontrolled intersections, the vehicle approaching from the right generally has the right of way.",
  },
];