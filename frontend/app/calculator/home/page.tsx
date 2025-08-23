"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Search } from "lucide-react"; // Search icon
import {
  Calculator,
  Landmark,
  PiggyBank,
  TrendingUp,
  Wallet,
  BarChart3,
  Car,
  GraduationCap,
  Coins,
  House,
  CreditCard,
} from "lucide-react";
import { NavbarDemo } from "@/components/Navbar";

const calculators = [
  {
    title: "Loan EMI Calculator",
    desc: "Calculate Equated Monthly Installments for any type of loan with flexible tenure and interest rate options. Understand your monthly outflow, total interest payable, and plan your finances efficiently.",
    link: "/calculator/loan",
    color: "bg-[#fefaf6]",
    icon: CreditCard,
  },
  {
    title: "SIP Calculator",
    desc: "Estimate potential returns from your Systematic Investment Plan investments with compounding benefits over your chosen time horizon. Compare different SIP amounts, durations, and expected returns.",
    link: "/calculator/sip",
    color: "bg-[#f8f9ff]",
    icon: PiggyBank,
  },
  {
    title: "FD Calculator",
    desc: "Calculate maturity amount for Fixed Deposits with various interest payout options. Evaluate different tenure scenarios and interest rates to optimize your fixed income investments.",
    link: "/calculator/fd",
    color: "bg-[#f0f8f4]",
    icon: Landmark,
  },
  {
    title: "RD Calculator",
    desc: "Determine the maturity value of your Recurring Deposit investments with regular monthly contributions and compounding interest.",
    link: "/calculator/rd",
    color: "bg-[#fefaf6]",
    icon: Wallet,
  },
  {
    title: "Retirement Calculator",
    desc: "Plan your retirement corpus by estimating future needs based on current expenses, inflation, and expected returns.",
    link: "/calculator/retirement",
    color: "bg-[#f8f9ff]",
    icon: TrendingUp,
  },
  {
    title: "PPF Calculator",
    desc: "Calculate maturity amount for Public Provident Fund accounts with tax-free returns and long-term wealth creation benefits.",
    link: "/calculator/ppf",
    color: "bg-[#f0f8f4]",
    icon: BarChart3,
  },
  {
    title: "Lump Sum Calculator",
    desc: "Estimate potential returns on one-time investments through mutual funds or other instruments with varying return expectations. Understand the impact of market performance, tenure, and risk level to plan your wealth creation strategy effectively.",
    link: "/calculator/lumpsum",
    color: "bg-[#fefaf6]",
    icon: Coins,
  },
  {
    title: "Tax Calculator",
    desc: "Calculate your annual income tax liability under the old and new tax regimes. Identify optimal deductions, exemptions, and tax-saving investment opportunities to minimize tax outflow while remaining compliant.",
    link: "/calculator/tax",
    color: "bg-[#f8f9ff]",
    icon: Calculator,
  },
  {
    title: "Home Loan Calculator",
    desc: "Plan your home loan EMIs, total interest outgo, and affordability based on property price, loan amount, and interest rates.",
    link: "/calculator/home-loan",
    color: "bg-[#f0f8f4]",
    icon: House,
  },
  {
    title: "Car Loan Calculator",
    desc: "Calculate monthly installments for your car loan and understand the total cost of ownership including interest payments.",
    link: "/calculator/car-loan",
    color: "bg-[#fefaf6]",
    icon: Car,
  },
  {
    title: "Education Loan Calculator",
    desc: "Plan your education loan repayment with moratorium period consideration and estimate total interest payable over the loan tenure.",
    link: "/calculator/education-loan",
    color: "bg-[#f8f9ff]",
    icon: GraduationCap,
  },
  {
    title: "Gold Loan Calculator",
    desc: "Calculate loan amount eligibility against gold, EMI options, and interest costs for different loan-to-value ratios.",
    link: "/calculator/gold-loan",
    color: "bg-[#f0f8f4]",
    icon: Coins,
  },
];

