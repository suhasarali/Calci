"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { NavbarHome } from "@/components/NavbarHome";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2, CheckCircle2, XCircle, ArrowRight, RotateCcw } from "lucide-react";
import confetti from "canvas-confetti"; // You might need: npm install canvas-confetti 

export default function TakeQuizPage() {
  const { id } = useParams();
  const router = useRouter();
  const [quiz, setQuiz] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  
  // Game State
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);

  useEffect(() => {
    const fetchQuiz = async () => {
      if (!id) return;
      const docRef = doc(db, "quizzes", id as string);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setQuiz(docSnap.data());
      }
      setLoading(false);
    };
    fetchQuiz();
  }, [id]);

  const handleOptionSelect = (option: string) => {
    if (isAnswered) return;
    setSelectedOption(option);
    setIsAnswered(true);

    if (option === quiz.questions[currentQIndex].correctAnswer) {
      setScore(prev => prev + 1);
      confetti({ particleCount: 50, spread: 60, origin: { y: 0.7 } });
    }
  };

  const handleNext = () => {
    if (currentQIndex + 1 < quiz.questions.length) {
      setCurrentQIndex(prev => prev + 1);
      setSelectedOption(null);
      setIsAnswered(false);
    } else {
      setShowResult(true);
      if (score > quiz.questions.length / 2) {
        confetti({ particleCount: 150, spread: 100, origin: { y: 0.6 } });
      }
    }
  };

  if (loading) return <div className="h-screen flex items-center justify-center bg-[#fdfbf7]"><Loader2 className="w-10 h-10 animate-spin text-blue-600" /></div>;
  if (!quiz) return <div className="h-screen flex items-center justify-center text-red-500">Quiz not found.</div>;

  const currentQuestion = quiz.questions[currentQIndex];
  const progress = ((currentQIndex + 1) / quiz.questions.length) * 100;

  return (
    <div className="min-h-screen bg-[#fdfbf7]">
      <NavbarHome />
      <div className="max-w-3xl mx-auto px-4 pt-24 pb-12">
        
        {/* Result Screen */}
        {showResult ? (
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white p-8 rounded-3xl shadow-xl text-center border border-gray-100"
          >
            <h2 className="text-3xl font-bold text-gray-800 mb-2">Quiz Completed!</h2>
            <p className="text-gray-500 mb-8">Here is how you performed</p>
            
            <div className="w-40 h-40 mx-auto bg-blue-50 rounded-full flex items-center justify-center mb-8 border-4 border-blue-100">
              <div className="text-center">
                <span className="block text-4xl font-extrabold text-blue-600">{score}/{quiz.questions.length}</span>
                <span className="text-sm text-blue-400 font-semibold">SCORE</span>
              </div>
            </div>

            <div className="flex gap-4 justify-center">
              <button 
                onClick={() => router.push('/quiz')}
                className="px-6 py-3 rounded-xl border border-gray-300 text-gray-700 font-semibold hover:bg-gray-50 transition-colors"
              >
                Back to List
              </button>
              <button 
                onClick={() => window.location.reload()}
                className="px-6 py-3 rounded-xl bg-blue-600 text-white font-semibold hover:bg-blue-700 transition-colors flex items-center gap-2"
              >
                <RotateCcw className="w-4 h-4" /> Retry
              </button>
            </div>
          </motion.div>
        ) : (
          /* Quiz Game Screen */
          <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
            {/* Header / Progress */}
            <div className="bg-slate-50 px-8 py-6 border-b border-slate-100">
              <div className="flex justify-between items-center mb-4">
                <h2 className="font-bold text-slate-700">{quiz.title}</h2>
                <span className="text-sm font-semibold text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
                  Q {currentQIndex + 1} / {quiz.questions.length}
                </span>
              </div>
              <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  className="bg-blue-600 h-full"
                />
              </div>
            </div>

            {/* Question Body */}
            <div className="p-8">
              <h3 className="text-2xl font-semibold text-gray-800 mb-8 leading-relaxed">
                {currentQuestion.question}
              </h3>

              <div className="space-y-3">
                {currentQuestion.options.map((option: string, idx: number) => {
                  const isSelected = selectedOption === option;
                  const isCorrect = option === currentQuestion.correctAnswer;
                  
                  let cardClass = "border-2 border-gray-100 hover:border-blue-200 hover:bg-blue-50"; // Default
                  
                  if (isAnswered) {
                    if (isCorrect) cardClass = "border-2 border-green-500 bg-green-50"; // Correct
                    else if (isSelected && !isCorrect) cardClass = "border-2 border-red-300 bg-red-50"; // Wrong selected
                    else cardClass = "border-gray-100 opacity-50"; // Others
                  } else if (isSelected) {
                    cardClass = "border-2 border-blue-500 bg-blue-50";
                  }

                  return (
                    <button
                      key={idx}
                      onClick={() => handleOptionSelect(option)}
                      disabled={isAnswered}
                      className={`w-full text-left p-4 rounded-xl text-lg font-medium transition-all duration-200 flex items-center justify-between ${cardClass}`}
                    >
                      <span>{option}</span>
                      {isAnswered && isCorrect && <CheckCircle2 className="text-green-600 w-6 h-6" />}
                      {isAnswered && isSelected && !isCorrect && <XCircle className="text-red-500 w-6 h-6" />}
                    </button>
                  );
                })}
              </div>

              {/* Footer Actions */}
              <AnimatePresence>
                {isAnswered && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-8 pt-6 border-t border-gray-100"
                  >
                    <div className="bg-blue-50 p-4 rounded-xl mb-6">
                      <p className="text-sm text-blue-800 font-semibold mb-1">Explanation:</p>
                      <p className="text-blue-700">{currentQuestion.explanation}</p>
                    </div>
                    <div className="flex justify-end">
                      <button 
                        onClick={handleNext}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-xl font-bold text-lg flex items-center gap-2 shadow-lg shadow-blue-200"
                      >
                        {currentQIndex + 1 === quiz.questions.length ? "Finish Quiz" : "Next Question"} <ArrowRight className="w-5 h-5" />
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}