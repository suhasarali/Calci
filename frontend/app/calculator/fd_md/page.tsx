"use client";

import React, { useState, useMemo } from "react";
import { motion } from "framer-motion";
import BackButton from "@/components/BackButton";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, CartesianGrid,
} from "recharts";
import { toWords } from 'number-to-words';
import { NavbarHome } from "@/components/NavbarHome";
// Import icons from lucide-react
import { IndianRupee, CalendarDays, Percent, ReceiptText, TrendingUp } from "lucide-react";

// Helper function to capitalize the first letter of a string
const capitalize = (s) => s.charAt(0).toUpperCase() + s.slice(1);

// Helper function to parse a formatted currency string back to a number
const parseCurrency = (value) => {
    if (typeof value !== 'string') return value;
    return Number(value.replace(/[^0-9.-]+/g,""));
};

// Main Calculator Component
export default function FdVsMfCalculator() {
  const [mode, setMode] = useState("compare");
  const [investmentAmount, setInvestmentAmount] = useState(1000000);
  const [investmentPeriod, setInvestmentPeriod] = useState(5);
  const [fdRate, setFdRate] = useState(7.5);
  const [taxBracket, setTaxBracket] = useState(25);
  const [mfRate, setMfRate] = useState(12);
  const [ltcgRate, setLtcgRate] = useState(12.5);

  const fdCalculations = useMemo(() => {
    const principal = investmentAmount;
    const rate = fdRate / 100;
    const time = investmentPeriod;
    const taxRate = taxBracket / 100;
    const maturity = principal * Math.pow(1 + rate, time);
    const interest = maturity - principal;
    const tax = interest * taxRate;
    const netReturn = maturity - tax;
    return { maturity, interest, tax, netReturn };
  }, [investmentAmount, investmentPeriod, fdRate, taxBracket]);

  const mfCalculations = useMemo(() => {
    const principal = investmentAmount;
    const rate = mfRate / 100;
    const time = investmentPeriod;
    const ltcgTaxRate = ltcgRate / 100; 

    const maturity = principal * Math.pow(1 + rate, time);
    const gains = maturity - principal;
    const taxableGains = Math.max(0, gains - 100000); 
    const tax = taxableGains * ltcgTaxRate; 
    const netReturn = maturity - tax;
    return { maturity, gains, tax, netReturn };
  }, [investmentAmount, investmentPeriod, mfRate, ltcgRate]); 

  const chartData = [
    { name: "Maturity Value", FD: fdCalculations.maturity, MF: mfCalculations.maturity },
    { name: "Wealth After Tax", FD: fdCalculations.netReturn, MF: mfCalculations.netReturn },
  ];

  const formatCurrency = (value) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(value);
    
  const preTaxDifference = mfCalculations.maturity - fdCalculations.maturity;
  const postTaxDifference = mfCalculations.netReturn - fdCalculations.netReturn;

  return (
    <div className="min-h-screen bg-[#fdfbf7] p-4 sm:p-6 lg:p-8">
      <NavbarHome></NavbarHome>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 20 }}
        viewport={{ once: false, amount: 0.3 }}
        transition={{ duration: 0.6 }}
        className="text-center mt-18 mb-6"
      >
      </motion.div>
       
      <div className="max-w-7xl mx-auto mt-10">
        <Card className="bg-white shadow-lg rounded-2xl">
          <BackButton></BackButton>
          <CardHeader>          
            <CardTitle className="text-2xl font-bold text-gray-800 text-center">
              Fixed Deposit vs. Mutual Fund Calculator
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue={mode} className="w-full">
              <div className="flex justify-center mb-6">
                <TabsList className="grid w-full max-w-md grid-cols-3">
                  <TabsTrigger value="fd" onClick={() => setMode("fd")} className="data-[state=active]:text-blue-700">
                    FD
                  </TabsTrigger>
                  <TabsTrigger value="mf" onClick={() => setMode("mf")} className="data-[state=active]:text-blue-700">
                    MF
                  </TabsTrigger>
                  <TabsTrigger value="compare" onClick={() => setMode("compare")} className="data-[state=active]:text-blue-700">
                    Compare
                  </TabsTrigger>
                </TabsList>
              </div>

              {/* Inputs */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-8 px-4">
                {/* Investment Details */}
                <div className="space-y-6">
                  <h3 className="text-lg font-semibold text-gray-700">Investment Details</h3>
                  <div>
                    <label className="flex items-center space-x-2 text-sm font-medium text-gray-600">
                      <IndianRupee className="h-4 w-4 text-gray-500" />
                      <span>Investment Amount (₹)</span>
                    </label>
                    <input
                      type="text"
                      value={`₹ ${new Intl.NumberFormat('en-IN').format(investmentAmount)}`}
                      onChange={(e) => {
                        const numericValue = parseCurrency(e.target.value);
                        if (!isNaN(numericValue)) {
                          setInvestmentAmount(numericValue);
                        }
                      }}
                      className="w-full mt-1 border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500 font-semibold"
                    />
                    <p className="text-xs text-blue-600 mt-1">
                      {capitalize(toWords(investmentAmount))} Rupees
                    </p>
                  </div>

                  <div className="pt-2">
                    <label className="flex items-center space-x-2 text-sm font-medium text-gray-600">
                        <CalendarDays className="h-4 w-4 text-gray-500" />
                        <span>Investment Period (Years)</span>
                    </label>
                    <input
                      type="number" min={1} max={30} step={1} value={investmentPeriod}
                      onChange={(e) => setInvestmentPeriod(Number(e.target.value))}
                      className="w-full mt-1 border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                    <p className="text-sm text-blue-600 mt-1 font-semibold">{investmentPeriod} years</p>
                  </div>
                </div>

                {/* FD */}
                <div className={`${mode === "mf" ? "opacity-40 pointer-events-none" : ""} space-y-6`}>
                  <h3 className="text-lg font-semibold text-gray-700">Fixed Deposit (FD)</h3>
                  <div>
                    <label className="flex items-center space-x-2 text-sm font-medium text-gray-600">
                        <Percent className="h-4 w-4 text-gray-500" />
                        <span>Rate of Interest (% p.a.)</span>
                    </label>
                    <input
                      type="number" min={4} max={10} step={0.25} value={fdRate}
                      onChange={(e) => setFdRate(Number(e.target.value))}
                      className="w-full mt-1 border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                    <p className="text-sm text-blue-600 mt-1 font-semibold">{fdRate}%</p>
                  </div>
                  <div>
                    <label className="flex items-center space-x-2 text-sm font-medium text-gray-600">
                        <ReceiptText className="h-4 w-4 text-gray-500" />
                        <span>Income Tax Bracket (%)</span>
                    </label>
                    <input
                      type="number" min={0} max={30} step={5} value={taxBracket}
                      onChange={(e) => setTaxBracket(Number(e.target.value))}
                      className="w-full mt-1 border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                    <p className="text-sm text-blue-600 mt-1 font-semibold">{taxBracket}%</p>
                  </div>
                </div>

                {/* MF */}
                <div className={`${mode === "fd" ? "opacity-40 pointer-events-none" : ""} space-y-6`}>
                  <h3 className="text-lg font-semibold text-gray-700">Mutual Fund (MF)</h3>
                  <div>
                    <label className="flex items-center space-x-2 text-sm font-medium text-gray-600">
                        <TrendingUp className="h-4 w-4 text-gray-500" />
                        <span>Expected Return (% p.a.)</span>
                    </label>
                    <input
                      type="number" min={5} max={25} step={0.5} value={mfRate}
                      onChange={(e) => setMfRate(Number(e.target.value))}
                      className="w-full mt-1 border-gray-300 rounded-md shadow-sm p-2 focus:ring-green-500 focus:border-green-500"
                    />
                    <p className="text-sm text-blue-600 mt-1 font-semibold">{mfRate}%</p>
                  </div>
                  <div>
                    <label className="flex items-center space-x-2 text-sm font-medium text-gray-600">
                        <ReceiptText className="h-4 w-4 text-gray-500" />
                        <span>LTCG Tax Rate (%)</span>
                    </label>
                     <input
                      type="number" min={0} max={20} step={0.5} value={ltcgRate}
                      onChange={(e) => setLtcgRate(Number(e.target.value))}
                      className="w-full mt-1 border-gray-300 rounded-md shadow-sm p-2 focus:ring-green-500 focus:border-green-500"
                    />
                    <p className="text-sm text-blue-600 mt-1 font-semibold">{ltcgRate}%</p>
                    <p className="text-xs text-gray-500 pt-1">Tax on gains above ₹1 Lakh.</p>
                  </div>
                </div>
              </div>

              {/* Output */}
              <div className="mt-6 bg-gray-100 p-6 rounded-lg">
                <div className={`grid grid-cols-1 ${mode === "compare" ? "md:grid-cols-2" : "md:grid-cols-1"} gap-6`}>
                  {["fd", "compare"].includes(mode) && (
                    <ResultCard
                      title="Fixed Deposit Results"
                      data={[
                        ["Invested Amount", investmentAmount],
                        ["Maturity Value", fdCalculations.maturity],
                        ["Total Interest", fdCalculations.interest],
                        ["Tax Paid", -fdCalculations.tax],
                        ["Wealth After Tax", fdCalculations.netReturn],
                      ]}
                    />
                  )}
                  {["mf", "compare"].includes(mode) && (
                    <ResultCard
                      title="Mutual Fund Results"
                      data={[
                        ["Invested Amount", investmentAmount],
                        ["Maturity Value", mfCalculations.maturity],
                        ["Total Gains", mfCalculations.gains],
                        ["Tax Paid", -mfCalculations.tax],
                        ["Wealth After Tax", mfCalculations.netReturn],
                      ]}
                    />
                  )}
                </div>

                {mode === "compare" && (
                    <DifferenceCard 
                        preTax={preTaxDifference}
                        postTax={postTaxDifference}
                    />
                )}
                
                {mode === "compare" && (
                  <div className="mt-10">
                    <h3 className="text-xl font-bold text-center text-gray-800 mb-6">FD vs MF Comparison</h3>
                    <div className="w-full h-80">
                      <ResponsiveContainer>
                        <BarChart data={chartData}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                          <XAxis dataKey="name" />
                          <YAxis tickFormatter={(v) => `₹${(v / 100000).toFixed(1)}L`} />
                          <Tooltip formatter={(v) => formatCurrency(Number(v))} />
                          <Legend />
                          <Bar dataKey="FD" fill="#3b82f6" radius={[6, 6, 0, 0]} barSize={60} />
                          <Bar dataKey="MF" fill="#111827" radius={[6, 6, 0, 0]} barSize={60} />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                )}
              </div>
            </Tabs>
          </CardContent>
        </Card>
        
        {/* NEW: Detailed Comparison Table Section */}
        <Card className="bg-white shadow-lg rounded-2xl mt-8">
            <CardContent className="p-6 md:p-8">
                <DetailedComparison />
            </CardContent>
        </Card>
      </div>
    </div>
  );
}