export default function DashboardPage() {
  const [searchQuery, setSearchQuery] = useState("");

  // Filter calculators by title based on search query
  const filteredCalculators = calculators.filter((calc) =>
    calc.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6 md:p-10">
      {/* Header / Navbar */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 20 }}
        viewport={{ once: false, amount: 0.3 }}
        transition={{ duration: 0.6 }}
        className="text-center mb-6"
      >
        <NavbarDemo />
      </motion.div>

      {/* Search Bar */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-8 flex justify-center"
      >
        <div className="flex items-center bg-white border rounded-lg shadow-sm px-4 py-2 w-full max-w-md transition-all focus-within:ring-2 ring-gray-300">
          <Search className="w-5 h-5 text-gray-500 mr-2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search"
            onFocus={(e) =>
              (e.target.placeholder = "Search which calculator you want")
            }
            onBlur={(e) => (e.target.placeholder = "Search")}
            className="w-full outline-none text-gray-700 placeholder-gray-400"
          />
        </div>
      </motion.div>

      {/* Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredCalculators.length > 0 ? (
          filteredCalculators.map((calc, i) => {
            const Icon = calc.icon;
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 60 }}
                whileInView={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 60 }}
                viewport={{ once: false, amount: 0.2 }}
                transition={{
                  duration: 0.6,
                  delay: i * 0.1,
                  type: "spring",
                  stiffness: 120,
                }}
                whileHover={{ y: -8, scale: 1.02 }}
              >
                <Card
                  className={`${calc.color} shadow-md rounded-2xl hover:shadow-2xl transition-all duration-300 border border-gray-100 flex flex-col`}
                  style={{ aspectRatio: "1 / 1" }}
                >
                  {/* Icon and Title */}
                  <CardHeader className="pb-3 flex flex-row items-center gap-3">
                    <div className="p-2 bg-white rounded-lg shadow-sm">
                      <Icon className="w-6 h-6 text-gray-700" />
                    </div>
                    <CardTitle className="font-bold text-lg text-gray-800">
                      {calc.title}
                    </CardTitle>
                  </CardHeader>

                  {/* Centered Description */}
                  <CardContent className="flex-grow flex flex-col items-center justify-center text-center px-4">
                    <p className="font-bold text-gray-800 text-sm leading-relaxed">
                      {calc.desc}
                    </p>
                  </CardContent>

                  {/* Button at Bottom */}
                  <div className="px-4 pb-4">
                    <Link href={calc.link}>
                      <Button className="w-full bg-gray-900 text-white hover:bg-gray-800 rounded-lg py-2 transition-colors duration-300">
                        Calculate Now
                      </Button>
                    </Link>
                  </div>
                </Card>
              </motion.div>
            );
          })
        ) : (
          <p className="col-span-full text-center text-gray-500 mt-10">
            No calculators found.
          </p>
        )}
      </div>
    </div>
  );
}


// "use client";

// import { motion } from "framer-motion";
// import Link from "next/link";
// import { Button } from "@/components/ui/button";
// import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
// import {
//   Calculator,
//   Landmark,
//   PiggyBank,
//   TrendingUp,
//   Wallet,
//   BarChart3,
//   Car,
//   GraduationCap,
//   Coins,
//   House,
//   CreditCard,
// } from "lucide-react";
// import { NavbarDemo } from "@/components/Navbar";

// const calculators = [
//   {
//     title: "Loan EMI Calculator",
//     desc: "Calculate Equated Monthly Installments for any type of loan with flexible tenure and interest rate options. Understand your monthly outflow, total interest payable, and plan your finances efficiently.",
//     link: "/calculator/loan-emi",
//     color: "bg-[#fefaf6]",
//     icon: CreditCard,
//   },
//   {
//     title: "SIP Calculator",
//     desc: "Estimate potential returns from your Systematic Investment Plan investments with compounding benefits over your chosen time horizon. Compare different SIP amounts, durations, and expected returns.",
//     link: "/calculator/sip",
//     color: "bg-[#f8f9ff]",
//     icon: PiggyBank,
//   },
//   {
//     title: "FD Calculator",
//     desc: "Calculate maturity amount for Fixed Deposits with various interest payout options. Evaluate different tenure scenarios and interest rates to optimize your fixed income investments.",
//     link: "/calculator/fd",
//     color: "bg-[#f0f8f4]",
//     icon: Landmark,
//   },
//   {
//     title: "RD Calculator",
//     desc: "Determine the maturity value of your Recurring Deposit investments with regular monthly contributions and compounding interest.",
//     link: "/calculator/rd",
//     color: "bg-[#fefaf6]",
//     icon: Wallet,
//   },
//   {
//     title: "Retirement Calculator",
//     desc: "Plan your retirement corpus by estimating future needs based on current expenses, inflation, and expected returns.",
//     link: "/calculator/retirement",
//     color: "bg-[#f8f9ff]",
//     icon: TrendingUp,
//   },
//   {
//     title: "PPF Calculator",
//     desc: "Calculate maturity amount for Public Provident Fund accounts with tax-free returns and long-term wealth creation benefits.",
//     link: "/calculator/ppf",
//     color: "bg-[#f0f8f4]",
//     icon: BarChart3,
//   },
//   {
//     title: "Lump Sum Calculator",
//     desc: "Estimate potential returns on one-time investments through mutual funds or other instruments with varying return expectations. Understand the impact of market performance, tenure, and risk level to plan your wealth creation strategy effectively.",
//     link: "/calculator/lumpsum",
//     color: "bg-[#fefaf6]",
//     icon: Coins,
//   },
//   {
//     title: "Tax Calculator",
//     desc: "Calculate your annual income tax liability under the old and new tax regimes. Identify optimal deductions, exemptions, and tax-saving investment opportunities to minimize tax outflow while remaining compliant.",
//     link: "/calculator/tax",
//     color: "bg-[#f8f9ff]",
//     icon: Calculator,
//   },
//   {
//     title: "Home Loan Calculator",
//     desc: "Plan your home loan EMIs, total interest outgo, and affordability based on property price, loan amount, and interest rates.",
//     link: "/calculator/home-loan",
//     color: "bg-[#f0f8f4]",
//     icon: House,
//   },
//   {
//     title: "Car Loan Calculator",
//     desc: "Calculate monthly installments for your car loan and understand the total cost of ownership including interest payments.",
//     link: "/calculator/car-loan",
//     color: "bg-[#fefaf6]",
//     icon: Car,
//   },
//   {
//     title: "Education Loan Calculator",
//     desc: "Plan your education loan repayment with moratorium period consideration and estimate total interest payable over the loan tenure.",
//     link: "/calculator/education-loan",
//     color: "bg-[#f8f9ff]",
//     icon: GraduationCap,
//   },
//   {
//     title: "Gold Loan Calculator",
//     desc: "Calculate loan amount eligibility against gold, EMI options, and interest costs for different loan-to-value ratios.",
//     link: "/calculator/gold-loan",
//     color: "bg-[#f0f8f4]",
//     icon: Coins,
//   },
// ];

