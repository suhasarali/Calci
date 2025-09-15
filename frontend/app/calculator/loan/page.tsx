"use client";

import React, { useState } from "react";
import { Info } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";

import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  TooltipProvider,
} from "@/components/ui/tooltip";

/**
 * Financial Health - Flashcard Flow Page (TypeScript React)
 *
 * Flow:
 * - landing: shows 2 cards (Numeric Inputs, Yes/No Pre-reqs). If both completed a Results card appears.
 * - numeric: fullscreen numeric table only (submit returns to landing and marks completed)
 * - yesno: fullscreen yes/no checklist only (submit returns to landing and marks completed)
 * - results: fullscreen final score + tips
 *
 * UI colors:
 * - background: #fdfbf7 (creamy)
 * - card: white
 * - text: black
 *
 * Notes:
 * - Uses shadcn components: table, input, button, checkbox, tooltip.
 * - Tooltips use TooltipProvider -> Tooltip -> TooltipTrigger -> TooltipContent
 */

// Types
type NumericField = {
  key: string;
  label: string;
  defaultValue: number;
  value: number;
  higherBetter: boolean;
  info: string;
};

type YesNoField = {
  key: string;
  label: string;
  value: boolean;
  info: string;
};

// Hardcoded defaults
const initialNumeric: NumericField[] = [
  {
    key: "monthlyExpenses",
    label: "Monthly Expenses",
    defaultValue: 40000,
    value: 40000,
    higherBetter: false,
    info: "Benchmark example: target monthly expenses. Lower is better relative to income.",
  },
  {
    key: "monthlyIncome",
    label: "Monthly Income",
    defaultValue: 100000,
    value: 100000,
    higherBetter: true,
    info: "Gross monthly income. Higher is better to cover expenses and savings.",
  },
  {
    key: "familyMembers",
    label: "Family Members",
    defaultValue: 4,
    value: 4,
    higherBetter: false,
    info: "Number of dependents. Lower number reduces financial burden.",
  },
  {
    key: "incomeProtection",
    label: "Income Protection (life cover)",
    defaultValue: 2000000,
    value: 2000000,
    higherBetter: true,
    info: "Recommended life cover (example: annual income × ~20).",
  },
  {
    key: "emergencyFund",
    label: "Emergency Fund",
    defaultValue: 120000,
    value: 120000,
    higherBetter: true,
    info: "Emergency fund typically 3-6 months of expenses. Default uses 3 months.",
  },
  {
    key: "healthInsurance",
    label: "Health Insurance Sum Insured",
    defaultValue: 800000,
    value: 800000,
    higherBetter: true,
    info: "Recommended health cover relative to annual income and family size.",
  },
  {
    key: "criticalIllness",
    label: "Critical Illness Cover",
    defaultValue: 300000,
    value: 300000,
    higherBetter: true,
    info: "Recommended sum assured for critical illness policies (rule-of-thumb).",
  },
  {
    key: "disabilityInsurance",
    label: "Disability Insurance",
    defaultValue: 1500000,
    value: 1500000,
    higherBetter: true,
    info: "Income replacement cover in case of long-term disability.",
  },
  {
    key: "retirementGoals",
    label: "Retirement Corpus Goal",
    defaultValue: 12000000,
    value: 12000000,
    higherBetter: true,
    info: "Estimated retirement corpus required (placeholder rule).",
  },
  {
    key: "childEducation",
    label: "Child Education Fund",
    defaultValue: 2000000,
    value: 2000000,
    higherBetter: true,
    info: "Target corpus for child education (placeholder).",
  },
  {
    key: "debtManagement",
    label: "Debt Management (acceptable EMI)",
    defaultValue: 40000,
    value: 40000,
    higherBetter: false,
    info: "Acceptable EMI threshold (rule-of-thumb: ≤ 40% of income).",
  },
];

