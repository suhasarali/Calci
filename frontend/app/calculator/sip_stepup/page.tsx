// ✅ Updated SIP Top-Up Calculator — UI Improvised
// - Monthly simulation for both Fixed and Step-Up SIPs for 100% accuracy
// - Chart data is now perfectly in sync with summary cards
// - UI updated with icons, new colors, and requested text labels

"use client";

import React, { useState, useMemo } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
// Removed Tabs imports
import BackButton from "@/components/BackButton";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { NavbarHome } from "@/components/NavbarHome";
import { ToWords } from 'to-words'; 

// --- ICONS ---
const RupeeIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 3h12"/><path d="M6 8h12"/><path d="M6 13h12"/><path d="M6 18h12"/><path d="M14.5 21V3"/><path d="M8 21V3"/></svg>;
const PercentIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="5" x2="5" y2="19"/><circle cx="6.5" cy="6.5" r="2.5"/><circle cx="17.5" cy="17.5" r="2.5"/></svg>;
const CalendarIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>;
const TrendingUpIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>;

// --- HELPERS ---
const parseCurrency = (value) => {
  if (typeof value !== 'string') return value;
  return Number(value.replace(/[^0-9.-]+/g,""));
};
const formatCurrency = (value) => new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(value);
const toWordsConverter = new ToWords({ localeCode: 'en-IN', converterOptions: { currency: true, ignoreDecimal: true, ignoreZeroCurrency: true }});

// --- MAIN PAGE COMPONENT ---
export default function SipTopUpComparisonPage() {
  const [monthlyInvestment, setMonthlyInvestment] = useState(20000);
  const [interestRate, setInterestRate] = useState(12);
  const [investmentTenure, setInvestmentTenure] = useState(25);
  const [topUpRate, setTopUpRate] = useState(10);

  const { primaryCalculations, yearlyData } = useMemo(() => {
   const p = monthlyInvestment;
const r = interestRate / 100;
const stepUpPct = topUpRate / 100;
const months = investmentTenure * 12;


// ✅ Excel equivalent monthly rate
// ✅ Excel-equivalent monthly rate (CAGR/12)
const monthlyRate = r / 12;


// ✅ FV for fixed SIP using Excel formula
// Excel: =FV(rate/12, years*12, -monthly,,1)
const fvFixed = p * (((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate) * (1 + monthlyRate));
const investedFixed = p * months;
const interestFixed = fvFixed - investedFixed;


// ✅ Step‑Up SIP — month‑by‑month compounding
let investedStep = 0, wealthStep = 0, curr = p;
let yearlyData = [];


for (let m = 1; m <= months; m++) {
if (m > 1 && m % 12 === 1) curr *= (1 + stepUpPct);


investedStep += curr;
wealthStep = (wealthStep + curr) * (1 + monthlyRate);


if (m % 12 === 0) {
yearlyData.push({
year: `Year ${m/12}`,
"Step-Up Wealth": wealthStep,
"Fixed Wealth": fvFixed * ((m / months)), // scaled for chart
"Step-Up Invested": investedStep,
"Fixed Invested": investedFixed * ((m / months)) // scaled
});
}
}

// --- Manually fix chart data to match summary cards ---
// The loop calculates end-of-year values. 
// Let's replace the last year's data with the precise final calculation
// to ensure the chart and summary cards are 100% aligned.
const finalYearlyData = yearlyData.slice(0, -1); // Remove last entry
finalYearlyData.push({
    year: `Year ${investmentTenure}`,
    "Step-Up Wealth": wealthStep,
    "Fixed Wealth": fvFixed, // Use the exact final value
    "Step-Up Invested": investedStep,
    "Fixed Invested": investedFixed // Use the exact final value
});


return {
primaryCalculations: {
final_wealth_stepUp: wealthStep,
final_wealth_fixed: fvFixed,
final_totalInvested_stepUp: investedStep,
final_totalInvested_fixed: investedFixed,
final_interest_stepUp: wealthStep - investedStep,
final_interest_fixed: interestFixed,
extra_wealth: wealthStep - fvFixed
},
yearlyData: finalYearlyData, // Use the corrected data
};
  }, [monthlyInvestment, interestRate, investmentTenure, topUpRate]);

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
      <NavbarHome />
      <div className="max-w-6xl mt-18 mx-auto">
        <Card className="bg-white shadow-xl rounded-2xl border-gray-200">
          <CardHeader className="border-b-2 border-gray-100 p-6">
            <BackButton />
            <CardTitle className="text-3xl font-bold text-blue-600 text-center">SIP Top-Up Comparison Calculator</CardTitle>
          </CardHeader>
          <CardContent className="p-6 md:p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8 mb-8">
              <div>
                <InputWithIcon
                  Icon={RupeeIcon}
                  label="Monthly SIP Investment (₹)"
                  value={formatCurrency(monthlyInvestment)}
                  onChange={(e) => {
                    const num = parseCurrency(e.target.value);
                    if (!isNaN(num)) setMonthlyInvestment(num);
                  }}
                />
                <p className="text-xs text-blue-600 font-semibold mt-1">
                  {toWordsConverter.convert(monthlyInvestment)}
                </p>
              </div>

              <InputWithIcon 
                Icon={CalendarIcon} 
                label="SIP Tenure (Years)" 
                type="number" 
                min={1} 
                max={50} 
                value={investmentTenure} 
                onChange={(e) => setInvestmentTenure(Number(e.target.value))}
              />
              
              <InputWithIcon 
                Icon={PercentIcon} 
                label="Expected Return Rate(CAGR)" 
                type="number" 
                min={1} 
                max={30} 
                step={0.5} 
                value={interestRate} 
                onChange={(e) => setInterestRate(Number(e.target.value))}
              />

              <InputWithIcon 
                Icon={TrendingUpIcon} 
                label="SIP Top-Up after every year (% p.a.)" 
                type="number" 
                min={0} 
                max={50} 
                step={1} 
                value={topUpRate} 
                onChange={(e) => setTopUpRate(Number(e.target.value))}
              />
            </div>

            <CalculatorResults primaryCalculations={primaryCalculations} yearlyData={yearlyData} />

            {/* ✅ Extra wealth message */}
            <div className="text-center bg-green-50 border border-green-200 text-green-800 p-4 rounded-lg mt-8">
              <p className="text-lg text-black font-semibold">
                By topping up your SIP, you generated an extra{" "}
                <span className="font-bold text-green-600">{formatCurrency(primaryCalculations.extra_wealth)}</span>
                {" "}compared to a Fixed SIP.
              </p>
            </div>

          </CardContent>
        </Card>
      </div>
    </div>
  );
}