// export default function DashboardPage() {
//   return (
//     <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6 md:p-10">
//       {/* Header */}
//       <motion.div
//         initial={{ opacity: 0, y: 20 }}
//         whileInView={{ opacity: 1, y: 0 }}
//         exit={{ opacity: 0, y: 20 }}
//         viewport={{ once: false, amount: 0.3 }}
//         transition={{ duration: 0.6 }}
//         className="text-center mb-12"
//       >
//         {/* <h1 className="text-4xl font-extrabold text-gray-800 mb-4 tracking-tight">
//           Financial Calculators
//         </h1>
//         <p className="text-gray-600 max-w-2xl mx-auto text-lg">
//           Comprehensive tools to help you plan loans, investments, and achieve financial goals with precision.
//         </p> */}

//         <NavbarDemo/>

//       </motion.div>

//       {/* Cards */}
//       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
//         {calculators.map((calc, i) => {
//           const Icon = calc.icon;
//           return (
//             <motion.div
//               key={i}
//               initial={{ opacity: 0, y: 60 }}
//               whileInView={{ opacity: 1, y: 0 }}
//               exit={{ opacity: 0, y: 60 }}
//               viewport={{ once: false, amount: 0.2 }}
//               transition={{
//                 duration: 0.6,
//                 delay: i * 0.1,
//                 type: "spring",
//                 stiffness: 120,
//               }}
//               whileHover={{ y: -8, scale: 1.02 }}
//             >
//               <Card
//                 className={`${calc.color} shadow-md rounded-2xl hover:shadow-2xl transition-all duration-300 border border-gray-100 flex flex-col`}
//                 style={{ aspectRatio: "1 / 1" }} // Square card
//               >
//                 {/* Icon and Title */}
//                 <CardHeader className="pb-3 flex flex-row items-center gap-3">
//                   <div className="p-2 bg-white rounded-lg shadow-sm">
//                     <Icon className="w-6 h-6 text-gray-700" />
//                   </div>
//                   <CardTitle className="font-bold text-lg text-gray-800">
//                     {calc.title}
//                   </CardTitle>
//                 </CardHeader>

//                 {/* Centered Description */}
//                 <CardContent className="flex-grow flex flex-col items-center justify-center text-center px-4">
//                   <p className="font-bold text-gray-800 text-sm leading-relaxed">
//                     {calc.desc}
//                   </p>
//                 </CardContent>

//                 {/* Button at Bottom */}
//                 <div className="px-4 pb-4">
//                   <Link href={calc.link}>
//                     <Button className="w-full bg-gray-900 text-white hover:bg-gray-800 rounded-lg py-2 transition-colors duration-300">
//                       Calculate Now
//                     </Button>
//                   </Link>
//                 </div>
//               </Card>
//             </motion.div>
//           );
//         })}
//       </div>
//     </div>
//   );
// }
