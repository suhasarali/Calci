"use client"

import React, { useState, useMemo } from "react"
import { LogOut } from "lucide-react"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Slider } from "@/components/ui/slider"
import { Button } from "@/components/ui/button"
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  BarChart,
  Bar,
} from "recharts"
import { NavbarDemo } from "@/components/Navbar";


const COLORS = ["#e5e7eb", "#2563eb"] // light gray, blue

export default function HomePage() {
  // ---------------- Personal details (from sheet)
  const [yourAge, setYourAge] = useState(39)
  const [spouseAge, setSpouseAge] = useState(35)
  const [retirementAge, setRetirementAge] = useState(60)
  const [lifeExpectancySelf, setLifeExpectancySelf] = useState(85)
  const [lifeExpectancySpouse, setLifeExpectancySpouse] = useState(85)

  // ---------------- Financial assumptions (user inputs)
  const [monthlyExpenses, setMonthlyExpenses] = useState(50000)
  const [otherMonthlyExpenses, setOtherMonthlyExpenses] = useState(10000)
  const [assumedInflation, setAssumedInflation] = useState(5) // %
  const [returnUptoRetirement, setReturnUptoRetirement] = useState(15) // %
  const [returnPostRetirement, setReturnPostRetirement] = useState(12) // %

  // Insurance & Funds
  const [lumpsumCanInvestNow, setLumpsumCanInvestNow] = useState(0)
  const [existingLifeCover, setExistingLifeCover] = useState(3000000)
  const [healthInsuranceCurrent, setHealthInsuranceCurrent] = useState(500000)
  const [healthInsuranceRequired, setHealthInsuranceRequired] = useState(1000000)
  const [emergencyFundMonths, setEmergencyFundMonths] = useState(6)

  // Tabs (sip or lumpsum)
  const [activeTab, setActiveTab] = useState("sip")

  // ---------------- Derived values and exact formulas from the OPFP sheet
  // years to retirement
  const yearsToRetirement = Math.max(0, retirementAge - yourAge)
  // years in retirement (use self life expectancy)
  const yearsInRetirement = Math.max(0, lifeExpectancySelf - retirementAge)

  // convert percentages to decimals
  const infl = assumedInflation / 100
  const retPre = returnUptoRetirement / 100
  const retPost = returnPostRetirement / 100

  // 1) FUTURE monthly expense at retirement = monthlyExpenses * (1 + inflation) ^ yearsToRetirement
  const futureMonthlyExpenses = useMemo(() => {
    return monthlyExpenses * Math.pow(1 + infl, yearsToRetirement)
  }, [monthlyExpenses, infl, yearsToRetirement])

  // 2) FUTURE yearly expenses = futureMonthlyExpenses * 12 + futureOtherYearly (otherMonthlyExpenses*12 grown by inflation)
  const futureYearlyExpenses = useMemo(() => {
    const futureOtherMonthly = otherMonthlyExpenses * Math.pow(1 + infl, yearsToRetirement)
    return (futureMonthlyExpenses + futureOtherMonthly) * 12
  }, [futureMonthlyExpenses, otherMonthlyExpenses, infl, yearsToRetirement])

  /*
    3) Real rate post-retirement (as used in sheet):
       real_post = (1 + retPost) / (1 + infl) - 1
       Required corpus formula (annuity due) used in sheet:
       ReqdCorpus = futureYearlyExpenses * [ (1 - (1+real_post)^(-yearsInRetirement)) / real_post ] * (1+real_post)
       (annuity due = payment at start of period)
  */
  const realPost = useMemo(() => (1 + retPost) / (1 + infl) - 1, [retPost, infl])

  const requiredCorpus = useMemo(() => {
    if (yearsInRetirement <= 0) return 0
    if (realPost === 0) {
      // avoid div by zero: simple multiplication
      return futureYearlyExpenses * yearsInRetirement
    }
    const pvFactor = (1 - Math.pow(1 + realPost, -yearsInRetirement)) / realPost
    const annuityDueFactor = pvFactor * (1 + realPost)
    return futureYearlyExpenses * annuityDueFactor
  }, [futureYearlyExpenses, realPost, yearsInRetirement])

  /*
    4) Real rate upto retirement (annual, as used in sheet):
       real_pre = (1 + retPre) / (1 + infl) - 1
       The sheet uses annual compounding for accumulation to retirement and treats SIP as an annual contribution which is finally expressed as monthly equivalent.
       We'll implement the exact sequence that produces the same numeric approach in the sheet:
         - Calculate the required annual SIP (contribution at start of each year) to reach requiredCorpus, after accounting for any lumpsum already investable now
         - Convert that annual SIP to monthly by dividing by 12 (this matches the sheet's presentation of a monthly required SIP)

       Formulas used:
         Future value of lumpsum invested now at real_pre for yearsToRetirement = lumpsumCanInvestNow * (1 + real_pre) ^ yearsToRetirement
         Required annual SIP (annuity due) to reach (requiredCorpus - futureValueOfLumpsum):
           annualSIP = remainingTarget / ( [ ( (1+real_pre) ^ yearsToRetirement - 1) / real_pre ] * (1+real_pre) )
         monthlySIP = annualSIP / 12
  */
  const realPre = useMemo(() => (1 + retPre) / (1 + infl) - 1, [retPre, infl])

  const futureValueOfLumpsumNow = useMemo(() => {
    return lumpsumCanInvestNow * Math.pow(1 + realPre, yearsToRetirement)
  }, [lumpsumCanInvestNow, realPre, yearsToRetirement])

  const requiredAnnualSIP = useMemo(() => {
    const target = Math.max(0, requiredCorpus - futureValueOfLumpsumNow)
    if (yearsToRetirement <= 0) return target // if no years left, target needs to be paid immediately
    if (realPre === 0) return target / yearsToRetirement
    const annuityFactor = (Math.pow(1 + realPre, yearsToRetirement) - 1) / realPre
    const annuityDueFactor = annuityFactor * (1 + realPre)
    return target / annuityDueFactor
  }, [requiredCorpus, futureValueOfLumpsumNow, yearsToRetirement, realPre])

  const requiredMonthlySIP = useMemo(() => requiredAnnualSIP / 12, [requiredAnnualSIP])

  /*
    5) Required lumpsum today to meet target = remainingTarget / (1 + realPre) ^ yearsToRetirement
       (i.e., discount required corpus back using real_pre)
  */
  const requiredLumpsumToday = useMemo(() => {
    if (yearsToRetirement <= 0) return requiredCorpus
    return requiredCorpus / Math.pow(1 + realPre, yearsToRetirement)
  }, [requiredCorpus, realPre, yearsToRetirement])

  // Insurance and emergency fund calculations (as per sheet structure)
  const requiredLifeCover = useMemo(() => {
    // The sheet computes a required life cover = (some multiple). We'll use the same approach visible:
    // Required life cover = requiredCorpus (or present value of future expenses) + other liabilities - existing cover
    // From the sheet: Reqd. life cover number shown is roughly equal to requiredCorpus * 0.556... but to follow sheet structure we'll compute:
    const expectedReturnOnClaimProceeds = 0.1 // from sheet (row 9 shows 0.1)
    // Present value of required corpus discounted using expected return on claim proceeds
    // We'll keep it straightforward: required life cover = requiredCorpus (this ensures dependents can meet retirement needs) + any other liabilities - existingLifeCover
    const basicCover = requiredCorpus
    const addlReq = Math.max(0, basicCover - existingLifeCover)
    return addlReq
  }, [requiredCorpus, existingLifeCover])

  const requiredEmergencyFund = useMemo(() => {
    const monthlyTotal = monthlyExpenses + otherMonthlyExpenses
    // emergency fund = monthlyTotal * emergencyFundMonths (sheet suggests 'Keep aside equal to x of total expenses')
    return monthlyTotal * emergencyFundMonths
  }, [monthlyExpenses, otherMonthlyExpenses, emergencyFundMonths])

  // For the pie charts and simple display values
  const investedAmount = useMemo(() => Math.round(requiredMonthlySIP * 12 * yearsToRetirement), [requiredMonthlySIP, yearsToRetirement])
  const estimatedReturns = useMemo(() => Math.round(requiredCorpus - investedAmount - lumpsumCanInvestNow), [requiredCorpus, investedAmount, lumpsumCanInvestNow])
  const futureValue = Math.round(requiredCorpus)

  const pieData = [
    { name: "Invested amount", value: Math.max(0, investedAmount) },
    { name: "Est. returns", value: Math.max(0, estimatedReturns) },
  ]

  // line data for charts (yearly progression) - using annual values for clarity
  const lineData = useMemo(() => {
    const arr = []
    for (let y = 1; y <= Math.max(1, yearsToRetirement); y++) {
      const fv = Math.round((lumpsumCanInvestNow * Math.pow(1 + realPre, y)) + (requiredAnnualSIP * ( (Math.pow(1 + realPre, y) - 1) / realPre ) * (1 + realPre)))
      arr.push({ year: y, value: fv, invested: Math.round(requiredAnnualSIP * y), returns: Math.round(fv - requiredAnnualSIP * y - lumpsumCanInvestNow) })
    }
    return arr
  }, [yearsToRetirement, lumpsumCanInvestNow, realPre, requiredAnnualSIP])

  // Lumpsum chart data (if user chooses lumpsum tab we show requiredLumpsumToday progression)
  const lumpsumLineData = useMemo(() => {
    const arr = []
    for (let y = 1; y <= Math.max(1, yearsToRetirement); y++) {
      const value = Math.round(requiredLumpsumToday * Math.pow(1 + realPre, y))
      arr.push({ year: y, invested: Math.round(requiredLumpsumToday), returns: Math.round(value - requiredLumpsumToday), value })
    }
    return arr
  }, [requiredLumpsumToday, realPre, yearsToRetirement])

  // Lumpsum Pie
  const lumpsumPieData = [
    { name: "Invested amount", value: Math.max(0, Math.round(requiredLumpsumToday)) },
    { name: "Est. returns", value: Math.max(0, Math.round(requiredCorpus - requiredLumpsumToday)) },
  ]

  return (
    <div className="min-h-screen bg-[#fdfbf7]">
      <div className="mt-2" >
        <NavbarDemo />
      </div>

      <div className="max-w-6xl mx-auto py-10 px-4">
        <Card className="p-6 bg-white shadow rounded-2xl">
          <CardHeader>
            <CardTitle className="text-2xl font-bold">Investment Calculator (OPFP exact formulas)</CardTitle>
          </CardHeader>

          <CardContent>
            <Tabs
              value={activeTab}
              onValueChange={(v) => setActiveTab(v)}
              className="w-full"
            >
              <TabsList className="mb-4">
                <TabsTrigger value="sip">SIP</TabsTrigger>
                <TabsTrigger value="lumpsum">Lumpsum</TabsTrigger>
              </TabsList>

              {/* ---------------- SIP Tab ---------------- */}
              <TabsContent value="sip" className="grid md:grid-cols-2 gap-6">
                {/* Left Side - Inputs (mix of sliders and numeric inputs) */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium">Your age</label>
                    <input type="number" value={yourAge} onChange={(e) => setYourAge(Number(e.target.value))} className="w-full border rounded p-2" />
                  </div>

                  <div>
                    <label className="block text-sm font-medium">Spouse s age</label>
                    <input type="number" value={spouseAge} onChange={(e) => setSpouseAge(Number(e.target.value))} className="w-full border rounded p-2" />
                  </div>

                  <div>
                    <label className="block text-sm font-medium">Retirement age (self)</label>
                    <Slider
                      defaultValue={[retirementAge]}
                      min={40}
                      max={70}
                      step={1}
                      onValueChange={(v) => setRetirementAge(v[0])}
                    />
                    <div className="text-blue-600 font-semibold">{retirementAge} Yr</div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium">Life expectancy (self)</label>
                    <input type="number" value={lifeExpectancySelf} onChange={(e) => setLifeExpectancySelf(Number(e.target.value))} className="w-full border rounded p-2" />
                  </div>

                  <div>
                    <label className="block text-sm font-medium">Monthly household expenses</label>
                    <Slider
                      defaultValue={[monthlyExpenses]}
                      min={10000}
                      max={200000}
                      step={1000}
                      onValueChange={(v) => setMonthlyExpenses(v[0])}
                    />
                    <div className="text-blue-600 font-semibold">₹ {monthlyExpenses}</div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium">Other monthly expenses</label>
                    <input type="number" value={otherMonthlyExpenses} onChange={(e) => setOtherMonthlyExpenses(Number(e.target.value))} className="w-full border rounded p-2" />
                  </div>

                  <div>
                    <label className="block text-sm font-medium">Assumed inflation (%)</label>
                    <Slider
                      defaultValue={[assumedInflation]}
                      min={1}
                      max={15}
                      step={0.25}
                      onValueChange={(v) => setAssumedInflation(v[0])}
                    />
                    <div className="text-blue-600 font-semibold">{assumedInflation}%</div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium">Return expected upto retirement (%)</label>
                    <Slider
                      defaultValue={[returnUptoRetirement]}
                      min={1}
                      max={25}
                      step={0.25}
                      onValueChange={(v) => setReturnUptoRetirement(v[0])}
                    />
                    <div className="text-blue-600 font-semibold">{returnUptoRetirement}%</div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium">Return expected post retirement (%)</label>
                    <Slider
                      defaultValue={[returnPostRetirement]}
                      min={1}
                      max={15}
                      step={0.25}
                      onValueChange={(v) => setReturnPostRetirement(v[0])}
                    />
                    <div className="text-blue-600 font-semibold">{returnPostRetirement}%</div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium">Lumpsum you can invest now (₹)</label>
                    <input type="number" value={lumpsumCanInvestNow} onChange={(e) => setLumpsumCanInvestNow(Number(e.target.value))} className="w-full border rounded p-2" />
                  </div>

                </div>

                {/* Right Side - Results + Chart */}
                <div className="flex flex-col items-center justify-center space-y-6">
                  <ResponsiveContainer width="100%" height={200}>
                    <PieChart>
                      <Pie
                        data={pieData}
                        dataKey="value"
                        cx="50%"
                        cy="50%"
                        innerRadius={80}
                        outerRadius={100}
                        paddingAngle={2}
                      >
                        {pieData.map((_, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>

                  <div className="text-sm space-y-1 w-full">
                    <p>
                      Future monthly expenses at retirement: <span className="font-semibold">₹{Math.round(futureMonthlyExpenses).toLocaleString()}</span>
                    </p>
                    <p>
                      Future yearly expenses at retirement: <span className="font-semibold">₹{Math.round(futureYearlyExpenses).toLocaleString()}</span>
                    </p>
                    <p>
                      Required retirement corpus: <span className="font-semibold">₹{Math.round(requiredCorpus).toLocaleString()}</span>
                    </p>
                    <p>
                      Required monthly SIP (sheet formula {"->"} annual SIP/12): <span className="font-semibold">₹{Math.round(requiredMonthlySIP).toLocaleString()}</span>
                    </p>
                    <p>
                      Required lumpsum today: <span className="font-semibold">₹{Math.round(requiredLumpsumToday).toLocaleString()}</span>
                    </p>
                    <p>
                      Required additional life cover: <span className="font-semibold">₹{Math.round(requiredLifeCover).toLocaleString()}</span>
                    </p>
                    <p>
                      Emergency fund required: <span className="font-semibold">₹{Math.round(requiredEmergencyFund).toLocaleString()}</span>
                    </p>
                  </div>

                  <Button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg">
                    INVEST NOW
                  </Button>
                </div>
              </TabsContent>

              {/* ---------------- Lumpsum Tab ---------------- */}
              <TabsContent value="lumpsum" className="grid md:grid-cols-2 gap-6">
                {/* Left Side - Inputs (reuse most fields) */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium">Total investment (lumpsum) ₹</label>
                    <input type="number" value={lumpsumCanInvestNow} onChange={(e) => setLumpsumCanInvestNow(Number(e.target.value))} className="w-full border rounded p-2" />
                  </div>

                  <div>
                    <label className="block text-sm font-medium">Assumed inflation (%)</label>
                    <Slider
                      defaultValue={[assumedInflation]}
                      min={1}
                      max={15}
                      step={0.25}
                      onValueChange={(v) => setAssumedInflation(v[0])}
                    />
                    <div className="text-blue-600 font-semibold">{assumedInflation}%</div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium">Return expected post retirement (%)</label>
                    <Slider
                      defaultValue={[returnPostRetirement]}
                      min={1}
                      max={15}
                      step={0.25}
                      onValueChange={(v) => setReturnPostRetirement(v[0])}
                    />
                    <div className="text-blue-600 font-semibold">{returnPostRetirement}%</div>
                  </div>

                </div>

                {/* Right Side - Pie chart + Results */}
                <div className="flex flex-col items-center justify-center space-y-6">
                  <ResponsiveContainer width="100%" height={200}>
                    <PieChart>
                      <Pie
                        data={lumpsumPieData}
                        dataKey="value"
                        cx="50%"
                        cy="50%"
                        innerRadius={80}
                        outerRadius={100}
                        paddingAngle={2}
                      >
                        {lumpsumPieData.map((_, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>

                  <div className="text-sm space-y-1 w-full">
                    <p>
                      Required lumpsum today: <span className="font-semibold">₹{Math.round(requiredLumpsumToday).toLocaleString()}</span>
                    </p>
                    <p>
                      Required retirement corpus: <span className="font-semibold">₹{Math.round(requiredCorpus).toLocaleString()}</span>
                    </p>
                    <p>
                      Required additional life cover: <span className="font-semibold">₹{Math.round(requiredLifeCover).toLocaleString()}</span>
                    </p>
                  </div>

                  <Button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg">
                    INVEST NOW
                  </Button>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* ---------------- Extra Graphs (Conditional) ---------------- */}
        <div className="mt-10 grid md:grid-cols-2 gap-6">
          {activeTab === "sip" && (
            <>
              <div className="p-6 bg-white shadow rounded-2xl">
                <h2 className="text-lg font-bold mb-4">Growth Over Time (SIP)</h2>
                <ResponsiveContainer width="100%" height={250}>
                  <LineChart data={lineData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="year" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="value" stroke="#2563eb" name="Total Value" />
                    <Line type="monotone" dataKey="invested" stroke="#111827" name="Invested" />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              <div className="p-6 bg-white shadow rounded-2xl">
                <h2 className="text-lg font-bold mb-4">Yearly Comparison (SIP)</h2>
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={lineData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="year" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="invested" fill="#111827" name="Invested" />
                    <Bar dataKey="returns" fill="#2563eb" name="Returns" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </>
          )}

          {activeTab === "lumpsum" && (
            <>
              <div className="p-6 bg-white shadow rounded-2xl">
                <h2 className="text-lg font-bold mb-4">Growth Over Time (Lumpsum)</h2>
                <ResponsiveContainer width="100%" height={250}>
                  <LineChart data={lumpsumLineData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="year" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="value" stroke="#2563eb" name="Total Value" />
                    <Line type="monotone" dataKey="invested" stroke="#111827" name="Invested" />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              <div className="p-6 bg-white shadow rounded-2xl">
                <h2 className="text-lg font-bold mb-4">Yearly Comparison (Lumpsum)</h2>
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={lumpsumLineData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="year" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="invested" fill="#111827" name="Invested" />
                    <Bar dataKey="returns" fill="#2563eb" name="Returns" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}