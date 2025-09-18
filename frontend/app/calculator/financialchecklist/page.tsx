// "use client";

// import React, { useState, useEffect } from "react";
// import { motion, AnimatePresence } from "framer-motion";
// import Link from 'next/link';

// // Lucide Icons Import
// import { 
//     Info, 
//     Calculator, 
//     CheckSquare, 
//     Trophy, 
//     ChevronDown,
//     Dribbble,
//     Facebook,
//     Github,
//     Instagram,
//     Mail,
//     MapPin,
//     Phone,
//     Twitter,
//     HelpCircle,
//     TrendingUp,
//     Sparkles,
//     CheckCircle2
// } from "lucide-react";

// // Shadcn UI Imports
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Input } from "@/components/ui/input";
// import { Button } from "@/components/ui/button";
// import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
// import {
//     Tooltip,
//     TooltipContent,
//     TooltipProvider,
//     TooltipTrigger,
// } from "@/components/ui/tooltip";
// import {
//     Popover,
//     PopoverTrigger,
//     PopoverContent,
// } from "@/components/ui/popover";

// // --- CUSTOM HOOK for Media Queries ---
// const useMediaQuery = (query: string) => {
//     const [matches, setMatches] = useState(false);

//     useEffect(() => {
//         // This code will only run on the client, where `window` is available.
//         const media = window.matchMedia(query);
//         if (media.matches !== matches) {
//             setMatches(media.matches);
//         }
//         const listener = () => setMatches(media.matches);
//         window.addEventListener("resize", listener);
//         return () => window.removeEventListener("resize", listener);
//     }, [matches, query]);

//     return matches;
// };


// // --- PLACEHOLDER COMPONENTS ---
// const Footer4Col = () => (
//     <footer className="bg-gray-100 p-8 mt-12">
//         <div className="container mx-auto text-center text-gray-600">
//             <p>&copy; {new Date().getFullYear()} Financial Health Services. All rights reserved.</p>
//             <div className="flex justify-center space-x-4 mt-4">
//                 <a href="#" className="hover:text-gray-900">Privacy Policy</a>
//                 <a href="#" className="hover:text-gray-900">Terms of Service</a>
//                 <a href="#" className="hover:text-gray-900">Contact Us</a>
//             </div>
//         </div>
//     </footer>
// );

// const NavbarDemo = () => (
//     <nav className="bg-white shadow-sm sticky top-0 z-50">
//         <div className="container mx-auto px-4 sm:px-6 lg:px-8">
//             <div className="flex items-center justify-between h-16">
//                 <div className="flex-shrink-0">
//                     <a href="#" className="text-2xl font-bold text-gray-800">FinHealth</a>
//                 </div>
//                 <div className="hidden md:block">
//                     <div className="ml-10 flex items-baseline space-x-4">
//                         <a href="#" className="text-gray-600 hover:bg-gray-100 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium">Home</a>
//                         <a href="#how-it-works" className="text-gray-600 hover:bg-gray-100 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium">How It Works</a>
//                         <a href="#" className="text-gray-600 hover:bg-gray-100 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium">About</a>
//                     </div>
//                 </div>
//             </div>
//         </div>
//     </nav>
// );

// // --- HELPERS ---
// const formatCurrency = (value: number | string): string => {
//     if (value === null || value === undefined || value === '') return '';
//     const num = Number(String(value).replace(/[^0-9.-]+/g, ""));
//     if (isNaN(num)) return '';
//     return new Intl.NumberFormat('en-IN', {
//         style: 'currency',
//         currency: 'INR',
//         minimumFractionDigits: 0,
//         maximumFractionDigits: 0,
//     }).format(num);
// };

// const parseCurrency = (value: string): string => {
//     if (typeof value !== 'string') return '';
//     return value.replace(/[^0-9]/g, '');
// };

// // --- CONDITIONAL INFO COMPONENT ---
// const InfoPopup = ({ info, isDesktop }: { info: string; isDesktop: boolean }) => {
//     const commonButtonClasses = "p-1 rounded-full hover:bg-gray-200 cursor-pointer focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500";
//     const commonContentClasses = "w-80 z-50 bg-black text-white border-black";

//     if (isDesktop) {
//         return (
//             <Tooltip>
//                 <TooltipTrigger asChild>
//                     <button className={commonButtonClasses}>
//                         <Info size={16} />
//                     </button>
//                 </TooltipTrigger>
//                 <TooltipContent className={commonContentClasses}>
//                     <p className="text-sm">{info}</p>
//                 </TooltipContent>
//             </Tooltip>
//         );
//     }

//     return (
//         <Popover>
//             <PopoverTrigger asChild>
//                 <button onClick={(e) => e.stopPropagation()} className={commonButtonClasses}>
//                     <Info size={16} />
//                 </button>
//             </PopoverTrigger>
//             <PopoverContent side="top" align="center" className={commonContentClasses}>
//                 <p className="text-sm">{info}</p>
//             </PopoverContent>
//         </Popover>
//     );
// };


// // --- TYPE DEFINITIONS ---
// type View = "landing" | "numeric" | "yesno" | "results";
// type YesNoValue = 'yes' | 'no' | 'dont_know' | null;

// type NumericField = { 
//   key: string; 
//   label: string; 
//   value: string; 
//   info: string;
//   type: 'core' | 'rated';
//   defaultValue?: number; 
//   higherBetter?: boolean; 
// };

// type YesNoField = { 
//   key: string; 
//   label: string; 
//   value: YesNoValue; 
//   info: string; 
// };

// type NumericFullscreenProps = { 
//     numericState: NumericField[]; 
//     updateNumericValue: (key: string, newValue: string) => void; 
//     computeGap: (f: NumericField) => number; 
//     computeRating: (f: NumericField) => number; 
//     handleNumericSubmit: () => void; 
//     setView: React.Dispatch<React.SetStateAction<View>>;
//     isDesktop: boolean;
// };

// type YesNoFullscreenProps = { 
//     yesNoState: YesNoField[]; 
//     updateYesNoValue: (key: string, checked: YesNoValue) => void; 
//     handleYesNoSubmit: () => void; 
//     setView: React.Dispatch<React.SetStateAction<View>>;
//     isDesktop: boolean;
// };

// type ResultsFullscreenProps = { 
//     finalScore: number; 
//     numericScoreWeighted: number; 
//     yesScoreWeighted: number; 
//     allTips: string[]; 
//     setView: React.Dispatch<React.SetStateAction<View>>; 
// };

// type LandingViewProps = { 
//     numericDone: boolean; 
//     yesNoDone: boolean; 
//     setView: React.Dispatch<React.SetStateAction<View>>; 
// };

// type CollapsibleSectionProps = {
//     title: string;
//     icon: React.ElementType;
//     isComplete: boolean;
//     statusText: string;
//     isOpen: boolean;
//     setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
//     children: React.ReactNode;
// };

