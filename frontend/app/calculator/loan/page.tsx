"use client";

import React, { useState } from "react";
import { LogOut } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import { NavbarDemo } from "@/components/Navbar";


const COLORS = ["#2563eb", "#e5e7eb"]; // Interest: blue, Principal: light gray

export default function LoanEMICalculator() {
  const [loanAmount, setLoanAmount] = useState<number>(500000);
  const [interestRate, setInterestRate] = useState<number>(10);
  const [loanTenure, setLoanTenure] = useState<number>(5);

  // EMI calculation
  const n = loanTenure * 12;
  const r = interestRate / 12 / 100;
  const emi = Math.round((loanAmount * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1));
  const totalPayment = emi * n;
  const totalInterest = totalPayment - loanAmount;

  // Pie chart data
  const pieData = [
    { name: "Principal", value: loanAmount },
    { name: "Interest", value: totalInterest },
  ];

  // Area chart data
  const areaData = Array.from({ length: n }, (_, i) => {
    const month = i + 1;
    const principalPaid = (loanAmount * month) / n;
    const interestPaid = (totalInterest * month) / n;
    return {
      month,
      Principal: principalPaid,
      Interest: interestPaid,
      EMI: emi,
    };
  });

  return (
    <div className="min-h-screen bg-[#fdfbf7]">
      <div className="mt-2" >
        <NavbarDemo />
      </div>

      <div className="max-w-7xl mx-auto py-10 px-4">
        <Card className="p-6 bg-white shadow rounded-2xl">
          <CardHeader>
            <CardTitle className="text-2xl font-bold">Loan EMI Calculator</CardTitle>
          </CardHeader>

          <CardContent>
            {/* Top Row: Sliders Left, Pie Chart Right */}
            <div className="grid md:grid-cols-2 gap-6">
              {/* Left Column: Sliders */}
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium">Loan Amount</label>
                  <div className="flex items-center justify-between text-blue-600 font-semibold">
                    <span>₹ {loanAmount.toLocaleString()}</span>
                  </div>
                  <Slider
                    defaultValue={[loanAmount]}
                    min={50000}
                    max={10000000}
                    step={5000}
                    onValueChange={(v: number[]) => setLoanAmount(v[0])}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium">Interest Rate (p.a)</label>
                  <div className="flex items-center justify-between text-blue-600 font-semibold">
                    <span>{interestRate}%</span>
                  </div>
                  <Slider
                    defaultValue={[interestRate]}
                    min={1}
                    max={20}
                    step={0.1}
                    onValueChange={(v: number[]) => setInterestRate(v[0])}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium">Loan Tenure (years)</label>
                  <div className="flex items-center justify-between text-blue-600 font-semibold">
                    <span>{loanTenure} Yr</span>
                  </div>
                  <Slider
                    defaultValue={[loanTenure]}
                    min={1}
                    max={30}
                    step={1}
                    onValueChange={(v: number[]) => setLoanTenure(v[0])}
                  />
                </div>
              </div>

              {/* Right Column: Pie Chart + EMI Results */}
              <div className="flex flex-col items-center justify-center space-y-6">
                <div className="w-64 h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={pieData}
                        dataKey="value"
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={100}
                        paddingAngle={2}
                        label
                      >
                        {pieData.map((_, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>

                <div className="text-center space-y-2">
                  <p>
                    Monthly EMI: <span className="font-semibold">₹ {emi.toLocaleString()}</span>
                  </p>
                  <p>
                    Total Interest: <span className="font-semibold">₹ {totalInterest.toLocaleString()}</span>
                  </p>
                  <p>
                    Total Payment: <span className="font-semibold">₹ {totalPayment.toLocaleString()}</span>
                  </p>
                </div>

                <Button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg w-full">
                  APPLY NOW
                </Button>
              </div>
            </div>

            {/* Bottom Row: Stacked Area Chart spanning both columns */}
            <div className="mt-10 w-full h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={areaData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" label={{ value: "Month", position: "insideBottom", offset: -5 }} />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Area type="monotone" dataKey="Principal" stackId="1" stroke="#111827" fill="#cbd5e1" />
                  <Area type="monotone" dataKey="Interest" stackId="1" stroke="#2563eb" fill="#60a5fa" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
