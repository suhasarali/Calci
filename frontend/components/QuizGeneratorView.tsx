"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Sparkles, Save, Trash2, CheckCircle, AlertCircle, Loader2, Plus } from "lucide-react";
import { collection, addDoc } from "firebase/firestore";
import { db } from "../lib/firebase"; // Ensure this points to your Firebase config

interface Question {
  question: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
}

export default function QuizGeneratorView() {
  const [topic, setTopic] = useState("");
  const [customPrompt, setCustomPrompt] = useState("");
  const [generatedQuiz, setGeneratedQuiz] = useState<Question[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const handleGenerate = async () => {
    if (!topic) return;
    setLoading(true);
    setStatus(null);
    setGeneratedQuiz([]);

    try {
      const res = await fetch("/api/admin/generate-quiz", {
        method: "POST",
        body: JSON.stringify({ topic, prompt: customPrompt }),
      });

      if (!res.ok) throw new Error("Generation failed");
      const data = await res.json();
      setGeneratedQuiz(data.quiz);
    } catch (error) {
      setStatus({ type: "error", message: "AI Generation failed. Please try again." });
    } finally {
      setLoading(false);
    }
  };

  const handleSaveToDB = async () => {
    if (generatedQuiz.length === 0) return;
    
    console.log("Attempting to save..."); // Debug Log 1
    setSaving(true);
    
    try {
      // Firestore throws errors if fields are 'undefined'. We use || "" to ensure they are empty strings instead.
      const payload = {
        title: topic || "Untitled Quiz",
        description: customPrompt || `Test your knowledge on ${topic}`,
        questions: generatedQuiz,
        createdAt: new Date(),
        isActive: true,
        plays: 0
      };

      console.log("Payload being sent:", payload); // Debug Log 2

      await addDoc(collection(db, "quizzes"), payload);
      
      console.log("Save successful!"); // Debug Log 3
      setStatus({ type: "success", message: "Quiz published successfully!" });
      
      // Clear form
      setTopic("");
      setCustomPrompt("");
      setGeneratedQuiz([]);
    } catch (error) {
      // THIS IS THE MISSING PIECE
      console.error("FULL FIREBASE ERROR:", error); 
      
      // Check for specific permission error
      if (JSON.stringify(error).includes("insufficient-permissions")) {
         setStatus({ type: "error", message: "Permission Denied: Check Firestore Rules." });
      } else {
         setStatus({ type: "error", message: "Database Error: Check Console for details." });
      }
    } finally {
      setSaving(false);
    }
  };

  const removeQuestion = (index: number) => {
    const newQuiz = [...generatedQuiz];
    newQuiz.splice(index, 1);
    setGeneratedQuiz(newQuiz);
  };

  return (
    <motion.div
      className="bg-white dark:bg-slate-800/50 rounded-xl shadow-lg border border-slate-200/50 dark:border-slate-700/50 p-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Sparkles className="w-6 h-6 text-indigo-500" />
          AI Quiz Generator
        </h2>
        <p className="text-sm text-slate-500">Create engaging financial quizzes instantly with Gemini.</p>
      </div>

      <div className="grid md:grid-cols-2 gap-8 mb-8">
        <div className="space-y-4">
          <div>
            <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Topic</label>
            <input
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="e.g. Mutual Funds vs FD"
              className="w-full mt-1 px-4 py-2 border rounded-lg bg-white dark:bg-slate-900 dark:border-slate-700 focus:ring-2 focus:ring-indigo-500 outline-none"
            />
          </div>
          <div>
            <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Custom Instructions</label>
            <textarea
              value={customPrompt}
              onChange={(e) => setCustomPrompt(e.target.value)}
              placeholder="e.g. Focus on tax implications for Indian investors..."
              rows={3}
              className="w-full mt-1 px-4 py-2 border rounded-lg bg-white dark:bg-slate-900 dark:border-slate-700 focus:ring-2 focus:ring-indigo-500 outline-none"
            />
          </div>
          
          <button
            onClick={handleGenerate}
            disabled={loading || !topic}
            className="w-full flex justify-center items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white py-2.5 rounded-lg font-semibold disabled:opacity-50 transition-all"
          >
            {loading ? <Loader2 className="animate-spin" /> : <Sparkles className="w-4 h-4" />}
            {loading ? "Generating..." : "Generate Quiz"}
          </button>

          {status && (
            <div className={`p-3 rounded-lg flex items-center gap-2 text-sm font-medium ${
              status.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
            }`}>
               {status.type === 'success' ? <CheckCircle className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
               {status.message}
            </div>
          )}
        </div>

        {/* Generated Preview */}
        <div className="bg-slate-50 dark:bg-slate-900/50 rounded-lg p-4 border border-slate-200 dark:border-slate-700 h-[400px] overflow-y-auto">
          {generatedQuiz.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-slate-400">
              <Sparkles className="w-10 h-10 mb-2 opacity-20" />
              <p>Generated questions will appear here.</p>
            </div>
          ) : (
            <div className="space-y-4">
               <div className="flex justify-between items-center sticky top-0 bg-slate-50 dark:bg-slate-900 z-10 pb-2 border-b">
                 <h3 className="font-bold text-slate-700 dark:text-slate-200">Preview ({generatedQuiz.length})</h3>
                 <button 
                   onClick={handleSaveToDB}
                   disabled={saving}
                   className="text-xs bg-green-600 text-white px-3 py-1 rounded-full flex items-center gap-1 hover:bg-green-700"
                 >
                   {saving ? <Loader2 className="w-3 h-3 animate-spin" /> : <Save className="w-3 h-3" />}
                   Publish
                 </button>
               </div>
               {generatedQuiz.map((q, i) => (
                 <div key={i} className="p-3 bg-white dark:bg-slate-800 rounded border border-slate-200 dark:border-slate-700 relative group">
                   <button 
                     onClick={() => removeQuestion(i)}
                     className="absolute top-2 right-2 text-slate-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                   >
                     <Trash2 className="w-4 h-4" />
                   </button>
                   <p className="font-medium text-sm text-slate-800 dark:text-slate-200 pr-6">{i + 1}. {q.question}</p>
                   <div className="mt-2 grid grid-cols-2 gap-2">
                     {q.options.map((opt, idx) => (
                       <span key={idx} className={`text-xs p-1.5 rounded border ${
                         opt === q.correctAnswer 
                          ? "bg-green-50 border-green-200 text-green-700" 
                          : "border-slate-100 text-slate-500"
                       }`}>
                         {opt}
                       </span>
                     ))}
                   </div>
                 </div>
               ))}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}