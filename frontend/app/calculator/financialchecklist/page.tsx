"use client";

import React, { useState, useEffect, useMemo, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

// Lucide Icons Import
import { 
    Info, 
    Calculator, 
    CheckSquare, 
    Trophy, 
    ChevronDown,
    HelpCircle,
    TrendingUp,
    Sparkles,
    CheckCircle2,
    Lock,
    X // Added for modal close button
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

// Original Navbar and Footer Imports
import { NavbarDemo } from "@/components/Navbar";
import Footer4Col from "@/components/footer-column";

// --- CUSTOM HOOK for Media Queries ---
const useMediaQuery = (query: string) => {
    const [matches, setMatches] = useState(false);
    useEffect(() => {
        if (typeof window !== 'undefined') {
            const media = window.matchMedia(query);
            if (media.matches !== matches) {
                setMatches(media.matches);
            }
            const listener = () => setMatches(media.matches);
            window.addEventListener("resize", listener);
            return () => window.removeEventListener("resize", listener);
        }
    }, [matches, query]);
    return matches;
};

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
    const commonContentClasses = "w-80 z-50 bg-black text-white border-black p-2 rounded-md";

    if (isDesktop) {
        return (
            <Tooltip>
                <TooltipTrigger asChild>
                    <button type="button" className={commonButtonClasses}>
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
                <button type="button" onClick={(e) => e.stopPropagation()} className={commonButtonClasses}>
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
  targetValue?: string; 
  targetLabel?: string; 
};

type YesNoField = { 
  key: string; 
  label: string; 
  value: YesNoValue; 
  info: string; 
};

type NumericFullscreenProps = { 
    numericState: NumericField[]; 
    updateNumericValue: (key: string, newValue: string, isTarget?: boolean) => void; 
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
    setView: React.Dispatch<React.SetStateAction<View>>;
    onOpenReport: () => void;
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
    isDisabled?: boolean;
};

type ReportModalProps = {
    isOpen: boolean;
    onClose: () => void;
    tips: string[];
};


// --- DATA CONSTANTS ---
const initialNumeric: NumericField[] = [
    { key: "monthlyIncome", label: "Monthly Income", value: "", info: "Your gross monthly income from all sources.", type: 'core' },
    { key: "monthlyExpenses", label: "Monthly Expenses", value: "", info: "Your total monthly spending.", type: 'core' },
    { key: "familyMembers", label: "Family Members", value: "", info: "Number of dependents you support financially.", type: 'core' },
    { key: "incomeProtection", label: "Income Protection (life cover)", defaultValue: 0, value: "", higherBetter: true, info: "Recommended life cover (example: annual income × ~20).", type: 'rated' },
    { key: "emergencyFund", label: "Emergency Fund", defaultValue: 0, value: "", higherBetter: true, info: "Recommended emergency fund is 6 months of your expenses.", type: 'rated' },
    { key: "retirementGoals", label: "Retirement Corpus Goal", defaultValue: 0, value: "", higherBetter: true, info: "Estimated retirement corpus required (placeholder rule).", type: 'rated' },
    { key: "healthInsurance", label: "Health Insurance Sum Insured", defaultValue: 0, value: "", higherBetter: true, info: "Recommended health cover is ₹10 Lakh per family member.", type: 'rated' },
    { key: "criticalIllness", label: "Critical Illness Cover", defaultValue: 0, value: "", higherBetter: true, info: "Recommended cover is 3-5 times your annual income. We use 4x as a target.", type: 'rated' },
    { key: "disabilityInsurance", label: "Disability Insurance", defaultValue: 0, value: "", higherBetter: true, info: "Recommended cover is 5-10 times your annual income. We use 7.5x as a target.", type: 'rated' },
    { key: "debtManagement", label: "Total Monthly EMIs", defaultValue: 0, value: "", higherBetter: false, info: "Your total EMIs should be less than 40% of your monthly income for a good score.", type: 'rated' },
    { key: "childEducation", label: "Child Education Fund", value: "", targetValue: "", targetLabel: "Your Goal", higherBetter: true, info: "Enter your target corpus (Your Goal) and your current savings for your child's education.", type: 'rated' },
    { key: "childMarriage", label: "Child Marriage Fund", value: "", targetValue: "", targetLabel: "Your Goal", higherBetter: true, info: "Enter your target corpus (Your Goal) and your current savings for your child's marriage.", type: 'rated' },
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

const CollapsibleSection = ({ title, icon: Icon, isComplete, statusText, isOpen, setIsOpen, children, isDisabled = false }: CollapsibleSectionProps) => (
    <motion.div layout className={`w-full max-w-3xl mb-6 bg-white border-t-4 rounded-xl shadow-md ${isDisabled ? 'bg-gray-50 opacity-60' : ''}`} style={{borderColor: isComplete ? '#22c55e' : (isDisabled ? '#d1d5db' : '#e5e7eb')}}>
        <button onClick={() => !isDisabled && setIsOpen(!isOpen)} className={`flex items-center justify-between w-full p-4 md:p-6 text-left focus:outline-none ${isDisabled ? 'cursor-not-allowed' : 'cursor-pointer'}`}>
            <div className="flex items-center">
                <Icon className={`w-6 h-6 md:w-8 md:h-8 mr-4 ${isComplete ? 'text-green-500' : 'text-gray-500'}`} />
                <div>
                    <h2 className="text-lg md:text-xl font-semibold text-gray-800">{title}</h2>
                    <p className={`text-sm font-semibold ${isComplete ? 'text-green-600' : 'text-gray-500'}`}>{statusText}</p>
                </div>
            </div>
            {isDisabled ? <Lock className="w-6 h-6 text-gray-400" /> : <motion.div animate={{ rotate: isOpen ? 180 : 0 }} transition={{ duration: 0.3 }}><ChevronDown className="w-6 h-6 text-gray-500" /></motion.div>}
        </button>
        <AnimatePresence>
            {isOpen && !isDisabled && (
                <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1, transition: { opacity: { delay: 0.15 } } }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.3, ease: 'easeInOut' }} className="overflow-hidden">
                    <div className="px-4 md:px-6 pb-6 border-t border-gray-200">{children}</div>
                </motion.div>
            )}
        </AnimatePresence>
    </motion.div>
);

// --- VIEW COMPONENTS ---
const NumericFullscreen = ({
  numericState,
  updateNumericValue,
  computeGap,
  computeRating,
  handleNumericSubmit,
  setView,
  isDesktop,
}: NumericFullscreenProps) => {
  const sections = {
    core: { title: "Core Financials", fields: numericState.filter(f => f.type === "core") },
    security: { title: "Long-Term Security", fields: numericState.filter(f => ["incomeProtection", "emergencyFund", "retirementGoals"].includes(f.key)) },
    insurance: { title: "Insurance Coverage", fields: numericState.filter(f => ["healthInsurance", "criticalIllness", "disabilityInsurance"].includes(f.key)) },
    goals: { title: "Other Financial Goals", fields: numericState.filter(f => ["debtManagement", "childEducation", "childMarriage"].includes(f.key)) },
  };

  const isSectionComplete = (fields: NumericField[]) =>
    fields.every(f => {
        const hasValue = f.value !== "" && !isNaN(Number(f.value));
        if (f.targetLabel) {
            return hasValue && f.targetValue !== "" && !isNaN(Number(f.targetValue));
        }
        return hasValue;
    });

  return (
    <div className="flex items-start justify-center min-h-screen px-4 py-12 bg-[#fdfbf7] text-black">
      <div className="w-full max-w-5xl space-y-6">
        <div className="text-center">
          <h2 className="text-3xl font-bold">Step 1: Your Financial Numbers</h2>
          <p className="text-gray-600 mt-2">Enter your details below to calculate your score.</p>
        </div>

        {Object.values(sections).map(({ title, fields }) => (
          <CollapsibleCard key={title} title={title} isComplete={isSectionComplete(fields)}>
            {isDesktop ? (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader className="hidden md:table-header-group">
                    <TableRow>
                      <TableHead className="w-[30%]">Field</TableHead>
                      <TableHead className="w-[20%]">Your Value</TableHead>
                      {fields.some(f => f.type === "rated") && (
                        <>
                          <TableHead className="text-center w-[20%]">Target</TableHead>
                          <TableHead className="text-center w-[15%]">Gap</TableHead>
                          <TableHead className="text-right w-[15%]">Score</TableHead>
                        </>
                      )}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {fields.map(f => (
                      <TableRow key={f.key} className="block md:table-row mb-4 md:mb-0 border rounded-lg md:border-none p-2 md:p-0">
                        <TableCell className="block md:table-cell font-medium" data-label="Field">
                          <div className="flex items-center gap-2">
                            <span>{f.label}</span>
                            <InfoPopup info={f.info} isDesktop={isDesktop} />
                          </div>
                        </TableCell>
                        <TableCell className="block md:table-cell" data-label="Your Value">
                          <Input
                            type="text"
                            value={f.key !== "familyMembers" ? formatCurrency(f.value) : f.value}
                            onChange={e => updateNumericValue(f.key, e.target.value)}
                            className="w-full"
                            placeholder={"Enter value"}
                          />
                        </TableCell>

                        {f.type === "rated" ? (
                          <>
                            <TableCell className="block md:table-cell text-left md:text-center" data-label="Target">
                                {f.targetLabel ? (
                                    <Input
                                        type="text"
                                        value={formatCurrency(f.targetValue || "")}
                                        onChange={e => updateNumericValue(f.key, e.target.value, true)}
                                        className="w-full"
                                        placeholder={f.targetLabel}
                                    />
                                ) : (
                                    <Input 
                                      type="text"
                                      value={formatCurrency(f.defaultValue || 0)}
                                      disabled
                                      className="w-full bg-gray-100 border-gray-300 text-gray-700 text-center disabled:cursor-default"
                                    />
                                )}
                            </TableCell>
                            <TableCell className="block md:table-cell text-left md:text-center font-medium" data-label="Gap">
                              {(() => {
                                const gap = computeGap(f);
                                const colorClass = f.higherBetter === false && gap < 0 ? "text-red-600" : (gap > 0 ? "text-red-600" : "text-green-600");
                                return (
                                  <span className={colorClass}>
                                    {formatCurrency(Math.abs(gap))}
                                  </span>
                                );
                              })()}
                            </TableCell>
                            <TableCell className="block md:table-cell text-left md:text-right font-bold" data-label="Rating">
                              {computeRating(f)} / 5
                            </TableCell>
                          </>
                        ) : (
                          <TableCell className="hidden md:table-cell" colSpan={3}></TableCell>
                        )}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <div className="space-y-4">
                {fields.map(f => {
                  const gap = computeGap(f);
                  const colorClass = f.higherBetter === false && gap < 0 ? "text-red-600" : (gap > 0 ? "text-red-600" : "text-green-600");
                  return (
                    <div key={f.key} className="border rounded-xl p-4 bg-white shadow-sm">
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-semibold">{f.label}</span>
                        <InfoPopup info={f.info} isDesktop={isDesktop} />
                      </div>
                      <Input
                        type="text"
                        value={f.key !== "familyMembers" ? formatCurrency(f.value) : f.value}
                        onChange={e => updateNumericValue(f.key, e.target.value)}
                        placeholder={"Your current value"}
                        className="mb-3"
                      />
                      {f.targetLabel && (
                          <Input
                            type="text"
                            value={formatCurrency(f.targetValue || "")}
                            onChange={e => updateNumericValue(f.key, e.target.value, true)}
                            placeholder={f.targetLabel}
                            className="mb-3"
                          />
                      )}

                      {f.type === "rated" && (
                        <div className="grid grid-cols-3 gap-3 text-sm text-center">
                          <div>
                            <p className="text-gray-500 font-medium">Target</p>
                            <p className="font-semibold">{f.targetLabel ? formatCurrency(f.targetValue || 0) : formatCurrency(f.defaultValue || 0)}</p>
                          </div>
                          <div>
                            <p className="text-gray-500 font-medium">Gap</p>
                            <p className={`font-semibold ${colorClass}`}>
                              {formatCurrency(Math.abs(gap))}
                            </p>
                          </div>
                          <div>
                            <p className="text-gray-500 font-medium">Score</p>
                            <p className="font-bold">{computeRating(f)} / 5</p>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </CollapsibleCard>
        ))}

        <div className="flex justify-between items-center pt-4">
          <Button variant="ghost" onClick={() => setView('landing')}>Back to Home</Button>
          <Button onClick={handleNumericSubmit}>Submit & Continue to Step 2</Button>
        </div>
      </div>
    </div>
  );
};

const YesNoFullscreen = ({ yesNoState, updateYesNoValue, handleYesNoSubmit, setView, isDesktop }: YesNoFullscreenProps) => (
    <div className="flex items-start justify-center min-h-screen px-4 py-12 bg-[#fdfbf7] text-black">
        <div className="w-full max-w-3xl">
            <Card className="bg-white">
                <CardHeader>
                    <CardTitle>Step 2: Financial Habits</CardTitle>
                    <p className="text-sm text-gray-600">Answer these questions about your financial practices.</p>
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
                                    <div className="flex flex-wrap justify-end gap-2 w-full sm:w-auto">
                                        <Button onClick={() => updateYesNoValue(y.key, 'yes')} variant={y.value === 'yes' ? 'default' : 'outline'} className={`flex-1 sm:flex-none sm:w-24 ${y.value === 'yes' ? 'bg-green-600 hover:bg-green-700 text-white' : ''}`}>Yes</Button>
                                        <Button onClick={() => updateYesNoValue(y.key, 'no')} variant={y.value === 'no' ? 'default' : 'outline'} className={`flex-1 sm:flex-none sm:w-24 ${y.value === 'no' ? 'bg-red-600 hover:bg-red-700 text-white' : ''}`}>No</Button>
                                        <Button onClick={() => updateYesNoValue(y.key, 'dont_know')} variant={y.value === 'dont_know' ? 'default' : 'outline'} className={`w-full mt-2 sm:mt-0 sm:w-28 ${y.value === 'dont_know' ? 'bg-gray-500 hover:bg-gray-600 text-white' : ''}`}>Don't Know</Button>
                                    </div>
                                </div>
                            </li>
                        ))}
                    </ul>
                    <div className="flex justify-between mt-6">
                        <Button variant="ghost" onClick={() => setView('numeric')}>Back to Step 1</Button>
                        <Button onClick={handleYesNoSubmit}>Submit & View Results</Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    </div>
);

const ResultsFullscreen = ({ finalScore, numericScoreWeighted, yesScoreWeighted, setView, onOpenReport }: ResultsFullscreenProps) => (
  <div className="flex items-start justify-center min-h-screen px-2 py-6 md:px-6 md:py-10 bg-[#fdfbf7] text-black">
    <div className="w-full max-w-4xl">
      <Card className="bg-white shadow-lg rounded-2xl">
        <CardHeader className="pb-4">
          <CardTitle className="text-2xl md:text-3xl text-center">
            Your Financial Health Report
          </CardTitle>
        </CardHeader>

        <CardContent>
          <div className="flex flex-col items-center gap-4">

            <div className={`text-center p-3 rounded-lg font-semibold text-lg w-full max-w-md ${finalScore >= 50 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                {finalScore >= 50
                    ? `Congratulations! You've passed the financial health check.`
                    : `It looks like there's room for improvement.`
                }
            </div>

            <div>
              <h2 className="text-lg font-semibold text-center">Final Score</h2>
              <p className="text-5xl md:text-6xl font-bold text-center">
                {finalScore} / 100
              </p>
              <p className="mt-1 text-sm text-gray-600 text-center">
                (Numeric: {numericScoreWeighted.toFixed(1)} / 60, Habits:{" "}
                {yesScoreWeighted.toFixed(1)} / 40)
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 w-full max-w-md mt-3">
              <Button
                variant="ghost"
                onClick={() => setView("landing")}
                className="w-full sm:w-1/2 border border-gray-200 hover:bg-gray-100"
              >
                Back to Home
              </Button>
              <Button
                onClick={onOpenReport}
                className="w-full sm:w-1/2 bg-blue-600 hover:bg-blue-700 text-white"
              >
                Download Report
              </Button>
            </div>
          </div>

          <div className="mt-6 text-xs text-gray-500">
            <p><strong>Notes:</strong></p>
            <ul className="ml-5 list-disc">
              <li>Your score is an estimate based on standard financial benchmarks.</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  </div>
);

const ReportModal = ({ isOpen, onClose, tips }: ReportModalProps) => {
    const [isUnlocked, setIsUnlocked] = useState(false);
    const initialTipsCount = Math.max(1, Math.ceil(tips.length * 0.15));
    const displayedTips = isUnlocked ? tips : tips.slice(0, initialTipsCount);

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4"
                onClick={onClose}
            >
                <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.9, opacity: 0 }}
                    className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] flex flex-col"
                    onClick={(e) => e.stopPropagation()}
                >
                    <div className="p-6 border-b flex justify-between items-center">
                        <h2 className="text-xl font-bold">Your Personalized Report</h2>
                        <Button variant="ghost" size="icon" onClick={onClose} className="rounded-full">
                            <X size={24} />
                        </Button>
                    </div>
                    <div className="p-6 overflow-y-auto relative">
                        {tips.length === 0 ? (
                            <p className="text-green-600">Great job—all fields meet or exceed targets!</p>
                        ) : (
                            <ul className="space-y-3 list-disc pl-5">
                                {displayedTips.map((tip, i) => (
                                    <li key={i} dangerouslySetInnerHTML={{ __html: tip }}></li>
                                ))}
                            </ul>
                        )}

                        {!isUnlocked && tips.length > initialTipsCount && (
                            <div className="relative mt-4 pt-16 text-center">
                                <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-white to-transparent pointer-events-none"></div>
                                <div className="absolute bottom-0 left-0 w-full p-4 bg-white">
                                    <p className="font-semibold mb-2">Unlock {tips.length - initialTipsCount} more personalized tips!</p>
                                    <Button onClick={() => setIsUnlocked(true)} className="w-full sm:w-auto">
                                        View Full Report
                                    </Button>
                                </div>
                            </div>
                        )}
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
};


const LandingView = ({ setView, numericDone, yesNoDone }: LandingViewProps) => {
    const [isNumericOpen, setIsNumericOpen] = useState(true);
    const [isYesNoOpen, setIsYesNoOpen] = useState(false);
    const [isResultsOpen, setIsResultsOpen] = useState(false);

    const handleYesNoClick = () => {
        if (numericDone) {
            setView("yesno");
        } else {
            // This case might not be strictly needed if button is disabled, but good for safety
            alert("Please complete Step 1 first.");
        }
    };

    return (
        <div className="flex flex-col items-center min-h-screen px-4 pt-12 pb-24 bg-[#fdfbf7] text-black">
            <div className="mb-12 text-center">
                <motion.h1 initial={{opacity: 0, y: 20}} animate={{opacity: 1, y: 0}} transition={{duration: 0.5}} className="mb-4 text-3xl md:text-5xl font-bold text-gray-800">Your Financial Health Checkup</motion.h1>
                <motion.p initial={{opacity: 0, y: 20}} animate={{opacity: 1, y: 0}} transition={{duration: 0.5, delay: 0.2}} className="max-w-2xl mx-auto text-base md:text-lg text-gray-600">
                    Confused about money stuff? 😵‍💫 This quick checkup gives you a simple score and personalized tips to get your finances on track. ✨
                </motion.p>
            </div>

            <CollapsibleSection title="Step 1: Numeric Inputs" icon={Calculator} isComplete={numericDone} statusText={numericDone ? '✓ Completed' : 'Required'} isOpen={isNumericOpen} setIsOpen={setIsNumericOpen}>
                <p className="mb-4 text-gray-600">Enter your key financial figures. This section is crucial for calculating the quantitative part of your score.</p>
                <Button onClick={() => setView("numeric")} className="w-full sm:w-auto">{numericDone ? 'Edit Numeric Inputs' : 'Start Step 1'}</Button>
            </CollapsibleSection>

            <CollapsibleSection
                title="Step 2: Pre-Requisites"
                icon={CheckSquare}
                isComplete={yesNoDone}
                statusText={numericDone ? (yesNoDone ? '✓ Completed' : 'Required') : 'Locked'}
                isOpen={isYesNoOpen}
                setIsOpen={setIsYesNoOpen}
                isDisabled={!numericDone}
            >
                <p className="mb-4 text-gray-600">Answer a few simple questions about your financial habits and planning.</p>
                <Button onClick={handleYesNoClick} className="w-full sm:w-auto" disabled={!numericDone}>
                    {yesNoDone ? 'Edit Pre-Requisites' : 'Start Step 2'}
                </Button>
            </CollapsibleSection>

            <AnimatePresence>
                {numericDone && yesNoDone && (
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }} className="flex justify-center w-full">
                        <CollapsibleSection title="Results" icon={Trophy} isComplete={true} statusText="Ready to View" isOpen={isResultsOpen} setIsOpen={setIsResultsOpen}>
                            <p className="mb-4 text-gray-600">Great job! Your financial health score is calculated. View your detailed report and personalized tips.</p>
                            <Button onClick={() => setView("results")} className="w-full sm:w-auto">View Full Report</Button>
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

/// --- MAIN PAGE COMPONENT ---
export default function FinancialHealthCheckupPage() {
    const [view, setView] = useState<View>("landing");
    const [numericState, setNumericState] = useState<NumericField[]>(initialNumeric);
    const [yesNoState, setYesNoState] = useState<YesNoField[]>(initialYesNo);
    const [numericDone, setNumericDone] = useState(false);
    const [yesNoDone, setYesNoDone] = useState(false);
    const [isReportModalOpen, setIsReportModalOpen] = useState(false);

    const isDesktop = useMediaQuery("(min-width: 768px)");

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [view]);

    const recalculateTargets = useCallback((currentState: NumericField[]): NumericField[] => {
        const monthlyIncome = Number(currentState.find(f => f.key === "monthlyIncome")?.value || 0);
        const monthlyExpenses = Number(currentState.find(f => f.key === "monthlyExpenses")?.value || 0);
        const familyMembers = Number(currentState.find(f => f.key === "familyMembers")?.value || 1);
        const annualIncome = monthlyIncome * 12;

        return currentState.map(field => {
            switch (field.key) {
                case "incomeProtection": return { ...field, defaultValue: annualIncome * 20 };
                case "emergencyFund": return { ...field, defaultValue: monthlyExpenses * 6 };
                case "healthInsurance": return { ...field, defaultValue: familyMembers * 1000000 };
                case "criticalIllness": return { ...field, defaultValue: annualIncome * 4 };
                case "disabilityInsurance": return { ...field, defaultValue: annualIncome * 7.5 };
                case "retirementGoals": return { ...field, defaultValue: monthlyExpenses * 300 };
                case "debtManagement": return { ...field, defaultValue: monthlyIncome * 0.4 };
                default: return field;
            }
        });
    }, []);

    const updateNumericValue = (key: string, newValue: string, isTarget: boolean = false) => {
        const parsedValue = key === 'familyMembers' ? newValue.replace(/[^0-9]/g, '') : parseCurrency(newValue);
        setNumericState(prev => {
            const updated = prev.map(p => (p.key === key ? (isTarget ? { ...p, targetValue: parsedValue } : { ...p, value: parsedValue }) : p));
            return recalculateTargets(updated);
        });
    };

    const updateYesNoValue = (key: string, value: YesNoValue) => {
        setYesNoState((prev) => prev.map((p) => (p.key === key ? { ...p, value } : p)));
    };

    const computeRating = useCallback((f: NumericField): number => {
        const recomputedState = recalculateTargets(numericState);
        const currentField = recomputedState.find(field => field.key === f.key)!;
        if (currentField.type !== 'rated' || typeof currentField.higherBetter === 'undefined' || currentField.value === '') return 0;
        if (currentField.key === "debtManagement") {
            const actualEMI = Number(currentField.value);
            const maxEMI = currentField.defaultValue || 0;
            if (actualEMI <= 0) return 5;
            if (maxEMI <= 0 && actualEMI > 0) return 1; // If no income but has debt, score is 1
            if (actualEMI <= maxEMI) return 5;
            const score = (maxEMI / actualEMI) * 5;
            // Ensure the score is at least 1 if a value is entered
            return Math.max(1, Math.min(5, Math.round(score)));
        }
        const actual = Number(currentField.value) || 0.0001;
        const target = Number(currentField.targetValue || currentField.defaultValue) || 0.0001;
        let percent = currentField.higherBetter ? actual / target : target / actual;
        if (!isFinite(percent) || isNaN(percent) || percent <= 0) percent = 0;
        if (percent > 1) percent = 1;
        return Math.max(0, Math.min(5, Math.ceil(percent * 5)));
    }, [numericState, recalculateTargets]);

    const computeGap = useCallback((f: NumericField): number => {
        const recomputedState = recalculateTargets(numericState);
        const currentField = recomputedState.find(field => field.key === f.key)!;
        if (currentField.type !== 'rated' || currentField.value === '') return 0;
        const target = Number(currentField.targetValue || currentField.defaultValue);
        if (isNaN(target)) return 0;
        return target - Number(currentField.value);
    }, [numericState, recalculateTargets]);

    const { finalScore, numericScoreWeighted, yesScoreWeighted, allTips, numericComplete } = useMemo(() => {
        const ratedNumericFields = numericState.filter(f => f.type === 'rated');

        const numComplete = numericState.every((n) => {
            const hasValue = n.value !== "" && !isNaN(Number(n.value));
            return n.targetLabel ? hasValue && n.targetValue !== "" && !isNaN(Number(n.targetValue)) : hasValue;
        });

        const numericSum = ratedNumericFields.reduce((acc, cur) => acc + computeRating(cur), 0);
        const numericMax = ratedNumericFields.length * 5;
        const numScoreWeighted = numericMax > 0 ? (numericSum / numericMax) * 60 : 0;

        const yesCount = yesNoState.filter(y => y.value === 'yes').length;
        const totalYesNo = yesNoState.length;
        const yScoreWeighted = totalYesNo > 0 ? (yesCount / totalYesNo) * 40 : 0;

        const finScore = Math.round(numScoreWeighted + yScoreWeighted);

        const numTips: string[] = [];
        const recomputedNumericState = recalculateTargets(numericState);
        ratedNumericFields.forEach((f) => {
            if (computeRating(f) < 5) {
                const gap = computeGap(f);
                const target = f.targetValue || recomputedNumericState.find(field => field.key === f.key)!.defaultValue;
                const formattedValue = formatCurrency(Number(f.value));
                const formattedDefault = formatCurrency(target!);
                const formattedGap = formatCurrency(Math.abs(gap));
                let tip = ``;
                if (f.key === "debtManagement") {
                    tip = `For <strong>${f.label}</strong>, your EMIs of ${formattedValue} are higher than the recommended limit of ${formattedDefault}. Try to reduce your debt to improve your score.`;
                } else if (gap > 0) {
                    tip = `For <strong>${f.label}</strong>, your current value is ${formattedValue} against a target of ${formattedDefault}. You have a shortfall of ${formattedGap}. Aim to increase your savings to meet this goal.`;
                }
                if (tip) numTips.push(tip);
            }
        });

        const yNoTips: string[] = yesNoState.filter(y => y.value === 'no' || y.value === 'dont_know')
            .map(y => `Consider addressing <strong>"${y.label}"</strong>. ${y.info}`);

        return {
            finalScore: finScore,
            numericScoreWeighted: numScoreWeighted,
            yesScoreWeighted: yScoreWeighted,
            allTips: [...numTips, ...yNoTips],
            numericComplete: numComplete,
        };
    }, [numericState, yesNoState, computeGap, computeRating, recalculateTargets]);

    const handleNumericSubmit = () => {
      if (!numericComplete) {
        alert("Please ensure all numeric fields have a valid number entered, including any 'Your Goal' fields.");
        return;
      }
      setNumericDone(true);
      setView("yesno");
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
                    {view === "numeric" && <NumericFullscreen
                        numericState={recalculateTargets(numericState)}
                        updateNumericValue={updateNumericValue}
                        computeGap={computeGap}
                        computeRating={computeRating}
                        handleNumericSubmit={handleNumericSubmit}
                        setView={setView}
                        isDesktop={isDesktop}
                    />}
                    {view === "yesno" && <YesNoFullscreen yesNoState={yesNoState} updateYesNoValue={updateYesNoValue} handleYesNoSubmit={handleYesNoSubmit} setView={setView} isDesktop={isDesktop} />}
                    {view === "results" && <ResultsFullscreen finalScore={finalScore} numericScoreWeighted={numericScoreWeighted} yesScoreWeighted={yesScoreWeighted} setView={setView} onOpenReport={() => setIsReportModalOpen(true)} />}
                </main>
                <Footer4Col />
                <ReportModal isOpen={isReportModalOpen} onClose={() => setIsReportModalOpen(false)} tips={allTips} />
            </div>
            <style jsx global>{`
              @media (max-width: 767px) {
                .md\\:table-cell[data-label]::before { content: attr(data-label); font-weight: 600; display: block; margin-bottom: 0.25rem; color: #4a5568; }
                .md\\:table-cell { padding-bottom: 0.75rem; border-bottom: 1px solid #e2e8f0; }
                .md\\:table-row:last-child .md\\:table-cell:last-child { border-bottom: none; }
              }
            `}</style>
        </TooltipProvider>
    );
}