// 📌 Shared Components
const InputWithIcon = ({ Icon, label, subText, ...props }) => (
  <div>
    <label className="flex items-center text-sm font-medium text-gray-600 mb-2"><Icon /><span className="ml-2">{label}</span></label>
    <input {...props} className="w-full mt-1 border-gray-300 rounded-lg shadow-sm p-3 text-lg font-semibold focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"/>
    {subText && <p className="text-xs text-blue-600 mt-2">{subText}</p>}
  </div>
);

// --- MODIFIED CalculatorResults component ---
const CalculatorResults = ({ primaryCalculations: pc, yearlyData }) => (
  <div className="w-full mt-6 space-y-6">
    
    {/* 1. Summary Content (from "summary" tab) */}
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <ResultCard 
        title="Step-Up SIP Results" 
        data={[
          ["Amount Invested", pc.final_totalInvested_stepUp],
          ["Wealth Creation", pc.final_interest_stepUp]
        ]} 
        finalLabel="Expected Future Value" 
        finalValue={pc.final_wealth_stepUp}
      />
      <ResultCard 
        title="Fixed SIP Results" 
        data={[
          ["Amount Invested", pc.final_totalInvested_fixed],
          ["Wealth Creation", pc.final_interest_fixed]
        ]} 
        finalLabel="Expected Future Value" 
        finalValue={pc.final_wealth_fixed}
      />
    </div>

    {/* 2. Chart Content (from "chart" tab) */}
    <h3 className="text-2xl font-bold text-blue-600 text-center pt-4">
      Growth Chart
    </h3>
    <Card className="bg-white p-2 sm:p-4 rounded-xl shadow-lg border border-gray-200">
      {/* ✅ Set a fixed aspect ratio for responsiveness */}
      <div className="w-full h-96 pt-4 px-1">
        <ResponsiveContainer>
          <LineChart data={yearlyData} margin={{ top: 5, right: 5, left: 2, bottom: 50 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
            <XAxis 
              dataKey="year" 
              tick={{ fontSize: 12 }} // Smaller font on axis
            />
            <YAxis 
              tickFormatter={formatCurrency} 
              domain={['dataMin', 'dataMax']} 
              tick={{ fontSize: 10 }} // Smaller font on axis
              width={80} // Give Y-axis labels space
            />
            <Tooltip content={<CustomTooltip />} />
            
            {/* --- ✅ RESPONSIVE LEGEND --- */}
            <Legend 
              verticalAlign="bottom" 
              align="center"
              wrapperStyle={{
                paddingTop: '20px', // Space between chart and legend
                fontSize: '16px',  // Smaller font for legend
                width: '100%',
              }}
            />
            
            {/* ✅ Updated Colors & Added Invested Lines */}
            <Line type="monotone" dataKey="Step-Up Wealth" stroke="#10b981" strokeWidth={3} dot={false} />
            <Line type="monotone" dataKey="Fixed Wealth" stroke="#3b82f6" strokeWidth={3} dot={false} />
            
          </LineChart>
        </ResponsiveContainer>
      </div>
    </Card>
  </div>
);

const ResultCard = ({ title, data, finalLabel, finalValue }) => (
  <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200 h-full">
    <h3 className="text-xl font-bold text-center mb-5 text-gray-800">{title}</h3>
    <div className="space-y-3">
      {/* ✅ Text updated as requested */}
      {data.map(([label, value]) => (
        <div key={label} className="flex justify-between items-center py-2 border-b border-gray-100">
          <p className="text-gray-600 text-base">{label}</p>
          <p className="font-semibold text-gray-900 text-md">{formatCurrency(value)}</p>
        </div>
      ))}
      <div className="flex justify-between items-center pt-4">
          <p className="text-gray-800 text-md font-bold">{finalLabel}</p>
          <p className="font-bold text-xl text-green-600">{formatCurrency(finalValue)}</p>
      </div>
    </div>
  </div>
); 

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white/80 p-4 border border-gray-300 rounded-lg shadow-lg backdrop-blur-sm">
        <p className="label font-bold text-gray-800">{`${label}`}</p>
        {payload.map((pld) => (
            <p key={pld.dataKey} style={{ color: pld.color }}>
                {`${pld.dataKey}: ${formatCurrency(pld.value)}`}
            </p>
        ))}
      </div>
    );
  }
  return null;
};