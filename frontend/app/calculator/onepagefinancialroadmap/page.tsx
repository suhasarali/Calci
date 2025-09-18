// "use client";

// import React, { useMemo, useState, useEffect } from "react";
// import { motion, AnimatePresence } from "framer-motion";
// import { ChevronDown, Plus, Trash2, Pencil, Save, Calculator, Info, Target, TrendingUp, ShieldCheck, CheckCircle, HeartPulse, UserCheck, PiggyBank, Briefcase } from "lucide-react";
// import { NavbarDemo } from "@/components/Navbar";
// import Footer4Col from "@/components/footer-column";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
// import { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from "@/components/ui/tooltip";


// // --- TYPE DEFINITIONS ---
// type Goal = { 
//   id: string; 
//   name: string; 
//   currentCost: number | string; 
//   years: number | string; 
//   inflation: number | string; 
//   canInvestNow: number | string; 
//   expectedReturn: number | string; 
// };

// // --- HELPER & UTILITY FUNCTIONS ---
// const number = (n: number) => (isFinite(n) ? n : 0);
// const currency = (n: number) => n.toLocaleString("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 });

// // --- UI COMPONENTS ---

// function Section({ title, children, defaultOpen = true, isComplete = false }: { title: string; children: React.ReactNode; defaultOpen?: boolean, isComplete?: boolean }) {
//   const [open, setOpen] = useState<boolean>(defaultOpen);
//   return (
//     <motion.div layout className="bg-white/50 backdrop-blur-sm rounded-xl shadow-md border mb-6">
//       <button onClick={() => setOpen((o) => !o)} className="w-full flex items-center justify-between px-6 py-4 text-left">
//         <div className="flex items-center gap-3">
//           <span className="text-xl font-semibold text-gray-800">{title}</span>
//           {!open && isComplete && (
//             <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.2 }}>
//               <CheckCircle className="w-6 h-6 text-green-500" />
//             </motion.div>
//           )}
//         </div>
//         <motion.span animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.2 }}>
//           <ChevronDown className="w-6 h-6 text-gray-800" />
//         </motion.span>
//       </button>
//       <AnimatePresence initial={false}>
//         {open && (
//           <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
//             <div className="px-6 pb-6 border-t border-gray-200/80 pt-4">
//               {children}
//             </div>
//           </motion.div>
//         )}
//       </AnimatePresence>
//     </motion.div>
//   );
// }

// type LabeledInputProps = { label: string; value: string | number; onChange: (v: string) => void; info: string; placeholder?: string };

// const LabeledInputLayout = ({ label, info, children }: {label: string; info: string; children: React.ReactNode}) => (
//     <div className="grid grid-cols-2 items-center gap-4">
//         <label htmlFor={label} className="flex items-center gap-2 text-sm text-gray-700 whitespace-nowrap">
//             {label} <span className="text-red-500">*</span>
//             <Tooltip>
//                 <TooltipTrigger asChild><button type="button" className="focus:outline-none"><Info className="w-3.5 h-3.5 text-gray-400 hover:text-gray-600"/></button></TooltipTrigger>
//                 <TooltipContent><p className="max-w-xs">{info}</p></TooltipContent>
//             </Tooltip>
//         </label>
//         {children}
//     </div>
// );

// function LabeledNumber({ label, value, onChange, info, placeholder = "e.g. 35" }: LabeledInputProps) {
//   return (
//     <LabeledInputLayout label={label} info={info}>
//         <Input id={label} type="number" value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} />
//     </LabeledInputLayout>
//   );
// }

// function LabeledAmount({ label, value, onChange, info, placeholder = "e.g. 50000" }: LabeledInputProps) {
//     return (
//         <LabeledInputLayout label={label} info={info}>
//             <Input id={label} type="number" value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder}/>
//         </LabeledInputLayout>
//     );
// }

// function LabeledPercent({ label, value, onChange, info, placeholder = "e.g. 12" }: LabeledInputProps) {
//   return (
//     <LabeledInputLayout label={label} info={info}>
//         <div className="flex items-center gap-2">
//             <Input id={label} type="number" value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder}/>
//             <span className="text-sm text-gray-500">%</span>
//         </div>
//     </LabeledInputLayout>
//   );
// }

// const TableHeaderWithTooltip = ({ children, info }: { children: React.ReactNode; info: string }) => (
//     <TableHead>
//         <div className="flex items-center gap-1.5">
//             {children}
//             <Tooltip>
//                 <TooltipTrigger asChild><button type="button" className="focus:outline-none"><Info className="w-3.5 h-3.5 text-gray-400 hover:text-gray-600"/></button></TooltipTrigger>
//                 <TooltipContent><p className="max-w-xs">{info}</p></TooltipContent>
//             </Tooltip>
//         </div>
//     </TableHead>
// );

// // --- MAIN PAGE COMPONENT ---
// export default function OnePageFinancialRoadmap() {
//   const [yourAge, setYourAge] = useState<string>("");
//   const [spouseAge, setSpouseAge] = useState<string>("");
//   const [retirementAge, setRetirementAge] = useState<string>("");
//   const [lifeExpectancySelf, setLifeExpectancySelf] = useState<string>("");
//   const [lifeExpectancySpouse, setLifeExpectancySpouse] = useState<string>("");
//   const [monthlyExpenses, setMonthlyExpenses] = useState<string>("");
//   const [otherMonthlyExpenses, setOtherMonthlyExpenses] = useState<string>("");
//   const [retPre, setRetPre] = useState<string>("");
//   const [retPost, setRetPost] = useState<string>("");
//   const [inflation, setInflation] = useState<string>("");
//   const [lumpsumNow, setLumpsumNow] = useState<string>("");
//   const [claimReturn, setClaimReturn] = useState<string>("");
//   const [existingLifeCover, setExistingLifeCover] = useState<string>("");
//   const [requiredHealthCover, setRequiredHealthCover] = useState<string>("");
//   const [currentHealthCover, setCurrentHealthCover] = useState<string>("");
//   const [emergencyMonths, setEmergencyMonths] = useState<string>("");
  
//   const [goals, setGoals] = useState<Goal[]>([]);
//   const [editingId, setEditingId] = useState<string | null>(null);

//   const addGoal = () => {
//     const g: Goal = { id: Math.random().toString(36).slice(2), name: "", currentCost: "", years: "", inflation: "", canInvestNow: "", expectedReturn: "", };
//     setGoals((prev) => [...prev, g]);
//     setEditingId(g.id);
//   };
//   const removeGoal = (id: string) => setGoals((prev) => prev.filter((g) => g.id !== id));
//   const updateGoal = (id: string, patch: Partial<Goal>) => setGoals((prev) => prev.map((g) => (g.id === id ? { ...g, ...patch } : g)));

