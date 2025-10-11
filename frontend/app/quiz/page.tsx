"use client";
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import OnboardingQuiz from '@/components/OnboardingQuiz';

export default function QuizPage() {
 
  return (
    <main className="min-h-screen flex items-center justify-center p-6 bg-background">
      <OnboardingQuiz />
    </main>
  );
}