const initialYesNo: YesNoField[] = [
  { key: "budgetPlanning", label: "Budget Planning", value: false, info: "Do you maintain a monthly/quarterly budget?" },
  { key: "wealthBuilding", label: "Wealth Building", value: false, info: "Do you follow a structured wealth-building plan?" },
  { key: "optimizeTax", label: "Optimize Tax Saving Investments", value: false, info: "Do you leverage tax-saving investments effectively?" },
  { key: "openHUF", label: "Open HUF Account", value: false, info: "Is an HUF account opened/considered (if applicable)?" },
  { key: "homeLoanRent", label: "Home Loan & Rent", value: false, info: "Is your housing EMI/rent within acceptable limits?" },
  { key: "cibil", label: "CIBIL Score ≥ 700", value: false, info: "Is your credit score above 700?" },
  { key: "spouseCoverage", label: "Spouse Coverage", value: false, info: "Does spouse have adequate insurance/coverage?" },
  { key: "familyGoals", label: "Family Goals", value: false, info: "Are family financial goals documented and planned?" },
  { key: "estatePlanning", label: "Estate Planning", value: false, info: "Do you have a will/estate plan in place?" },
  { key: "diversification", label: "Investment Diversification", value: false, info: "Are your investments diversified across asset classes?" },
  { key: "legacyFund", label: "Legacy Fund", value: false, info: "Have you planned for legacy/wealth transfer to next generation?" },
];