//   const isPersonalDetailsComplete = Number(yourAge) > 0 && Number(spouseAge) > 0 && Number(retirementAge) > 0 && Number(lifeExpectancySelf) > 0 && Number(lifeExpectancySpouse) > 0;
//   const isHouseholdComplete = Number(monthlyExpenses) > 0;
//   const isRetirementComplete = Number(retPre) > 0 && Number(retPost) > 0 && Number(inflation) > 0 && Number(lumpsumNow) >= 0;
//   const isLifeInsuranceComplete = Number(claimReturn) > 0 && Number(existingLifeCover) >= 0;
//   const isHealthInsuranceComplete = Number(requiredHealthCover) > 0 && Number(currentHealthCover) >= 0;
//   const isEmergencyComplete = Number(emergencyMonths) > 0;

//   // --- Financial Calculations (Memoized for performance) ---
//   const pow = (r: number, n: number) => Math.pow(1 + r, n);
//   const fv = (pv: number, ratePct: number, years: number) => number(pv * pow(ratePct / 100, years));
//   const pv = (fv_val: number, ratePct: number, years: number) => number(fv_val / pow(ratePct / 100, years));

//   const goalsWithCalc = useMemo(() => {
//     return goals.map((g) => {
//       const futureValue = fv(Number(g.currentCost), Number(g.inflation), Number(g.years));
//       const r = Number(g.expectedReturn) / 100 / 12;
//       const n = Number(g.years) * 12;
//       const lumpsumFvForGoal = fv(Number(g.canInvestNow), Number(g.expectedReturn), Number(g.years));
//       const fvNeededFromSip = futureValue - lumpsumFvForGoal;
//       const sip = r === 0 || n === 0 ? fvNeededFromSip / (n || 1) : fvNeededFromSip * (r / (pow(1 + r, n) - 1));
//       return { ...g, futureValue, sipRequired: Math.max(0, sip) } as Goal & { futureValue: number; sipRequired: number };
//     });
//   }, [goals]);

//   const calculations = useMemo(() => {
//     const retirementYears = Math.max(0, Number(retirementAge) - Number(yourAge));
//     const monthlyTotalExpenseToday = Number(monthlyExpenses) + Number(otherMonthlyExpenses);
//     const totalGoalsSip = goalsWithCalc.reduce((s, g) => s + g.sipRequired, 0);
    
//     const postRetYears = Math.max(0, Number(lifeExpectancySelf) - Number(retirementAge));
//     const monthlyExpenseAtRetirement = fv(monthlyTotalExpenseToday, Number(inflation), retirementYears);
//     const yearlyExpenseAtRetirement = monthlyExpenseAtRetirement * 12;
//     const realRatePost = (1 + Number(retPost) / 100) / (1 + Number(inflation) / 100) - 1;
//     const retirementCorpusRequired = realRatePost <= 0 ? number(yearlyExpenseAtRetirement * postRetYears) : number((yearlyExpenseAtRetirement / realRatePost) * (1 - pow(1 + realRatePost, -postRetYears)) * (1 + realRatePost));

//     const rSip = Number(retPre) / 100 / 12;
//     const nSip = retirementYears * 12;
//     const lumpsumFvAtRetirement = fv(Number(lumpsumNow), Number(retPre), retirementYears);
//     const corpusNeededViaSip = Math.max(0, retirementCorpusRequired - lumpsumFvAtRetirement);
//     const retirementSIP = rSip === 0 || nSip === 0 ? corpusNeededViaSip / (nSip || 1) : corpusNeededViaSip * (rSip / (pow(1 + rSip, nSip) - 1));

//     const pvOfRetirementCorpus = pv(retirementCorpusRequired, Number(claimReturn), retirementYears);
//     const pvOfGoals = goalsWithCalc.reduce((acc, goal) => acc + pv(goal.futureValue, Number(claimReturn), goal.years as number), 0);
//     const requiredLifeCover = pvOfRetirementCorpus + pvOfGoals;
//     const additionalLifeCover = requiredLifeCover - Number(existingLifeCover);

//     const additionalHealthCover = Number(requiredHealthCover) - Number(currentHealthCover);
//     const emergencyFundRequired = monthlyTotalExpenseToday * Number(emergencyMonths);
//     const totalRequiredSIP = retirementSIP + totalGoalsSip;

//     return { requiredLifeCover, additionalLifeCover, additionalHealthCover, emergencyFundRequired, retirementCorpusRequired, retirementSIP, totalRequiredSIP };
//   }, [yourAge, spouseAge, retirementAge, lifeExpectancySelf, monthlyExpenses, otherMonthlyExpenses, retPre, retPost, inflation, lumpsumNow, claimReturn, existingLifeCover, requiredHealthCover, currentHealthCover, emergencyMonths, goalsWithCalc]);

//   const [submitting, setSubmitting] = useState<boolean>(false);
//   const [showReport, setShowReport] = useState<boolean>(false);
//   const [reportData, setReportData] = useState(calculations);

//   const handleReset = () => {
//     setYourAge("");
//     setSpouseAge("");
//     setRetirementAge("");
//     setLifeExpectancySelf("");
//     setLifeExpectancySpouse("");
//     setMonthlyExpenses("");
//     setOtherMonthlyExpenses("");
//     setRetPre("");
//     setRetPost("");
//     setInflation("");
//     setLumpsumNow("");
//     setClaimReturn("");
//     setExistingLifeCover("");
//     setRequiredHealthCover("");
//     setCurrentHealthCover("");
//     setEmergencyMonths("");
//     setGoals([]);
//   };

//   const handleSubmit = async () => {
//     setSubmitting(true);
//     setReportData(calculations);
//     await new Promise((res) => setTimeout(res, 1200));
//     setSubmitting(false);
//     setShowReport(true);
//     document.getElementById("report-section")?.scrollIntoView({ behavior: 'smooth' });
//     handleReset();
//   };
  
//   return (
//     <TooltipProvider>
//       <div className="min-h-screen bg-gray-50 text-gray-800 py-6 ">
//         <NavbarDemo />

//         <div className="max-w-5xl mx-auto px-4 py-8 md:py-16">
//           <motion.div initial={{opacity: 0, y: 20}} animate={{opacity: 1, y: 0}} transition={{duration: 0.5}} className="text-center mb-12">
//             <h1 className="text-4xl md:text-5xl font-bold mb-4 text-gray-800">Your One-Page Financial Roadmap</h1>
//             <p className="text-lg text-gray-600 max-w-2xl mx-auto">
//                 No more guesswork. Input your details to generate a clear, actionable financial plan in seconds.
//             </p>
//           </motion.div>

