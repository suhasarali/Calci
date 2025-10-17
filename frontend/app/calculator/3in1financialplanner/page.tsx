"use client";

import React, { useState, useMemo } from "react";
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
import BackButton from "@/components/BackButton";
import { NavbarHome } from "@/components/NavbarHome";
import { toWords } from 'number-to-words';
import {
    IndianRupee,
    TrendingUp,
    CalendarDays,
    Percent,
    TrendingDown,
    ShieldCheck,
    ReceiptText,
    HeartPulse
} from 'lucide-react';


// --- Helper Functions ---
const capitalize = (s) => {
    if (typeof s !== 'string') return '';
    return s.charAt(0).toUpperCase() + s.slice(1);
};


// --- UI Components ---
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

// --- Main Calculator Component ---

export default function ThreeInOnePlanner() {
  // --- State Variables for User Inputs ---
  const [monthlyContribution, setMonthlyContribution] = useState(20000);
  const [annualStepUp, setAnnualStepUp] = useState(10);
  const [contributionPeriod, setContributionPeriod] = useState(20);
  const [expectedReturn, setExpectedReturn] = useState(12);
  const [termPremium, setTermPremium] = useState(15000);
  const [healthPremium, setHealthPremium] = useState(12000);
  const [termCoverAmount, setTermCoverAmount] = useState(10000000);
  const [healthCoverAmount, setHealthCoverAmount] = useState(1000000);
  const [premiumIncreaseRate, setPremiumIncreaseRate] = useState(10);
  const [inflationRate, setInflationRate] = useState(6);


  // --- Derived Calculations ---
  const calculations = useMemo(() => {
    const inflation = inflationRate / 100;
    const annualReturnRate = expectedReturn / 100;
    const stepUpRate = annualStepUp / 100;
    const premiumIncrease = premiumIncreaseRate / 100;

    let totalWealth = 0;
    let totalInvested = 0;
    
    let currentMonthlyContribution = monthlyContribution;
    let currentHealthPremium = healthPremium;
    const termMonthly = termPremium / 12;

    const chartData = [{ year: 0, invested: 0, wealth: 0 }];

    for (let year = 1; year <= contributionPeriod; year++) {
      const currentHealthMonthly = currentHealthPremium / 12;
      const actualMonthlySip = Math.max(0, currentMonthlyContribution - termMonthly - currentHealthMonthly);
      const currentAnnualSip = actualMonthlySip * 12;
      
      totalInvested += currentAnnualSip;
      totalWealth = (totalWealth + currentAnnualSip) * (1 + annualReturnRate);

      chartData.push({
        year,
        invested: parseFloat(totalInvested.toFixed(0)),
        wealth: parseFloat(totalWealth.toFixed(0)),
      });

      // Step-up values for the next year
      currentMonthlyContribution *= (1 + stepUpRate);
      currentHealthPremium *= (1 + premiumIncrease);
    }

    const estimatedReturns = totalWealth - totalInvested;
    const realValue = totalWealth / Math.pow(1 + inflation, contributionPeriod);
    const initialSip = Math.max(0, monthlyContribution - (termPremium / 12) - (healthPremium / 12));

    return {
      termMonthly,
      healthMonthly: healthPremium / 12,
      actualSip: initialSip,
      totalWealth,
      totalInvested,
      estimatedReturns,
      realValue,
      chartData,
    };
  }, [monthlyContribution, annualStepUp, contributionPeriod, expectedReturn, termPremium, healthPremium, premiumIncreaseRate, inflationRate]);


  const formatCurrency = (value) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(value);

  return (
      <div className="min-h-screen bg-[#fdfbf7] p-4 sm:p-6 lg:p-8">
        <NavbarHome/>
      <div className="max-w-7xl mt-18 mx-auto">
        <Card>
          <BackButton/>
          <CardHeader>
            <CardTitle>3-in-1 Financial Planner</CardTitle>
          </CardHeader>
          <CardContent>
            {/* --- Input Section --- */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
                {/* Investment Inputs */}
                <InputSection title="Investment Plan">
                    <InputRow label="Monthly Contribution (₹)" icon={<IndianRupee />}>
                        <input type="number" value={monthlyContribution} onChange={(e) => setMonthlyContribution(Number(e.target.value))} className="w-full mt-1 border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"/>
                        <p className="text-xs text-blue-600 mt-1">{capitalize(toWords(monthlyContribution))} Rupees</p>
                    </InputRow>
                    <InputRow label="Annual Step-Up (%)" icon={<TrendingUp />}>
                        <input type="number" value={annualStepUp} onChange={(e) => setAnnualStepUp(Number(e.target.value))} className="w-full mt-1 border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"/>
                    </InputRow>
                    <InputRow label="Contribution Period (Years)" icon={<CalendarDays />}>
                        <input type="number" value={contributionPeriod} onChange={(e) => setContributionPeriod(Number(e.target.value))} className="w-full mt-1 border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"/>
                    </InputRow>
                    <InputRow label="Expected Annual Return (%)" icon={<Percent />}>
                        <input type="number" value={expectedReturn} onChange={(e) => setExpectedReturn(Number(e.target.value))} className="w-full mt-1 border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"/>
                    </InputRow>
                     <InputRow label="Assumed Annual Inflation (%)" icon={<TrendingDown />}>
                        <input type="number" value={inflationRate} onChange={(e) => setInflationRate(Number(e.target.value))} className="w-full mt-1 border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"/>
                    </InputRow>
                </InputSection>

                {/* Insurance Inputs */}
                <InputSection title="Insurance Details">
                    <InputRow label="Term Insurance Cover Amount (₹)" icon={<ShieldCheck />}>
                        <input type="number" value={termCoverAmount} onChange={(e) => setTermCoverAmount(Number(e.target.value))} className="w-full mt-1 border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"/>
                        <p className="text-xs text-blue-600 mt-1">{capitalize(toWords(termCoverAmount))} Rupees</p>
                    </InputRow>
                    <InputRow label="Yearly Term Insurance Premium (₹)" icon={<ReceiptText />}>
                        <input type="number" value={termPremium} onChange={(e) => setTermPremium(Number(e.target.value))} className="w-full mt-1 border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"/>
                        <p className="text-xs text-blue-600 mt-1">{capitalize(toWords(termPremium))} Rupees</p>
                    </InputRow>
                     <InputRow label="Health Insurance Cover Amount (₹)" icon={<HeartPulse />}>
                        <input type="number" value={healthCoverAmount} onChange={(e) => setHealthCoverAmount(Number(e.target.value))} className="w-full mt-1 border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"/>
                        <p className="text-xs text-blue-600 mt-1">{capitalize(toWords(healthCoverAmount))} Rupees</p>
                     </InputRow>
                    <InputRow label="Yearly Health Insurance Premium (₹)" icon={<ReceiptText />}>
                        <input type="number" value={healthPremium} onChange={(e) => setHealthPremium(Number(e.target.value))} className="w-full mt-1 border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"/>
                        <p className="text-xs text-blue-600 mt-1">{capitalize(toWords(healthPremium))} Rupees</p>
                    </InputRow>
                     <InputRow label="Health Premium Increase on Renewal (%)" icon={<TrendingUp />}>
                        <input type="number" value={premiumIncreaseRate} onChange={(e) => setPremiumIncreaseRate(Number(e.target.value))} className="w-full mt-1 border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"/>
                    </InputRow>
                </InputSection>
                
                {/* Results & Breakdown */}
                <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="text-lg font-semibold text-gray-800 mb-3">Your Financial Plan Summary</h3>
                    <ResultRow label="Projected Wealth" value={formatCurrency(calculations.totalWealth)} isFinal={true} />
                    <ResultRow label="Wealth (in Today's Value)" value={formatCurrency(calculations.realValue)} isFinal={true} />
                    <ResultRow label="Total Amount Invested" value={formatCurrency(calculations.totalInvested)} />
                    <ResultRow label="Estimated Wealth Gains" value={formatCurrency(calculations.estimatedReturns)} />
                    <div className="mt-4 pt-4 border-t border-dashed">
                        <h4 className="font-semibold text-md mb-2">Initial Monthly Contribution Split:</h4>
                        <ResultRow label="For Investments (SIP)" value={formatCurrency(calculations.actualSip)} />
                        <ResultRow label="For Term Insurance" value={formatCurrency(calculations.termMonthly)} />
                        <ResultRow label="For Health Insurance" value={formatCurrency(calculations.healthMonthly)} />
                    </div>
                     <div className="mt-4 pt-4 border-t border-dashed">
                        <h4 className="font-semibold text-md mb-2">Insurance Coverage:</h4>
                        <ResultRow label="Term Insurance Cover" value={formatCurrency(termCoverAmount)} />
                        <ResultRow label="Health Insurance Cover" value={formatCurrency(healthCoverAmount)} />
                    </div>
                </div>
            </div>

            {/* --- Chart Section --- */}
            <div className="mt-10">
            <h3 className="text-xl font-bold text-center text-gray-800 mb-6">
                Wealth Growth Over Time
            </h3>
            <div className="w-full h-96">
                <ResponsiveContainer>
                <BarChart data={calculations.chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="year" label={{ value: 'Year', position: 'insideBottom', offset: -5 }} />
                    <YAxis tickFormatter={(v) => `₹${v / 100000}L`} />
                    <Tooltip formatter={(value) => formatCurrency(value)} />
                    <Legend />
                    <Bar dataKey="invested" name="Total Investment" stackId="a" fill="#000000" />
                    <Bar dataKey="wealth" name="Projected Wealth" fill="#3b82f5" />
                </BarChart>
                </ResponsiveContainer>
            </div>
            </div>

          </CardContent>
        </Card>
      </div>
    </div>
  );
}

// --- Helper Sub-components ---

const InputSection = ({ title, children }) => (
    <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-700">{title}</h3>
        {children}
    </div>
);

const InputRow = ({ label, icon, children }) => (
    <div>
        <label className="flex items-center space-x-2 text-sm font-medium text-gray-600">
            {icon && React.cloneElement(icon, { className: "h-4 w-4 text-gray-500"})}
            <span>{label}</span>
          </label>
        {children}
    </div>
);

const ResultRow = ({ label, value, isFinal = false }) => (
  <div className={`flex justify-between items-center py-1.5 ${!isFinal && 'border-b border-gray-200'}`}>
    <p className="text-sm text-gray-600">{label}</p>
    <p className={`font-semibold ${isFinal ? "text-lg text-green-700" : "text-gray-800"}`}>
      {value}
    </p>
  </div>
);