export default function FinancialHealthFlashcardsPage() {
  // Views: "landing" | "numeric" | "yesno" | "results"
  const [view, setView] = useState<"landing" | "numeric" | "yesno" | "results">("landing");

  const [numericState, setNumericState] = useState<NumericField[]>(initialNumeric);
  const [yesNoState, setYesNoState] = useState<YesNoField[]>(initialYesNo);

  // completion flags
  const [numericDone, setNumericDone] = useState(false);
  const [yesNoDone, setYesNoDone] = useState(false);

  // Helpers to update values
  const updateNumericValue = (key: string, newValue: number) => {
    setNumericState((prev) => prev.map((p) => (p.key === key ? { ...p, value: newValue } : p)));
  };

  const toggleYesNo = (key: string, checked: boolean) => {
    setYesNoState((prev) => prev.map((p) => (p.key === key ? { ...p, value: checked } : p)));
  };

  // Rating calculation (1..5) using 20% steps as described:
  const computeRating = (f: NumericField) => {
    const actual = f.value <= 0 ? 0.0001 : f.value;
    const def = f.defaultValue <= 0 ? 0.0001 : f.defaultValue;
    let percent = f.higherBetter ? actual / def : def / actual; // closeness to default (1 is perfect)
    if (!isFinite(percent) || percent <= 0) percent = 0;
    if (percent > 1) percent = 1;
    const rating = Math.max(0, Math.min(5, Math.ceil(percent * 5)));
    return rating;
  };

  const computeGap = (f: NumericField) => {
    return f.defaultValue - f.value;
  };

  // Completion checks
  const numericComplete = numericState.every((n) => typeof n.value === "number" && n.value > 0);
  const yesNoComplete = yesNoState.every((y) => y.value === true || y.value === false); // always true, but kept for clarity

  // Final scoring logic: numeric contributes 60%, yes/no 40%
  const numericSum = numericState.reduce((acc, cur) => acc + computeRating(cur), 0); // 0..(count*5)
  const numericMax = numericState.length * 5;
  const numericScoreWeighted = (numericSum / numericMax) * 60;

  const yesYesCount = yesNoState.reduce((acc, cur) => acc + (cur.value ? 1 : 0), 0);
  const yesCount = yesNoState.length;
  const yesScoreWeighted = (yesYesCount / yesCount) * 40;

  const finalScore = Math.round(numericScoreWeighted + yesScoreWeighted);

  // Tips: numeric and yes/no
  const numericTips: string[] = [];
  numericState.forEach((f) => {
    const rating = computeRating(f);
    if (rating < 5) {
      const gap = computeGap(f);
      const tip = `Improve ${f.label}: current ${f.value.toLocaleString()} vs target ${f.defaultValue.toLocaleString()} (gap ${gap.toLocaleString()}). Recommendation: move towards ${f.defaultValue.toLocaleString()}.`;
      numericTips.push(tip);
    }
  });

  const yesNoTips: string[] = [];
  yesNoState.forEach((y) => {
    if (!y.value) {
      yesNoTips.push(`Consider improving "${y.label}" — ${y.info}`);
    }
  });

  const allTips = [...numericTips, ...yesNoTips];

  // Handlers for card submit
  const handleNumericSubmit = () => {
    // validation: ensure every numeric > 0
    if (!numericComplete) {
      alert("Please ensure all numeric fields have values greater than 0.");
      return;
    }
    setNumericDone(true);
    setView("landing");
  };

  const handleYesNoSubmit = () => {
    // all yes/no fields are toggles; they are always answered (true/false)
    setYesNoDone(true);
    setView("landing");
  };

  // UI components to render each fullscreen view
  const NumericFullscreen = () => (
    <div className="min-h-screen bg-[#fdfbf7] text-black flex items-start justify-center py-12 px-4">
      <div className="w-full max-w-4xl">
        <Card className="bg-white">
          <CardHeader>
            <CardTitle>Numeric Inputs</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Field</TableHead>
                  <TableHead>Actual Value</TableHead>
                  <TableHead>Default Value</TableHead>
                  <TableHead>Gap</TableHead>
                  <TableHead>Rating</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {numericState.map((f) => (
                  <TableRow key={f.key}>
                    <TableCell className="flex items-center gap-2">
                      <span>{f.label}</span>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <button className="inline-flex items-center p-1 rounded-full hover:bg-gray-100">
                            <Info size={16} />
                          </button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p className="max-w-xs text-sm">{f.info}</p>
                        </TooltipContent>
                      </Tooltip>
                    </TableCell>

                    <TableCell>
                      <Input
                        type="number"
                        value={f.value}
                        onChange={(e) => updateNumericValue(f.key, Number(e.target.value))}
                        className="w-40"
                        min={0}
                      />
                    </TableCell>

                    <TableCell>{f.defaultValue.toLocaleString()}</TableCell>
                    <TableCell>{computeGap(f).toLocaleString()}</TableCell>
                    <TableCell>{computeRating(f)} / 5</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            <div className="flex items-center justify-between mt-6">
              <div className="text-sm text-gray-600">* Fill all numeric fields (required).</div>
              <div className="space-x-2">
                <Button variant="ghost" onClick={() => setView("landing")}>
                  Cancel
                </Button>
                <Button onClick={handleNumericSubmit}>Submit</Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  const YesNoFullscreen = () => (
    <div className="min-h-screen bg-[#fdfbf7] text-black flex items-start justify-center py-12 px-4">
      <div className="w-full max-w-2xl">
        <Card className="bg-white">
          <CardHeader>
            <CardTitle>Pre-Requisites (Yes / No)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {yesNoState.map((y) => (
                <div key={y.key} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span>{y.label}</span>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <button className="inline-flex items-center p-1 rounded-full hover:bg-gray-100">
                          <Info size={16} />
                        </button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="max-w-xs text-sm">{y.info}</p>
                      </TooltipContent>
                    </Tooltip>
                  </div>
                  <div>
                    <Checkbox
                      checked={y.value}
                      onCheckedChange={(v) => toggleYesNo(y.key, Boolean(v))}
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className="flex items-center justify-between mt-6">
              <div className="text-sm text-gray-600">* Toggle each item Yes/No (required).</div>
              <div className="space-x-2">
                <Button variant="ghost" onClick={() => setView("landing")}>
                  Cancel
                </Button>
                <Button onClick={handleYesNoSubmit}>Submit</Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  const ResultsFullscreen = () => (
    <div className="min-h-screen bg-[#fdfbf7] text-black flex items-start justify-center py-12 px-4">
      <div className="w-full max-w-3xl">
        <Card className="bg-white">
          <CardHeader>
            <CardTitle>Final Score & Areas for Improvement</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold">Final Score</h2>
                <p className="text-4xl font-bold">{finalScore} / 100</p>
                <p className="text-sm text-gray-600 mt-1">
                  (Numeric: {numericScoreWeighted.toFixed(1)} / 60, Pre-reqs: {yesScoreWeighted.toFixed(1)} / 40)
                </p>
              </div>
              <div className="space-x-2">
                <Button variant="ghost" onClick={() => setView("landing")}>Back</Button>
                <Button>Download Report</Button>
              </div>
            </div>

            <div className="mt-6">
              <h3 className="font-semibold">Personalized Tips</h3>
              {allTips.length === 0 ? (
                <p className="text-sm text-green-600 mt-2">Great job — all fields meet or exceed targets.</p>
              ) : (
                <ul className="list-disc pl-5 mt-2 space-y-1 text-sm">
                  {allTips.map((t, i) => (
                    <li key={i}>{t}</li>
                  ))}
                </ul>
              )}
            </div>

            <div className="mt-4 text-xs text-gray-500">
              <p>Notes:</p>
              <ul className="list-disc pl-5">
                <li>Numeric ratings are computed in 20% steps (each 20% closer to target → +1 rating).</li>
                <li>Defaults are hardcoded. Adjust the initial values in code if benchmarks change.</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  // Landing view (two cards side-by-side)
  const LandingView = () => (
    <div className="min-h-screen bg-[#fdfbf7] text-black py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Financial Health — Flashcards</h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Numeric Card */}
          <div>
            <div
              role="button"
              onClick={() => setView("numeric")}
              className="bg-white rounded-lg shadow p-6 cursor-pointer hover:shadow-md min-h-[150px] flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold">Inputs (Numeric)</h2>
                  {numericDone ? (
                    <span className="text-sm text-green-600 font-bold">✓ Completed</span>
                  ) : (
                    <span className="text-sm text-gray-500">Required</span>
                  )}
                </div>
                <p className="text-sm text-gray-600 mt-2">Click to fill numeric values (actual vs default).</p>
              </div>

              <div className="text-xs text-gray-400 mt-4">All fields mandatory</div>
            </div>
          </div>

          {/* Yes/No Card */}
          <div>
            <div
              role="button"
              onClick={() => setView("yesno")}
              className="bg-white rounded-lg shadow p-6 cursor-pointer hover:shadow-md min-h-[150px] flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold">Pre-Requisites (Yes / No)</h2>
                  {yesNoDone ? (
                    <span className="text-sm text-green-600 font-bold">✓ Completed</span>
                  ) : (
                    <span className="text-sm text-gray-500">Required</span>
                  )}
                </div>
                <p className="text-sm text-gray-600 mt-2">Click to answer pre-requisite yes/no checklist.</p>
              </div>

              <div className="text-xs text-gray-400 mt-4">All fields mandatory</div>
            </div>
          </div>

          {/* Results Card (only visible when both done) */}
          {numericDone && yesNoDone && (
            <div>
              <div
                role="button"
                onClick={() => setView("results")}
                className="bg-white rounded-lg shadow p-6 cursor-pointer hover:shadow-md min-h-[150px] flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <h2 className="text-lg font-semibold">Results</h2>
                    <span className="text-sm text-blue-600 font-bold">View Score</span>
                  </div>
                  <p className="text-sm text-gray-600 mt-2">Click to view final score & improvement tips.</p>
                </div>

                <div className="text-xs text-gray-400 mt-4">Auto-generated</div>
              </div>
            </div>
          )}
        </div>

        <div className="mt-6 text-sm text-gray-600">
          <p>Click a card to open it as a flashcard. Submit to return and mark completed.</p>
        </div>
      </div>
    </div>
  );

  return (
    <TooltipProvider>
      {view === "landing" && <LandingView />}
      {view === "numeric" && <NumericFullscreen />}
      {view === "yesno" && <YesNoFullscreen />}
      {view === "results" && <ResultsFullscreen />}
    </TooltipProvider>
  );
}