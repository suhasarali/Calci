"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

type Question = {
  id: string;
  question: string;
  options: string[];
  answerIndex: number;
};

const QUESTIONS: Question[] = [
  { id: "q1", question: "How often do you save from your income?", options: ["Never", "Sometimes", "Monthly", "Always"], answerIndex: 2 },
  { id: "q2", question: "Do you have an emergency fund?", options: ["No", "Partial", "Yes, 1-3 months", "Yes, 3+ months"], answerIndex: 2 },
  { id: "q3", question: "Do you invest regularly (e.g., SIP)?", options: ["No", "Occasionally", "Yes, sometimes", "Yes, regularly"], answerIndex: 3 },
  { id: "q4", question: "How confident are you in your financial plan?", options: ["Not at all", "Somewhat", "Confident", "Very confident"], answerIndex: 2 },
  { id: "q5", question: "Do you track your monthly expenses?", options: ["No", "Roughly", "Yes, in spreadsheet", "Yes, with app"], answerIndex: 2 },
];

export default function OnboardingQuiz() {
  const router = useRouter();
  const [answers, setAnswers] = useState<Record<string, number>>(() => {
    try {
      const raw = localStorage.getItem("onboarding_quiz_answers");
      return raw ? JSON.parse(raw) : {};
    } catch {
      return {};
    }
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [index, setIndex] = useState(0);
  const [showResults, setShowResults] = useState(false);

  const select = (qId: string, idx: number) => {
    const next = { ...answers, [qId]: idx };
    setAnswers(next);
    try {
      localStorage.setItem("onboarding_quiz_answers", JSON.stringify(next));
    } catch {}
  };

  const computeScore = () => {
    let score = 0;
    for (const q of QUESTIONS) {
      const a = answers[q.id];
      if (typeof a === "number" && a >= q.answerIndex) score += 1;
    }
    return score;
  };

  const handleSubmit = async () => {
    setError(null);
    setSubmitting(true);
    try {
      const score = computeScore();
      localStorage.setItem(
        "onboarding_quiz_result",
        JSON.stringify({ score, answers, taken_at: new Date().toISOString() })
      );
      setShowResults(true);
    } catch (err: any) {
      setError(err?.message || "Failed to save result");
    } finally {
      setSubmitting(false);
    }
  };

  const current = QUESTIONS[index];
  const currentAnswer = answers[current.id];
  const progress = ((index + 1) / QUESTIONS.length) * 100;

  const goNext = () => {
    if (index < QUESTIONS.length - 1) setIndex(index + 1);
    else handleSubmit();
  };

  const goPrev = () => {
    if (index > 0) setIndex(index - 1);
  };

  if (showResults) {
    const score = computeScore();
    return (
      <div className="max-w-3xl mx-auto p-6 bg-card/60 rounded-xl shadow border-2">
        <h2 className="text-2xl font-semibold mb-4">Your Quiz Results</h2>
        <p className="text-muted-foreground mb-4">
          You scored <strong>{score}</strong> out of {QUESTIONS.length}.
        </p>

        <div className="space-y-6">
          {QUESTIONS.map((q, i) => {
            const userAnswer = answers[q.id];
            const correctAnswer = q.answerIndex;
            const isCorrect = userAnswer === correctAnswer;
            return (
              <div key={q.id} className="p-4 border rounded-md">
                <p className="font-medium mb-2">{i + 1}. {q.question}</p>
                <p className="text-sm">
                  <strong>Your answer:</strong>{" "}
                  <span className={isCorrect ? "text-green-600" : "text-red-600"}>
                    {typeof userAnswer === "number" ? q.options[userAnswer] : "Not answered"}
                  </span>
                </p>
                <p className="text-sm">
                  <strong>Correct answer:</strong>{" "}
                  <span className="text-primary">{q.options[correctAnswer]}</span>
                </p>
              </div>
            );
          })}
        </div>

        <div className="mt-6 text-center">
          <button
            onClick={() => router.push("/")}
            className="px-6 py-2 bg-primary text-white rounded-md"
          >
            Go to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-6 bg-card/60 rounded-xl shadow border-2">
      <h2 className="text-2xl font-semibold mb-2">Quick Onboarding Quiz</h2>
      <p className="text-sm text-muted-foreground mb-4">
        Answer the short questions to your answers are saved locally for now.
      </p>

      {/* Progress Bar */}
      <div className="w-full bg-gray-200 h-2 rounded-full mb-4">
        <div
          className="bg-primary h-2 rounded-full transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Question Box */}
      <div className="p-4 border rounded-md">
        <div className="flex items-center justify-between mb-3">
          <div className="text-sm text-muted-foreground">
            Question {index + 1} of {QUESTIONS.length}
          </div>
          <div className="text-sm text-muted-foreground">
            Progress: {(index + 1)}/{QUESTIONS.length}
          </div>
        </div>

        <p className="font-medium mb-3">
          {index + 1}. {current.question}
        </p>

        <div className="space-y-2">
          {current.options.map((opt, idx) => (
            <label
              key={idx}
              className={`flex items-center gap-3 cursor-pointer p-2 rounded-md border transition ${
                currentAnswer === idx
                  ? "bg-primary/10 border-primary"
                  : "border-transparent hover:bg-muted/40"
              }`}
            >
              <input
                type="radio"
                name={current.id}
                checked={currentAnswer === idx}
                onChange={() => select(current.id, idx)}
              />
              <span>{opt}</span>
            </label>
          ))}
        </div>
      </div>

      {error && <p className="text-sm text-destructive mt-4">{error}</p>}

      {/* Navigation Buttons */}
      <div className="mt-6 flex items-center justify-between">
        <button
          onClick={goPrev}
          disabled={index === 0}
          className="px-4 py-2 bg-muted rounded-md disabled:opacity-50 mr-2"
        >
          Previous
        </button>
        <button
          onClick={goNext}
          disabled={typeof currentAnswer !== "number"}
          className="px-4 py-2 bg-primary text-white rounded-md disabled:opacity-50"
        >
          {index < QUESTIONS.length - 1 ? "Next" : submitting ? "Saving..." : "Submit"}
        </button>
      </div>
    </div>
  );
}
