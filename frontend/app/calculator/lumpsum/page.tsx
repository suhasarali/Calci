

// "use client";

// import React, { useState, useMemo } from "react";
// import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
// import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
// import  { NavbarHome }  from "@/components/NavbarHome";

// // --- INLINE COMPONENTS TO FIX DEPENDENCY ERRORS ---


// const BackButton = () => (
//     <button onClick={() => window.history.back()} className="mb-4 flex items-center text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">
//         <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
//         </svg>
//         Back
//     </button>
// );

// // --- ICONS ---
// const RupeeIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 3h12"/><path d="M6 8h12"/><path d="M6 13h12"/><path d="M6 18h12"/><path d="M14.5 21V3"/><path d="M8 21V3"/></svg>;
// const PercentIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="5" x2="5" y2="19"/><circle cx="6.5" cy="6.5" r="2.5"/><circle cx="17.5" cy="17.5" r="2.5"/></svg>;
// const CalendarIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>;
// const TrendingUpIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>;

// // --- HELPERS ---
// const parseCurrency = (value) => {
//     if (typeof value !== 'string') return value;
//     return Number(value.replace(/[^0-9.-]+/g,""));
// };
// const formatCurrency = (value) =>
//     new Intl.NumberFormat("en-IN", {
//       style: "currency",
//       currency: "INR",
//       maximumFractionDigits: 0,
//     }).format(value);

// // --- MAIN PAGE COMPONENT ---
// export default function LumpsumPage() {
//     const [lumpsumAmount, setLumpsumAmount] = useState(100000);
//     const [interestRate, setInterestRate] = useState(12);
//     const [investmentTenure, setInvestmentTenure] = useState(10);
//     const [inflationRate, setInflationRate] = useState(6);
//     const [showFutureValue, setShowFutureValue] = useState(false);
//     const [futureValueYear, setFutureValueYear] = useState(1);
    
//     const { primaryCalculations, yearlyData } = useMemo(() => {
//         const principal = lumpsumAmount;
//         const rate = interestRate / 100;
//         const tenure = investmentTenure;
//         const inflation = inflationRate / 100;

//         const generatedWealth = principal * Math.pow(1 + rate, tenure);
//         const inflationAdjustedWealth = generatedWealth / Math.pow(1 + inflation, tenure);
//         const totalInterest = generatedWealth - principal;

//         const data = Array.from({ length: tenure + 1 }, (_, i) => {
//             const year = i;
//             const fv = principal * Math.pow(1 + rate, year);
//             const realFv = fv / Math.pow(1 + inflation, year);
//             return { year: `Year ${year}`, 'Generated Wealth': fv, 'Inflation-Adjusted Wealth': realFv, 'Invested Amount': principal };
//         });

//         return {
//             primaryCalculations: { investedAmount: principal, generatedWealth, inflationAdjustedWealth, totalInterest },
//             yearlyData: data,
//         };
//     }, [lumpsumAmount, interestRate, investmentTenure, inflationRate]);

//     const futureValueCalculations = useMemo(() => {
//         if (!showFutureValue || futureValueYear <= 0 || futureValueYear > investmentTenure) return { futureValue: 0, inflationAdjustedFutureValue: 0 };
        
//         const principal = lumpsumAmount;
//         const rate = interestRate / 100;
//         const inflation = inflationRate / 100;
        
//         const futureValue = principal * Math.pow(1 + rate, futureValueYear);
//         const inflationAdjustedFutureValue = futureValue / Math.pow(1 + inflation, futureValueYear);
        
//         return { futureValue, inflationAdjustedFutureValue };
//     }, [lumpsumAmount, interestRate, inflationRate, showFutureValue, futureValueYear, investmentTenure]);