//           <Section title="Section 1: Personal Details" defaultOpen isComplete={isPersonalDetailsComplete}>
//             <Card className={`transition-all border-2 ${isPersonalDetailsComplete ? 'border-green-400' : 'border-transparent'}`}>
//                 <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6 pt-6">
//                     <LabeledNumber label="Your age:" value={yourAge} onChange={setYourAge} info="Your current age in years."/>
//                     <LabeledNumber label="Spouse's age:" value={spouseAge} onChange={setSpouseAge} info="Your spouse's current age. If not applicable, enter your age."/>
//                     <LabeledNumber label="Retirement age:" value={retirementAge} onChange={setRetirementAge} info="The age you plan to retire." placeholder="e.g. 60"/>
//                     <LabeledNumber label="Life expectancy (self):" value={lifeExpectancySelf} onChange={setLifeExpectancySelf} info="The age you expect to live to." placeholder="e.g. 85"/>
//                     <LabeledNumber label="Life expectancy (spouse):" value={lifeExpectancySpouse} onChange={setLifeExpectancySpouse} info="The age you expect your spouse to live to." placeholder="e.g. 85"/>
//                 </CardContent>
//             </Card>
//           </Section>

//           <Section title="Section 2: Financial Details" defaultOpen isComplete={isHouseholdComplete && isRetirementComplete && isLifeInsuranceComplete && isHealthInsuranceComplete && isEmergencyComplete}>
//             <div className="space-y-6">
//               <Card className={`transition-all ${isHouseholdComplete ? 'border-t-4 border-green-500' : ''}`}>
//                 <CardHeader><CardTitle className="text-base font-semibold">Household Expenses</CardTitle></CardHeader>
//                 <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                   <LabeledAmount label="Monthly expenses:" value={monthlyExpenses} onChange={setMonthlyExpenses} info="Your core monthly household expenses (rent, utilities, groceries, etc.)." />
//                   <LabeledAmount label="Other monthly expenses:" value={otherMonthlyExpenses} onChange={setOtherMonthlyExpenses} info="Include other regular monthly costs like EMIs, school fees, etc." placeholder="e.g. 10000" />
//                 </CardContent>
//               </Card>

//               <Card className={`transition-all ${isRetirementComplete ? 'border-t-4 border-green-500' : ''}`}>
//                 <CardHeader><CardTitle className="text-base font-semibold">Retirement & Inflation</CardTitle></CardHeader>
//                 <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                   <LabeledPercent label="Return (pre-retirement):" value={retPre} onChange={setRetPre} info="Annual % return you expect on your investments until you retire." placeholder="e.g. 15"/>
//                   <LabeledPercent label="Return (post-retirement):" value={retPost} onChange={setRetPost} info="Annual % return you expect on your investments after you retire."/>
//                   <LabeledPercent label="Assumed inflation:" value={inflation} onChange={setInflation} info="The average annual inflation rate you expect over the long term (e.g., 5-6%)." placeholder="e.g. 6"/>
//                   <LabeledAmount label="Lumpsum for retirement:" value={lumpsumNow} onChange={setLumpsumNow} info="Any one-time amount you can invest for retirement right now." placeholder="e.g. 500000"/>
//                 </CardContent>
//               </Card>

//               <Card className={`transition-all ${isLifeInsuranceComplete ? 'border-t-4 border-green-500' : ''}`}>
//                 <CardHeader><CardTitle className="text-base font-semibold">Life Insurance</CardTitle></CardHeader>
//                 <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                     <LabeledAmount label="Existing Life Cover + Assets:" value={existingLifeCover} onChange={setExistingLifeCover} info="Total sum assured from all your existing life insurance policies plus any existing financial assets." placeholder="e.g. 5000000"/>
//                     <LabeledPercent label="Return on claim proceeds:" value={claimReturn} onChange={setClaimReturn} info="The annual % return you expect your family could earn by investing the insurance payout." placeholder="e.g. 8"/>
//                 </CardContent>
//               </Card>

//               <Card className={`transition-all ${isHealthInsuranceComplete && isEmergencyComplete ? 'border-t-4 border-green-500' : ''}`}>
//                 <CardHeader><CardTitle className="text-base font-semibold">Health Insurance & Emergency Fund</CardTitle></CardHeader>
//                 <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                     <LabeledAmount label="Required Health Cover:" value={requiredHealthCover} onChange={setRequiredHealthCover} info="The ideal total health cover you should have for your family." placeholder="e.g. 1000000" />
//                     <LabeledAmount label="Current Health Cover:" value={currentHealthCover} onChange={setCurrentHealthCover} info="The total coverage of your existing health insurance policy." placeholder="e.g. 500000" />
//                     <LabeledNumber label="Emergency fund (months):" value={emergencyMonths} onChange={setEmergencyMonths} info="How many months of expenses you want to keep as an emergency fund (e.g., 6 months)." placeholder="e.g. 6"/>
//                 </CardContent>
//               </Card>
//             </div>
//           </Section>

//           <Section title="Section 3: Financial Goals" defaultOpen>
//               <Table>
//                 <TableCaption>Add and manage your life's financial goals (optional).</TableCaption>
//                 <TableHeader>
//                   <TableRow>
//                     <TableHeaderWithTooltip info="Give your goal a name (e.g., 'Child's Education').">Goal Name</TableHeaderWithTooltip>
//                     <TableHeaderWithTooltip info="How much would this goal cost if you had to pay for it today?">Current Cost</TableHeaderWithTooltip>
//                     <TableHeaderWithTooltip info="In how many years from now do you need the money?">Years</TableHeaderWithTooltip>
//                     <TableHeaderWithTooltip info="Expected annual cost increase for this goal.">Inflation</TableHeaderWithTooltip>
//                     <TableHeaderWithTooltip info="Expected annual return from investments for this goal.">Return</TableHeaderWithTooltip>
//                     <TableHead>Future Value</TableHead>
//                     <TableHeaderWithTooltip info="Any one-time amount you can invest for this goal now.">Invest Now</TableHeaderWithTooltip>
//                     <TableHead>Monthly SIP</TableHead>
//                     <TableHead className="text-right">Actions</TableHead>
//                   </TableRow>
//                 </TableHeader>
//                 <TableBody>
//                   {goalsWithCalc.map((g) => {
//                     const isEditing = editingId === g.id
//                     return (
//                       <TableRow key={g.id}>
//                         <TableCell><Input placeholder="e.g. Vacation" value={g.name} onChange={(e) => updateGoal(g.id, { name: e.target.value })} /></TableCell>
//                         <TableCell><Input type="number" placeholder="e.g. 500000" value={g.currentCost} onChange={(e) => updateGoal(g.id, { currentCost: e.target.value })} /></TableCell>
//                         <TableCell><Input type="number" placeholder="e.g. 3" value={g.years} onChange={(e) => updateGoal(g.id, { years: e.target.value })} /></TableCell>
//                         <TableCell><Input type="number" placeholder="e.g. 7" value={g.inflation} onChange={(e) => updateGoal(g.id, { inflation: e.target.value })} /></TableCell>
//                         <TableCell><Input type="number" placeholder="e.g. 12" value={g.expectedReturn} onChange={(e) => updateGoal(g.id, { expectedReturn: e.target.value })} /></TableCell>
//                         <TableCell className="font-medium">{currency(g.futureValue)}</TableCell>
//                         <TableCell><Input type="number" placeholder="e.g. 100000" value={g.canInvestNow} onChange={(e) => updateGoal(g.id, { canInvestNow: e.target.value })} /></TableCell>
//                         <TableCell className="font-semibold text-purple-700">{currency(g.sipRequired)}</TableCell>
//                         <TableCell className="text-right space-x-2">
//                            <Button size="icon" variant="outline" onClick={() => isEditing ? setEditingId(null) : setEditingId(g.id)}>
//                                 {isEditing ? <CheckCircle className="w-4 h-4 text-green-600"/> : <Pencil className="w-4 h-4" />}
//                            </Button>
//                            <Button size="icon" variant="destructive" onClick={() => removeGoal(g.id)}><Trash2 className="w-4 h-4" /></Button>
//                         </TableCell>
//                       </TableRow>
//                     )
//                   })}
//                 </TableBody>
//               </Table>
//               <Button onClick={addGoal} className="mt-4"><Plus className="w-4 h-4 mr-2" /> Add Goal</Button>
//           </Section>