// // --- DATA CONSTANTS ---
// const initialNumeric: NumericField[] = [
//     { key: "monthlyIncome", label: "Monthly Income", value: "", info: "Your gross monthly income from all sources.", type: 'core' },
//     { key: "monthlyExpenses", label: "Monthly Expenses", value: "", info: "Your total monthly spending.", type: 'core' },
//     { key: "familyMembers", label: "Family Members", value: "", info: "Number of dependents you support financially.", type: 'core' },
//     { key: "incomeProtection", label: "Income Protection (life cover)", defaultValue: 2000000, value: "", higherBetter: true, info: "Recommended life cover (example: annual income × ~20).", type: 'rated' },
//     { key: "emergencyFund", label: "Emergency Fund", defaultValue: 120000, value: "", higherBetter: true, info: "Emergency fund typically 3-6 months of expenses. Default uses 3 months.", type: 'rated' },
//     { key: "retirementGoals", label: "Retirement Corpus Goal", defaultValue: 12000000, value: "", higherBetter: true, info: "Estimated retirement corpus required (placeholder rule).", type: 'rated' },
//     { key: "healthInsurance", label: "Health Insurance Sum Insured", defaultValue: 800000, value: "", higherBetter: true, info: "Recommended health cover relative to annual income and family size.", type: 'rated' },
//     { key: "criticalIllness", label: "Critical Illness Cover", defaultValue: 300000, value: "", higherBetter: true, info: "Recommended sum assured for critical illness policies (rule-of-thumb).", type: 'rated' },
//     { key: "disabilityInsurance", label: "Disability Insurance", defaultValue: 1500000, value: "", higherBetter: true, info: "Income replacement cover in case of long-term disability.", type: 'rated' },
//     { key: "childEducation", label: "Child Education Fund", defaultValue: 2000000, value: "", higherBetter: true, info: "Target corpus for child education (placeholder).", type: 'rated' },
//     { key: "debtManagement", label: "Debt Management (acceptable EMI)", defaultValue: 40000, value: "", higherBetter: false, info: "Acceptable EMI threshold (rule-of-thumb: ≤ 40% of income).", type: 'rated' },
// ];

// const initialYesNo: YesNoField[] = [
//     { key: "budgetPlanning", label: "Budget Planning", value: null, info: "Do you maintain a monthly/quarterly budget?" },
//     { key: "wealthBuilding", label: "Wealth Building", value: null, info: "Do you follow a structured wealth-building plan?" },
//     { key: "optimizeTax", label: "Optimize Tax Saving Investments", value: null, info: "Do you leverage tax-saving investments effectively?" },
//     { key: "openHUF", label: "Open HUF Account", value: null, info: "Is an HUF account opened/considered (if applicable)?" },
//     { key: "homeLoanRent", label: "Home Loan & Rent", value: null, info: "Is your housing EMI/rent within acceptable limits?" },
//     { key: "cibil", label: "CIBIL Score ≥ 700", value: null, info: "Is your credit score above 700?" },
//     { key: "spouseCoverage", label: "Spouse Coverage", value: null, info: "Does spouse have adequate insurance/coverage?" },
//     { key: "familyGoals", label: "Family Goals", value: null, info: "Are family financial goals documented and planned?" },
//     { key: "estatePlanning", label: "Estate Planning", value: null, info: "Do you have a will/estate plan in place?" },
//     { key: "diversification", label: "Investment Diversification", value: null, info: "Are your investments diversified across asset classes?" },
//     { key: "legacyFund", label: "Legacy Fund", value: null, info: "Have you planned for legacy/wealth transfer to next generation?" },
// ];

// // --- COLLAPSIBLE CARD & SECTION COMPONENTS ---
// const CollapsibleCard = ({ title, children, isComplete }: { title: string; children: React.ReactNode; isComplete: boolean }) => {
//     const [isOpen, setIsOpen] = useState(true);
//     return (
//         <Card className={`transition-all duration-300 ${isOpen && isComplete ? 'border-green-500' : 'border'}`}>
//             <button onClick={() => setIsOpen(!isOpen)} className="w-full p-4 flex justify-between items-center text-left">
//                 <div className="flex items-center gap-3">
//                     <h3 className="text-lg font-semibold">{title}</h3>
//                     {!isOpen && isComplete && <CheckCircle2 className="w-5 h-5 text-green-500" />}
//                 </div>
//                 <motion.div animate={{ rotate: isOpen ? 180 : 0 }}><ChevronDown /></motion.div>
//             </button>
//             <AnimatePresence>
//                 {isOpen && (
//                     <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}>
//                         <CardContent className="border-t pt-4">{children}</CardContent>
//                     </motion.div>
//                 )}
//             </AnimatePresence>
//         </Card>
//     );
// };

// const CollapsibleSection = ({ title, icon: Icon, isComplete, statusText, isOpen, setIsOpen, children }: CollapsibleSectionProps) => (
//     <motion.div layout className="w-full max-w-3xl mb-6 bg-white border-t-4 rounded-xl shadow-md" style={{borderColor: isComplete ? '#22c55e' : '#e5e7eb'}}>
//         <button onClick={() => setIsOpen(!isOpen)} className="flex items-center justify-between w-full p-6 text-left cursor-pointer focus:outline-none">
//             <div className="flex items-center">
//                 <Icon className={`w-8 h-8 mr-4 ${isComplete ? 'text-green-500' : 'text-gray-500'}`} />
//                 <div>
//                     <h2 className="text-xl font-semibold text-gray-800">{title}</h2>
//                     <p className={`text-sm font-semibold ${isComplete ? 'text-green-600' : 'text-gray-500'}`}>{statusText}</p>
//                 </div>
//             </div>
//             <motion.div animate={{ rotate: isOpen ? 180 : 0 }} transition={{ duration: 0.3 }}><ChevronDown className="w-6 h-6 text-gray-500" /></motion.div>
//         </button>
//         <AnimatePresence>
//             {isOpen && (
//                 <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1, transition: { opacity: { delay: 0.15 } } }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.3, ease: 'easeInOut' }} className="overflow-hidden">
//                     <div className="px-6 pb-6 border-t border-gray-200">{children}</div>
//                 </motion.div>
//             )}
//         </AnimatePresence>
//     </motion.div>
// );

// // --- VIEW COMPONENTS ---
// const NumericFullscreen = ({ numericState, updateNumericValue, computeGap, computeRating, handleNumericSubmit, isDesktop }: NumericFullscreenProps) => {
//     const sections = {
//         core: { title: "Core Financials", fields: numericState.filter(f => f.type === 'core') },
//         security: { title: "Long-Term Security", fields: numericState.filter(f => ["incomeProtection", "emergencyFund", "retirementGoals"].includes(f.key)) },
//         insurance: { title: "Insurance Coverage", fields: numericState.filter(f => ["healthInsurance", "criticalIllness", "disabilityInsurance"].includes(f.key)) },
//         goals: { title: "Other Financial Goals", fields: numericState.filter(f => ["childEducation", "debtManagement"].includes(f.key)) },
//     };

//     const isSectionComplete = (fields: NumericField[]) => fields.every(f => f.value !== "" && !isNaN(Number(f.value)));