//     return (
//         <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
//             <NavbarHome />
//             <div className="max-w-6xl mx-auto">
//                 <Card className="bg-white shadow-xl rounded-2xl border-gray-200">
//                     <CardHeader className="border-b-2 border-gray-100 p-6">
//                         <BackButton />
//                         <CardTitle className="text-3xl font-bold text-gray-800 text-center">Lumpsum Calculator</CardTitle>
//                     </CardHeader>
//                     <CardContent className="p-6 md:p-8">
//                         <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8 mb-8">
//                             <InputWithIcon Icon={RupeeIcon} label="Lumpsum Amount (₹)" value={formatCurrency(lumpsumAmount)} onChange={(e) => { const num = parseCurrency(e.target.value); if (!isNaN(num)) setLumpsumAmount(num); }} />
//                             <InputWithIcon Icon={CalendarIcon} label="Investment Tenure (Years)" type="number" min={1} max={50} value={investmentTenure} onChange={(e) => setInvestmentTenure(Number(e.target.value))}/>
//                             <InputWithIcon Icon={PercentIcon} label="Rate of Interest (% p.a.)" type="number" min={1} max={30} step={0.5} value={interestRate} onChange={(e) => setInterestRate(Number(e.target.value))}/>
//                             <InputWithIcon Icon={TrendingUpIcon} label="Inflation Rate (% p.a.)" type="number" min={1} max={20} step={0.5} value={inflationRate} onChange={(e) => setInflationRate(Number(e.target.value))}/>
//                         </div>

//                         <SpecificYearToggle
//                             show={showFutureValue}
//                             setShow={setShowFutureValue}
//                             year={futureValueYear}
//                             setYear={setFutureValueYear}
//                             maxYear={investmentTenure}
//                         />

//                         <CalculatorResults
//                             primaryCalculations={primaryCalculations}
//                             yearlyData={yearlyData}
//                             showSpecificYear={showFutureValue}
//                             specificYear={futureValueYear}
//                             specificYearCalculations={futureValueCalculations}
//                             isSip={false}
//                         />
//                     </CardContent>
//                 </Card>
//             </div>
//         </div>
//     );
// }

// // --- SHARED UI COMPONENTS ---

// const SpecificYearToggle = ({ show, setShow, year, setYear, maxYear }) => (
//     <div className="px-6 py-4 bg-gray-50 rounded-lg border border-gray-200 mb-10">
//         <div className="flex items-center justify-between">
//             <label htmlFor="future-value-toggle" className="text-base font-medium text-gray-800">Calculate for a Specific Year?</label>
//             <ToggleSwitch checked={show} onChange={setShow} />
//         </div>
//         {show && (
//             <div className="mt-4 animate-fade-in">
//                 <InputWithIcon Icon={CalendarIcon} label="Year to Calculate For" type="number" min={1} max={maxYear} value={year} onChange={(e) => setYear(Number(e.target.value))} subText={`Must be between 1 and ${maxYear}.`}/>
//             </div>
//         )}
//     </div>
// );

// const CalculatorResults = ({ primaryCalculations, yearlyData, showSpecificYear, specificYear, specificYearCalculations, isSip }) => {
//     const specificYearData = isSip 
//         ? [["Invested Amount", specificYearCalculations.investedAmount], ["Generated Wealth", specificYearCalculations.futureValue]]
//         : [["Future Value", specificYearCalculations.futureValue]];

//     return (
//         <Tabs defaultValue="summary" className="w-full">
//             <TabsList className="grid w-full grid-cols-2 max-w-md mx-auto">
//                 <TabsTrigger value="summary">Summary</TabsTrigger>
//                 <TabsTrigger value="chart">Growth Chart</TabsTrigger>
//             </TabsList>
//             <TabsContent value="summary" className="mt-6 space-y-6">
//                 <ResultCard title="Final Investment Results" data={[["Invested Amount", primaryCalculations.investedAmount], ["Total Interest Earned", primaryCalculations.totalInterest], ["Generated Wealth (Maturity)", primaryCalculations.generatedWealth]]} finalLabel="Inflation-Adjusted Wealth" finalValue={primaryCalculations.inflationAdjustedWealth}/>
//                 {showSpecificYear && (
//                     <div className="animate-fade-in">
//                         <ResultCard title={`Results for Year ${specificYear}`} data={specificYearData} finalLabel="Inflation-Adjusted FV" finalValue={specificYearCalculations.inflationAdjustedFutureValue}/>
//                     </div>
//                 )}
//             </TabsContent>
//             <TabsContent value="chart" className="mt-6">
//                 <Card className="bg-white p-4 rounded-xl shadow-lg border border-gray-200">
//                     <div className="w-full h-96">
//                         <ResponsiveContainer>
//                             <LineChart data={yearlyData} margin={{ top: 5, right: 20, left: 30, bottom: 5 }}>
//                                 <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
//                                 <XAxis dataKey="year" />
//                                 <YAxis tickFormatter={(value) => formatCurrency(value)} domain={['dataMin', 'dataMax']} />
//                                 <Tooltip content={<CustomTooltip />} />
//                                 <Legend />
//                                 <Line type="monotone" dataKey="Generated Wealth" stroke="#10b981" strokeWidth={3} dot={false} />
//                                 <Line type="monotone" dataKey="Inflation-Adjusted Wealth" stroke="#3b82f6" strokeWidth={3} dot={false} />
//                                 <Line type="monotone" dataKey="Invested Amount" stroke="#8884d8" strokeWidth={2} strokeDasharray="5 5" dot={false} />
//                             </LineChart>
//                         </ResponsiveContainer>
//                     </div>
//                 </Card>
//             </TabsContent>
//         </Tabs>
//     );
// };

