// Your page file, e.g., QuantityLanding.tsx

'use client';

import { GlowCard } from "@/components/ui/spotlight-card";
import { Users, Calculator, Award, TrendingUp } from 'lucide-react';
import React from 'react';

const statsData = [
  { icon: Users, value: "100,000+", label: "Active Users" },
  { icon: Calculator, value: "1M+", label: "Calculations Done" },
  { icon: Award, value: "50,000+", label: "Quizzes Completed" },
  { icon: TrendingUp, value: "₹500Cr+", label: "Investments Planned" },
];

export function QuantityLanding() {
  return (
    // The root div's background should have an image or gradient for the glass effect to be visible
    <div className="w-full  flex flex-col md:flex-row items-center justify-center gap-5 p-8">
      {statsData.map((stat, index) => (
        <GlowCard
          key={index}
          glowColor="orange"
          cardBgColor="#1e40af"       // This is Tailwind's blue-800
          // --- THE ONLY CHANGE YOU NEED IS HERE ---
          bgOpacity={0.95}            // Add this to set transparency
          // --- -------------------------------- ---

          className="p-6 backdrop-blur-xl" // This class is essential for the blur
          customSize={true}
          width={280}
          height={280}
        >
          <div className="flex flex-col items-center justify-center h-full text-center gap-4">
            <stat.icon className="size-12 text-white/80 mb-2" strokeWidth={1.5} />
            <h2 className="text-4xl lg:text-5xl font-bold text-white tracking-tight">
              {stat.value}
            </h2>
            <p className="text-lg text-white/80">
              {stat.label}
            </p>
          </div>
        </GlowCard>
      ))}
    </div>
  );
};