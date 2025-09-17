// "use client";

// import React, { useState } from "react";
// import { motion, AnimatePresence, Variants } from "framer-motion";
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
//     Sparkles
// } from "lucide-react";

// // Shadcn UI Imports
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import {
//   Table,
//   TableHeader,
//   TableRow,
//   TableHead,
//   TableBody,
//   TableCell,
// } from "@/components/ui/table";
// import { Input } from "@/components/ui/input";
// import { Button } from "@/components/ui/button";
// import { Switch } from "@/components/ui/switch";
// import {
//   Tooltip,
//   TooltipTrigger,
//   TooltipContent,
//   TooltipProvider,
// } from "@/components/ui/tooltip";
// import {
//   Navbar as ResizableNavbar,
//   NavBody,
//   NavItems,
//   MobileNav,
//   NavbarLogo,
//   NavbarButton,
//   MobileNavHeader,
//   MobileNavToggle,
//   MobileNavMenu,
// } from "@/components/ui/resizable-navbar";


// // --- TYPE DEFINITIONS ---
// type View = "landing" | "numeric" | "yesno" | "results";
// type NumericField = { key: string; label: string; defaultValue: number; value: number; higherBetter: boolean; info: string; };
// type YesNoField = { key: string; label: string; value: boolean; info: string; };
// type NumericFullscreenProps = { numericState: NumericField[]; updateNumericValue: (key: string, newValue: number) => void; computeGap: (f: NumericField) => number; computeRating: (f: NumericField) => number; handleNumericSubmit: () => void; setView: React.Dispatch<React.SetStateAction<View>>; };
// type YesNoFullscreenProps = { yesNoState: YesNoField[]; toggleYesNo: (key: string, checked: boolean) => void; handleYesNoSubmit: () => void; setView: React.Dispatch<React.SetStateAction<View>>; };
// type ResultsFullscreenProps = { finalScore: number; numericScoreWeighted: number; yesScoreWeighted: number; allTips: string[]; setView: React.Dispatch<React.SetStateAction<View>>; };
// type LandingViewProps = { numericDone: boolean; yesNoDone: boolean; setView: React.Dispatch<React.SetStateAction<View>>; };
// type CollapsibleSectionProps = { title: string; icon: React.ElementType; isComplete: boolean; statusText: string; isOpen: boolean; setIsOpen: React.Dispatch<React.SetStateAction<boolean>>; children: React.ReactNode; };

// // --- DATA CONSTANTS ---
// const initialNumeric: NumericField[] = [
//     { key: "monthlyExpenses", label: "Monthly Expenses", defaultValue: 40000, value: 40000, higherBetter: false, info: "Benchmark example: target monthly expenses. Lower is better relative to income.", },
//     { key: "monthlyIncome", label: "Monthly Income", defaultValue: 100000, value: 100000, higherBetter: true, info: "Gross monthly income. Higher is better to cover expenses and savings.", },
//     { key: "familyMembers", label: "Family Members", defaultValue: 4, value: 4, higherBetter: false, info: "Number of dependents. Lower number reduces financial burden.", },
//     { key: "incomeProtection", label: "Income Protection (life cover)", defaultValue: 2000000, value: 2000000, higherBetter: true, info: "Recommended life cover (example: annual income × ~20).", },
//     { key: "emergencyFund", label: "Emergency Fund", defaultValue: 120000, value: 120000, higherBetter: true, info: "Emergency fund typically 3-6 months of expenses. Default uses 3 months.", },
//     { key: "healthInsurance", label: "Health Insurance Sum Insured", defaultValue: 800000, value: 800000, higherBetter: true, info: "Recommended health cover relative to annual income and family size.", },
//     { key: "criticalIllness", label: "Critical Illness Cover", defaultValue: 300000, value: 300000, higherBetter: true, info: "Recommended sum assured for critical illness policies (rule-of-thumb).", },
//     { key: "disabilityInsurance", label: "Disability Insurance", defaultValue: 1500000, value: 1500000, higherBetter: true, info: "Income replacement cover in case of long-term disability.", },
//     { key: "retirementGoals", label: "Retirement Corpus Goal", defaultValue: 12000000, value: 12000000, higherBetter: true, info: "Estimated retirement corpus required (placeholder rule).", },
//     { key: "childEducation", label: "Child Education Fund", defaultValue: 2000000, value: 2000000, higherBetter: true, info: "Target corpus for child education (placeholder).", },
//     { key: "debtManagement", label: "Debt Management (acceptable EMI)", defaultValue: 40000, value: 40000, higherBetter: false, info: "Acceptable EMI threshold (rule-of-thumb: ≤ 40% of income).", },
// ];
// const initialYesNo: YesNoField[] = [
//     { key: "budgetPlanning", label: "Budget Planning", value: false, info: "Do you maintain a monthly/quarterly budget?" },
//     { key: "wealthBuilding", label: "Wealth Building", value: false, info: "Do you follow a structured wealth-building plan?" },
//     { key: "optimizeTax", label: "Optimize Tax Saving Investments", value: false, info: "Do you leverage tax-saving investments effectively?" },
//     { key: "openHUF", label: "Open HUF Account", value: false, info: "Is an HUF account opened/considered (if applicable)?" },
//     { key: "homeLoanRent", label: "Home Loan & Rent", value: false, info: "Is your housing EMI/rent within acceptable limits?" },
//     { key: "cibil", label: "CIBIL Score ≥ 700", value: false, info: "Is your credit score above 700?" },
//     { key: "spouseCoverage", label: "Spouse Coverage", value: false, info: "Does spouse have adequate insurance/coverage?" },
//     { key: "familyGoals", label: "Family Goals", value: false, info: "Are family financial goals documented and planned?" },
//     { key: "estatePlanning", label: "Estate Planning", value: false, info: "Do you have a will/estate plan in place?" },
//     { key: "diversification", label: "Investment Diversification", value: false, info: "Are your investments diversified across asset classes?" },
//     { key: "legacyFund", label: "Legacy Fund", value: false, info: "Have you planned for legacy/wealth transfer to next generation?" },
// ];

// // --- YOUR ORIGINAL NAVBAR COMPONENT ---
// function Navbar() {
//   const navItems = [
//     { name: "Features", link: "#features" },
//     { name: "Testimonials", link: "#testimonials" },
//     { name: "Pricing", link: "#pricing" },
//     { name: "Contact", link: "#contact" },
//   ];
//   const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

//   return (
//     // Set background to creamy to match the page
//     <div className="relative w-full bg-[#fdfbf7]">
//       <ResizableNavbar>
//         <NavBody>
//           <NavbarLogo />
//           <NavItems items={navItems} />
//           <div className="flex items-center gap-4">
//             <NavbarButton variant="secondary">Login</NavbarButton>
//             <NavbarButton variant="primary">Book a call</NavbarButton>
//           </div>
//         </NavBody>
//         <MobileNav>
//           <MobileNavHeader>
//             <NavbarLogo />
//             <MobileNavToggle isOpen={isMobileMenuOpen} onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} />
//           </MobileNavHeader>
//           <MobileNavMenu isOpen={isMobileMenuOpen} onClose={() => setIsMobileMenuOpen(false)}>
//             {navItems.map((item, idx) => (
//               <a key={`mobile-link-${idx}`} href={item.link} onClick={() => setIsMobileMenuOpen(false)} className="relative text-neutral-600 dark:text-neutral-300">
//                 <span className="block">{item.name}</span>
//               </a>
//             ))}
//             <div className="flex w-full flex-col gap-4">
//               <NavbarButton onClick={() => setIsMobileMenuOpen(false)} variant="secondary" className="w-full">Login</NavbarButton>
//               <NavbarButton onClick={() => setIsMobileMenuOpen(false)} variant="primary" className="w-full">Book a call</NavbarButton>
//             </div>
//           </MobileNavMenu>
//         </MobileNav>
//       </ResizableNavbar>
//     </div>
//   );
// }

// // --- YOUR ORIGINAL FOOTER COMPONENT ---
// function Footer() {
//     const data = {
//         facebookLink: 'https://facebook.com/mvpblocks',
//         instaLink: 'https://instagram.com/mvpblocks',
//         twitterLink: 'https://twitter.com/mvpblocks',
//         githubLink: 'https://github.com/mvpblocks',
//         dribbbleLink: 'https://dribbble.com/mvpblocks',
//         services: { webdev: '/web-development', webdesign: '/web-design', marketing: '/marketing', googleads: '/google-ads', },
//         about: { history: '/company-history', team: '/meet-the-team', handbook: '/employee-handbook', careers: '/careers', },
//         help: { faqs: '/faqs', support: '/support', livechat: '/live-chat', },
//         contact: { email: 'hello@mvpblocks.com', phone: '+91 8637373116', address: 'Kolkata, West Bengal, India', },
//         company: { name: 'Mvpblocks', description: 'Building beautiful and functional web experiences with modern technologies. We help startups and businesses create their digital presence.', logo: '/logo.webp', },
//     };
//     const socialLinks = [ { icon: Facebook, label: 'Facebook', href: data.facebookLink }, { icon: Instagram, label: 'Instagram', href: data.instaLink }, { icon: Twitter, label: 'Twitter', href: data.twitterLink }, { icon: Github, label: 'GitHub', href: data.githubLink }, { icon: Dribbble, label: 'Dribbble', href: data.dribbbleLink }, ];
//     const aboutLinks = [ { text: 'Company History', href: data.about.history }, { text: 'Meet the Team', href: data.about.team }, { text: 'Employee Handbook', href: data.about.handbook }, { text: 'Careers', href: data.about.careers }, ];
//     const serviceLinks = [ { text: 'Web Development', href: data.services.webdev }, { text: 'Web Design', href: data.services.webdesign }, { text: 'Marketing', href: data.services.marketing }, { text: 'Google Ads', href: data.services.googleads }, ];
//     const helpfulLinks = [ { text: 'FAQs', href: data.help.faqs }, { text: 'Support', href: data.help.support }, { text: 'Live Chat', href: data.help.livechat, hasIndicator: true }, ];
//     const contactInfo = [ { icon: Mail, text: data.contact.email }, { icon: Phone, text: data.contact.phone }, { icon: MapPin, text: data.contact.address, isAddress: true }, ];

//     return (
//         <footer className="bg-white dark:bg-gray-900 mt-16 w-full">
//             <div className="mx-auto max-w-screen-xl px-4 pt-16 pb-6 sm:px-6 lg:px-8 lg:pt-24">
//                 <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
//                     <div>
//                         <div className="text-primary flex justify-center gap-2 sm:justify-start">
//                             <img src="https://assets.aceternity.com/logo-dark.png" alt="logo" className="h-8 w-8 rounded-full"/>
//                             <span className="text-2xl font-semibold">{data.company.name}</span>
//                         </div>
//                         <p className="text-gray-500 dark:text-gray-400 mt-6 max-w-md text-center leading-relaxed sm:max-w-xs sm:text-left">{data.company.description}</p>
//                         <ul className="mt-8 flex justify-center gap-6 sm:justify-start md:gap-8">
//                             {socialLinks.map(({ icon: Icon, label, href }) => (
//                                 <li key={label}>
//                                     <Link href={href} className="text-gray-700 dark:text-gray-200 hover:text-gray-900 dark:hover:text-white transition">
//                                         <span className="sr-only">{label}</span>
//                                         <Icon className="size-6" />
//                                     </Link>
//                                 </li>
//                             ))}
//                         </ul>
//                     </div>
//                     <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-4 lg:col-span-2">
//                         <div className="text-center sm:text-left">
//                             <p className="text-lg font-medium text-gray-900 dark:text-white">About Us</p>
//                             <ul className="mt-8 space-y-4 text-sm">{aboutLinks.map(({ text, href }) => (<li key={text}><a className="text-gray-700 dark:text-gray-400 transition hover:text-gray-700/75 dark:hover:text-white/75" href={href}>{text}</a></li>))}</ul>
//                         </div>
//                         <div className="text-center sm:text-left">
//                             <p className="text-lg font-medium text-gray-900 dark:text-white">Our Services</p>
//                             <ul className="mt-8 space-y-4 text-sm">{serviceLinks.map(({ text, href }) => (<li key={text}><a className="text-gray-700 dark:text-gray-400 transition hover:text-gray-700/75 dark:hover:text-white/75" href={href}>{text}</a></li>))}</ul>
//                         </div>
//                         <div className="text-center sm:text-left">
//                             <p className="text-lg font-medium text-gray-900 dark:text-white">Helpful Links</p>
//                             <ul className="mt-8 space-y-4 text-sm">
//                                 {helpfulLinks.map(({ text, href, hasIndicator }) => (
//                                     <li key={text}>
//                                         <a href={href} className={hasIndicator ? 'group flex justify-center gap-1.5 sm:justify-start' : 'text-gray-700 dark:text-gray-400 transition hover:text-gray-700/75 dark:hover:text-white/75'}>
//                                             <span className="text-gray-700 dark:text-gray-400 transition hover:text-gray-700/75 dark:hover:text-white/75">{text}</span>
//                                             {hasIndicator && (<span className="relative flex size-2"><span className="bg-primary absolute inline-flex h-full w-full animate-ping rounded-full opacity-75" /><span className="bg-primary relative inline-flex size-2 rounded-full" /></span>)}
//                                         </a>
//                                     </li>
//                                 ))}
//                             </ul>
//                         </div>
//                         <div className="text-center sm:text-left">
//                             <p className="text-lg font-medium text-gray-900 dark:text-white">Contact Us</p>
//                             <ul className="mt-8 space-y-4 text-sm">
//                                 {contactInfo.map(({ icon: Icon, text, isAddress }) => (
//                                     <li key={text}>
//                                         <a className="flex items-center justify-center gap-1.5 sm:justify-start" href="#">
//                                             <Icon className="text-primary size-5 shrink-0" />
//                                             {isAddress ? (<address className="text-gray-700 dark:text-gray-400 flex-1 not-italic">{text}</address>) : (<span className="text-gray-700 dark:text-gray-400 flex-1">{text}</span>)}
//                                         </a>
//                                     </li>
//                                 ))}
//                             </ul>
//                         </div>
//                     </div>
//                 </div>
//                 <div className="mt-12 border-t border-gray-100 dark:border-gray-800 pt-6">
//                     <div className="text-center sm:flex sm:justify-between sm:text-left">
//                         <p className="text-sm text-gray-500 dark:text-gray-400"><span className="block sm:inline">All rights reserved.</span></p>
//                         <p className="mt-4 text-sm text-gray-500 dark:text-gray-400 sm:order-first sm:mt-0">&copy; 2025 {data.company.name}</p>
//                     </div>
//                 </div>
//             </div>
//         </footer>
//     );
// }


// // --- VIEW & HELPER COMPONENTS ---

// const NumericFullscreen = ({ numericState, updateNumericValue, computeGap, computeRating, handleNumericSubmit, setView }: NumericFullscreenProps) => ( <div className="min-h-screen bg-[#fdfbf7] text-black flex items-start justify-center py-12 px-4"><div className="w-full max-w-4xl"><Card className="bg-white"><CardHeader><CardTitle>Numeric Inputs</CardTitle></CardHeader><CardContent><Table><TableHeader><TableRow><TableHead>Field</TableHead><TableHead>Actual Value</TableHead><TableHead>Default Value</TableHead><TableHead>Gap</TableHead><TableHead>Rating</TableHead></TableRow></TableHeader><TableBody>{numericState.map((f) => (<TableRow key={f.key}><TableCell className="flex items-center gap-2"><span>{f.label}</span><Tooltip><TooltipTrigger asChild><button className="inline-flex items-center p-1 rounded-full hover:bg-gray-100"><Info size={16} /></button></TooltipTrigger><TooltipContent><p className="max-w-xs text-sm">{f.info}</p></TooltipContent></Tooltip></TableCell><TableCell><Input type="number" value={f.value} onChange={(e) => updateNumericValue(f.key, Number(e.target.value))} className="w-40" min={0} /></TableCell><TableCell>{f.defaultValue.toLocaleString()}</TableCell><TableCell>{computeGap(f).toLocaleString()}</TableCell><TableCell>{computeRating(f)} / 5</TableCell></TableRow>))}</TableBody></Table><div className="flex items-center justify-between mt-6"><div className="text-sm text-gray-600">* Fill all numeric fields (required).</div><div className="space-x-2"><Button variant="ghost" onClick={() => setView("landing")}>Cancel</Button><Button onClick={handleNumericSubmit}>Submit</Button></div></div></CardContent></Card></div></div>);
// const YesNoFullscreen = ({ yesNoState, toggleYesNo, handleYesNoSubmit, setView }: YesNoFullscreenProps) => ( <div className="min-h-screen bg-[#fdfbf7] text-black flex items-start justify-center py-12 px-4"><div className="w-full max-w-2xl"><Card className="bg-white"><CardHeader><CardTitle>Pre-Requisites (Yes / No)</CardTitle></CardHeader><CardContent><div className="space-y-4">{yesNoState.map((y) => (<div key={y.key} className="flex items-center justify-between"><div className="flex items-center gap-2"><span>{y.label}</span><Tooltip><TooltipTrigger asChild><button className="inline-flex items-center p-1 rounded-full hover:bg-gray-100"><Info size={16} /></button></TooltipTrigger><TooltipContent><p className="max-w-xs text-sm">{y.info}</p></TooltipContent></Tooltip></div><div><Switch checked={y.value} onCheckedChange={(v) => toggleYesNo(y.key, Boolean(v))} /></div></div>))}</div><div className="flex items-center justify-between mt-6"><div className="text-sm text-gray-600">* Toggle each item Yes/No (required).</div><div className="space-x-2"><Button variant="ghost" onClick={() => setView("landing")}>Cancel</Button><Button onClick={handleYesNoSubmit}>Submit</Button></div></div></CardContent></Card></div></div>);
// const ResultsFullscreen = ({ finalScore, numericScoreWeighted, yesScoreWeighted, allTips, setView }: ResultsFullscreenProps) => ( <div className="min-h-screen bg-[#fdfbf7] text-black flex items-start justify-center py-12 px-4"><div className="w-full max-w-3xl"><Card className="bg-white"><CardHeader><CardTitle>Final Score & Areas for Improvement</CardTitle></CardHeader><CardContent><div className="flex items-center justify-between"><div><h2 className="text-lg font-semibold">Final Score</h2><p className="text-4xl font-bold">{finalScore} / 100</p><p className="text-sm text-gray-600 mt-1">(Numeric: {numericScoreWeighted.toFixed(1)} / 60, Pre-reqs:{" "}{yesScoreWeighted.toFixed(1)} / 40)</p></div><div className="space-x-2"><Button variant="ghost" onClick={() => setView("landing")}>Back</Button><Button>Download Report</Button></div></div><div className="mt-6"><h3 className="font-semibold">Personalized Tips</h3>{allTips.length === 0 ? (<p className="text-sm text-green-600 mt-2">Great job — all fields meet or exceed targets.</p>) : (<ul className="list-disc pl-5 mt-2 space-y-1 text-sm">{allTips.map((t, i) => (<li key={i}>{t}</li>))}</ul>)}</div><div className="mt-4 text-xs text-gray-500"><p>Notes:</p><ul className="list-disc pl-5"><li>Numeric ratings are computed in 20% steps (each 20% closer to target → +1 rating).</li><li>Defaults are hardcoded. Adjust the initial values in code if benchmarks change.</li></ul></div></CardContent></Card></div></div>);
// const CollapsibleSection = ({ title, icon: Icon, isComplete, statusText, isOpen, setIsOpen, children }: CollapsibleSectionProps) => ( <motion.div layout className="w-full max-w-3xl bg-white rounded-xl shadow-md mb-6 border-t-4" style={{borderColor: isComplete ? '#22c55e' : '#e5e7eb'}}><button onClick={() => setIsOpen(!isOpen)} className="w-full p-6 flex justify-between items-center text-left cursor-pointer focus:outline-none"><div className="flex items-center"><Icon className={`w-8 h-8 mr-4 ${isComplete ? 'text-green-500' : 'text-gray-500'}`} /><div><h2 className="text-xl font-semibold text-gray-800">{title}</h2><p className={`text-sm font-semibold ${isComplete ? 'text-green-600' : 'text-gray-500'}`}>{statusText}</p></div></div><motion.div animate={{ rotate: isOpen ? 180 : 0 }} transition={{ duration: 0.3 }}><ChevronDown className="w-6 h-6 text-gray-500" /></motion.div></button><AnimatePresence>{isOpen && (<motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1, transition: { opacity: { delay: 0.15 } } }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.3, ease: 'easeInOut' }} className="overflow-hidden"><div className="px-6 pb-6 border-t border-gray-200">{children}</div></motion.div>)}</AnimatePresence></motion.div>);

// function HowItWorks() {
//     const steps = [
//         { icon: HelpCircle, title: "Answer a Few Qs", description: "Quickly fill out your numbers and check off some yes/no items. No judgement." },
//         { icon: TrendingUp, title: "Get Your Score", description: "We instantly calculate your financial health score, giving you a simple snapshot of where you stand." },
//         { icon: Sparkles, title: "Level Up with Tips", description: "Receive personalized, jargon-free tips to help you improve your score and build better money habits." }
//     ];
//     return (
//         <div id="how-it-works" className="w-full max-w-5xl mx-auto py-12 px-4 text-center">
//              <motion.h2 initial={{opacity: 0, y: 20}} whileInView={{opacity: 1, y: 0}} viewport={{ once: true, amount: 0.8 }} transition={{duration: 0.5}} className="text-3xl font-bold text-gray-800 mb-8">How It Works</motion.h2>
//              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
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
//                         <h3 className="text-lg font-semibold text-gray-800 mb-2">{step.title}</h3>
//                         <p className="text-gray-600 text-sm">{step.description}</p>
//                     </motion.div>
//                 ))}
//             </div>
//         </div>
//     );
// }

// const LandingView = ({ setView, numericDone, yesNoDone }: LandingViewProps) => {
//     const [isNumericOpen, setIsNumericOpen] = useState(true);
//     const [isYesNoOpen, setIsYesNoOpen] = useState(true);
//     const [isResultsOpen, setIsResultsOpen] = useState(true);

//     return (
//         <div className="min-h-screen bg-[#fdfbf7] text-black flex flex-col items-center pt-12 pb-24 px-4">
//             <div className="text-center mb-12">
//                 <motion.h1 initial={{opacity: 0, y: 20}} animate={{opacity: 1, y: 0}} transition={{duration: 0.5}} className="text-4xl md:text-5xl font-bold mb-4 text-gray-800">Your Financial Health Checkup</motion.h1>
//                 <motion.p initial={{opacity: 0, y: 20}} animate={{opacity: 1, y: 0}} transition={{duration: 0.5, delay: 0.2}} className="text-lg text-gray-600 max-w-2xl mx-auto">
//                     Confused about money stuff? 😵‍💫 This quick checkup gives you a simple score and personalized tips to get your finances on track. ✨
//                 </motion.p>
//             </div>

//             <CollapsibleSection title="Step 1: Numeric Inputs" icon={Calculator} isComplete={numericDone} statusText={numericDone ? '✓ Completed' : 'Required'} isOpen={isNumericOpen} setIsOpen={setIsNumericOpen}>
//                 <p className="text-gray-600 mb-4">Enter your key financial figures. This section is crucial for calculating the quantitative part of your score.</p>
//                 <Button onClick={() => setView("numeric")} className="w-full md:w-auto">{numericDone ? 'Edit Numeric Inputs' : 'Start Step 1'}</Button>
//             </CollapsibleSection>

//             <CollapsibleSection title="Step 2: Pre-Requisites" icon={CheckSquare} isComplete={yesNoDone} statusText={yesNoDone ? '✓ Completed' : 'Required'} isOpen={isYesNoOpen} setIsOpen={setIsYesNoOpen}>
//                 <p className="text-gray-600 mb-4">Answer a few simple yes or no questions about your financial habits and planning.</p>
//                 <Button onClick={() => setView("yesno")} className="w-full md:w-auto">{yesNoDone ? 'Edit Pre-Requisites' : 'Start Step 2'}</Button>
//             </CollapsibleSection>

//             <AnimatePresence>
//                 {numericDone && yesNoDone && (
//                     <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }} className="w-full flex justify-center">
//                         <CollapsibleSection title="Results" icon={Trophy} isComplete={true} statusText="Ready to View" isOpen={isResultsOpen} setIsOpen={setIsResultsOpen}>
//                             <p className="text-gray-600 mb-4">Great job! Your financial health score is calculated. View your detailed report and personalized tips.</p>
//                             <Button onClick={() => setView("results")} className="w-full md:w-auto">View Full Report</Button>
//                         </CollapsibleSection>
//                     </motion.div>
//                 )}
//             </AnimatePresence>
            
//             <HowItWorks />
//         </div>
//     );
// };


// // --- MAIN PAGE COMPONENT ---
// export default function FinancialHealthFlashcardsPage() {
//   const [view, setView] = useState<View>("landing");
//   const [numericState, setNumericState] = useState<NumericField[]>(initialNumeric);
//   const [yesNoState, setYesNoState] = useState<YesNoField[]>(initialYesNo);
//   const [numericDone, setNumericDone] = useState(false);
//   const [yesNoDone, setYesNoDone] = useState(false);

//   const updateNumericValue = (key: string, newValue: number) => { setNumericState((prev) => prev.map((p) => (p.key === key ? { ...p, value: newValue } : p))); };
//   const toggleYesNo = (key: string, checked: boolean) => { setYesNoState((prev) => prev.map((p) => (p.key === key ? { ...p, value: checked } : p))); };
//   const computeRating = (f: NumericField) => { const actual = f.value <= 0 ? 0.0001 : f.value; const def = f.defaultValue <= 0 ? 0.0001 : f.defaultValue; let percent = f.higherBetter ? actual / def : def / actual; if (!isFinite(percent) || percent <= 0) percent = 0; if (percent > 1) percent = 1; const rating = Math.max(0, Math.min(5, Math.ceil(percent * 5))); return rating; };
//   const computeGap = (f: NumericField) => { return f.defaultValue - f.value; };

//   const numericComplete = numericState.every((n) => typeof n.value === "number" && n.value > 0);
//   const numericSum = numericState.reduce((acc, cur) => acc + computeRating(cur), 0);
//   const numericMax = numericState.length * 5;
//   const numericScoreWeighted = (numericSum / numericMax) * 60;
//   const yesYesCount = yesNoState.reduce((acc, cur) => acc + (cur.value ? 1 : 0), 0);
//   const yesCount = yesNoState.length;
//   const yesScoreWeighted = (yesYesCount / yesCount) * 40;
//   const finalScore = Math.round(numericScoreWeighted + yesScoreWeighted);

//   const numericTips: string[] = [];
//   numericState.forEach((f) => { const rating = computeRating(f); if (rating < 5) { const gap = computeGap(f); const tip = `Improve ${f.label}: current ${f.value.toLocaleString()} vs target ${f.defaultValue.toLocaleString()} (gap ${gap.toLocaleString()}). Recommendation: move towards ${f.defaultValue.toLocaleString()}.`; numericTips.push(tip); } });
//   const yesNoTips: string[] = [];
//   yesNoState.forEach((y) => { if (!y.value) { yesNoTips.push(`Consider improving "${y.label}" — ${y.info}`); } });
//   const allTips = [...numericTips, ...yesNoTips];

//   const handleNumericSubmit = () => { if (!numericComplete) { alert("Please ensure all numeric fields have values greater than 0."); return; } setNumericDone(true); setView("landing"); };
//   const handleYesNoSubmit = () => { setYesNoDone(true); setView("landing"); };
  
//   return (
//     <TooltipProvider>
//       <div className="flex flex-col min-h-screen">
//         <Navbar />
//         <main className="flex-grow">
//           {view === "landing" && <LandingView setView={setView} numericDone={numericDone} yesNoDone={yesNoDone} />}
//           {view === "numeric" && <NumericFullscreen numericState={numericState} updateNumericValue={updateNumericValue} computeGap={computeGap} computeRating={computeRating} handleNumericSubmit={handleNumericSubmit} setView={setView} />}
//           {view === "yesno" && <YesNoFullscreen yesNoState={yesNoState} toggleYesNo={toggleYesNo} handleYesNoSubmit={handleYesNoSubmit} setView={setView} />}
//           {view === "results" && <ResultsFullscreen finalScore={finalScore} numericScoreWeighted={numericScoreWeighted} yesScoreWeighted={yesScoreWeighted} allTips={allTips} setView={setView} />}
//         </main>
//         <Footer />
//       </div>
//     </TooltipProvider>
//   );
// } 






"use client";

import React, { useState } from "react";
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
    TooltipTrigger,
    TooltipContent,
    TooltipProvider,
} from "@/components/ui/tooltip";
import Footer4Col from "@/components/footer-column";
import { NavbarDemo } from "@/components/Navbar";

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
};

