"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Search } from "lucide-react";
import {
  CreditCard,
  PiggyBank,
  Coins,
  BarChart3,
  Wallet,
  TrendingUp,
} from "lucide-react";
import { NavbarHome } from "@/components/NavbarHome";

const calculators = [
  {
    title: "Financial Health Checkup",
    desc: "Assess your financial well-being by analyzing your assets, liabilities, and cash flow.",
    link: "/calculator/financialchecklist",
    icon: CreditCard,
  },
  {
    title: "One Page Financial Roadmap",
    desc: "Create a personalized, one-page plan to map out and visualize your long-term financial goals.",
    link: "/calculator/onepagefinancialroadmap",
    icon: PiggyBank,
  },
  {
    title: "Fixed Deposit vs Mutual Fund",
    desc: "Compare post-tax returns from FDs and Mutual Funds to make an informed investment choice.",
    link: "/calculator/fd_md",
    icon: Coins,
  },
  {
    title: "3-in-1 Financial Planner",
    desc: "Combine your investment, term, and health insurance planning into one seamless experience.",
    link: "/calculator/3in1financialplanner",
    icon: BarChart3,
  },
  {
    title: "Systematic Withdrawal Plan (SWP)",
    desc: "Estimate periodic withdrawals from your investments to ensure a steady post-retirement income.",
    link: "/calculator/swp",
    icon: Wallet,
  },
  {
    title: "SIP vs Lumpsum",
    desc: "Project the potential growth of both SIP and Lumpsum strategies to find the right one for you.",
    link: "/calculator/sipandlumpsum",
    icon: TrendingUp,
  },
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
        <NavbarHome />
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
            className="w-full outline-none text-gray-700 placeholder-gray-400 bg-transparent"
          />
        </div>
      </motion.div>

      {/* Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
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
                <Card className="bg-white shadow-md rounded-2xl hover:shadow-xl transition-all duration-300 border-2 border-transparent hover:border-[#0065FF] flex flex-col h-full">
                  {/* Icon and Title */}
                  <CardHeader className="pb-3 flex flex-row items-center gap-3">
                    <div className="p-2 bg-gray-100 rounded-lg shadow-sm">
                      <Icon className="w-6 h-6 text-gray-700" />
                    </div>
                    <CardTitle className="font-bold text-lg text-gray-800">
                      {calc.title}
                    </CardTitle>
                  </CardHeader>

                  {/* Description */}
                  <CardContent className="flex-grow px-4">
                    <p className="text-gray-600 text-sm leading-relaxed">
                      {calc.desc}
                    </p>
                  </CardContent>

                  {/* Button at Bottom */}
                  <div className="px-4 pb-4 mt-4"> {/* <-- Change is here */}
                    <Link href={calc.link}>
                      <Button className="w-full bg-[#0065FF] text-white hover:bg-[#0052cc] rounded-lg py-2 transition-colors duration-300">
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