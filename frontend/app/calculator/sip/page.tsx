"use client"

import React, { useState } from "react"
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



type CalculatorProps = {
  defaultMonthly?: number
  defaultRate?: number
  defaultYears?: number
}

const COLORS = ["#e5e7eb", "#2563eb"] // light gray, blue

export default function HomePage({
  defaultMonthly = 25000,
  defaultRate = 14,
  defaultYears = 8,
}: CalculatorProps) {
  // ---------------- Shared States ----------------
  const [monthlyInvestment, setMonthlyInvestment] = useState<number>(defaultMonthly)
  const [expectedReturn, setExpectedReturn] = useState<number>(defaultRate)
  const [timePeriod, setTimePeriod] = useState<number>(defaultYears)
  const [activeTab, setActiveTab] = useState<"sip" | "lumpsum">("sip")

  // ---------------- SIP Calculations ----------------
  const r = expectedReturn / 100 / 12
  const n = timePeriod * 12
  const futureValue = Math.round(
    monthlyInvestment * (((Math.pow(1 + r, n) - 1) / r) * (1 + r))
  )
  const investedAmount = monthlyInvestment * n
  const estimatedReturns = futureValue - investedAmount

  const pieData = [
    { name: "Invested amount", value: investedAmount },
    { name: "Est. returns", value: estimatedReturns },
  ]

  const lineData = Array.from({ length: n / 12 }, (_, i) => {
    const months = (i + 1) * 12
    const value = Math.round(
      monthlyInvestment * (((Math.pow(1 + r, months) - 1) / r) * (1 + r))
    )
    return {
      year: i + 1,
      value,
      invested: monthlyInvestment * months,
      returns: value - monthlyInvestment * months,
    }
  })

  // ---------------- Lumpsum Calculations ----------------
  const FV_lumpsum = Math.round(monthlyInvestment * Math.pow(1 + expectedReturn / 100, timePeriod))
  const returns_lumpsum = FV_lumpsum - monthlyInvestment

  const lumpsumLineData = Array.from({ length: timePeriod }, (_, i) => {
    const year = i + 1
    const value = Math.round(monthlyInvestment * Math.pow(1 + expectedReturn / 100, year))
    return { year, invested: monthlyInvestment, returns: value - monthlyInvestment, value }
  })

  const lumpsumPieData = [
    { name: "Invested amount", value: monthlyInvestment },
    { name: "Est. returns", value: returns_lumpsum },
  ]

  return (
    <div className="min-h-screen bg-[#fdfbf7]">
      <div className="mt-2" >
        <NavbarDemo />
        </div>

      <div className="max-w-6xl mx-auto py-10 px-4">
        <Card className="p-6 bg-white shadow rounded-2xl">
          <CardHeader>
            <CardTitle className="text-2xl font-bold">Investment Calculator</CardTitle>
          </CardHeader>

          <CardContent>
            <Tabs
              value={activeTab}
              onValueChange={(v: "sip" | "lumpsum") => setActiveTab(v)}
              className="w-full"
            >
              <TabsList className="mb-4">
                <TabsTrigger value="sip">SIP</TabsTrigger>
                <TabsTrigger value="lumpsum">Lumpsum</TabsTrigger>
              </TabsList>

              {/* ---------------- SIP Tab ---------------- */}
              <TabsContent value="sip" className="grid md:grid-cols-2 gap-6">
                {/* Left Side - Sliders */}
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium">Monthly investment</label>
                    <div className="flex items-center justify-between text-blue-600 font-semibold">
                      <span>₹ {monthlyInvestment}</span>
                    </div>
                    <Slider
                      defaultValue={[monthlyInvestment]}
                      min={1000}
                      max={100000}
                      step={500}
                      onValueChange={(v: number[]) => setMonthlyInvestment(v[0])}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium">Expected return rate (p.a)</label>
                    <div className="flex items-center justify-between text-blue-600 font-semibold">
                      <span>{expectedReturn}%</span>
                    </div>
                    <Slider
                      defaultValue={[expectedReturn]}
                      min={1}
                      max={30}
                      step={0.5}
                      onValueChange={(v: number[]) => setExpectedReturn(v[0])}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium">Time period</label>
                    <div className="flex items-center justify-between text-blue-600 font-semibold">
                      <span>{timePeriod} Yr</span>
                    </div>
                    <Slider
                      defaultValue={[timePeriod]}
                      min={1}
                      max={40}
                      step={1}
                      onValueChange={(v: number[]) => setTimePeriod(v[0])}
                    />
                  </div>
                </div>

                {/* Right Side - Graph + Results */}
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

                  <div className="text-sm space-y-1">
                    <p>
                      Invested amount: <span className="font-semibold">₹{investedAmount.toLocaleString()}</span>
                    </p>
                    <p>
                      Est. returns: <span className="font-semibold">₹{estimatedReturns.toLocaleString()}</span>
                    </p>
                    <p>
                      Total value: <span className="font-semibold">₹{futureValue.toLocaleString()}</span>
                    </p>
                  </div>

                  <Button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg">
                    INVEST NOW
                  </Button>
                </div>
              </TabsContent>

              {/* ---------------- Lumpsum Tab ---------------- */}
              <TabsContent value="lumpsum" className="grid md:grid-cols-2 gap-6">
                {/* Left Side - Sliders */}
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium">Total investment</label>
                    <div className="flex items-center justify-between text-blue-600 font-semibold">
                      <span>₹ {monthlyInvestment}</span>
                    </div>
                    <Slider
                      defaultValue={[monthlyInvestment]}
                      min={1000}
                      max={1000000}
                      step={5000}
                      onValueChange={(v: number[]) => setMonthlyInvestment(v[0])}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium">Expected return rate (p.a)</label>
                    <div className="flex items-center justify-between text-blue-600 font-semibold">
                      <span>{expectedReturn}%</span>
                    </div>
                    <Slider
                      defaultValue={[expectedReturn]}
                      min={1}
                      max={30}
                      step={0.5}
                      onValueChange={(v: number[]) => setExpectedReturn(v[0])}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium">Time period</label>
                    <div className="flex items-center justify-between text-blue-600 font-semibold">
                      <span>{timePeriod} Yr</span>
                    </div>
                    <Slider
                      defaultValue={[timePeriod]}
                      min={1}
                      max={40}
                      step={1}
                      onValueChange={(v: number[]) => setTimePeriod(v[0])}
                    />
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

                  <div className="text-sm space-y-1">
                    <p>
                      Invested amount: <span className="font-semibold">₹{monthlyInvestment.toLocaleString()}</span>
                    </p>
                    <p>
                      Est. returns: <span className="font-semibold">₹{returns_lumpsum.toLocaleString()}</span>
                    </p>
                    <p>
                      Total value: <span className="font-semibold">₹{FV_lumpsum.toLocaleString()}</span>
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