type YesNoFullscreenProps = { 
    yesNoState: YesNoField[]; 
    updateYesNoValue: (key: string, checked: YesNoValue) => void; 
    handleYesNoSubmit: () => void; 
    setView: React.Dispatch<React.SetStateAction<View>>; 
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
    // Section 1: Core Financials (Not Rated)
    { key: "monthlyIncome", label: "Monthly Income", value: "", info: "Your gross monthly income from all sources.", type: 'core' },
    { key: "monthlyExpenses", label: "Monthly Expenses", value: "", info: "Your total monthly spending.", type: 'core' },
    { key: "familyMembers", label: "Family Members", value: "", info: "Number of dependents you support financially.", type: 'core' },
    
    // Section 2: Long-Term Security (Rated)
    { key: "incomeProtection", label: "Income Protection (life cover)", defaultValue: 2000000, value: "", higherBetter: true, info: "Recommended life cover (example: annual income × ~20).", type: 'rated' },
    { key: "emergencyFund", label: "Emergency Fund", defaultValue: 120000, value: "", higherBetter: true, info: "Emergency fund typically 3-6 months of expenses. Default uses 3 months.", type: 'rated' },
    { key: "retirementGoals", label: "Retirement Corpus Goal", defaultValue: 12000000, value: "", higherBetter: true, info: "Estimated retirement corpus required (placeholder rule).", type: 'rated' },
    
    // Section 3: Insurance Coverage (Rated)
    { key: "healthInsurance", label: "Health Insurance Sum Insured", defaultValue: 800000, value: "", higherBetter: true, info: "Recommended health cover relative to annual income and family size.", type: 'rated' },
    { key: "criticalIllness", label: "Critical Illness Cover", defaultValue: 300000, value: "", higherBetter: true, info: "Recommended sum assured for critical illness policies (rule-of-thumb).", type: 'rated' },
    { key: "disabilityInsurance", label: "Disability Insurance", defaultValue: 1500000, value: "", higherBetter: true, info: "Income replacement cover in case of long-term disability.", type: 'rated' },
    
    // Section 4: Other Financial Goals (Rated)
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
const NumericFullscreen = ({ numericState, updateNumericValue, computeGap, computeRating, handleNumericSubmit }: NumericFullscreenProps) => {
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
                                                <Tooltip><TooltipTrigger asChild><button className="p-1 rounded-full hover:bg-gray-200"><Info size={16} /></button></TooltipTrigger><TooltipContent><p className="max-w-xs text-sm">{f.info}</p></TooltipContent></Tooltip>
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
                    </CollapsibleCard>
                ))}
                <div className="flex justify-end pt-4"><Button onClick={handleNumericSubmit}>Submit & Continue</Button></div>
            </div>
        </div>
    );
};