//     return (
//         <div className="flex items-start justify-center min-h-screen px-4 py-12 bg-[#fdfbf7] text-black">
//             <div className="w-full max-w-5xl space-y-6">
//                 <div className="text-center">
//                     <h2 className="text-3xl font-bold">Step 1: Your Financial Numbers</h2>
//                     <p className="text-gray-600 mt-2">Enter your details below. We'll use this to calculate your score.</p>
//                 </div>
//                 {Object.values(sections).map(({ title, fields }) => (
//                     <CollapsibleCard key={title} title={title} isComplete={isSectionComplete(fields)}>
//                         <Table>
//                             <TableHeader>
//                                 <TableRow>
//                                     <TableHead className="w-[30%]">Field</TableHead>
//                                     <TableHead className="w-[20%]">Your Value</TableHead>
//                                     {fields[0].type === 'rated' && (
//                                         <>
//                                             <TableHead className="text-center">Target</TableHead>
//                                             <TableHead className="text-center">Gap</TableHead>
//                                             <TableHead className="text-right">Rating</TableHead>
//                                         </>
//                                     )}
//                                 </TableRow>
//                             </TableHeader>
//                             <TableBody>
//                                 {fields.map((f) => (
//                                     <TableRow key={f.key}>
//                                         <TableCell className="font-medium">
//                                             <div className="flex items-center gap-2">
//                                                 <span>{f.label}</span>
//                                                 <InfoPopup info={f.info} isDesktop={isDesktop} />
//                                             </div>
//                                         </TableCell>
//                                         <TableCell>
//                                             <Input 
//                                                 type="text" 
//                                                 value={f.type === 'core' && f.key !== 'familyMembers' ? formatCurrency(f.value) : (f.type === 'rated' ? formatCurrency(f.value) : f.value)}
//                                                 onChange={(e) => updateNumericValue(f.key, e.target.value)} 
//                                                 className="w-full" 
//                                                 placeholder={f.defaultValue ? formatCurrency(f.defaultValue) : "Enter value"} 
//                                             />
//                                         </TableCell>
//                                         {f.type === 'rated' ? (
//                                             <>
//                                                 <TableCell className="text-center">{formatCurrency(f.defaultValue || 0)}</TableCell>
//                                                 <TableCell className={`text-center font-medium ${computeGap(f) > 0 ? 'text-red-600' : 'text-green-600'}`}>{formatCurrency(computeGap(f))}</TableCell>
//                                                 <TableCell className="text-right font-bold">{computeRating(f)} / 5</TableCell>
//                                             </>
//                                         ) : <TableCell colSpan={3}></TableCell>}
//                                     </TableRow>
//                                 ))}
//                             </TableBody>
//                         </Table>
//                     </CollapsibleCard>
//                 ))}
//                 <div className="flex justify-end pt-4"><Button onClick={handleNumericSubmit}>Submit & Continue</Button></div>
//             </div>
//         </div>
//     );
// };

// const YesNoFullscreen = ({ yesNoState, updateYesNoValue, handleYesNoSubmit, isDesktop }: YesNoFullscreenProps) => (
//     <div className="flex items-start justify-center min-h-screen px-4 py-12 bg-[#fdfbf7] text-black">
//         <div className="w-full max-w-3xl">
//             <Card className="bg-white">
//                 <CardHeader>
//                     <CardTitle>Step 2: Financial Habits (Pre-Requisites)</CardTitle>
//                     <p className="text-sm text-gray-600">Answer these questions to help us understand your financial practices.</p>
//                 </CardHeader>
//                 <CardContent>
//                     <ul className="space-y-4">
//                         {yesNoState.map((y) => (
//                             <li key={y.key} className="p-4 border rounded-lg">
//                                 <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
//                                     <div className="flex items-center gap-2 font-medium text-gray-800">
//                                         <span>{y.label}</span>
//                                         <InfoPopup info={y.info} isDesktop={isDesktop} />
//                                     </div>
//                                     <div className="flex items-center flex-shrink-0 gap-2">
//                                         <Button onClick={() => updateYesNoValue(y.key, 'yes')} variant={y.value === 'yes' ? 'default' : 'outline'} className={`w-24 ${y.value === 'yes' ? 'bg-green-600 hover:bg-green-700 text-white' : ''}`}>Yes</Button>
//                                         <Button onClick={() => updateYesNoValue(y.key, 'no')} variant={y.value === 'no' ? 'default' : 'outline'} className={`w-24 ${y.value === 'no' ? 'bg-red-600 hover:bg-red-700 text-white' : ''}`}>No</Button>
//                                         <Button onClick={() => updateYesNoValue(y.key, 'dont_know')} variant={y.value === 'dont_know' ? 'default' : 'outline'} className={`w-28 ${y.value === 'dont_know' ? 'bg-gray-500 hover:bg-gray-600 text-white' : ''}`}>Don't Know</Button>
//                                     </div>
//                                 </div>
//                             </li>
//                         ))}
//                     </ul>
//                     <div className="flex justify-end mt-6"><Button onClick={handleYesNoSubmit}>Submit</Button></div>
//                 </CardContent>
//             </Card>
//         </div>
//     </div>
// );

// const ResultsFullscreen = ({ finalScore, numericScoreWeighted, yesScoreWeighted, allTips, setView }: ResultsFullscreenProps) => (
//     <div className="flex items-start justify-center min-h-screen px-4 py-12 bg-[#fdfbf7] text-black">
//         <div className="w-full max-w-3xl">
//             <Card className="bg-white">
//                 <CardHeader><CardTitle>Your Financial Health Report</CardTitle></CardHeader>
//                 <CardContent>
//                     <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
//                         <div>
//                             <h2 className="text-lg font-semibold">Final Score</h2>
//                             <p className="text-5xl font-bold">{finalScore} / 100</p>
//                             <p className="mt-1 text-sm text-gray-600">(Numeric: {numericScoreWeighted.toFixed(1)} / 60, Habits: {yesScoreWeighted.toFixed(1)} / 40)</p>
//                         </div>
//                         <div className="space-x-2">
//                             <Button variant="ghost" onClick={() => setView("landing")}>Back to Home</Button>
//                             <Button>Download Report</Button>
//                         </div>
//                     </div>
//                     <div className="mt-8">
//                         <h3 className="font-semibold text-lg">Personalized Tips for Improvement</h3>
//                         {allTips.length === 0 ? (<p className="mt-2 text-sm text-green-600">Great job — all fields meet or exceed targets!</p>) : (<ul className="mt-2 ml-5 space-y-2 text-sm list-disc">{allTips.map((t, i) => (<li key={i} dangerouslySetInnerHTML={{ __html: t }}></li>))}</ul>)}
//                     </div>
//                     <div className="mt-6 text-xs text-gray-500">
//                         <p><strong>Notes:</strong></p>
//                         <ul className="ml-5 list-disc">
//                             <li>Your score is an estimate based on standard financial benchmarks.</li>
//                             <li>Numeric ratings are calculated based on how close you are to the target value.</li>
//                         </ul>
//                     </div>
//                 </CardContent>
//             </Card>
//         </div>
//     </div>
// );

// const LandingView = ({ setView, numericDone, yesNoDone }: LandingViewProps) => {
//     const [isNumericOpen, setIsNumericOpen] = useState(true);
//     const [isYesNoOpen, setIsYesNoOpen] = useState(true);
//     const [isResultsOpen, setIsResultsOpen] = useState(true);

//     return (
//         <div className="flex flex-col items-center min-h-screen px-4 pt-12 pb-24 bg-[#fdfbf7] text-black">
//             <div className="mb-12 text-center">
//                 <motion.h1 initial={{opacity: 0, y: 20}} animate={{opacity: 1, y: 0}} transition={{duration: 0.5}} className="mb-4 text-4xl font-bold text-gray-800 md:text-5xl">Your Financial Health Checkup</motion.h1>
//                 <motion.p initial={{opacity: 0, y: 20}} animate={{opacity: 1, y: 0}} transition={{duration: 0.5, delay: 0.2}} className="max-w-2xl mx-auto text-lg text-gray-600">
//                     Confused about money stuff? 😵‍💫 This quick checkup gives you a simple score and personalized tips to get your finances on track. ✨
//                 </motion.p>
//             </div>

