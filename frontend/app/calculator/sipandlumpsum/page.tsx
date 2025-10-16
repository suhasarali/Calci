"use client";

import React, { useState, useMemo } from "react";
import BackButton from "@/components/BackButton";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { toWords } from "number-to-words";
import { NavbarHome } from "@/components/NavbarHome";

// --- ICONS ---
const RupeeIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
    <path strokeLinecap="round" strokeLinejoin="round" d="M6 6h12M6 12h12m-6 6h6M6 18l6-6" />
  </svg>
);

const PercentIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
    <path strokeLinecap="round" strokeLinejoin="round" d="M19 5L5 19m0-14h.01M19 19h.01" />
  </svg>
);

const CalendarIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
    <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3M3 9h18M5 9v11a2 2 0 002 2h10a2 2 0 002-2V9H5z" />
  </svg>
);

const TrendingUpIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 17l6-6 4 4 8-8" />
  </svg>
);

// --- HELPERS ---
const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

const parseCurrency = (value: string | number) =>
  typeof value === "string" ? Number(value.replace(/[^0-9.-]+/g, "")) : value;

const formatCurrency = (value: number) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value);

// ✅ ENTIRE COMPONENT STARTS HERE
export default function Page() {
  // --- STATES ---
  const [lumpsumAmount, setLumpsumAmount] = useState(100000);
  const [interestRate, setInterestRate] = useState(12);
  const [investmentTenure, setInvestmentTenure] = useState(10);
  const [inflationRate, setInflationRate] = useState(6);
  const [showFutureValue, setShowFutureValue] = useState(false);
  const [futureValueYear, setFutureValueYear] = useState(1);

  // --- CALCULATIONS ---
  const { primaryCalculations, yearlyData } = useMemo(() => {
    const principal = lumpsumAmount;
    const rate = interestRate / 100;
    const tenure = investmentTenure;
    const inflation = inflationRate / 100;

    const generatedWealth = principal * Math.pow(1 + rate, tenure);
    const inflationAdjustedWealth = generatedWealth / Math.pow(1 + inflation, tenure);
    const totalInterest = generatedWealth - principal;

    const yearlyData = Array.from({ length: tenure + 1 }, (_, i) => {
      const year = i;
      const fv = principal * Math.pow(1 + rate, year);
      const realFv = fv / Math.pow(1 + inflation, year);
      return {
        year: `Year ${year}`,
        "Generated Wealth": fv,
        "Inflation-Adjusted Wealth": realFv,
        "Invested Amount": principal,
      };
    });

    return {
      primaryCalculations: {
        investedAmount: principal,
        generatedWealth,
        inflationAdjustedWealth,
        totalInterest,
      },
      yearlyData,
    };
  }, [lumpsumAmount, interestRate, investmentTenure, inflationRate]);

  const futureValueCalculations = useMemo(() => {
    if (!showFutureValue || futureValueYear <= 0)
      return { futureValue: 0, inflationAdjustedFutureValue: 0 };

    const principal = lumpsumAmount;
    const rate = interestRate / 100;
    const inflation = inflationRate / 100;
    const year = futureValueYear;
    const tenure = investmentTenure;

    const futureValue =
      year > tenure ? 0 : principal * Math.pow(1 + rate, year);
    const inflationAdjustedFutureValue =
      year > tenure ? 0 : futureValue / Math.pow(1 + inflation, year);

    return { futureValue, inflationAdjustedFutureValue };
  }, [
    lumpsumAmount,
    interestRate,
    investmentTenure,
    inflationRate,
    showFutureValue,
    futureValueYear,
  ]);

  // --- RETURN JSX ---
  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
      <NavbarHome />
      <BackButton />

      <div className="max-w-6xl mx-auto mt-6 space-y-8">
        <Card className="p-6 shadow-md">
          <CardHeader>
            <CardTitle className="text-xl sm:text-2xl font-bold text-center">
              Lumpsum Investment Calculator
            </CardTitle>
          </CardHeader>

          <CardContent className="space-y-4">
            {/* Inputs */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  Lumpsum Amount (₹)
                </label>
                <input
                  type="number"
                  value={lumpsumAmount}
                  onChange={(e) => setLumpsumAmount(parseCurrency(e.target.value))}
                  className="w-full border rounded-lg p-2"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  Expected Return (%)
                </label>
                <input
                  type="number"
                  value={interestRate}
                  onChange={(e) => setInterestRate(parseFloat(e.target.value))}
                  className="w-full border rounded-lg p-2"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  Investment Tenure (Years)
                </label>
                <input
                  type="number"
                  value={investmentTenure}
                  onChange={(e) => setInvestmentTenure(parseInt(e.target.value))}
                  className="w-full border rounded-lg p-2"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  Inflation Rate (%)
                </label>
                <input
                  type="number"
                  value={inflationRate}
                  onChange={(e) => setInflationRate(parseFloat(e.target.value))}
                  className="w-full border rounded-lg p-2"
                />
              </div>
            </div>

            {/* Results */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-6">
              <Card className="p-4">
                <CardTitle className="text-sm font-semibold text-gray-600">
                  Invested Amount
                </CardTitle>
                <p className="text-lg font-bold text-gray-800">
                  {formatCurrency(primaryCalculations.investedAmount)}
                </p>
              </Card>

              <Card className="p-4">
                <CardTitle className="text-sm font-semibold text-gray-600">
                  Generated Wealth
                </CardTitle>
                <p className="text-lg font-bold text-green-700">
                  {formatCurrency(primaryCalculations.generatedWealth)}
                </p>
              </Card>

              <Card className="p-4">
                <CardTitle className="text-sm font-semibold text-gray-600">
                  Inflation Adjusted Wealth
                </CardTitle>
                <p className="text-lg font-bold text-orange-600">
                  {formatCurrency(primaryCalculations.inflationAdjustedWealth)}
                </p>
              </Card>

              <Card className="p-4">
                <CardTitle className="text-sm font-semibold text-gray-600">
                  Total Interest Earned
                </CardTitle>
                <p className="text-lg font-bold text-blue-700">
                  {formatCurrency(primaryCalculations.totalInterest)}
                </p>
              </Card>
            </div>
          </CardContent>
        </Card>

        {/* Chart */}
        <Card className="p-6">
          <CardHeader>
            <CardTitle className="text-lg font-bold text-center">
              Investment Growth Over Time
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={400}>
              <LineChart data={yearlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="year" />
                <YAxis tickFormatter={(val) => `₹${val / 1000}k`} />
                <Tooltip formatter={(val: any) => formatCurrency(val)} />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="Generated Wealth"
                  stroke="#4ade80"
                  strokeWidth={2}
                />
                <Line
                  type="monotone"
                  dataKey="Inflation-Adjusted Wealth"
                  stroke="#f97316"
                  strokeWidth={2}
                />
                <Line
                  type="monotone"
                  dataKey="Invested Amount"
                  stroke="#60a5fa"
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