//           <div className="flex justify-center mt-8">
//             <Button onClick={handleSubmit} disabled={submitting} size="lg" className="bg-purple-700 hover:bg-purple-800 text-lg px-8 py-6 rounded-full shadow-lg">
//               {submitting ? (<><Calculator className="w-5 h-5 mr-2 animate-spin" /> Calculating...</>) : "Calculate My Roadmap"}
//             </Button>
//           </div>
//         </div>
        
//         <AnimatePresence>
//             {showReport && (
//                 <motion.div 
//                     id="report-section"
//                     initial={{ opacity: 0, y: 50 }}
//                     animate={{ opacity: 1, y: 0 }}
//                     exit={{ opacity: 0, y: 50 }}
//                     transition={{ duration: 0.5, ease: "easeOut" }}
//                     className="bg-white py-12"
//                 >
//                     <div className="max-w-5xl mx-auto px-4">
//                         <Card className="bg-white border-none shadow-none">
//                             <CardHeader className="text-center">
//                                 <CardTitle className="text-3xl font-bold">Your Financial Roadmap</CardTitle>
//                                 <p className="text-gray-600">Here's the detailed breakdown based on your inputs.</p>
//                             </CardHeader>
//                             <CardContent className="mt-6 space-y-8">
                                
//                                 <div className="p-6 bg-gray-50 rounded-lg">
//                                     <div className="flex items-center gap-3 mb-4"><UserCheck className="w-8 h-8 text-blue-600"/><h3 className="text-xl font-semibold">Life Insurance</h3></div>
//                                     <div className="space-y-2 text-lg">
//                                         <div className="flex justify-between items-center"><span>Required Life Cover:</span><span className="font-bold text-gray-700 text-2xl">{currency(reportData.requiredLifeCover)}</span></div>
//                                         <div className="flex justify-between items-center pt-2 border-t"><span className="text-blue-600">Required Additional Cover:</span><span className="font-bold text-blue-600 text-2xl">{currency(reportData.additionalLifeCover)}</span></div>
//                                     </div>
//                                 </div>

//                                 <div className="p-6 bg-gray-50 rounded-lg">
//                                     <div className="flex items-center gap-3 mb-4"><HeartPulse className="w-8 h-8 text-red-600"/><h3 className="text-xl font-semibold">Health Insurance</h3></div>
//                                     <div className="space-y-2 text-lg">
//                                         <div className="flex justify-between items-center"><span className="text-red-600">Additional Cover Needed:</span><span className="font-bold text-red-600 text-2xl">{currency(reportData.additionalHealthCover)}</span></div>
//                                     </div>
//                                 </div>
                                
//                                 <div className="p-6 bg-gray-50 rounded-lg">
//                                     <div className="flex items-center gap-3 mb-4"><ShieldCheck className="w-8 h-8 text-green-600"/><h3 className="text-xl font-semibold">Emergency Fund</h3></div>
//                                     <div className="space-y-2 text-lg">
//                                         <div className="flex justify-between items-center"><span className="text-green-600">Total Emergency Fund:</span><span className="font-bold text-green-600 text-2xl">{currency(reportData.emergencyFundRequired)}</span></div>
//                                     </div>
//                                 </div>

//                                 <div className="p-6 bg-gray-50 rounded-lg">
//                                     <div className="flex items-center gap-3 mb-4"><Briefcase className="w-8 h-8 text-yellow-600"/><h3 className="text-xl font-semibold">Retirement Details</h3></div>
//                                     <div className="space-y-2 text-lg">
//                                         <div className="flex justify-between items-center"><span>Required Corpus:</span><span className="font-bold text-gray-700 text-2xl">{currency(reportData.retirementCorpusRequired)}</span></div>
//                                         <div className="flex justify-between items-center pt-2 border-t"><span className="text-yellow-600">Required Monthly SIP:</span><span className="font-bold text-yellow-600 text-2xl">{currency(reportData.retirementSIP)}</span></div>
//                                     </div>
//                                 </div>
                                
//                                 <div className="bg-purple-700 text-white rounded-xl p-8 flex flex-col items-center text-center">
//                                     <div className="flex items-center gap-3"><PiggyBank className="w-8 h-8"/><h3 className="text-xl font-semibold">Total Required Monthly Investment</h3></div>
//                                     <div className="text-5xl font-extrabold my-2">{currency(reportData.totalRequiredSIP)}</div>
//                                     <p className="text-sm opacity-80">(Retirement SIP + Goals SIP)</p>
//                                 </div>
//                             </CardContent>
//                         </Card>
//                     </div>
//                 </motion.div>
//             )}
//         </AnimatePresence>

//         <Footer4Col />
//       </div>
//     </TooltipProvider>
//   );
// }



"use client";

import React, { useMemo, useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Plus, Trash2, Pencil, CheckCircle, Calculator, Info, UserCheck, HeartPulse, ShieldCheck, Briefcase, PiggyBank } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from "@/components/ui/tooltip";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";

// --- CUSTOM HOOK for Media Queries ---
const useMediaQuery = (query: string) => {
    const [matches, setMatches] = useState(false);

    useEffect(() => {
        const media = window.matchMedia(query);
        if (media.matches !== matches) {
            setMatches(media.matches);
        }
        const listener = () => setMatches(media.matches);
        window.addEventListener("resize", listener);
        return () => window.removeEventListener("resize", listener);
    }, [matches, query]);

    return matches;
};