// const InputWithIcon = ({ Icon, label, subText, ...props }) => (
//     <div>
//         <label className="flex items-center text-sm font-medium text-gray-600 mb-2"><Icon /><span className="ml-2">{label}</span></label>
//         <input {...props} className="w-full mt-1 border-gray-300 rounded-lg shadow-sm p-3 text-lg font-semibold focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"/>
//         {subText && <p className="text-xs text-blue-600 mt-2">{subText}</p>}
//     </div>
// );

// const ToggleSwitch = ({ checked, onChange }) => (
//     <button type="button" className={`${checked ? 'bg-blue-600' : 'bg-gray-200'} relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2`} onClick={() => onChange(!checked)}>
//         <span className={`${checked ? 'translate-x-5' : 'translate-x-0'} pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out`}/>
//     </button>
// );

// const ResultCard = ({ title, data, finalLabel, finalValue }) => (
//   <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200 h-full">
//     <h3 className="text-xl font-bold text-center mb-5 text-gray-800">{title}</h3>
//     <div className="space-y-3">
//       {data.map(([label, value]) => (
//         <div key={label} className="flex justify-between items-center py-2 border-b border-gray-100">
//           <p className="text-gray-600 text-base">{label}</p>
//           <p className="font-semibold text-gray-900 text-lg">{formatCurrency(value)}</p>
//         </div>
//       ))}
//       <div className="flex justify-between items-center pt-4">
//           <p className="text-gray-800 text-lg font-bold">{finalLabel}</p>
//           <p className="font-bold text-2xl text-green-600">{formatCurrency(finalValue)}</p>
//       </div>
//     </div>
//   </div>
// );

// const CustomTooltip = ({ active, payload, label }) => {
//   if (active && payload && payload.length) {
//     return (
//       <div className="bg-white/80 p-4 border border-gray-300 rounded-lg shadow-lg backdrop-blur-sm">
//         <p className="label font-bold text-gray-800">{`${label}`}</p>
//         {payload.map((pld) => (
//             <p key={pld.dataKey} style={{ color: pld.color }}>
//                 {`${pld.dataKey}: ${formatCurrency(pld.value)}`}
//             </p>
//         ))}
//       </div>
//     );
//   }
//   return null;
// };


"use client";

import React, { useState, useMemo } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
// Removed Tabs imports
import BackButton from "@/components/BackButton";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { NavbarHome } from "@/components/NavbarHome";
import { ToWords } from 'to-words'; 

// --- INLINE COMPONENTS TO FIX DEPENDENCY ERRORS ---

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
const formatCurrency = (value) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(value);

