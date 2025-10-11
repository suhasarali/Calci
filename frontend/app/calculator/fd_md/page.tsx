"use client";

import React, { useState, useMemo } from "react";
import BackButton  from "@/components/BackButton";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import {
  Tabs,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Slider } from "@/components/ui/slider";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

export default function FdVsMfCalculator() {
  const [mode, setMode] = useState("compare");
  const [investmentAmount, setInvestmentAmount] = useState(1000000);
  const [investmentPeriod, setInvestmentPeriod] = useState(5);
  const [fdRate, setFdRate] = useState(7.5);
  const [taxBracket, setTaxBracket] = useState(30);
  const [mfRate, setMfRate] = useState(12);

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

    const maturity = principal * Math.pow(1 + rate, time);
    const gains = maturity - principal;
    const taxableGains = Math.max(0, gains - 125000);
    const tax = taxableGains * 0.125;
    const netReturn = maturity - tax;

    return { maturity, gains, tax, netReturn };
  }, [investmentAmount, investmentPeriod, mfRate]);

  const chartData = [
    {
      name: "Maturity Value",
      FD: fdCalculations.maturity,
      MF: mfCalculations.maturity,
    },
    {
      name: "Wealth After Tax",
      FD: fdCalculations.netReturn,
      MF: mfCalculations.netReturn,
    },
    {
      name: "Tax Paid",
      FD: fdCalculations.tax,
      MF: mfCalculations.tax,
    },
  ];

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(value);

  return (
    
    <div className="min-h-screen bg-[#fdfbf7] p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        
        <Card className="bg-white shadow-lg rounded-2xl">
          <CardHeader><BackButton/>
            <CardTitle className="text-2xl font-bold text-gray-800 text-center">
              Fixed Deposit vs. Mutual Fund Calculator
            </CardTitle>
          </CardHeader>

          <CardContent>
            <Tabs defaultValue={mode} className="w-full">
              <div className="flex justify-center mb-6">
                <TabsList className="grid w-full max-w-md grid-cols-3">
                  <TabsTrigger value="fd" onClick={() => setMode("fd")}>
                    FD
                  </TabsTrigger>
                  <TabsTrigger value="mf" onClick={() => setMode("mf")}>
                    MF
                  </TabsTrigger>
                  <TabsTrigger value="compare" onClick={() => setMode("compare")}>
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
                    <label className="block text-sm font-medium text-gray-600">
                      Investment Amount (₹)
                    </label>
                    <input
                      type="number"
                      value={investmentAmount}
                      onChange={(e) => setInvestmentAmount(Number(e.target.value))}
                      className="w-full mt-1 border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>

                  <div className="pt-5.5">
                    <label className="block text-sm font-medium text-gray-600">
                      Investment Period (Years)
                    </label>
                    <input
  type="number"
  min={1}
  max={30}
  step={1}
  value={investmentPeriod}
  onChange={(e) => setInvestmentPeriod(Number(e.target.value))}
  className="w-full mt-1 border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
/>
                    <p className="text-sm text-blue-600 mt-1 font-semibold">
                      {investmentPeriod} years
                    </p>
                  </div>
                </div>

                {/* FD */}
                <div className={`${mode === "mf" ? "opacity-40 pointer-events-none" : ""} space-y-6`}>
                  <h3 className="text-lg font-semibold text-gray-700">Fixed Deposit (FD)</h3>
                  <div>
                    <label className="block text-sm font-medium text-gray-600">
                      Rate of Interest (% p.a.)
                    </label>
                    <input
  type="number"
  min={4}
  max={10}
  step={0.25}
  value={fdRate}
  onChange={(e) => setFdRate(Number(e.target.value))}
  className="w-full mt-1 border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
/>
                    <p className="text-sm text-blue-600 mt-1 font-semibold">{fdRate}%</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-600">
                      Income Tax Bracket (%)
                    </label>
                    <input
  type="number"
  min={0}
  max={30}
  step={5}
  value={taxBracket}
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
                    <label className="block text-sm font-medium text-gray-600">
                      Expected Return (% p.a.)
                    </label>
                    <input
  type="number"
  min={5}
  max={25}
  step={0.5}
  value={mfRate}
  onChange={(e) => setMfRate(Number(e.target.value))}
  className="w-full mt-1 border-gray-300 rounded-md shadow-sm p-2 focus:ring-green-500 focus:border-green-500"
/>
                    <p className="text-sm text-blue-600 mt-1 font-semibold">{mfRate}%</p>
                  </div>
                  <p className="text-xs text-gray-500 pt-4">
                    Long-Term Capital Gains tax (12.5% on gains above ₹1 Lakh)
                  </p>
                </div>
              </div>

              {/* Output */}
              <div className="mt-6 bg-gray-100 p-6 rounded-lg">
                <div
                  className={`grid grid-cols-1 ${
                    mode === "compare" ? "md:grid-cols-2" : "md:grid-cols-1"
                  } gap-6`}
                >
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

                {mode === "compare" && (
                  <div className="mt-10">
                    <h3 className="text-xl font-bold text-center text-gray-800 mb-6">
                      FD vs MF Comparison
                    </h3>
                    <div className="w-full h-80">
                      <ResponsiveContainer>
                        <BarChart data={chartData}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                          <XAxis dataKey="name" />
                          <YAxis tickFormatter={(v) => `₹${v / 100000}L`} />
                          <Tooltip formatter={(v) => formatCurrency(Number(v))} />
                          <Legend />
                          <Bar dataKey="FD" fill="#3b82f6" radius={[6, 6, 0, 0]} barSize={60} />
                          <Bar dataKey="MF" fill="#" radius={[6, 6, 0, 0]} barSize={60}/>
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

const ResultCard = ({ title, color, data }) => (
  <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
    <h3 className={`text-xl font-bold text-center mb-4 ${color}`}>{title}</h3>
    <div className="space-y-2 text-sm">
      {data.map(([label, value], i) => (
        <div
          key={i}
          className={`flex justify-between py-2 ${
            i === data.length - 1 ? "border-t-2 border-dashed mt-2 pt-2" : "border-b border-gray-100"
          }`}
        >
          <p className="text-gray-600">{label}</p>
          <p
            className={`font-semibold ${
              value < 0 ? "text-red-600" : "text-gray-800"
            } ${i === data.length - 1 ? "text-lg text-green-700" : ""}`}
          >
            {value < 0
              ? `- ${new Intl.NumberFormat("en-IN", {
                  style: "currency",
                  currency: "INR",
                  maximumFractionDigits: 0,
                }).format(Math.abs(value))}`
              : new Intl.NumberFormat("en-IN", {
                  style: "currency",
                  currency: "INR",
                  maximumFractionDigits: 0,
                }).format(value)}
          </p>
        </div>
      ))}
    </div>
  </div>
);