// --- PLACEHOLDER COMPONENTS ---
const NavbarDemo = () => (
    <nav className="bg-white shadow-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
                <div className="flex-shrink-0">
                    <a href="#" className="text-2xl font-bold text-gray-800">FinRoadmap</a>
                </div>
                <div className="hidden md:block">
                    <div className="ml-10 flex items-baseline space-x-4">
                        <a href="#" className="text-gray-600 hover:bg-gray-100 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium">Home</a>
                        <a href="#" className="text-gray-600 hover:bg-gray-100 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium">About</a>
                    </div>
                </div>
            </div>
        </div>
    </nav>
);
const Footer4Col = () => (
    <footer className="bg-gray-100 p-8 mt-12">
        <div className="container mx-auto text-center text-gray-600">
            <p>&copy; {new Date().getFullYear()} Financial Services. All rights reserved.</p>
        </div>
    </footer>
);


// --- TYPE DEFINITIONS ---
type Goal = { 
  id: string; 
  name: string; 
  currentCost: number | string; 
  years: number | string; 
  inflation: number | string; 
  canInvestNow: number | string; 
  expectedReturn: number | string; 
};

// --- HELPER & UTILITY FUNCTIONS ---
const number = (n: number) => (isFinite(n) ? n : 0);
const currency = (n: number) => n.toLocaleString("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 });

// --- UI COMPONENTS ---

// Conditional Info Popup (Tooltip for Desktop, Popover for Mobile)
const InfoPopup = ({ info, isDesktop }: { info: string; isDesktop: boolean }) => {
    const commonButtonClasses = "p-1 rounded-full hover:bg-gray-200 cursor-pointer focus:outline-none";
    const commonContentClasses = "max-w-xs z-50 bg-black text-white border-black p-2 rounded-md";

    if (isDesktop) {
        return (
            <Tooltip>
                <TooltipTrigger asChild>
                    <button type="button" className={commonButtonClasses}><Info className="w-3.5 h-3.5 text-gray-400 hover:text-gray-600"/></button>
                </TooltipTrigger>
                <TooltipContent className={commonContentClasses}><p className="text-sm">{info}</p></TooltipContent>
            </Tooltip>
        );
    }

    return (
        <Popover>
            <PopoverTrigger asChild>
                <button type="button" onClick={(e) => e.stopPropagation()} className={commonButtonClasses}><Info className="w-3.5 h-3.5 text-gray-400 hover:text-gray-600"/></button>
            </PopoverTrigger>
            <PopoverContent side="top" align="center" className={commonContentClasses}><p className="text-sm">{info}</p></PopoverContent>
        </Popover>
    );
};


function Section({ title, children, defaultOpen = true, isComplete = false }: { title: string; children: React.ReactNode; defaultOpen?: boolean, isComplete?: boolean }) {
  const [open, setOpen] = useState<boolean>(defaultOpen);
  return (
    <motion.div layout className="bg-white/50 backdrop-blur-sm rounded-xl shadow-md border mb-6">
      <button onClick={() => setOpen((o) => !o)} className="w-full flex items-center justify-between px-4 sm:px-6 py-4 text-left">
        <div className="flex items-center gap-3">
          <span className="text-lg sm:text-xl font-semibold text-gray-800">{title}</span>
          {!open && isComplete && (
            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.2 }}>
              <CheckCircle className="w-5 h-5 sm:w-6 sm:h-6 text-green-500" />
            </motion.div>
          )}
        </div>
        <motion.span animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.2 }}>
          <ChevronDown className="w-5 h-5 sm:w-6 sm:h-6 text-gray-800" />
        </motion.span>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
            <div className="px-4 sm:px-6 pb-6 border-t border-gray-200/80 pt-4">
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

type LabeledInputProps = { label: string; value: string | number; onChange: (v: string) => void; info: string; placeholder?: string; isDesktop: boolean; };

const LabeledInputLayout = ({ label, info, children, isDesktop }: {label: string; info: string; children: React.ReactNode; isDesktop: boolean;}) => (
    <div className="grid grid-cols-1 sm:grid-cols-2 items-center gap-2 sm:gap-4">
        <label htmlFor={label} className="flex items-center gap-2 text-sm text-gray-700 whitespace-nowrap">
            {label} <span className="text-red-500">*</span>
            <InfoPopup info={info} isDesktop={isDesktop} />
        </label>
        {children}
    </div>
);

function LabeledNumber({ label, value, onChange, info, placeholder = "e.g. 35", isDesktop }: LabeledInputProps) {
  return (
    <LabeledInputLayout label={label} info={info} isDesktop={isDesktop}>
        <Input id={label} type="number" value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} />
    </LabeledInputLayout>
  );
}

function LabeledAmount({ label, value, onChange, info, placeholder = "e.g. 50000", isDesktop }: LabeledInputProps) {
    return (
        <LabeledInputLayout label={label} info={info} isDesktop={isDesktop}>
            <Input id={label} type="number" value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder}/>
        </LabeledInputLayout>
    );
}

function LabeledPercent({ label, value, onChange, info, placeholder = "e.g. 12", isDesktop }: LabeledInputProps) {
  return (
    <LabeledInputLayout label={label} info={info} isDesktop={isDesktop}>
        <div className="relative">
            <Input id={label} type="number" value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} className="pr-8"/>
            <span className="absolute inset-y-0 right-3 flex items-center text-sm text-gray-500">%</span>
        </div>
    </LabeledInputLayout>
  );
}

const TableHeaderWithTooltip = ({ children, info, isDesktop }: { children: React.ReactNode; info: string; isDesktop: boolean; }) => (
    <TableHead>
        <div className="flex items-center gap-1.5">
            {children}
            <InfoPopup info={info} isDesktop={isDesktop} />
        </div>
    </TableHead>
);