// --- MAIN PAGE COMPONENT ---
export default function LumpsumPage() {
    const [lumpsumAmount, setLumpsumAmount] = useState(100000);
    const [interestRate, setInterestRate] = useState(12);
    const [investmentTenure, setInvestmentTenure] = useState(10);
    const [inflationRate, setInflationRate] = useState(6);
    const [showFutureValue, setShowFutureValue] = useState(false);
    const [futureValueYear, setFutureValueYear] = useState(1);

    const toWordsConverter = useMemo(() => new ToWords({
      localeCode: 'en-IN',
      converterOptions: {
        currency: true, // We'll add "Rupees" manually
        ignoreDecimal: true,
        ignoreZeroCurrency: true,
      }
    }), []);
    
    const { primaryCalculations, yearlyData } = useMemo(() => {
        const principal = lumpsumAmount;
        const rate = interestRate / 100;
        const tenure = investmentTenure;
        const inflation = inflationRate / 100;

        const generatedWealth = principal * Math.pow(1 + rate, tenure);
        const inflationAdjustedWealth = generatedWealth / Math.pow(1 + inflation, tenure);
        const totalInterest = generatedWealth - principal;

        const data = Array.from({ length: tenure + 1 }, (_, i) => {
            const year = i;
            const fv = principal * Math.pow(1 + rate, year);
            const realFv = fv / Math.pow(1 + inflation, year);
            return { year: `Year ${year}`, 'Generated Wealth': fv, 'Inflation-Adjusted Wealth': realFv, 'Invested Amount': principal };
        });

        return {
            primaryCalculations: { investedAmount: principal, generatedWealth, inflationAdjustedWealth, totalInterest },
            yearlyData: data,
        };
    }, [lumpsumAmount, interestRate, investmentTenure, inflationRate]);

    const futureValueCalculations = useMemo(() => {
        if (!showFutureValue || futureValueYear <= 0 || futureValueYear > investmentTenure) return { futureValue: 0, inflationAdjustedFutureValue: 0 };
        
        const principal = lumpsumAmount;
        const rate = interestRate / 100;
        const inflation = inflationRate / 100;
        
        const futureValue = principal * Math.pow(1 + rate, futureValueYear);
        const inflationAdjustedFutureValue = futureValue / Math.pow(1 + inflation, futureValueYear);
        
        return { futureValue, inflationAdjustedFutureValue };
    }, [lumpsumAmount, interestRate, inflationRate, showFutureValue, futureValueYear, investmentTenure]);

    return (
        <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
            <NavbarHome />
            <div className="max-w-6xl mt-18 mx-auto">
                <Card className="bg-white shadow-xl rounded-2xl border-gray-200">
                    <CardHeader className=" p-6">
                        <BackButton />
                        <CardTitle className="text-3xl font-bold text-blue-600 text-center">Lumpsum Calculator</CardTitle>
                    </CardHeader>
                    <CardContent className="p-6 md:p-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8 mb-8">
                            
                            {/* ✅ Updated Lumpsum Amount input to show words */}
                            <div>
                                <InputWithIcon 
                                    Icon={RupeeIcon} 
                                    label="Lumpsum Amount (₹)" 
                                    value={formatCurrency(lumpsumAmount)} 
                                    onChange={(e) => { const num = parseCurrency(e.target.value); if (!isNaN(num)) setLumpsumAmount(num); }} 
                                />
                                <p className="text-xs text-blue-600 font-semibold mt-1">
                                    {toWordsConverter.convert(lumpsumAmount)}
                                </p>
                            </div>
                            
                            <InputWithIcon Icon={CalendarIcon} label="Investment Tenure (Years)" type="number" min={1} max={50} value={investmentTenure} onChange={(e) => setInvestmentTenure(Number(e.target.value))}/>
                            <InputWithIcon Icon={PercentIcon} label="Rate of Interest (% p.a.)" type="number" min={1} max={30} step={0.5} value={interestRate} onChange={(e) => setInterestRate(Number(e.target.value))}/>
                            <InputWithIcon Icon={TrendingUpIcon} label="Inflation Rate (% p.a.)" type="number" min={1} max={20} step={0.5} value={inflationRate} onChange={(e) => setInflationRate(Number(e.target.value))}/>
                        </div>

                        <SpecificYearToggle
                            show={showFutureValue}
                            setShow={setShowFutureValue}
                            year={futureValueYear}
                            setYear={setFutureValueYear}
                            maxYear={investmentTenure}
                        />

                        <CalculatorResults
                            primaryCalculations={primaryCalculations}
                            yearlyData={yearlyData}
                            showSpecificYear={showFutureValue}
                            specificYear={futureValueYear}
                            specificYearCalculations={futureValueCalculations}
                            isSip={false}
                        />
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}

// --- SHARED UI COMPONENTS ---

const SpecificYearToggle = ({ show, setShow, year, setYear, maxYear }) => (
    <div className="px-6 py-4 bg-gray-50 rounded-lg border border-gray-200 mb-10">
        <div className="flex items-center justify-between">
            <label htmlFor="future-value-toggle" className="text-base font-medium text-gray-800">Calculate for a Specific Year?</label>
            <ToggleSwitch checked={show} onChange={setShow} />
        </div>
        {show && (
            <div className="mt-4 animate-fade-in">
                <InputWithIcon Icon={CalendarIcon} label="Year to Calculate For" type="number" min={1} max={maxYear} value={year} onChange={(e) => setYear(Number(e.target.value))} subText={`Must be between 1 and ${maxYear}.`}/>
            </div>
        )}
    </div>
);

// --- MODIFIED CalculatorResults component ---
const CalculatorResults = ({ primaryCalculations, yearlyData, showSpecificYear, specificYear, specificYearCalculations, isSip }) => {
    const specificYearData = isSip 
        ? [["Invested Amount", specificYearCalculations.investedAmount], ["Generated Wealth", specificYearCalculations.futureValue]]
        : [["Future Value", specificYearCalculations.futureValue]];

    return (
        <div className="w-full mt-6 space-y-6">
            
            {/* 1. Summary Content */}
            <ResultCard 
                title="Final Investment Results" 
                data={[
                    ["Invested Amount", primaryCalculations.investedAmount], 
                    ["Total Interest Earned", primaryCalculations.totalInterest], 
                    ["Generated Wealth (Maturity)", primaryCalculations.generatedWealth]
                ]} 
                finalLabel="Inflation-Adjusted Wealth" 
                finalValue={primaryCalculations.inflationAdjustedWealth}
            />
            
            {showSpecificYear && (
                <div className="animate-fade-in">
                    <ResultCard 
                        title={`Results for Year ${specificYear}`} 
                        data={specificYearData} 
                        finalLabel="Inflation-Adjusted FV" 
                        finalValue={specificYearCalculations.inflationAdjustedFutureValue}
                    />
                </div>
            )}

            {/* 2. Chart Content */}
            <h3 className="text-2xl font-bold text-blue-600 text-center pt-4">
                Growth Chart
            </h3>
            <Card className="bg-white p-4 rounded-xl shadow-lg border border-gray-200">
                <div className="w-full h-96">
                    <ResponsiveContainer>
                        <LineChart data={yearlyData} margin={{ top: 5, right: 20, left: 30, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                            <XAxis dataKey="year" />
                            <YAxis tickFormatter={(value) => formatCurrency(value)} domain={['dataMin', 'dataMax']} />
                            <Tooltip content={<CustomTooltip />} />
                            <Legend 
                                            verticalAlign="bottom" 
                                            align="center"
                                            wrapperStyle={{
                                              paddingTop: '20px', // Space between chart and legend
                                              fontSize: '16px',  // Smaller font for legend
                                              width: '100%',
                                            }}
                                          />
                            <Line type="monotone" dataKey="Generated Wealth" stroke="#10b981" strokeWidth={3} dot={false} />
                            <Line type="monotone" dataKey="Inflation-Adjusted Wealth" stroke="#3b82f6" strokeWidth={3} dot={false} />
                            
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </Card>
        </div>
    );
};

const InputWithIcon = ({ Icon, label, subText, ...props }) => (
    <div>
        <label className="flex items-center text-sm font-medium text-gray-600 mb-2"><Icon /><span className="ml-2">{label}</span></label>
        <input {...props} className="w-full mt-1 border-gray-300 rounded-lg shadow-sm p-3 text-lg font-semibold focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"/>
        {subText && <p className="text-xs text-blue-600 mt-2">{subText}</p>}
    </div>
);

const ToggleSwitch = ({ checked, onChange }) => (
    <button type="button" className={`${checked ? 'bg-blue-600' : 'bg-gray-200'} relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2`} onClick={() => onChange(!checked)}>
        <span className={`${checked ? 'translate-x-5' : 'translate-x-0'} pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out`}/>
    </button>
);

const ResultCard = ({ title, data, finalLabel, finalValue }) => (
  <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200 h-full">
    <h3 className="text-xl font-bold text-center mb-5 text-gray-800">{title}</h3>
    <div className="space-y-3">
      {data.map(([label, value]) => (
        <div key={label} className="flex justify-between items-center py-2 border-b border-gray-100">
          <p className="text-gray-600 text-base">{label}</p>
          <p className="font-semibold text-gray-900 text-lg">{formatCurrency(value)}</p>
        </div>
      ))}
      <div className="flex justify-between items-center pt-4">
          <p className="text-gray-800 text-lg font-bold">{finalLabel}</p>
          <p className="font-bold text-2xl text-green-600">{formatCurrency(finalValue)}</p>
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