//             <CollapsibleSection title="Step 1: Numeric Inputs" icon={Calculator} isComplete={numericDone} statusText={numericDone ? '✓ Completed' : 'Required'} isOpen={isNumericOpen} setIsOpen={setIsNumericOpen}>
//                 <p className="mb-4 text-gray-600">Enter your key financial figures. This section is crucial for calculating the quantitative part of your score.</p>
//                 <Button onClick={() => setView("numeric")} className="w-full md:w-auto">{numericDone ? 'Edit Numeric Inputs' : 'Start Step 1'}</Button>
//             </CollapsibleSection>

//             <CollapsibleSection title="Step 2: Pre-Requisites" icon={CheckSquare} isComplete={yesNoDone} statusText={yesNoDone ? '✓ Completed' : 'Required'} isOpen={isYesNoOpen} setIsOpen={setIsYesNoOpen}>
//                 <p className="mb-4 text-gray-600">Answer a few simple questions about your financial habits and planning.</p>
//                 <Button onClick={() => setView("yesno")} className="w-full md:w-auto">{yesNoDone ? 'Edit Pre-Requisites' : 'Start Step 2'}</Button>
//             </CollapsibleSection>

//             <AnimatePresence>
//                 {numericDone && yesNoDone && (
//                     <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }} className="flex justify-center w-full">
//                         <CollapsibleSection title="Results" icon={Trophy} isComplete={true} statusText="Ready to View" isOpen={isResultsOpen} setIsOpen={setIsResultsOpen}>
//                             <p className="mb-4 text-gray-600">Great job! Your financial health score is calculated. View your detailed report and personalized tips.</p>
//                             <Button onClick={() => setView("results")} className="w-full md:w-auto">View Full Report</Button>
//                         </CollapsibleSection>
//                     </motion.div>
//                 )}
//             </AnimatePresence>
            
//             <HowItWorks />
//         </div>
//     );
// };

// function HowItWorks() {
//     const steps = [
//         { icon: HelpCircle, title: "Answer a Few Qs", description: "Quickly fill out your numbers and check off some yes/no items. No judgement." },
//         { icon: TrendingUp, title: "Get Your Score", description: "We instantly calculate your financial health score, giving you a simple snapshot of where you stand." },
//         { icon: Sparkles, title: "Level Up with Tips", description: "Receive personalized, jargon-free tips to help you improve your score and build better money habits." }
//     ];
//     return (
//         <div id="how-it-works" className="w-full max-w-5xl px-4 py-12 mx-auto text-center">
//              <motion.h2 initial={{opacity: 0, y: 20}} whileInView={{opacity: 1, y: 0}} viewport={{ once: true, amount: 0.8 }} transition={{duration: 0.5}} className="mb-8 text-3xl font-bold text-gray-800">How It Works</motion.h2>
//              <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
//                 {steps.map((step, index) => (
//                     <motion.div 
//                         key={step.title}
//                         initial={{opacity: 0, y: 20}} 
//                         whileInView={{opacity: 1, y: 0}} 
//                         viewport={{ once: true, amount: 0.5 }}
//                         transition={{duration: 0.5, delay: index * 0.2}}
//                         className="flex flex-col items-center p-6 bg-white rounded-xl shadow-md"
//                     >
//                         <step.icon className="w-12 h-12 mb-4 text-purple-500"/>
//                         <h3 className="mb-2 text-lg font-semibold text-gray-800">{step.title}</h3>
//                         <p className="text-sm text-gray-600">{step.description}</p>
//                     </motion.div>
//                 ))}
//             </div>
//         </div>
//     );
// }

// // --- MAIN PAGE COMPONENT ---
// export default function FinancialHealthCheckupPage() {
//     const [view, setView] = useState<View>("landing");
//     const [numericState, setNumericState] = useState<NumericField[]>(initialNumeric);
//     const [yesNoState, setYesNoState] = useState<YesNoField[]>(initialYesNo);
//     const [numericDone, setNumericDone] = useState(false);
//     const [yesNoDone, setYesNoDone] = useState(false);
    
//     // Use the hook to check for desktop screen sizes (Tailwind's `md` breakpoint)
//     const isDesktop = useMediaQuery("(min-width: 768px)");

//     const updateNumericValue = (key: string, newValue: string) => {
//         const parsedValue = (key === 'familyMembers') ? newValue.replace(/[^0-9]/g, '') : parseCurrency(newValue);
//         setNumericState((prev) => prev.map((p) => (p.key === key ? { ...p, value: parsedValue } : p))); 
//     };
    
//     const updateYesNoValue = (key: string, value: YesNoValue) => { 
//         setYesNoState((prev) => prev.map((p) => (p.key === key ? { ...p, value } : p))); 
//     };
    
//     const computeRating = (f: NumericField): number => { 
//       if (f.type !== 'rated' || typeof f.defaultValue === 'undefined' || typeof f.higherBetter === 'undefined' || f.value === '') return 0;
//       const actual = Number(f.value) <= 0 ? 0.0001 : Number(f.value); 
//       const def = f.defaultValue <= 0 ? 0.0001 : f.defaultValue; 
//       let percent = f.higherBetter ? actual / def : def / actual; 
//       if (!isFinite(percent) || percent <= 0) percent = 0; 
//       if (percent > 1) percent = 1; 
//       return Math.max(0, Math.min(5, Math.ceil(percent * 5))); 
//     };
    
//     const computeGap = (f: NumericField): number => {
//       if (f.type !== 'rated' || typeof f.defaultValue === 'undefined' || f.value === '') return 0;
//       return f.defaultValue - Number(f.value); 
//     };

//     const ratedNumericFields = numericState.filter(f => f.type === 'rated');
//     const numericComplete = numericState.every((n) => n.value !== "" && !isNaN(Number(n.value)));
    
//     const numericSum = ratedNumericFields.reduce((acc, cur) => acc + computeRating(cur), 0);
//     const numericMax = ratedNumericFields.length * 5;
//     const numericScoreWeighted = numericMax > 0 ? (numericSum / numericMax) * 60 : 60;
    
//     const yesCount = yesNoState.filter(y => y.value === 'yes').length;
//     const totalYesNo = yesNoState.length;
//     const yesScoreWeighted = totalYesNo > 0 ? (yesCount / totalYesNo) * 40 : 40;
//     const finalScore = Math.round(numericScoreWeighted + yesScoreWeighted);

//     const numericTips: string[] = [];
//     ratedNumericFields.forEach((f) => { 
//         const rating = computeRating(f); 
//         if (rating < 5) { 
//             const gap = computeGap(f); 
//             const formattedValue = formatCurrency(Number(f.value));
//             const formattedDefault = formatCurrency(f.defaultValue!);
//             const formattedGap = formatCurrency(gap);
//             const tip = `For <strong>${f.label}</strong>, your current value is ${formattedValue} against a target of ${formattedDefault} (a gap of ${formattedGap}). Aim to increase your amount to better meet this goal.`; 
//             numericTips.push(tip); 
//         } 
//     });
    
//     const yesNoTips: string[] = [];
//     yesNoState.forEach((y) => { 
//       if (y.value === 'no' || y.value === 'dont_know') { 
//         yesNoTips.push(`Consider addressing <strong>"${y.label}"</strong>. ${y.info}`); 
//       } 
//     });
//     const allTips = [...numericTips, ...yesNoTips];

//     const handleNumericSubmit = () => { 
//       if (!numericComplete) { 
//         alert("Please ensure all numeric fields have a valid number entered."); 
//         return; 
//       } 
//       setNumericDone(true); 
//       setView("landing"); 
//     };