// --- MAIN PAGE COMPONENT ---
export default function OnePageFinancialRoadmap() {
  const isDesktop = useMediaQuery("(min-width: 768px)");

  const [yourAge, setYourAge] = useState<string>("");
  const [spouseAge, setSpouseAge] = useState<string>("");
  const [retirementAge, setRetirementAge] = useState<string>("");
  const [lifeExpectancySelf, setLifeExpectancySelf] = useState<string>("");
  const [lifeExpectancySpouse, setLifeExpectancySpouse] = useState<string>("");
  const [monthlyExpenses, setMonthlyExpenses] = useState<string>("");
  const [otherMonthlyExpenses, setOtherMonthlyExpenses] = useState<string>("");
  const [retPre, setRetPre] = useState<string>("");
  const [retPost, setRetPost] = useState<string>("");
  const [inflation, setInflation] = useState<string>("");
  const [lumpsumNow, setLumpsumNow] = useState<string>("");
  const [claimReturn, setClaimReturn] = useState<string>("");
  const [existingLifeCover, setExistingLifeCover] = useState<string>("");
  const [requiredHealthCover, setRequiredHealthCover] = useState<string>("");
  const [currentHealthCover, setCurrentHealthCover] = useState<string>("");
  const [emergencyMonths, setEmergencyMonths] = useState<string>("");
  
  const [goals, setGoals] = useState<Goal[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);

  const addGoal = () => {
    const g: Goal = { id: Math.random().toString(36).slice(2), name: "", currentCost: "", years: "", inflation: "", canInvestNow: "", expectedReturn: "", };
    setGoals((prev) => [...prev, g]);
    setEditingId(g.id);
  };
  const removeGoal = (id: string) => setGoals((prev) => prev.filter((g) => g.id !== id));
  const updateGoal = (id: string, patch: Partial<Goal>) => setGoals((prev) => prev.map((g) => (g.id === id ? { ...g, ...patch } : g)));

  const isPersonalDetailsComplete = Number(yourAge) > 0 && Number(spouseAge) > 0 && Number(retirementAge) > 0 && Number(lifeExpectancySelf) > 0 && Number(lifeExpectancySpouse) > 0;
  const isHouseholdComplete = Number(monthlyExpenses) > 0;
  const isRetirementComplete = Number(retPre) > 0 && Number(retPost) > 0 && Number(inflation) > 0 && Number(lumpsumNow) >= 0;
  const isLifeInsuranceComplete = Number(claimReturn) > 0 && Number(existingLifeCover) >= 0;
  const isHealthInsuranceComplete = Number(requiredHealthCover) > 0 && Number(currentHealthCover) >= 0;
  const isEmergencyComplete = Number(emergencyMonths) > 0;

  const pow = (r: number, n: number) => Math.pow(1 + r, n);
  const fv = (pv: number, ratePct: number, years: number) => number(pv * pow(ratePct / 100, years));
  const pv = (fv_val: number, ratePct: number, years: number) => number(fv_val / pow(ratePct / 100, years));

  const goalsWithCalc = useMemo(() => {
    return goals.map((g) => {
      const futureValue = fv(Number(g.currentCost), Number(g.inflation), Number(g.years));
      const r = Number(g.expectedReturn) / 100 / 12;
      const n = Number(g.years) * 12;
      const lumpsumFvForGoal = fv(Number(g.canInvestNow), Number(g.expectedReturn), Number(g.years));
      const fvNeededFromSip = futureValue - lumpsumFvForGoal;
      const sip = r === 0 || n === 0 ? fvNeededFromSip / (n || 1) : fvNeededFromSip * (r / (pow(1 + r, n) - 1));
      return { ...g, futureValue, sipRequired: Math.max(0, sip) } as Goal & { futureValue: number; sipRequired: number };
    });
  }, [goals]);

  const calculations = useMemo(() => {
    const retirementYears = Math.max(0, Number(retirementAge) - Number(yourAge));
    const monthlyTotalExpenseToday = Number(monthlyExpenses) + Number(otherMonthlyExpenses);
    const totalGoalsSip = goalsWithCalc.reduce((s, g) => s + g.sipRequired, 0);
    
    const postRetYears = Math.max(0, Number(lifeExpectancySelf) - Number(retirementAge));
    const monthlyExpenseAtRetirement = fv(monthlyTotalExpenseToday, Number(inflation), retirementYears);
    const yearlyExpenseAtRetirement = monthlyExpenseAtRetirement * 12;
    const realRatePost = (1 + Number(retPost) / 100) / (1 + Number(inflation) / 100) - 1;
    const retirementCorpusRequired = realRatePost <= 0 ? number(yearlyExpenseAtRetirement * postRetYears) : number((yearlyExpenseAtRetirement / realRatePost) * (1 - pow(1 + realRatePost, -postRetYears)) * (1 + realRatePost));

    const rSip = Number(retPre) / 100 / 12;
    const nSip = retirementYears * 12;
    const lumpsumFvAtRetirement = fv(Number(lumpsumNow), Number(retPre), retirementYears);
    const corpusNeededViaSip = Math.max(0, retirementCorpusRequired - lumpsumFvAtRetirement);
    const retirementSIP = rSip === 0 || nSip === 0 ? corpusNeededViaSip / (nSip || 1) : corpusNeededViaSip * (rSip / (pow(1 + rSip, nSip) - 1));

    const pvOfRetirementCorpus = pv(retirementCorpusRequired, Number(claimReturn), retirementYears);
    const pvOfGoals = goalsWithCalc.reduce((acc, goal) => acc + pv(goal.futureValue, Number(claimReturn), goal.years as number), 0);
    const requiredLifeCover = pvOfRetirementCorpus + pvOfGoals;
    const additionalLifeCover = requiredLifeCover - Number(existingLifeCover);

    const additionalHealthCover = Number(requiredHealthCover) - Number(currentHealthCover);
    const emergencyFundRequired = monthlyTotalExpenseToday * Number(emergencyMonths);
    const totalRequiredSIP = retirementSIP + totalGoalsSip;

    return { requiredLifeCover, additionalLifeCover, additionalHealthCover, emergencyFundRequired, retirementCorpusRequired, retirementSIP, totalRequiredSIP };
  }, [yourAge, retirementAge, lifeExpectancySelf, monthlyExpenses, otherMonthlyExpenses, retPre, retPost, inflation, lumpsumNow, claimReturn, existingLifeCover, requiredHealthCover, currentHealthCover, emergencyMonths, goalsWithCalc]);

  const [submitting, setSubmitting] = useState<boolean>(false);
  const [showReport, setShowReport] = useState<boolean>(false);
  const [reportData, setReportData] = useState(calculations);

  const handleSubmit = async () => {
    setSubmitting(true);
    setReportData(calculations);
    await new Promise((res) => setTimeout(res, 1200));
    setSubmitting(false);
    setShowReport(true);
    document.getElementById("report-section")?.scrollIntoView({ behavior: 'smooth' });
  };
  
  return (
    <TooltipProvider>
      <div className="min-h-screen bg-gray-50 text-gray-800">
        <NavbarDemo />

        <main className="max-w-5xl mx-auto px-4 py-8 md:py-16">
          <motion.div initial={{opacity: 0, y: 20}} animate={{opacity: 1, y: 0}} transition={{duration: 0.5}} className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 text-gray-800">Your One-Page Financial Roadmap</h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                No more guesswork. Input your details to generate a clear, actionable financial plan in seconds.
            </p>
          </motion.div>

          <Section title="Section 1: Personal Details" defaultOpen isComplete={isPersonalDetailsComplete}>
            <Card className={`transition-all border-2 ${isPersonalDetailsComplete ? 'border-green-400' : 'border-transparent'}`}>
                <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6 pt-6">
                    <LabeledNumber isDesktop={isDesktop} label="Your age:" value={yourAge} onChange={setYourAge} info="Your current age in years."/>
                    <LabeledNumber isDesktop={isDesktop} label="Spouse's age:" value={spouseAge} onChange={setSpouseAge} info="Your spouse's current age. If not applicable, enter your age."/>
                    <LabeledNumber isDesktop={isDesktop} label="Retirement age:" value={retirementAge} onChange={setRetirementAge} info="The age you plan to retire." placeholder="e.g. 60"/>
                    <LabeledNumber isDesktop={isDesktop} label="Life expectancy (self):" value={lifeExpectancySelf} onChange={setLifeExpectancySelf} info="The age you expect to live to." placeholder="e.g. 85"/>
                    <LabeledNumber isDesktop={isDesktop} label="Life expectancy (spouse):" value={lifeExpectancySpouse} onChange={setLifeExpectancySpouse} info="The age you expect your spouse to live to." placeholder="e.g. 85"/>
                </CardContent>
            </Card>
          </Section>

          <Section title="Section 2: Financial Details" defaultOpen isComplete={isHouseholdComplete && isRetirementComplete && isLifeInsuranceComplete && isHealthInsuranceComplete && isEmergencyComplete}>
            <div className="space-y-6">
              <Card className={`transition-all ${isHouseholdComplete ? 'border-t-4 border-green-500' : ''}`}>
                <CardHeader><CardTitle className="text-base font-semibold">Household Expenses</CardTitle></CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <LabeledAmount isDesktop={isDesktop} label="Monthly expenses:" value={monthlyExpenses} onChange={setMonthlyExpenses} info="Your core monthly household expenses (rent, utilities, groceries, etc.)." />
                  <LabeledAmount isDesktop={isDesktop} label="Other monthly expenses:" value={otherMonthlyExpenses} onChange={setOtherMonthlyExpenses} info="Include other regular monthly costs like EMIs, school fees, etc." placeholder="e.g. 10000" />
                </CardContent>
              </Card>

              <Card className={`transition-all ${isRetirementComplete ? 'border-t-4 border-green-500' : ''}`}>
                <CardHeader><CardTitle className="text-base font-semibold">Retirement & Inflation</CardTitle></CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <LabeledPercent isDesktop={isDesktop} label="Return (pre-retirement):" value={retPre} onChange={setRetPre} info="Annual % return you expect on your investments until you retire." placeholder="e.g. 15"/>
                  <LabeledPercent isDesktop={isDesktop} label="Return (post-retirement):" value={retPost} onChange={setRetPost} info="Annual % return you expect on your investments after you retire."/>
                  <LabeledPercent isDesktop={isDesktop} label="Assumed inflation:" value={inflation} onChange={setInflation} info="The average annual inflation rate you expect over the long term (e.g., 5-6%)." placeholder="e.g. 6"/>
                  <LabeledAmount isDesktop={isDesktop} label="Lumpsum for retirement:" value={lumpsumNow} onChange={setLumpsumNow} info="Any one-time amount you can invest for retirement right now." placeholder="e.g. 500000"/>
                </CardContent>
              </Card>

              <Card className={`transition-all ${isLifeInsuranceComplete ? 'border-t-4 border-green-500' : ''}`}>
                <CardHeader><CardTitle className="text-base font-semibold">Life Insurance</CardTitle></CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <LabeledAmount isDesktop={isDesktop} label="Existing Life Cover + Assets:" value={existingLifeCover} onChange={setExistingLifeCover} info="Total sum assured from all your existing life insurance policies plus any existing financial assets." placeholder="e.g. 5000000"/>
                    <LabeledPercent isDesktop={isDesktop} label="Return on claim proceeds:" value={claimReturn} onChange={setClaimReturn} info="The annual % return you expect your family could earn by investing the insurance payout." placeholder="e.g. 8"/>
                </CardContent>
              </Card>

              <Card className={`transition-all ${isHealthInsuranceComplete && isEmergencyComplete ? 'border-t-4 border-green-500' : ''}`}>
                <CardHeader><CardTitle className="text-base font-semibold">Health & Emergency</CardTitle></CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <LabeledAmount isDesktop={isDesktop} label="Required Health Cover:" value={requiredHealthCover} onChange={setRequiredHealthCover} info="The ideal total health cover you should have for your family." placeholder="e.g. 1000000" />
                    <LabeledAmount isDesktop={isDesktop} label="Current Health Cover:" value={currentHealthCover} onChange={setCurrentHealthCover} info="The total coverage of your existing health insurance policy." placeholder="e.g. 500000" />
                    <LabeledNumber isDesktop={isDesktop} label="Emergency fund (months):" value={emergencyMonths} onChange={setEmergencyMonths} info="How many months of expenses you want to keep as an emergency fund (e.g., 6 months)." placeholder="e.g. 6"/>
                </CardContent>
              </Card>
            </div>
          </Section>

          <Section title="Section 3: Financial Goals" defaultOpen>
              <div className="overflow-x-auto">
                <Table>
                    <TableCaption>Add and manage your life's financial goals (optional).</TableCaption>
                    <TableHeader className="hidden md:table-header-group">
                        <TableRow>
                            <TableHeaderWithTooltip isDesktop={isDesktop} info="Give your goal a name (e.g., 'Child's Education').">Goal Name</TableHeaderWithTooltip>
                            <TableHeaderWithTooltip isDesktop={isDesktop} info="How much would this goal cost if you had to pay for it today?">Current Cost</TableHeaderWithTooltip>
                            <TableHeaderWithTooltip isDesktop={isDesktop} info="In how many years from now do you need the money?">Years</TableHeaderWithTooltip>
                            <TableHeaderWithTooltip isDesktop={isDesktop} info="Expected annual cost increase for this goal.">Inflation %</TableHeaderWithTooltip>
                            <TableHeaderWithTooltip isDesktop={isDesktop} info="Expected annual return from investments for this goal.">Return %</TableHeaderWithTooltip>
                            <TableHead>Future Value</TableHead>
                            <TableHeaderWithTooltip isDesktop={isDesktop} info="Any one-time amount you can invest for this goal now.">Invest Now</TableHeaderWithTooltip>
                            <TableHead>Monthly SIP</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {goalsWithCalc.map((g) => (
                            <TableRow key={g.id} className="block md:table-row mb-4 md:mb-0 border rounded-lg md:border-none p-2 md:p-0">
                                <TableCell className="block md:table-cell" data-label="Goal Name"><Input placeholder="e.g. Vacation" value={g.name} onChange={(e) => updateGoal(g.id, { name: e.target.value })} /></TableCell>
                                <TableCell className="block md:table-cell" data-label="Current Cost"><Input type="number" placeholder="e.g. 500000" value={g.currentCost} onChange={(e) => updateGoal(g.id, { currentCost: e.target.value })} /></TableCell>
                                <TableCell className="block md:table-cell" data-label="Years"><Input type="number" placeholder="e.g. 3" value={g.years} onChange={(e) => updateGoal(g.id, { years: e.target.value })} /></TableCell>
                                <TableCell className="block md:table-cell" data-label="Inflation %"><Input type="number" placeholder="e.g. 7" value={g.inflation} onChange={(e) => updateGoal(g.id, { inflation: e.target.value })} /></TableCell>
                                <TableCell className="block md:table-cell" data-label="Return %"><Input type="number" placeholder="e.g. 12" value={g.expectedReturn} onChange={(e) => updateGoal(g.id, { expectedReturn: e.target.value })} /></TableCell>
                                <TableCell className="block md:table-cell font-medium" data-label="Future Value">{currency(g.futureValue)}</TableCell>
                                <TableCell className="block md:table-cell" data-label="Invest Now"><Input type="number" placeholder="e.g. 100000" value={g.canInvestNow} onChange={(e) => updateGoal(g.id, { canInvestNow: e.target.value })} /></TableCell>
                                <TableCell className="block md:table-cell font-semibold text-purple-700" data-label="Monthly SIP">{currency(g.sipRequired)}</TableCell>
                                <TableCell className="block md:table-cell text-right pt-4 md:pt-2">
                                    <div className="flex justify-end space-x-2">
                                      <Button size="icon" variant="outline" onClick={() => editingId === g.id ? setEditingId(null) : setEditingId(g.id)}>
                                          {editingId === g.id ? <CheckCircle className="w-4 h-4 text-green-600"/> : <Pencil className="w-4 h-4" />}
                                      </Button>
                                      <Button size="icon" variant="destructive" onClick={() => removeGoal(g.id)}><Trash2 className="w-4 h-4" /></Button>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
              </div>
              <Button onClick={addGoal} className="mt-4"><Plus className="w-4 h-4 mr-2" /> Add Goal</Button>
          </Section>

          <div className="flex justify-center mt-8">
            <Button onClick={handleSubmit} disabled={submitting} size="lg" className="bg-purple-700 hover:bg-purple-800 text-lg px-8 py-6 rounded-full shadow-lg w-full sm:w-auto">
              {submitting ? (<><Calculator className="w-5 h-5 mr-2 animate-spin" /> Calculating...</>) : "Calculate My Roadmap"}
            </Button>
          </div>
        </main>
        
        <AnimatePresence>
            {showReport && (
                <motion.div 
                    id="report-section"
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 50 }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                    className="bg-white py-12"
                >
                    <div className="max-w-5xl mx-auto px-4">
                        <Card className="border-none shadow-none">
                            <CardHeader className="text-center">
                                <CardTitle className="text-3xl font-bold">Your Financial Roadmap</CardTitle>
                                <p className="text-gray-600">Here's the detailed breakdown based on your inputs.</p>
                            </CardHeader>
                            <CardContent className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                                
                                <div className="p-6 bg-gray-50 rounded-lg">
                                    <div className="flex items-center gap-3 mb-4"><UserCheck className="w-8 h-8 text-blue-600"/><h3 className="text-xl font-semibold">Life Insurance</h3></div>
                                    <div className="space-y-2 text-base sm:text-lg">
                                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center"><span>Required Life Cover:</span><span className="font-bold text-gray-700 text-xl sm:text-2xl">{currency(reportData.requiredLifeCover)}</span></div>
                                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center pt-2 border-t"><span className="text-blue-600">Required Additional Cover:</span><span className="font-bold text-blue-600 text-xl sm:text-2xl">{currency(reportData.additionalLifeCover)}</span></div>
                                    </div>
                                </div>

                                <div className="p-6 bg-gray-50 rounded-lg">
                                    <div className="flex items-center gap-3 mb-4"><HeartPulse className="w-8 h-8 text-red-600"/><h3 className="text-xl font-semibold">Health Insurance</h3></div>
                                    <div className="space-y-2 text-base sm:text-lg">
                                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center"><span className="text-red-600">Additional Cover Needed:</span><span className="font-bold text-red-600 text-xl sm:text-2xl">{currency(reportData.additionalHealthCover)}</span></div>
                                    </div>
                                </div>
                                
                                <div className="p-6 bg-gray-50 rounded-lg">
                                    <div className="flex items-center gap-3 mb-4"><ShieldCheck className="w-8 h-8 text-green-600"/><h3 className="text-xl font-semibold">Emergency Fund</h3></div>
                                    <div className="space-y-2 text-base sm:text-lg">
                                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center"><span className="text-green-600">Total Emergency Fund:</span><span className="font-bold text-green-600 text-xl sm:text-2xl">{currency(reportData.emergencyFundRequired)}</span></div>
                                    </div>
                                </div>

                                <div className="p-6 bg-gray-50 rounded-lg">
                                    <div className="flex items-center gap-3 mb-4"><Briefcase className="w-8 h-8 text-yellow-600"/><h3 className="text-xl font-semibold">Retirement Details</h3></div>
                                    <div className="space-y-2 text-base sm:text-lg">
                                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center"><span>Required Corpus:</span><span className="font-bold text-gray-700 text-xl sm:text-2xl">{currency(reportData.retirementCorpusRequired)}</span></div>
                                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center pt-2 border-t"><span className="text-yellow-600">Required Monthly SIP:</span><span className="font-bold text-yellow-600 text-xl sm:text-2xl">{currency(reportData.retirementSIP)}</span></div>
                                    </div>
                                </div>
                                
                                <div className="md:col-span-2 bg-purple-700 text-white rounded-xl p-8 flex flex-col items-center text-center">
                                    <div className="flex items-center gap-3"><PiggyBank className="w-8 h-8"/><h3 className="text-xl font-semibold">Total Required Monthly Investment</h3></div>
                                    <div className="text-4xl sm:text-5xl font-extrabold my-2">{currency(reportData.totalRequiredSIP)}</div>
                                    <p className="text-sm opacity-80">(Retirement SIP + Goals SIP)</p>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>

        <Footer4Col />
      </div>
      <style jsx global>{`
        @media (max-width: 767px) {
          .md\\:table-cell[data-label]::before {
            content: attr(data-label);
            font-weight: 600;
            display: block;
            margin-bottom: 0.25rem;
            color: #4a5568; /* text-gray-600 */
          }
          .md\\:table-cell {
            padding-bottom: 0.75rem; /* pb-3 */
            border-bottom: 1px solid #e2e8f0; /* border-gray-200 */
          }
           .md\\:table-row:last-child .md\\:table-cell:last-child {
             border-bottom: none;
           }
        }
      `}</style>
    </TooltipProvider>
  );
}