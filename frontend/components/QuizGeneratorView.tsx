"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { 
  Sparkles, Save, Trash2, CheckCircle, AlertCircle, 
  Loader2, RefreshCw, Edit3, Plus, FileText, X 
} from "lucide-react";
import { collection, addDoc, deleteDoc, doc, onSnapshot, query, orderBy } from "firebase/firestore";
import { db } from "@/lib/firebase"; 

// Types
interface Question {
  question: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
}

interface QuizFromDB {
  id: string;
  title: string;
  description: string;
  questions: Question[];
  createdAt: any;
}

export default function QuizGeneratorView() {
  // --- STATE MANAGEMENT ---
  const [mode, setMode] = useState<'ai' | 'manual'>('ai');
  const [status, setStatus] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(false);

  // AI State
  const [topic, setTopic] = useState("");
  const [customPrompt, setCustomPrompt] = useState("");
  const [generatedQuiz, setGeneratedQuiz] = useState<Question[]>([]);

  // Manual State
  const [manualTitle, setManualTitle] = useState("");
  const [manualDesc, setManualDesc] = useState("");
  const [manualQuestions, setManualQuestions] = useState<Question[]>([
    { question: "", options: ["", "", "", ""], correctAnswer: "", explanation: "" }
  ]);

  // Management State
  const [existingQuizzes, setExistingQuizzes] = useState<QuizFromDB[]>([]);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // --- 1. FETCH QUIZZES ---
  useEffect(() => {
    const q = query(collection(db, "quizzes"), orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const quizzesData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as QuizFromDB[];
      setExistingQuizzes(quizzesData);
    });
    return () => unsubscribe();
  }, []);

  // --- 2. AI GENERATION LOGIC ---
  const handleGenerateAI = async () => {
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
      setStatus({ type: "error", message: "AI Generation failed." });
    } finally {
      setLoading(false);
    }
  };

  // --- 3. MANUAL FORM LOGIC ---
  const addManualQuestion = () => {
    setManualQuestions([
      ...manualQuestions, 
      { question: "", options: ["", "", "", ""], correctAnswer: "", explanation: "" }
    ]);
  };

  const removeManualQuestion = (index: number) => {
    if(manualQuestions.length === 1) return; // Keep at least one
    const updated = [...manualQuestions];
    updated.splice(index, 1);
    setManualQuestions(updated);
  };

  const updateManualQuestion = (index: number, field: keyof Question, value: any) => {
    const updated = [...manualQuestions];
    updated[index] = { ...updated[index], [field]: value };
    setManualQuestions(updated);
  };

  const updateOption = (qIndex: number, optIndex: number, value: string) => {
    const updated = [...manualQuestions];
    updated[qIndex].options[optIndex] = value;
    // If this option was the correct answer, update that too so it stays synced
    if (updated[qIndex].correctAnswer === manualQuestions[qIndex].options[optIndex]) {
        updated[qIndex].correctAnswer = value;
    }
    setManualQuestions(updated);
  };

  // --- 4. SHARED SAVE LOGIC ---
  const handleSaveToDB = async () => {
    setStatus(null);
    let quizData;

    // Prepare data based on mode
    if (mode === 'ai') {
        if (generatedQuiz.length === 0) return;
        quizData = {
            title: topic || "Untitled Quiz",
            description: customPrompt || `Test your knowledge on ${topic}`,
            questions: generatedQuiz
        };
    } else {
        // Validation for Manual Mode
        if (!manualTitle) {
            setStatus({ type: "error", message: "Please enter a Quiz Title." });
            return;
        }
        // Basic validation: Check if questions have text
        const isValid = manualQuestions.every(q => q.question && q.correctAnswer && q.options.every(o => o));
        if(!isValid) {
            setStatus({ type: "error", message: "Please fill in all questions, options, and select correct answers." });
            return;
        }

        quizData = {
            title: manualTitle,
            description: manualDesc || "A custom quiz.",
            questions: manualQuestions
        };
    }

    setSaving(true);
    try {
      await addDoc(collection(db, "quizzes"), {
        ...quizData,
        createdAt: new Date(),
        isActive: true,
        plays: 0
      });
      
      setStatus({ type: "success", message: "Quiz published successfully!" });
      
      // Reset Forms
      if(mode === 'ai') {
          setTopic(""); setCustomPrompt(""); setGeneratedQuiz([]);
      } else {
          setManualTitle(""); setManualDesc(""); 
          setManualQuestions([{ question: "", options: ["", "", "", ""], correctAnswer: "", explanation: "" }]);
      }
    } catch (error) {
      console.error(error);
      setStatus({ type: "error", message: "Database Error: Could not save quiz." });
    } finally {
      setSaving(false);
    }
  };

  // --- 5. DELETE LOGIC ---
  const handleDeleteQuiz = async (id: string) => {
    if(!window.confirm("Are you sure?")) return;
    setDeletingId(id);
    try {
      await deleteDoc(doc(db, "quizzes", id));
    } catch (error) {
      alert("Failed to delete.");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="space-y-8 pb-10">
      
      {/* --- MODE SWITCHER --- */}
      <div className="flex justify-center">
        <div className="bg-white dark:bg-slate-800 p-1 rounded-lg border border-slate-200 dark:border-slate-700 inline-flex">
            <button 
                onClick={() => setMode('ai')}
                className={`flex items-center gap-2 px-6 py-2 rounded-md font-medium text-sm transition-all ${
                    mode === 'ai' 
                    ? 'bg-indigo-600 text-white shadow-md' 
                    : 'text-slate-600 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-700'
                }`}
            >
                <Sparkles className="w-4 h-4" /> AI Generator
            </button>
            <button 
                onClick={() => setMode('manual')}
                className={`flex items-center gap-2 px-6 py-2 rounded-md font-medium text-sm transition-all ${
                    mode === 'manual' 
                    ? 'bg-indigo-600 text-white shadow-md' 
                    : 'text-slate-600 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-700'
                }`}
            >
                <Edit3 className="w-4 h-4" /> Manual Create
            </button>
        </div>
      </div>

      {/* ---------------- CREATION CARD ---------------- */}
      <motion.div
        className="bg-white dark:bg-slate-800/50 rounded-xl shadow-lg border border-slate-200/50 dark:border-slate-700/50 p-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        key={mode} // Re-animate on mode switch
      >
        {/* HEADER */}
        <div className="mb-6 border-b border-slate-100 dark:border-slate-700 pb-4">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                {mode === 'ai' ? <Sparkles className="w-6 h-6 text-indigo-500" /> : <FileText className="w-6 h-6 text-indigo-500" />}
                {mode === 'ai' ? "Generate with AI" : "Create Manually"}
            </h2>
            <p className="text-sm text-slate-500">
                {mode === 'ai' ? "Enter a topic and let Gemini do the work." : "Fill in the details yourself for precise control."}
            </p>
        </div>

        {/* ================= AI MODE ================= */}
        {mode === 'ai' && (
            <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-4">
                    <div>
                        <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Topic</label>
                        <input
                            value={topic}
                            onChange={(e) => setTopic(e.target.value)}
                            placeholder="e.g. Mutual Funds"
                            className="w-full mt-1 px-4 py-2 border rounded-lg bg-white dark:bg-slate-900 dark:border-slate-700 focus:ring-2 focus:ring-indigo-500 outline-none"
                        />
                    </div>
                    <div>
                        <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Instructions</label>
                        <textarea
                            value={customPrompt}
                            onChange={(e) => setCustomPrompt(e.target.value)}
                            placeholder="e.g. Make it difficult..."
                            rows={3}
                            className="w-full mt-1 px-4 py-2 border rounded-lg bg-white dark:bg-slate-900 dark:border-slate-700 focus:ring-2 focus:ring-indigo-500 outline-none"
                        />
                    </div>
                    <button
                        onClick={handleGenerateAI}
                        disabled={loading || !topic}
                        className="w-full flex justify-center items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white py-2.5 rounded-lg font-semibold disabled:opacity-50 transition-all"
                    >
                        {loading ? <Loader2 className="animate-spin" /> : <Sparkles className="w-4 h-4" />}
                        {loading ? "Generating..." : "Generate Quiz"}
                    </button>
                    {status && (
                        <div className={`p-3 rounded-lg flex items-center gap-2 text-sm font-medium ${status.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                            {status.type === 'success' ? <CheckCircle className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
                            {status.message}
                        </div>
                    )}
                </div>

                {/* AI PREVIEW */}
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
                                <button onClick={handleSaveToDB} disabled={saving} className="text-xs bg-green-600 text-white px-3 py-1 rounded-full flex items-center gap-1 hover:bg-green-700 shadow-sm">
                                    {saving ? <Loader2 className="w-3 h-3 animate-spin" /> : <Save className="w-3 h-3" />} Publish
                                </button>
                            </div>
                            {generatedQuiz.map((q, i) => (
                                <div key={i} className="p-3 bg-white dark:bg-slate-800 rounded border border-slate-200 dark:border-slate-700 relative group">
                                    <p className="font-medium text-sm text-slate-800 dark:text-slate-200 pr-6">{i + 1}. {q.question}</p>
                                    <div className="mt-2 grid grid-cols-2 gap-2">
                                        {q.options.map((opt, idx) => (
                                            <span key={idx} className={`text-xs p-1.5 rounded border ${opt === q.correctAnswer ? "bg-green-50 border-green-200 text-green-700" : "border-slate-100 text-slate-500"}`}>{opt}</span>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        )}

        {/* ================= MANUAL MODE ================= */}
        {mode === 'manual' && (
            <div className="space-y-6">
                {/* 1. QUIZ DETAILS */}
                <div className="grid md:grid-cols-2 gap-4">
                    <div>
                        <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Quiz Title</label>
                        <input
                            value={manualTitle}
                            onChange={(e) => setManualTitle(e.target.value)}
                            placeholder="e.g. Advanced Tax Planning"
                            className="w-full mt-1 px-4 py-2 border rounded-lg bg-white dark:bg-slate-900 dark:border-slate-700 focus:ring-2 focus:ring-indigo-500 outline-none"
                        />
                    </div>
                    <div>
                        <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Description</label>
                        <input
                            value={manualDesc}
                            onChange={(e) => setManualDesc(e.target.value)}
                            placeholder="Short description for the card..."
                            className="w-full mt-1 px-4 py-2 border rounded-lg bg-white dark:bg-slate-900 dark:border-slate-700 focus:ring-2 focus:ring-indigo-500 outline-none"
                        />
                    </div>
                </div>

                {/* 2. QUESTIONS LIST */}
                <div className="space-y-6">
                    {manualQuestions.map((q, qIdx) => (
                        <div key={qIdx} className="bg-slate-50 dark:bg-slate-900/50 p-6 rounded-xl border border-slate-200 dark:border-slate-700 relative">
                            <div className="flex justify-between items-start mb-4">
                                <h3 className="font-bold text-slate-700 dark:text-slate-300">Question {qIdx + 1}</h3>
                                {manualQuestions.length > 1 && (
                                    <button onClick={() => removeManualQuestion(qIdx)} className="text-slate-400 hover:text-red-500 transition-colors">
                                        <Trash2 className="w-5 h-5" />
                                    </button>
                                )}
                            </div>
                            
                            {/* Question Text */}
                            <div className="mb-4">
                                <input
                                    value={q.question}
                                    onChange={(e) => updateManualQuestion(qIdx, 'question', e.target.value)}
                                    placeholder="Enter question text here..."
                                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                                />
                            </div>

                            {/* Options Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                {q.options.map((opt, optIdx) => (
                                    <div key={optIdx} className="flex gap-2 items-center">
                                        <span className="text-xs font-bold text-slate-400 w-6">Opt {optIdx + 1}</span>
                                        <input
                                            value={opt}
                                            onChange={(e) => updateOption(qIdx, optIdx, e.target.value)}
                                            placeholder={`Option ${optIdx + 1}`}
                                            className="w-full px-3 py-2 text-sm border rounded-lg focus:ring-1 focus:ring-indigo-500 outline-none"
                                        />
                                    </div>
                                ))}
                            </div>

                            {/* Correct Answer & Explanation */}
                            <div className="grid md:grid-cols-2 gap-4">
                                <div>
                                    <label className="text-xs font-bold text-green-600 uppercase block mb-1">Correct Answer</label>
                                    <select
                                        value={q.correctAnswer}
                                        onChange={(e) => updateManualQuestion(qIdx, 'correctAnswer', e.target.value)}
                                        className="w-full px-3 py-2 text-sm border border-green-200 bg-green-50 rounded-lg focus:ring-1 focus:ring-green-500 outline-none"
                                    >
                                        <option value="">Select Correct Option</option>
                                        {q.options.map((opt, i) => (
                                            opt && <option key={i} value={opt}>{opt}</option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-blue-600 uppercase block mb-1">Explanation</label>
                                    <input
                                        value={q.explanation}
                                        onChange={(e) => updateManualQuestion(qIdx, 'explanation', e.target.value)}
                                        placeholder="Why is this correct?"
                                        className="w-full px-3 py-2 text-sm border border-blue-200 bg-blue-50 rounded-lg focus:ring-1 focus:ring-blue-500 outline-none"
                                    />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* 3. ACTIONS */}
                <div className="flex items-center gap-4">
                    <button 
                        onClick={addManualQuestion}
                        className="flex items-center gap-2 px-4 py-2 border border-dashed border-slate-300 rounded-lg text-slate-600 hover:bg-slate-50 hover:border-slate-400 transition-all text-sm font-semibold"
                    >
                        <Plus className="w-4 h-4" /> Add Question
                    </button>
                    
                    <div className="flex-grow"></div>
                    
                    {status && (
                         <span className={`text-sm font-medium ${status.type === 'success' ? 'text-green-600' : 'text-red-600'}`}>
                            {status.message}
                        </span>
                    )}

                    <button 
                        onClick={handleSaveToDB}
                        disabled={saving}
                        className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg font-bold shadow-md disabled:opacity-50 transition-all"
                    >
                        {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                        Publish Manual Quiz
                    </button>
                </div>
            </div>
        )}

      </motion.div>

      {/* ---------------- SECTION 3: MANAGEMENT LIST ---------------- */}
      <motion.div
        className="bg-white dark:bg-slate-800/50 rounded-xl shadow-lg border border-slate-200/50 dark:border-slate-700/50 p-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
          <RefreshCw className="w-5 h-5 text-slate-500" /> Manage Live Quizzes
        </h2>

        {existingQuizzes.length === 0 ? (
           <p className="text-slate-500 text-sm">No active quizzes found in database.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-slate-500 uppercase bg-slate-50 dark:bg-slate-900">
                <tr>
                  <th className="px-4 py-3">Topic</th>
                  <th className="px-4 py-3 text-center">Questions</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {existingQuizzes.map((quiz) => (
                  <tr key={quiz.id} className="border-b border-slate-100 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800/50">
                    <td className="px-4 py-3 font-medium text-slate-900 dark:text-slate-200">
                      {quiz.title}
                    </td>
                    <td className="px-4 py-3 text-center text-slate-500">
                      {quiz.questions?.length || 0}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button
                        onClick={() => handleDeleteQuiz(quiz.id)}
                        disabled={deletingId === quiz.id}
                        className="text-red-500 hover:text-red-700 p-2 rounded hover:bg-red-50 transition-colors disabled:opacity-50"
                        title="Delete Quiz"
                      >
                        {deletingId === quiz.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </motion.div>
    </div>
  );
}