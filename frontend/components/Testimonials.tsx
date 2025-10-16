"use client";

import React, { useState } from 'react';
import { motion } from "framer-motion";

// --- Data for the testimonials ---
const testimonials = [
    {
        text: "PaisaMastery helped me understand mutual funds better. The SIP calculator showed me how small investments can grow over time. Now I invest confidently!",
        image: "https://ui-avatars.com/api/?name=RK&background=eef2ff&color=4f46e5",
        name: "Rajesh Kumar",
        role: "Software Engineer, Mumbai",
    },
    {
        text: "The financial health checkup was eye-opening. I realized where I was overspending and how to save better. The quizzes made learning fun!",
        image: "https://ui-avatars.com/api/?name=PS&background=eef2ff&color=4f46e5",
        name: "Priya Sharma",
        role: "Teacher, Delhi",
    },
    {
        text: "As a business owner, the tax calculator and retirement planner are invaluable. I can plan my finances more effectively now.",
        image: "https://ui-avatars.com/api/?name=AP&background=eef2ff&color=4f46e5",
        name: "Amit Patel",
        role: "Business Owner, Ahmedabad",
    },
    {
        text: "The portfolio checkup feature helped me rebalance my investments. I love how everything is tailored for Indian investors!",
        image: "https://ui-avatars.com/api/?name=SR&background=eef2ff&color=4f46e5",
        name: "Sneha Reddy",
        role: "Marketing Manager, Bangalore",
    },
    {
        text: "Clear, simple, and extremely useful. The EMI calculator helped me make a smart decision on my home loan. Highly recommend!",
        image: "https://ui-avatars.com/api/?name=VS&background=eef2ff&color=4f46e5",
        name: "Vikram Singh",
        role: "Doctor, Pune",
    },
    {
        text: "The quizzes reinforced my CA studies and helped me learn practical applications. Great resource for anyone learning finance!",
        image: "https://ui-avatars.com/api/?name=AI&background=eef2ff&color=4f46e5",
        name: "Ananya Iyer",
        role: "CA Student, Chennai",
    },
];

// --- Sub-component for individual testimonial cards ---
const TestimonialCard = ({ testimonial }) => (
  <div className="bg-white border border-slate-200 rounded-xl shadow-lg p-8 mx-auto w-full max-w-md mb-8">
    <p className="text-slate-700 text-lg leading-relaxed">"{testimonial.text}"</p>
    <div className="flex items-center mt-6">
      <img className="w-14 h-14 rounded-full mr-4" src={testimonial.image} alt={testimonial.name} />
      <div>
        <p className="font-semibold text-slate-900 text-lg">{testimonial.name}</p>
        <p className="text-md text-slate-500">{testimonial.role}</p>
      </div>
    </div>
  </div>
);

// --- Main Testimonials section component ---
export const Testimonials = () => {
    const [isPaused, setIsPaused] = useState(false);
    const scrollingTestimonials = [...testimonials, ...testimonials];

    return (
        <section id="testimonials" className="py-20 relative  font-sans">
            <style jsx global>{`
                @keyframes scroll {
                    from { transform: translateY(0); }
                    to { transform: translateY(-50%); }
                }
                .animate-scroll {
                    animation: scroll linear infinite;
                }
            `}</style>
            <div className="container z-10 mx-auto px-4">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
                    viewport={{ once: true }}
                    className="flex flex-col items-center justify-center max-w-2xl mx-auto text-center"
                >
                    <div className="border border-blue-200 bg-blue-50 text-blue-700 font-medium py-1 px-3 rounded-lg mb-4">
                        Testimonials
                    </div>
                    <h2 className="text-3xl sm:text-5xl text-gray-800 font-bold mt-2">
                        Trusted By <span className="text-blue-600">Thousands</span>
                    </h2>
                    <p className="mt-5 text-lg text-slate-600">
                        See what our customers have to say about us.
                    </p>
                </motion.div>

                <div 
                    className="relative flex justify-center mt-12 h-[600px] overflow-hidden"
                    style={{ maskImage: 'linear-gradient(to bottom, transparent, black 25%, black 75%, transparent)' }}
                >
                    <div 
                        className="absolute animate-scroll" 
                        // Event handlers for both mouse and touch interaction
                        onMouseEnter={() => setIsPaused(true)}
                        onMouseLeave={() => setIsPaused(false)}
                        onTouchStart={() => setIsPaused(true)}
                        onTouchEnd={() => setIsPaused(false)}
                        style={{ 
                            animationDuration: '60s',
                            // This style now correctly pauses the animation for both hover and touch
                            animationPlayState: isPaused ? 'paused' : 'running'
                        }}
                    >
                        {scrollingTestimonials.map((testimonial, index) => (
                            <TestimonialCard key={index} testimonial={testimonial} />
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

