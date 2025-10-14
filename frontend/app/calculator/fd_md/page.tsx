"use client";

import React, { useState, useMemo } from "react";
import BackButton from "@/components/BackButton";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, CartesianGrid,
} from "recharts";
// Import the library to convert numbers to words
import { toWords } from 'number-to-words';

// Helper function to capitalize the first letter of a string
const capitalize = (s) => s.charAt(0).toUpperCase() + s.slice(1);

// Helper function to parse a formatted currency string back to a number
const parseCurrency = (value) => {
    if (typeof value !== 'string') return value;
    return Number(value.replace(/[^0-9.-]+/g,""));
};

export default function FdVsMfCalculator() {
  const [mode, setMode] = useState("compare");
  const [investmentAmount, setInvestmentAmount] = useState(1000000);
  const [investmentPeriod, setInvestmentPeriod] = useState(5);
  const [fdRate, setFdRate] = useState(7.5);
  const [taxBracket, setTaxBracket] = useState(25);
  const [mfRate, setMfRate] = useState(12);
  // NEW: State for Long-Term Capital Gains tax rate
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
    const ltcgTaxRate = ltcgRate / 100; // Use state for LTCG tax

    const maturity = principal * Math.pow(1 + rate, time);
    const gains = maturity - principal;
    const taxableGains = Math.max(0, gains - 100000); // Exemption is 1 Lakh
    const tax = taxableGains * ltcgTaxRate; // Use dynamic LTCG rate
    const netReturn = maturity - tax;
    return { maturity, gains, tax, netReturn };
  }, [investmentAmount, investmentPeriod, mfRate, ltcgRate]); // Add ltcgRate to dependency array

  // MODIFIED: Removed "Tax Paid" from chart data
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
    
  // NEW: Calculate differences for the new result box
  const preTaxDifference = mfCalculations.maturity - fdCalculations.maturity;
  const postTaxDifference = mfCalculations.netReturn - fdCalculations.netReturn;

  return (
    <div className="min-h-screen bg-[#fdfbf7] p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <Card className="bg-white shadow-lg rounded-2xl">
          <CardHeader>
            <BackButton />
            <CardTitle className="text-2xl font-bold text-gray-800 text-center">
              Fixed Deposit vs. Mutual Fund Calculator
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue={mode} className="w-full">
              <div className="flex justify-center mb-6">
                <TabsList className="grid w-full max-w-md grid-cols-3">
                  <TabsTrigger value="fd" onClick={() => setMode("fd")}>FD</TabsTrigger>
                  <TabsTrigger value="mf" onClick={() => setMode("mf")}>MF</TabsTrigger>
                  <TabsTrigger value="compare" onClick={() => setMode("compare")}>Compare</TabsTrigger>
                </TabsList>
              </div>

              {/* Inputs */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-8 px-4">
                {/* Investment Details */}
                <div className="space-y-6">
                  <h3 className="text-lg font-semibold text-gray-700">Investment Details</h3>
                  <div>
                    <label className="block text-sm font-medium text-gray-600">Investment Amount (₹)</label>
                    {/* MODIFIED: Changed input type to 'text' for formatting */}
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
                    {/* NEW: Display amount in words */}
                    <p className="text-xs text-blue-600 mt-1">
                      {capitalize(toWords(investmentAmount))} Rupees
                    </p>
                  </div>

                  <div className="pt-2">
                    <label className="block text-sm font-medium text-gray-600">Investment Period (Years)</label>
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
                    <label className="block text-sm font-medium text-gray-600">Rate of Interest (% p.a.)</label>
                    <input
                      type="number" min={4} max={10} step={0.25} value={fdRate}
                      onChange={(e) => setFdRate(Number(e.target.value))}
                      className="w-full mt-1 border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                    <p className="text-sm text-blue-600 mt-1 font-semibold">{fdRate}%</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-600">Income Tax Bracket (%)</label>
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
                    <label className="block text-sm font-medium text-gray-600">Expected Return (% p.a.)</label>
                    <input
                      type="number" min={5} max={25} step={0.5} value={mfRate}
                      onChange={(e) => setMfRate(Number(e.target.value))}
                      className="w-full mt-1 border-gray-300 rounded-md shadow-sm p-2 focus:ring-green-500 focus:border-green-500"
                    />
                    <p className="text-sm text-blue-600 mt-1 font-semibold">{mfRate}%</p>
                  </div>
                   {/* NEW: LTCG Tax Rate input */}
                  <div>
                    <label className="block text-sm font-medium text-gray-600">LTCG Tax Rate (%)</label>
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
                      color="text-black"
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
                      color="text-black"
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

                {/* NEW: Difference card, appears only in compare mode */}
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
      </div>
    </div>
  );
}

// ResultCard Component (Unchanged)
const ResultCard = ({ title, color, data }) => (
  <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
    <h3 className={`text-xl font-bold text-center mb-4 ${color}`}>{title}</h3>
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

// NEW: Component for showing the difference
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