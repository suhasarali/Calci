"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Search } from "lucide-react"; // Search icon
import {
  Calculator,
  Landmark,
  PiggyBank,
  TrendingUp,
  Wallet,
  BarChart3,
  Car,
  GraduationCap,
  Coins,
  House,
  CreditCard,
} from "lucide-react";
import { NavbarDemo } from "@/components/Navbar";

const calculators = [
  {
    title: "Financial health Checkup",
    desc: "Calculate Equated Monthly Installments for any type of loan with flexible tenure and interest rate options. Understand your monthly outflow, total interest payable, and plan your finances efficiently.",
    link: "/calculator/financialchecklist",
    color: "bg-[#fefaf6]",
    icon: CreditCard,
  },
  {
    title: "One page financial Roadmap",
    desc: "Estimate potential returns from your Systematic Investment Plan investments with compounding benefits over your chosen time horizon. Compare different SIP amounts, durations, and expected returns.",
    link: "/calculator/onepagefinancialroadmap",
    color: "bg-[#f8f9ff]",
    icon: PiggyBank,
  },
  {
    title: "Fixed Deposit and Mutual Fund",
    desc: "Calculate Equated Monthly Installments for any type of loan with flexible tenure and interest rate options. Understand your monthly outflow, total interest payable, and plan your finances efficiently.",
    link: "/calculator/fd_md",
    color: "bg-[#fefaf6]",
    icon: Coins,
  },
  // {
  //   title: "One page financial Roadmap",
  //   desc: "Estimate potential returns from your Systematic Investment Plan investments with compounding benefits over your chosen time horizon. Compare different SIP amounts, durations, and expected returns.",
  //   link: "/calculator/onepagefinancialroadmap",
  //   color: "bg-[#f8f9ff]",
  //   icon: PiggyBank,
  // },
  
];

export default function DashboardPage() {
  const [searchQuery, setSearchQuery] = useState("");

  // Filter calculators by title based on search query
  const filteredCalculators = calculators.filter((calc) =>
    calc.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6 md:p-10">
      {/* Header / Navbar */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 20 }}
        viewport={{ once: false, amount: 0.3 }}
        transition={{ duration: 0.6 }}
        className="text-center mb-6"
      >
        <NavbarDemo />
      </motion.div>

      {/* Search Bar */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-8 flex justify-center"
      >
        <div className="flex items-center mt-10 bg-white border rounded-lg shadow-sm px-4 py-2 w-full max-w-md transition-all focus-within:ring-2 ring-gray-300">
          <Search className="w-5 h-5 text-gray-500 mr-2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search"
            onFocus={(e) =>
              (e.target.placeholder = "Search which calculator you want")
            }
            onBlur={(e) => (e.target.placeholder = "Search")}
            className="w-full outline-none text-gray-700 placeholder-gray-400"
          />
        </div>
      </motion.div>

      {/* Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredCalculators.length > 0 ? (
          filteredCalculators.map((calc, i) => {
            const Icon = calc.icon;
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 60 }}
                whileInView={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 60 }}
                viewport={{ once: false, amount: 0.2 }}
                transition={{
                  duration: 0.6,
                  delay: i * 0.1,
                  type: "spring",
                  stiffness: 120,
                }}
                whileHover={{ y: -8, scale: 1.02 }}
              >
                <Card
                  className={`${calc.color} shadow-md rounded-2xl hover:shadow-2xl transition-all duration-300 border border-gray-100 flex flex-col`}
                  style={{ aspectRatio: "1 / 1" }}
                >
                  {/* Icon and Title */}
                  <CardHeader className="pb-3 flex flex-row items-center gap-3">
                    <div className="p-2 bg-white rounded-lg shadow-sm">
                      <Icon className="w-6 h-6 text-gray-700" />
                    </div>
                    <CardTitle className="font-bold text-lg text-gray-800">
                      {calc.title}
                    </CardTitle>
                  </CardHeader>

                  {/* Centered Description */}
                  <CardContent className="flex-grow flex flex-col items-center justify-center text-center px-4">
                    <p className="font-bold text-gray-800 text-sm leading-relaxed">
                      {calc.desc}
                    </p>
                  </CardContent>

                  {/* Button at Bottom */}
                  <div className="px-4 pb-4">
                    <Link href={calc.link}>
                      <Button className="w-full bg-gray-900 text-white hover:bg-gray-800 rounded-lg py-2 transition-colors duration-300">
                        Calculate Now
                      </Button>
                    </Link>
                  </div>
                </Card>
              </motion.div>
            );
          })
        ) : (
          <p className="col-span-full text-center text-gray-500 mt-10">
            No calculators found.
          </p>
        )}
      </div>
    </div>
  );
}