//     const handleYesNoSubmit = () => {
//       if (yesNoState.some(y => y.value === null)) {
//           alert("Please answer all questions before submitting.");
//           return;
//       }
//       setYesNoDone(true); 
//       setView("landing"); 
//     };
    
//     return (
//         <TooltipProvider>
//             <div className="flex flex-col min-h-screen bg-gray-50">
//                 <NavbarDemo />
//                 <main className="flex-grow">
//                     {view === "landing" && <LandingView setView={setView} numericDone={numericDone} yesNoDone={yesNoDone} />}
//                     {view === "numeric" && <NumericFullscreen numericState={numericState} updateNumericValue={updateNumericValue} computeGap={computeGap} computeRating={computeRating} handleNumericSubmit={handleNumericSubmit} setView={setView} isDesktop={isDesktop} />}
//                     {view === "yesno" && <YesNoFullscreen yesNoState={yesNoState} updateYesNoValue={updateYesNoValue} handleYesNoSubmit={handleYesNoSubmit} setView={setView} isDesktop={isDesktop} />}
//                     {view === "results" && <ResultsFullscreen finalScore={finalScore} numericScoreWeighted={numericScoreWeighted} yesScoreWeighted={yesScoreWeighted} allTips={allTips} setView={setView} />}
//                 </main>
//                 <Footer4Col />
//             </div>
//         </TooltipProvider>
//     );
// }





"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from 'next/link';

// Lucide Icons Import
import { 
    Info, 
    Calculator, 
    CheckSquare, 
    Trophy, 
    ChevronDown,
    Dribbble,
    Facebook,
    Github,
    Instagram,
    Mail,
    MapPin,
    Phone,
    Twitter,
    HelpCircle,
    TrendingUp,
    Sparkles,
    CheckCircle2
} from "lucide-react";

// Shadcn UI Imports
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import {
    Popover,
    PopoverTrigger,
    PopoverContent,
} from "@/components/ui/popover";

// --- CUSTOM HOOK for Media Queries ---
const useMediaQuery = (query: string) => {
    const [matches, setMatches] = useState(false);

    useEffect(() => {
        // This code will only run on the client, where `window` is available.
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
const Footer4Col = () => (
    <footer className="bg-gray-100 p-8 mt-12">
        <div className="container mx-auto text-center text-gray-600">
            <p>&copy; {new Date().getFullYear()} Financial Health Services. All rights reserved.</p>
            <div className="flex justify-center space-x-4 mt-4">
                <a href="#" className="hover:text-gray-900">Privacy Policy</a>
                <a href="#" className="hover:text-gray-900">Terms of Service</a>
                <a href="#" className="hover:text-gray-900">Contact Us</a>
            </div>
        </div>
    </footer>
);

const NavbarDemo = () => (
    <nav className="bg-white shadow-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
                <div className="flex-shrink-0">
                    <a href="#" className="text-2xl font-bold text-gray-800">FinHealth</a>
                </div>
                <div className="hidden md:block">
                    <div className="ml-10 flex items-baseline space-x-4">
                        <a href="#" className="text-gray-600 hover:bg-gray-100 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium">Home</a>
                        <a href="#how-it-works" className="text-gray-600 hover:bg-gray-100 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium">How It Works</a>
                        <a href="#" className="text-gray-600 hover:bg-gray-100 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium">About</a>
                    </div>
                </div>
            </div>
        </div>
    </nav>
);

// --- HELPERS ---
const formatCurrency = (value: number | string): string => {
    if (value === null || value === undefined || value === '') return '';
    const num = Number(String(value).replace(/[^0-9.-]+/g, ""));
    if (isNaN(num)) return '';
    return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(num);
};

const parseCurrency = (value: string): string => {
    if (typeof value !== 'string') return '';
    return value.replace(/[^0-9]/g, '');
};

// --- CONDITIONAL INFO COMPONENT ---
const InfoPopup = ({ info, isDesktop }: { info: string; isDesktop: boolean }) => {
    const commonButtonClasses = "p-1 rounded-full hover:bg-gray-200 cursor-pointer focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500";
    const commonContentClasses = "w-80 z-50 bg-black text-white border-black";

    if (isDesktop) {
        return (
            <Tooltip>
                <TooltipTrigger asChild>
                    <button className={commonButtonClasses}>
                        <Info size={16} />
                    </button>
                </TooltipTrigger>
                <TooltipContent className={commonContentClasses}>
                    <p className="text-sm">{info}</p>
                </TooltipContent>
            </Tooltip>
        );
    }

    return (
        <Popover>
            <PopoverTrigger asChild>
                <button onClick={(e) => e.stopPropagation()} className={commonButtonClasses}>
                    <Info size={16} />
                </button>
            </PopoverTrigger>
            <PopoverContent side="top" align="center" className={commonContentClasses}>
                <p className="text-sm">{info}</p>
            </PopoverContent>
        </Popover>
    );
};


// --- TYPE DEFINITIONS ---
type View = "landing" | "numeric" | "yesno" | "results";
type YesNoValue = 'yes' | 'no' | 'dont_know' | null;

type NumericField = { 
  key: string; 
  label: string; 
  value: string; 
  info: string;
  type: 'core' | 'rated';
  defaultValue?: number; 
  higherBetter?: boolean; 
};

type YesNoField = { 
  key: string; 
  label: string; 
  value: YesNoValue; 
  info: string; 
};

type NumericFullscreenProps = { 
    numericState: NumericField[]; 
    updateNumericValue: (key: string, newValue: string) => void; 
    computeGap: (f: NumericField) => number; 
    computeRating: (f: NumericField) => number; 
    handleNumericSubmit: () => void; 
    setView: React.Dispatch<React.SetStateAction<View>>;
    isDesktop: boolean;
};

type YesNoFullscreenProps = { 
    yesNoState: YesNoField[]; 
    updateYesNoValue: (key: string, checked: YesNoValue) => void; 
    handleYesNoSubmit: () => void; 
    setView: React.Dispatch<React.SetStateAction<View>>;
    isDesktop: boolean;
};

type ResultsFullscreenProps = { 
    finalScore: number; 
    numericScoreWeighted: number; 
    yesScoreWeighted: number; 
    allTips: string[]; 
    setView: React.Dispatch<React.SetStateAction<View>>; 
};

type LandingViewProps = { 
    numericDone: boolean; 
    yesNoDone: boolean; 
    setView: React.Dispatch<React.SetStateAction<View>>; 
};

type CollapsibleSectionProps = {
    title: string;
    icon: React.ElementType;
    isComplete: boolean;
    statusText: string;
    isOpen: boolean;
    setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
    children: React.ReactNode;
};

// --- DATA CONSTANTS ---
const initialNumeric: NumericField[] = [
    { key: "monthlyIncome", label: "Monthly Income", value: "", info: "Your gross monthly income from all sources.", type: 'core' },
    { key: "monthlyExpenses", label: "Monthly Expenses", value: "", info: "Your total monthly spending.", type: 'core' },
    { key: "familyMembers", label: "Family Members", value: "", info: "Number of dependents you support financially.", type: 'core' },
    { key: "incomeProtection", label: "Income Protection (life cover)", defaultValue: 2000000, value: "", higherBetter: true, info: "Recommended life cover (example: annual income × ~20).", type: 'rated' },
    { key: "emergencyFund", label: "Emergency Fund", defaultValue: 120000, value: "", higherBetter: true, info: "Emergency fund typically 3-6 months of expenses. Default uses 3 months.", type: 'rated' },
    { key: "retirementGoals", label: "Retirement Corpus Goal", defaultValue: 12000000, value: "", higherBetter: true, info: "Estimated retirement corpus required (placeholder rule).", type: 'rated' },
    { key: "healthInsurance", label: "Health Insurance Sum Insured", defaultValue: 800000, value: "", higherBetter: true, info: "Recommended health cover relative to annual income and family size.", type: 'rated' },
    { key: "criticalIllness", label: "Critical Illness Cover", defaultValue: 300000, value: "", higherBetter: true, info: "Recommended sum assured for critical illness policies (rule-of-thumb).", type: 'rated' },
    { key: "disabilityInsurance", label: "Disability Insurance", defaultValue: 1500000, value: "", higherBetter: true, info: "Income replacement cover in case of long-term disability.", type: 'rated' },
    { key: "childEducation", label: "Child Education Fund", defaultValue: 2000000, value: "", higherBetter: true, info: "Target corpus for child education (placeholder).", type: 'rated' },
    { key: "debtManagement", label: "Debt Management (acceptable EMI)", defaultValue: 40000, value: "", higherBetter: false, info: "Acceptable EMI threshold (rule-of-thumb: ≤ 40% of income).", type: 'rated' },
];

const initialYesNo: YesNoField[] = [
    { key: "budgetPlanning", label: "Budget Planning", value: null, info: "Do you maintain a monthly/quarterly budget?" },
    { key: "wealthBuilding", label: "Wealth Building", value: null, info: "Do you follow a structured wealth-building plan?" },
    { key: "optimizeTax", label: "Optimize Tax Saving Investments", value: null, info: "Do you leverage tax-saving investments effectively?" },
    { key: "openHUF", label: "Open HUF Account", value: null, info: "Is an HUF account opened/considered (if applicable)?" },
    { key: "homeLoanRent", label: "Home Loan & Rent", value: null, info: "Is your housing EMI/rent within acceptable limits?" },
    { key: "cibil", label: "CIBIL Score ≥ 700", value: null, info: "Is your credit score above 700?" },
    { key: "spouseCoverage", label: "Spouse Coverage", value: null, info: "Does spouse have adequate insurance/coverage?" },
    { key: "familyGoals", label: "Family Goals", value: null, info: "Are family financial goals documented and planned?" },
    { key: "estatePlanning", label: "Estate Planning", value: null, info: "Do you have a will/estate plan in place?" },
    { key: "diversification", label: "Investment Diversification", value: null, info: "Are your investments diversified across asset classes?" },
    { key: "legacyFund", label: "Legacy Fund", value: null, info: "Have you planned for legacy/wealth transfer to next generation?" },
];

// --- COLLAPSIBLE CARD & SECTION COMPONENTS ---
const CollapsibleCard = ({ title, children, isComplete }: { title: string; children: React.ReactNode; isComplete: boolean }) => {
    const [isOpen, setIsOpen] = useState(true);
    return (
        <Card className={`transition-all duration-300 ${isOpen && isComplete ? 'border-green-500' : 'border'}`}>
            <button onClick={() => setIsOpen(!isOpen)} className="w-full p-4 flex justify-between items-center text-left">
                <div className="flex items-center gap-3">
                    <h3 className="text-lg font-semibold">{title}</h3>
                    {!isOpen && isComplete && <CheckCircle2 className="w-5 h-5 text-green-500" />}
                </div>
                <motion.div animate={{ rotate: isOpen ? 180 : 0 }}><ChevronDown /></motion.div>
            </button>
            <AnimatePresence>
                {isOpen && (
                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}>
                        <CardContent className="border-t pt-4">{children}</CardContent>
                    </motion.div>
                )}
            </AnimatePresence>
        </Card>
    );
};

const CollapsibleSection = ({ title, icon: Icon, isComplete, statusText, isOpen, setIsOpen, children }: CollapsibleSectionProps) => (
    <motion.div layout className="w-full max-w-3xl mb-6 bg-white border-t-4 rounded-xl shadow-md" style={{borderColor: isComplete ? '#22c55e' : '#e5e7eb'}}>
        <button onClick={() => setIsOpen(!isOpen)} className="flex items-center justify-between w-full p-6 text-left cursor-pointer focus:outline-none">
            <div className="flex items-center">
                <Icon className={`w-8 h-8 mr-4 ${isComplete ? 'text-green-500' : 'text-gray-500'}`} />
                <div>
                    <h2 className="text-xl font-semibold text-gray-800">{title}</h2>
                    <p className={`text-sm font-semibold ${isComplete ? 'text-green-600' : 'text-gray-500'}`}>{statusText}</p>
                </div>
            </div>
            <motion.div animate={{ rotate: isOpen ? 180 : 0 }} transition={{ duration: 0.3 }}><ChevronDown className="w-6 h-6 text-gray-500" /></motion.div>
        </button>
        <AnimatePresence>
            {isOpen && (
                <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1, transition: { opacity: { delay: 0.15 } } }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.3, ease: 'easeInOut' }} className="overflow-hidden">
                    <div className="px-6 pb-6 border-t border-gray-200">{children}</div>
                </motion.div>
            )}
        </AnimatePresence>
    </motion.div>
);