// ResultCard Component
const ResultCard = ({ title, data }) => (
  <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
    <h3 className={`text-xl font-bold text-center mb-4 text-black`}>{title}</h3>
    <div className="space-y-2 text-sm">
      {data.map(([label, value], i) => (
        <div key={i} className={`flex justify-between py-2 ${i === data.length - 1 ? "border-t-2 border-dashed mt-2 pt-2" : "border-b border-gray-100"}`}>
          <p className="text-gray-600">{label}</p>
          <p className={`font-semibold ${value < 0 ? "text-red-600" : "text-gray-800"} ${i === data.length - 1 ? "text-lg text-green-700" : ""}`}>
            {new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(value)}
          </p>
        </div>
      ))}
    </div>
  </div>
);

// DifferenceCard Component
const DifferenceCard = ({ preTax, postTax }) => (
    <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 mt-6">
        <h3 className="text-xl font-bold text-center mb-4 text-gray-800">Investment Difference (MF vs FD)</h3>
        <div className="space-y-3 text-base">
            <div className="flex justify-between items-center py-2 border-b">
                <p className="text-gray-600">Pre-Tax Difference</p>
                <p className={`font-bold text-lg ${preTax >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(preTax)}
                </p>
            </div>
            <div className="flex justify-between items-center py-2">
                <p className="text-gray-600 font-semibold">Post-Tax Difference</p>
                <p className={`font-bold text-xl ${postTax >= 0 ? 'text-green-700' : 'text-red-700'}`}>
                    {new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(postTax)}
                </p>
            </div>
        </div>
    </div>
);


// NEW: Detailed Comparison Table Component
const comparisonData = [
    { feature: 'Risk Level', fd: 'Very Low', mf: 'Low to High' },
    { feature: 'Returns', fd: 'Fixed (5-8% p.a.)', mf: 'Variable (8-15%+ p.a.)' },
    { feature: 'Liquidity', fd: 'Moderate (penalty on early withdrawal)', mf: 'High (can redeem anytime)' },
    { feature: 'Taxation', fd: 'Interest taxed as per slab', mf: 'Capital gains tax applicable' },
    { feature: 'Best For', fd: 'Short-term goals, risk-averse investors', mf: 'Long-term wealth creation, growth seekers' },
];

const DetailedComparison = () => (
    <div className="w-full">
        <h2 className="text-2xl font-bold text-gray-800 text-center mb-6">Detailed Comparison</h2>
        <div className="space-y-4 text-sm md:text-base">
            {/* Header Row */}
            <div className="grid grid-cols-3 gap-4 font-bold p-4 bg-gray-50 rounded-lg">
                <p className="text-gray-700">Feature</p>
                <p className="text-blue-600">Fixed Deposit</p>
                <p className="text-green-600">Mutual Fund</p>
            </div>
            {/* Data Rows */}
            <div className="divide-y divide-gray-200">
                {comparisonData.map((item, index) => (
                    <div key={index} className="grid grid-cols-3 gap-4 py-4 px-4 items-center">
                        <p className="font-semibold text-gray-800">{item.feature}</p>
                        <p className="text-gray-600">{item.fd}</p>
                        <p className="text-gray-600">{item.mf}</p>
                    </div>
                ))}
            </div>
        </div>
    </div>
);