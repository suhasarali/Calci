"use client";

import React, { useState, useMemo } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import BackButton from "@/components/BackButton";
import { NavbarHome } from "@/components/NavbarHome";
// --- Import icons ---
import { FaRegCalendarAlt, FaPercentage } from "react-icons/fa";
import { BsCurrencyRupee } from "react-icons/bs";
import { FiTrendingUp, FiRepeat } from "react-icons/fi";


const Card = ({ className, ...props }) => (
  <div className={`rounded-2xl border bg-white text-gray-800 shadow-lg ${className}`} {...props} />
);

const CardHeader = ({ className, ...props }) => (
  <div className={`flex flex-col space-y-1.5 p-6 ${className}`} {...props} />
);

const CardTitle = ({ className, ...props }) => (
  <h2 className={`text-2xl font-bold tracking-tight text-center ${className}`} {...props} />
);

const CardContent = ({ className, ...props }) => (
  <div className={`p-6 pt-0 ${className}`} {...props} />
);

const Tabs = ({ children, className, ...props }) => (
    <div className={`inline-flex h-10 items-center justify-center rounded-md bg-gray-100 p-1 text-gray-600 ${className}`} {...props}>{children}</div>
);

const TabsTrigger = ({ isActive, className, ...props }) => (
    <button className={`inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-white transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 ${isActive ? 'bg-white shadow-sm text-blue-700' : ''} ${className}`} {...props}/>
);

// --- Excel FV Function Implementation ---
function FV(rate, nper, pmt, pv) {
  if (rate === 0) {
    return -pv - pmt * nper;
  }
  const fv = -pv * Math.pow(1 + rate, nper) - pmt * (Math.pow(1 + rate, nper) - 1) / rate;
  return fv;
}

// --- Number to Words Helper ---
function numberToWordsInIndianSystem(num) {
    const a = ['', 'one ', 'two ', 'three ', 'four ', 'five ', 'six ', 'seven ', 'eight ', 'nine ', 'ten ', 'eleven ', 'twelve ', 'thirteen ', 'fourteen ', 'fifteen ', 'sixteen ', 'seventeen ', 'eighteen ', 'nineteen '];
    const b = ['', '', 'twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety'];
    
    if (isNaN(num) || num === 0) return 'Zero';
    if (num > 999999999) return 'Number too large';

    const numStr = num.toString();
    if (numStr.length > 9) return 'overflow';

    const n = ('000000000' + numStr).substr(-9).match(/^(\d{2})(\d{2})(\d{2})(\d{1})(\d{2})$/);
    if (!n) return;

    let str = '';
    str += (n[1] != 0) ? (a[Number(n[1])] || b[n[1][0]] + ' ' + a[n[1][1]]) + 'crore ' : '';
    str += (n[2] != 0) ? (a[Number(n[2])] || b[n[2][0]] + ' ' + a[n[2][1]]) + 'lakh ' : '';
    str += (n[3] != 0) ? (a[Number(n[3])] || b[n[3][0]] + ' ' + a[n[3][1]]) + 'thousand ' : '';
    str += (n[4] != 0) ? (a[Number(n[4])] || b[n[4][0]] + ' ' + a[n[4][1]]) + 'hundred ' : '';
    str += (n[5] != 0) ? ((str != '') ? 'and ' : '') + (a[Number(n[5])] || b[n[5][0]] + ' ' + a[n[5][1]]) : '';
    
    return str.trim().split(' ').map(s => s.charAt(0).toUpperCase() + s.slice(1)).join(' ');
}


// --- Main Calculator Component ---

