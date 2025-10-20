"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  Search,
  CreditCard,
  PiggyBank,
  Coins, // Keep for future use
  BarChart3, // Used for Wealth Growth Analyzer
  Wallet, // Keep for future use
  TrendingUp, // Used for Investment Performance Tracker
  Calendar, // Keep for future use
} from "lucide-react";
import { NavbarHome } from "@/components/NavbarHome";

const analysisTools = [
  {
    title: "Financial Health Checkup",
    desc: "Assess your financial well-being by analyzing your assets, liabilities, and cash flow.",
    link: "/analysistool/financialchecklist",
    icon: CreditCard,
  },
  {
    title: "One Page Financial Roadmap",
    desc: "Create a personalized, one-page plan to map out and visualize your long-term financial goals.",
    link: "/analysistool/onepagefinancialroadmap",
    icon: PiggyBank,
  },
];

//array for "Coming Soon" tools
const comingSoonTools = [
  {
    title: "Investment Performance Tracker",
    desc: "Connect your accounts to monitor all your investments and track performance in one place.",
    icon: TrendingUp,
  },
  {
    title: "Wealth Growth Analyzer",
    desc: "Analyze your net worth, asset allocation, and wealth growth trajectory over time.",
    icon: BarChart3,
  },
];

export default function DashboardPage() {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredanalysisTools = analysisTools.filter((tool) =>
    tool.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6 md:p-10">
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
              (e.target.placeholder = "Search which analysis tool you want")
            }
            onBlur={(e) => (e.target.placeholder = "Search")}
            className="w-full outline-none text-gray-700 placeholder-gray-400 bg-transparent"
          />
        </div>
      </motion.div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {/* Render the available, filtered tools */}
        {filteredanalysisTools.map((tool, i) => {
          const Icon = tool.icon;
          return (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 60 }}
              whileInView={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 60 }}
              viewport={{ once: false, amount: 0.2 }}
              transition={{
                duration: 0.6,
                delay: i * 0.1, // Stagger delay based on index
                type: "spring",
                stiffness: 120,
              }}
              whileHover={{ y: -8, scale: 1.02 }}
            >
              <Card className="bg-white shadow-md rounded-2xl hover:shadow-xl hover:shadow-blue-200 transition-all duration-300 border-2 border-transparent hover:border-[#0065FF] flex flex-col h-full">
                <CardHeader className="pb-3 flex flex-row items-center gap-3">
                  <div className="p-2 bg-gray-100 rounded-lg shadow-sm">
                    <Icon className="w-6 h-6 text-gray-700" />
                  </div>
                  <CardTitle className="font-bold text-lg text-gray-800">
                    {tool.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="flex-grow px-4">
                  <p className="text-gray-600 text-sm leading-relaxed">
                    {tool.desc}
                  </p>
                </CardContent>
                <div className="px-4 pb-4 mt-4">
                  <Link href={tool.link}>
                    <Button className="w-full bg-[#0065FF] text-white hover:bg-[#0052cc] rounded-lg py-2 transition-colors duration-300">
                      Analyse Now
                    </Button>
                  </Link>
                </div>
              </Card>
            </motion.div>
          );
        })}

        {/* Render "Coming Soon" cards ONLY if no search is active */}
        {searchQuery === "" &&
          comingSoonTools.map((tool, i) => {
            const Icon = tool.icon;
            return (
              <motion.div
                key={`coming-soon-${i}`} // Use a distinct key
                initial={{ opacity: 0, y: 60 }}
                whileInView={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 60 }}
                viewport={{ once: false, amount: 0.2 }}
                transition={{
                  duration: 0.6,
                  // Stagger delay continues from the filtered tools
                  delay: (filteredanalysisTools.length + i) * 0.1,
                  type: "spring",
                  stiffness: 120,
                }}
                whileHover={{ y: -8, scale: 1.02 }} // Keep hover effect
              >
                {/* Styled as a "disabled" card */}
                <Card className="bg-gray-50 shadow-md rounded-2xl transition-all duration-300 border-2 border-dashed border-gray-300 flex flex-col h-full opacity-70 cursor-not-allowed">
                  <CardHeader className="pb-3 flex flex-row items-center gap-3">
                    <div className="p-2 bg-gray-200 rounded-lg shadow-sm">
                      <Icon className="w-6 h-6 text-gray-500" />
                    </div>
                    <CardTitle className="font-bold text-lg text-gray-600">
                      {tool.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="flex-grow px-4">
                    <p className="text-gray-500 text-sm leading-relaxed">
                      {tool.desc}
                    </p>
                  </CardContent>
                  <div className="px-4 pb-4 mt-4">
                    <Button
                      className="w-full bg-gray-300 text-gray-500 rounded-lg py-2 cursor-not-allowed"
                      disabled
                    >
                      Coming Soon
                    </Button>
                  </div>
                </Card>
              </motion.div>
            );
          })}

        {/* Handle the "No tools found" case */}
        {filteredanalysisTools.length === 0 && searchQuery !== "" && (
          <p className="col-span-full text-center text-gray-500 mt-10">
            No tools found matching your search.
          </p>
        )}
      </div>
    </div>
  );
}