const YesNoFullscreen = ({ yesNoState, updateYesNoValue, handleYesNoSubmit }: YesNoFullscreenProps) => (
    <div className="flex items-start justify-center min-h-screen px-4 py-12 bg-[#fdfbf7] text-black">
        <div className="w-full max-w-3xl">
            <Card className="bg-white">
                <CardHeader>
                    <CardTitle>Step 2: Financial Habits (Pre-Requisites)</CardTitle>
                    <p className="text-sm text-gray-600">Answer these questions to help us understand your financial practices.</p>
                </CardHeader>
                <CardContent>
                    <ul className="space-y-4">
                        {yesNoState.map((y) => (
                            <li key={y.key} className="p-4 border rounded-lg">
                                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                                    <div className="flex items-center gap-2 font-medium text-gray-800">
                                        <span>{y.label}</span>
                                        <Tooltip><TooltipTrigger asChild><button className="p-1 rounded-full hover:bg-gray-200"><Info size={16} /></button></TooltipTrigger><TooltipContent><p className="max-w-xs text-sm">{y.info}</p></TooltipContent></Tooltip>
                                    </div>
                                    <div className="flex items-center flex-shrink-0 gap-2">
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
                        {allTips.length === 0 ? (<p className="mt-2 text-sm text-green-600">Great job — all fields meet or exceed targets!</p>) : (<ul className="mt-2 ml-5 space-y-2 text-sm list-disc">{allTips.map((t, i) => (<li key={i}>{t}</li>))}</ul>)}
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
            const tip = `For **${f.label}**, your current value is ${formattedValue} against a target of ${formattedDefault} (a gap of ${formattedGap}). Aim to increase your amount to better meet this goal.`; 
            numericTips.push(tip); 
        } 
    });
    
    const yesNoTips: string[] = [];
    yesNoState.forEach((y) => { 
      if (y.value === 'no' || y.value === 'dont_know') { 
        yesNoTips.push(`Consider addressing **"${y.label}"**. ${y.info}`); 
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
            <div className="flex flex-col min-h-screen bg-gray-50 py-5">
                <NavbarDemo />
                <main className="flex-grow">
                    {view === "landing" && <LandingView setView={setView} numericDone={numericDone} yesNoDone={yesNoDone} />}
                    {view === "numeric" && <NumericFullscreen numericState={numericState} updateNumericValue={updateNumericValue} computeGap={computeGap} computeRating={computeRating} handleNumericSubmit={handleNumericSubmit} setView={setView} />}
                    {view === "yesno" && <YesNoFullscreen yesNoState={yesNoState} updateYesNoValue={updateYesNoValue} handleYesNoSubmit={handleYesNoSubmit} setView={setView} />}
                    {view === "results" && <ResultsFullscreen finalScore={finalScore} numericScoreWeighted={numericScoreWeighted} yesScoreWeighted={yesScoreWeighted} allTips={allTips} setView={setView} />}
                </main>
                <Footer4Col />
            </div>
        </TooltipProvider>
    );
}