export default function SWPCalculator() {
  // --- State Variables (Allowing string for empty input handling) ---
  const [mode, setMode] = useState("amount"); // 'amount' or 'percentage'
  const [initialInvestment, setInitialInvestment] = useState("3000000");
  const [annualReturn, setAnnualReturn] = useState("12");
  const [duration, setDuration] = useState("5");
  const [frequency, setFrequency] = useState("Monthly"); // Monthly, Quarterly, Half-Yearly, Yearly
  
  // Mode-specific states
  const [withdrawalAmount, setWithdrawalAmount] = useState("20000");
  const [withdrawalPercentage, setWithdrawalPercentage] = useState("12");

  // --- Form Validation ---
  const isFormValid = useMemo(() => {
    if (!initialInvestment || !annualReturn || !duration) {
      return false;
    }
    if (mode === 'amount' && !withdrawalAmount) {
      return false;
    }
    if (mode === 'percentage' && !withdrawalPercentage) {
      return false;
    }
    return true;
  }, [initialInvestment, annualReturn, duration, mode, withdrawalAmount, withdrawalPercentage]);


  // --- Core Calculation Logic ---
  const calculations = useMemo(() => {
    if (!isFormValid) {
        return { finalBalance: 0, totalWithdrawn: 0, totalInterest: 0, history: [] };
    }

    const pInitialInvestment = Number(initialInvestment);
    const pAnnualReturn = Number(annualReturn);
    const pDuration = Number(duration);
    const pWithdrawalAmount = Number(withdrawalAmount);
    const pWithdrawalPercentage = Number(withdrawalPercentage);

    const periodsPerYear = { "Monthly": 12, "Quarterly": 4, "Half-Yearly": 2, "Yearly": 1 }[frequency];
    const totalPeriods = pDuration * periodsPerYear;
    let history = [];
    let finalBalance = 0;
    let totalWithdrawn = 0;
    let totalInterest = 0;

    if (mode === 'amount') {
        const periodicRate = (pAnnualReturn / 100) / periodsPerYear;
        
        finalBalance = FV(periodicRate, totalPeriods, pWithdrawalAmount, -pInitialInvestment);
        totalWithdrawn = pWithdrawalAmount * totalPeriods;
        totalInterest = finalBalance + totalWithdrawn - pInitialInvestment;
        
        let currentBalance = pInitialInvestment;
        for (let i = 1; i <= totalPeriods; i++) {
            const interestEarned = currentBalance * periodicRate;
            const balanceAfterInterest = currentBalance + interestEarned;
            const actualWithdrawal = Math.min(balanceAfterInterest, pWithdrawalAmount);
            const closingBalance = balanceAfterInterest - actualWithdrawal;
            
            history.push({ period: i, closingBalance });
            currentBalance = closingBalance;
            if (currentBalance <= 0) break;
        }

    } else { // percentage mode
        const periodicRate = (pAnnualReturn / 100) / periodsPerYear;
        
        let currentBalance = pInitialInvestment;
        
        for (let i = 1; i <= totalPeriods; i++) {
            const openingBalance = currentBalance;
            const interestEarned = openingBalance * periodicRate;
            const withdrawalForPeriod = openingBalance * (pWithdrawalPercentage / 100) / periodsPerYear;
            const balanceAfterInterest = openingBalance + interestEarned;
            const actualWithdrawal = Math.min(balanceAfterInterest, withdrawalForPeriod);
            const closingBalance = balanceAfterInterest - actualWithdrawal;
            
            totalWithdrawn += actualWithdrawal;
            totalInterest += interestEarned;

            history.push({ period: i, closingBalance });

            currentBalance = closingBalance;
            if (currentBalance <= 0) {
                 for (let j = i + 1; j <= totalPeriods; j++) {
                    history.push({ period: j, closingBalance: 0 });
                 }
                 break;
            }
        }
        finalBalance = currentBalance;
    }
    
    return {
        finalBalance: Math.max(0, finalBalance),
        totalWithdrawn,
        totalInterest: Math.max(0, totalInterest),
        history,
    };

  }, [isFormValid, initialInvestment, annualReturn, duration, frequency, mode, withdrawalAmount, withdrawalPercentage]);

  const formatCurrency = (value) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(value);

  return (
    <div className="min-h-screen bg-[#fdfbf7] p-4 sm:p-6 lg:p-8">
      <NavbarHome />
      <div className="max-w-7xl mt-18 mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>Systematic Withdrawal Plan (SWP) Calculator</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex justify-center mb-6">
                <Tabs>
                    <TabsTrigger isActive={mode === 'amount'} onClick={() => setMode('amount')}>
                        Withdraw by Amount
                    </TabsTrigger>
                    <TabsTrigger isActive={mode === 'percentage'} onClick={() => setMode('percentage')}>
                        Withdraw by Percentage
                    </TabsTrigger>
                </Tabs>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-1 space-y-4">
                    <InputRow label="Initial Investment (₹)" icon={<BsCurrencyRupee className="text-gray-500"/>}>
                        <input type="number" value={initialInvestment} onChange={(e) => setInitialInvestment(e.target.value)} className="input-field" required/>
                        {Number(initialInvestment) > 0 && (
                            <p className="text-sm text-blue-600 mt-1 font-semibold">{numberToWordsInIndianSystem(Number(initialInvestment))} Rupees</p>
                        )}
                    </InputRow>
                    <InputRow label="Annual Rate of Return (%)" icon={<FiTrendingUp className="text-gray-500"/>}>
                        <input type="number" value={annualReturn} onChange={(e) => setAnnualReturn(e.target.value)} className="input-field" required/>
                    </InputRow>
                    <InputRow label="Investment Tenure (Years)" icon={<FaRegCalendarAlt className="text-gray-500"/>}>
                        <input type="number" value={duration} onChange={(e) => setDuration(e.target.value)} className="input-field" required/>
                    </InputRow>
                    <InputRow label="Withdrawal Frequency" icon={<FiRepeat className="text-gray-500"/>}>
                        <select value={frequency} onChange={(e) => setFrequency(e.target.value)} className="input-field" required>
                            <option>Monthly</option>
                            <option>Quarterly</option>
                            <option>Half-Yearly</option>
                            <option>Yearly</option>
                        </select>
                    </InputRow>
                    
                    {mode === 'amount' ? (
                        <InputRow label={`Withdrawal Amount per ${frequency.replace('ly', '')} (₹)`} icon={<BsCurrencyRupee className="text-gray-500"/>}>
                            <input type="number" value={withdrawalAmount} onChange={(e) => setWithdrawalAmount(e.target.value)} className="input-field" required/>
                            {Number(withdrawalAmount) > 0 && (
                                <p className="text-sm text-blue-600 mt-1 font-semibold">{numberToWordsInIndianSystem(Number(withdrawalAmount))} Rupees</p>
                            )}
                        </InputRow>
                    ) : (
                        <InputRow label="Annual Withdrawal Percentage (%)" icon={<FaPercentage className="text-gray-500"/>}>
                           <input type="number" value={withdrawalPercentage} onChange={(e) => setWithdrawalPercentage(e.target.value)} className="input-field" required/>
                        </InputRow>
                    )}
                </div>

                {isFormValid ? (
                  <div className="lg:col-span-2 bg-gray-50 p-6 rounded-lg">
                      <h3 className="text-xl font-bold text-gray-800 mb-4">Investment Summary</h3>
                      <ResultRow label="Final Balance" value={formatCurrency(calculations.finalBalance)} isFinal={true} />
                      <ResultRow label="Total Amount Withdrawn" value={formatCurrency(calculations.totalWithdrawn)} />
                      <ResultRow label="Total Interest Earned" value={formatCurrency(calculations.totalInterest)} />
                      
                      <div className="mt-8">
                          <h4 className="text-lg font-semibold text-center text-blue-700 mb-4">Corpus Balance Over Time</h4>
                          <div className="w-full h-80">
                              <ResponsiveContainer>
                                  <LineChart data={calculations.history} margin={{ top: 5, right: 20, left: 20, bottom: 5 }}>
                                      <CartesianGrid strokeDasharray="3 3" />
                                      <XAxis dataKey="period" label={{ value: `Period (${frequency})`, position: 'insideBottom', offset: -5 }}/>
                                      <YAxis tickFormatter={(v) => `₹${v / 100000}L`} />
                                      <Tooltip formatter={(value) => formatCurrency(value)} />
                                      <Legend />
                                      <Line type="monotone" dataKey="closingBalance" name="Corpus Balance" stroke="#3b82f6" strokeWidth={2} dot={false} />
                                  </LineChart>
                              </ResponsiveContainer>
                          </div>
                      </div>
                  </div>
                ) : (
                  <div className="lg:col-span-2 bg-gray-50 p-6 rounded-lg flex items-center justify-center">
                    <p className="text-center text-gray-500 font-semibold">Please fill in all required fields to see your SWP summary.</p>
                  </div>
                )}
            </div>
          </CardContent>
        </Card>
      </div>
      <style jsx global>{`
        .input-field {
            width: 100%;
            margin-top: 4px;
            border: 1px solid #d1d5db;
            border-radius: 0.375rem;
            box-shadow: 0 1px 2px 0 rgb(0 0 0 / 0.05);
            padding: 0.5rem;
            -webkit-appearance: none;
            -moz-appearance: textfield;
        }
        .input-field:focus {
            outline: 2px solid transparent;
            outline-offset: 2px;
            border-color: #3b82f6;
            box-shadow: 0 0 0 2px #3b82f6;
        }
      `}</style>
    </div>
  );
}

// --- Helper Sub-components ---

const InputRow = ({ label, children, icon }) => (
    <div>
        <label className="flex items-center gap-2 text-sm font-medium text-gray-600">
          {icon}
          <span>{label}</span>
        </label>
        {children}
    </div>
);

const ResultRow = ({ label, value, isFinal = false }) => (
  <div className={`flex justify-between items-center py-2 ${!isFinal && 'border-b border-gray-200'}`}>
    <p className="text-sm text-gray-600">{label}</p>
    <p className={`font-semibold ${isFinal ? "text-xl text-green-700" : "text-lg text-gray-800"}`}>
      {value}
    </p>
  </div>
);