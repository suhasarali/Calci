"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { NavbarHome } from "@/components/NavbarHome";
import { collection, getDocs, query, where, orderBy } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { motion } from "framer-motion";
import { 
  Loader2, PlayCircle, 
  // Import a variety of financial icons
  Wallet, TrendingUp, PieChart, Coins, Target, 
  Calculator, Landmark, PiggyBank, CreditCard, 
  BarChart3, Briefcase, Gem, LineChart, Banknote
} from "lucide-react";

// 1. Create a pool of relevant icons
const FINANCE_ICONS = [
  Wallet, TrendingUp, PieChart, Coins, Target, 
  Calculator, Landmark, PiggyBank, CreditCard, 
  BarChart3, Briefcase, Gem, LineChart, Banknote
];

// 2. Helper to pick an icon based on the topic string
const getIconForTopic = (topic: string) => {
  let hash = 0;
  // Generate a number from the string
  for (let i = 0; i < topic.length; i++) {
    hash = topic.charCodeAt(i) + ((hash << 5) - hash);
  }
  // Use modulo to pick an icon from the array
  const index = Math.abs(hash) % FINANCE_ICONS.length;
  return FINANCE_ICONS[index];
};

export default function QuizListingPage() {
  const [quizzes, setQuizzes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchQuizzes = async () => {
      try {
        const q = query(collection(db, "quizzes"), where("isActive", "==", true), orderBy("createdAt", "desc"));
        const querySnapshot = await getDocs(q);
        const data = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setQuizzes(data);
      } catch (error) {
        console.error("Error fetching quizzes:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchQuizzes();
  }, []);

  return (
    <div className="min-h-screen bg-[#fdfbf7]">
      <NavbarHome />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-12">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Financial Knowledge Quizzes</h1>
          <p className="text-lg text-gray-600">Test your financial IQ with AI-generated challenges.</p>
        </motion.div>

        {loading ? (
          <div className="flex justify-center py-20"><Loader2 className="w-10 h-10 text-blue-600 animate-spin" /></div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {quizzes.length > 0 ? (
              quizzes.map((quiz, index) => {
                // 3. Get the dynamic icon for this specific quiz
                const DynamicIcon = getIconForTopic(quiz.title || "default");
                
                return (
                  <motion.div
                    key={quiz.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300 group"
                  >
                    <div className="p-6">
                      {/* Icon Container */}
                      <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                        {/* Render the dynamic icon */}
                        <DynamicIcon className="w-6 h-6 text-blue-600" />
                      </div>

                      <h3 className="text-xl font-bold text-gray-900 mb-2">{quiz.title}</h3>
                      <p className="text-gray-500 text-sm mb-4 line-clamp-2">{quiz.description}</p>
                      
                      <div className="flex items-center justify-between mt-6">
                        <span className="text-xs font-semibold bg-gray-100 text-gray-600 px-3 py-1 rounded-full">
                          {quiz.questions?.length || 5} Questions
                        </span>
                        
                        {/* Fixed Link nesting issue here too */}
                        <Link 
                          href={`/quiz/${quiz.id}`}
                          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors text-sm"
                        >
                          Start Quiz <PlayCircle className="w-4 h-4" />
                        </Link>
                      </div>
                    </div>
                  </motion.div>
                );
              })
            ) : (
              <div className="col-span-full text-center py-20 text-gray-500">
                No quizzes available yet. Check back later!
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}