// --- VIEW COMPONENTS ---
const NumericFullscreen = ({ numericState, updateNumericValue, computeGap, computeRating, handleNumericSubmit, isDesktop }: NumericFullscreenProps) => {
    const sections = {
        core: { title: "Core Financials", fields: numericState.filter(f => f.type === 'core') },
        security: { title: "Long-Term Security", fields: numericState.filter(f => ["incomeProtection", "emergencyFund", "retirementGoals"].includes(f.key)) },
        insurance: { title: "Insurance Coverage", fields: numericState.filter(f => ["healthInsurance", "criticalIllness", "disabilityInsurance"].includes(f.key)) },
        goals: { title: "Other Financial Goals", fields: numericState.filter(f => ["childEducation", "debtManagement"].includes(f.key)) },
    };

    const isSectionComplete = (fields: NumericField[]) => fields.every(f => f.value !== "" && !isNaN(Number(f.value)));

    return (
        <div className="flex items-start justify-center min-h-screen px-4 py-12 bg-[#fdfbf7] text-black">
            <div className="w-full max-w-5xl space-y-6">
                <div className="text-center">
                    <h2 className="text-3xl font-bold">Step 1: Your Financial Numbers</h2>
                    <p className="text-gray-600 mt-2">Enter your details below. We'll use this to calculate your score.</p>
                </div>
                {Object.values(sections).map(({ title, fields }) => (
                    <CollapsibleCard key={title} title={title} isComplete={isSectionComplete(fields)}>
                        <div className="overflow-x-auto">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead className="w-[30%]">Field</TableHead>
                                        <TableHead className="w-[20%]">Your Value</TableHead>
                                        {fields[0].type === 'rated' && (
                                            <>
                                                <TableHead className="text-center">Target</TableHead>
                                                <TableHead className="text-center">Gap</TableHead>
                                                <TableHead className="text-right">Rating</TableHead>
                                            </>
                                        )}
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {fields.map((f) => (
                                        <TableRow key={f.key}>
                                            <TableCell className="font-medium">
                                                <div className="flex items-center gap-2">
                                                    <span>{f.label}</span>
                                                    <InfoPopup info={f.info} isDesktop={isDesktop} />
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <Input 
                                                    type="text" 
                                                    value={f.type === 'core' && f.key !== 'familyMembers' ? formatCurrency(f.value) : (f.type === 'rated' ? formatCurrency(f.value) : f.value)}
                                                    onChange={(e) => updateNumericValue(f.key, e.target.value)} 
                                                    className="w-full" 
                                                    placeholder={f.defaultValue ? formatCurrency(f.defaultValue) : "Enter value"} 
                                                />
                                            </TableCell>
                                            {f.type === 'rated' ? (
                                                <>
                                                    <TableCell className="text-center">{formatCurrency(f.defaultValue || 0)}</TableCell>
                                                    <TableCell className={`text-center font-medium ${computeGap(f) > 0 ? 'text-red-600' : 'text-green-600'}`}>{formatCurrency(computeGap(f))}</TableCell>
                                                    <TableCell className="text-right font-bold">{computeRating(f)} / 5</TableCell>
                                                </>
                                            ) : <TableCell colSpan={3}></TableCell>}
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    </CollapsibleCard>
                ))}
                <div className="flex justify-end pt-4"><Button onClick={handleNumericSubmit}>Submit & Continue</Button></div>
            </div>
        </div>
    );
};

const YesNoFullscreen = ({ yesNoState, updateYesNoValue, handleYesNoSubmit, isDesktop }: YesNoFullscreenProps) => (
    <div className="flex items-start justify-center min-h-screen px-4 py-12 bg-[#fdfbf7] text-black">
        <div className="w-full max-w-3xl">
            <Card className="bg-white">
                <CardHeader>
                    <CardTitle>Step 2: Financial Habits</CardTitle>
                    <p className="text-sm text-gray-600">Answer these questions to help us understand your financial practices.</p>
                </CardHeader>
                <CardContent>
                    <ul className="space-y-4">
                        {yesNoState.map((y) => (
                            <li key={y.key} className="p-4 border rounded-lg">
                                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                                    <div className="flex items-center gap-2 font-medium text-gray-800">
                                        <span>{y.label}</span>
                                        <InfoPopup info={y.info} isDesktop={isDesktop} />
                                    </div>
                                    {/* FIX: Added flex-wrap and justify-end to the button container */}
                                    <div className="flex flex-wrap justify-end gap-2">
                                        <Button onClick={() => updateYesNoValue(y.key, 'yes')} variant={y.value === 'yes' ? 'default' : 'outline'} className={`w-24 ${y.value === 'yes' ? 'bg-green-600 hover:bg-green-700 text-white' : ''}`}>Yes</Button>
                                        <Button onClick={() => updateYesNoValue(y.key, 'no')} variant={y.value === 'no' ? 'default' : 'outline'} className={`w-24 ${y.value === 'no' ? 'bg-red-600 hover:bg-red-700 text-white' : ''}`}>No</Button>
                                        <Button onClick={() => updateYesNoValue(y.key, 'dont_know')} variant={y.value === 'dont_know' ? 'default' : 'outline'} className={`w-28 ${y.value === 'dont_know' ? 'bg-gray-500 hover:bg-gray-600 text-white' : ''}`}>Don't Know</Button>
                                    </div>
                                </div>
                            </li>
                        ))}
                    </ul>
                    <div className="flex justify-end mt-6"><Button onClick={handleYesNoSubmit}>Submit</Button></div>
                </CardContent>
            </Card>
        </div>
    </div>
);

const ResultsFullscreen = ({ finalScore, numericScoreWeighted, yesScoreWeighted, allTips, setView }: ResultsFullscreenProps) => (
    <div className="flex items-start justify-center min-h-screen px-4 py-12 bg-[#fdfbf7] text-black">
        <div className="w-full max-w-3xl">
            <Card className="bg-white">
                <CardHeader><CardTitle>Your Financial Health Report</CardTitle></CardHeader>
                <CardContent>
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                        <div>
                            <h2 className="text-lg font-semibold">Final Score</h2>
                            <p className="text-5xl font-bold">{finalScore} / 100</p>
                            <p className="mt-1 text-sm text-gray-600">(Numeric: {numericScoreWeighted.toFixed(1)} / 60, Habits: {yesScoreWeighted.toFixed(1)} / 40)</p>
                        </div>
                        <div className="space-x-2">
                            <Button variant="ghost" onClick={() => setView("landing")}>Back to Home</Button>
                            <Button>Download Report</Button>
                        </div>
                    </div>
                    <div className="mt-8">
                        <h3 className="font-semibold text-lg">Personalized Tips for Improvement</h3>
                        {allTips.length === 0 ? (<p className="mt-2 text-sm text-green-600">Great job — all fields meet or exceed targets!</p>) : (<ul className="mt-2 ml-5 space-y-2 text-sm list-disc">{allTips.map((t, i) => (<li key={i} dangerouslySetInnerHTML={{ __html: t }}></li>))}</ul>)}
                    </div>
                    <div className="mt-6 text-xs text-gray-500">
                        <p><strong>Notes:</strong></p>
                        <ul className="ml-5 list-disc">
                            <li>Your score is an estimate based on standard financial benchmarks.</li>
                            <li>Numeric ratings are calculated based on how close you are to the target value.</li>
                        </ul>
                    </div>
                </CardContent>
            </Card>
        </div>
    </div>
);

const LandingView = ({ setView, numericDone, yesNoDone }: LandingViewProps) => {
    const [isNumericOpen, setIsNumericOpen] = useState(true);
    const [isYesNoOpen, setIsYesNoOpen] = useState(true);
    const [isResultsOpen, setIsResultsOpen] = useState(true);

    return (
        <div className="flex flex-col items-center min-h-screen px-4 pt-12 pb-24 bg-[#fdfbf7] text-black">
            <div className="mb-12 text-center">
                <motion.h1 initial={{opacity: 0, y: 20}} animate={{opacity: 1, y: 0}} transition={{duration: 0.5}} className="mb-4 text-4xl font-bold text-gray-800 md:text-5xl">Your Financial Health Checkup</motion.h1>
                <motion.p initial={{opacity: 0, y: 20}} animate={{opacity: 1, y: 0}} transition={{duration: 0.5, delay: 0.2}} className="max-w-2xl mx-auto text-lg text-gray-600">
                    Confused about money stuff? 😵‍💫 This quick checkup gives you a simple score and personalized tips to get your finances on track. ✨
                </motion.p>
            </div>

            <CollapsibleSection title="Step 1: Numeric Inputs" icon={Calculator} isComplete={numericDone} statusText={numericDone ? '✓ Completed' : 'Required'} isOpen={isNumericOpen} setIsOpen={setIsNumericOpen}>
                <p className="mb-4 text-gray-600">Enter your key financial figures. This section is crucial for calculating the quantitative part of your score.</p>
                <Button onClick={() => setView("numeric")} className="w-full md:w-auto">{numericDone ? 'Edit Numeric Inputs' : 'Start Step 1'}</Button>
            </CollapsibleSection>

            <CollapsibleSection title="Step 2: Pre-Requisites" icon={CheckSquare} isComplete={yesNoDone} statusText={yesNoDone ? '✓ Completed' : 'Required'} isOpen={isYesNoOpen} setIsOpen={setIsYesNoOpen}>
                <p className="mb-4 text-gray-600">Answer a few simple questions about your financial habits and planning.</p>
                <Button onClick={() => setView("yesno")} className="w-full md:w-auto">{yesNoDone ? 'Edit Pre-Requisites' : 'Start Step 2'}</Button>
            </CollapsibleSection>

            <AnimatePresence>
                {numericDone && yesNoDone && (
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }} className="flex justify-center w-full">
                        <CollapsibleSection title="Results" icon={Trophy} isComplete={true} statusText="Ready to View" isOpen={isResultsOpen} setIsOpen={setIsResultsOpen}>
                            <p className="mb-4 text-gray-600">Great job! Your financial health score is calculated. View your detailed report and personalized tips.</p>
                            <Button onClick={() => setView("results")} className="w-full md:w-auto">View Full Report</Button>
                        </CollapsibleSection>
                    </motion.div>
                )}
            </AnimatePresence>
            
            <HowItWorks />
        </div>
    );
};

function HowItWorks() {
    const steps = [
        { icon: HelpCircle, title: "Answer a Few Qs", description: "Quickly fill out your numbers and check off some yes/no items. No judgement." },
        { icon: TrendingUp, title: "Get Your Score", description: "We instantly calculate your financial health score, giving you a simple snapshot of where you stand." },
        { icon: Sparkles, title: "Level Up with Tips", description: "Receive personalized, jargon-free tips to help you improve your score and build better money habits." }
    ];
    return (
        <div id="how-it-works" className="w-full max-w-5xl px-4 py-12 mx-auto text-center">
             <motion.h2 initial={{opacity: 0, y: 20}} whileInView={{opacity: 1, y: 0}} viewport={{ once: true, amount: 0.8 }} transition={{duration: 0.5}} className="mb-8 text-3xl font-bold text-gray-800">How It Works</motion.h2>
             <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
                {steps.map((step, index) => (
                    <motion.div 
                        key={step.title}
                        initial={{opacity: 0, y: 20}} 
                        whileInView={{opacity: 1, y: 0}} 
                        viewport={{ once: true, amount: 0.5 }}
                        transition={{duration: 0.5, delay: index * 0.2}}
                        className="flex flex-col items-center p-6 bg-white rounded-xl shadow-md"
                    >
                        <step.icon className="w-12 h-12 mb-4 text-purple-500"/>
                        <h3 className="mb-2 text-lg font-semibold text-gray-800">{step.title}</h3>
                        <p className="text-sm text-gray-600">{step.description}</p>
                    </motion.div>
                ))}
            </div>
        </div>
    );
}

// --- MAIN PAGE COMPONENT ---
export default function FinancialHealthCheckupPage() {
    const [view, setView] = useState<View>("landing");
    const [numericState, setNumericState] = useState<NumericField[]>(initialNumeric);
    const [yesNoState, setYesNoState] = useState<YesNoField[]>(initialYesNo);
    const [numericDone, setNumericDone] = useState(false);
    const [yesNoDone, setYesNoDone] = useState(false);
    
    // Use the hook to check for desktop screen sizes (Tailwind's `md` breakpoint)
    const isDesktop = useMediaQuery("(min-width: 768px)");

    const updateNumericValue = (key: string, newValue: string) => {
        const parsedValue = (key === 'familyMembers') ? newValue.replace(/[^0-9]/g, '') : parseCurrency(newValue);
        setNumericState((prev) => prev.map((p) => (p.key === key ? { ...p, value: parsedValue } : p))); 
    };
    
    const updateYesNoValue = (key: string, value: YesNoValue) => { 
        setYesNoState((prev) => prev.map((p) => (p.key === key ? { ...p, value } : p))); 
    };
    
    const computeRating = (f: NumericField): number => { 
      if (f.type !== 'rated' || typeof f.defaultValue === 'undefined' || typeof f.higherBetter === 'undefined' || f.value === '') return 0;
      const actual = Number(f.value) <= 0 ? 0.0001 : Number(f.value); 
      const def = f.defaultValue <= 0 ? 0.0001 : f.defaultValue; 
      let percent = f.higherBetter ? actual / def : def / actual; 
      if (!isFinite(percent) || percent <= 0) percent = 0; 
      if (percent > 1) percent = 1; 
      return Math.max(0, Math.min(5, Math.ceil(percent * 5))); 
    };
    
    const computeGap = (f: NumericField): number => {
      if (f.type !== 'rated' || typeof f.defaultValue === 'undefined' || f.value === '') return 0;
      return f.defaultValue - Number(f.value); 
    };

    const ratedNumericFields = numericState.filter(f => f.type === 'rated');
    const numericComplete = numericState.every((n) => n.value !== "" && !isNaN(Number(n.value)));
    
    const numericSum = ratedNumericFields.reduce((acc, cur) => acc + computeRating(cur), 0);
    const numericMax = ratedNumericFields.length * 5;
    const numericScoreWeighted = numericMax > 0 ? (numericSum / numericMax) * 60 : 60;
    
    const yesCount = yesNoState.filter(y => y.value === 'yes').length;
    const totalYesNo = yesNoState.length;
    const yesScoreWeighted = totalYesNo > 0 ? (yesCount / totalYesNo) * 40 : 40;
    const finalScore = Math.round(numericScoreWeighted + yesScoreWeighted);

    const numericTips: string[] = [];
    ratedNumericFields.forEach((f) => { 
        const rating = computeRating(f); 
        if (rating < 5) { 
            const gap = computeGap(f); 
            const formattedValue = formatCurrency(Number(f.value));
            const formattedDefault = formatCurrency(f.defaultValue!);
            const formattedGap = formatCurrency(gap);
            const tip = `For <strong>${f.label}</strong>, your current value is ${formattedValue} against a target of ${formattedDefault} (a gap of ${formattedGap}). Aim to increase your amount to better meet this goal.`; 
            numericTips.push(tip); 
        } 
    });
    
    const yesNoTips: string[] = [];
    yesNoState.forEach((y) => { 
      if (y.value === 'no' || y.value === 'dont_know') { 
        yesNoTips.push(`Consider addressing <strong>"${y.label}"</strong>. ${y.info}`); 
      } 
    });
    const allTips = [...numericTips, ...yesNoTips];

    const handleNumericSubmit = () => { 
      if (!numericComplete) { 
        alert("Please ensure all numeric fields have a valid number entered."); 
        return; 
      } 
      setNumericDone(true); 
      setView("landing"); 
    };

    const handleYesNoSubmit = () => {
      if (yesNoState.some(y => y.value === null)) {
          alert("Please answer all questions before submitting.");
          return;
      }
      setYesNoDone(true); 
      setView("landing"); 
    };
    
    return (
        <TooltipProvider>
            <div className="flex flex-col min-h-screen bg-gray-50">
                <NavbarDemo />
                <main className="flex-grow">
                    {view === "landing" && <LandingView setView={setView} numericDone={numericDone} yesNoDone={yesNoDone} />}
                    {view === "numeric" && <NumericFullscreen numericState={numericState} updateNumericValue={updateNumericValue} computeGap={computeGap} computeRating={computeRating} handleNumericSubmit={handleNumericSubmit} setView={setView} isDesktop={isDesktop} />}
                    {view === "yesno" && <YesNoFullscreen yesNoState={yesNoState} updateYesNoValue={updateYesNoValue} handleYesNoSubmit={handleYesNoSubmit} setView={setView} isDesktop={isDesktop} />}
                    {view === "results" && <ResultsFullscreen finalScore={finalScore} numericScoreWeighted={numericScoreWeighted} yesScoreWeighted={yesScoreWeighted} allTips={allTips} setView={setView} />}
                </main>
                <Footer4Col />
            </div>
        </TooltipProvider>
    );
}