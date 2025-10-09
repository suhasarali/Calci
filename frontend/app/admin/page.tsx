// app/page.tsx
"use client";

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MoreHorizontal, Search, Plus, SlidersHorizontal } from 'lucide-react';
import AnalyticsView from '../../components/AnalyticsView'; // <-- IMPORT THE NEW COMPONENT

// --- DUMMY DATA ---
const dummyUsers = [
  { id: 1, name: 'Stern Thireau', email: 'sthireau0@prlog.org', phone: '+1-555-123-4567', calculatorsUsed: ['BMI', 'Loan', 'Savings'] },
  { id: 2, name: 'Ford McKibbin', email: 'fmckibbin1@slate.com', phone: '+1-555-987-6543', calculatorsUsed: ['Mortgage', 'Retirement'] },
  { id: 3, name: 'Foss Rogliero', email: 'froglier2@ixing.com', phone: '+1-555-345-6789', calculatorsUsed: ['BMI', 'Savings'] },
  { id: 4, name: 'Maurits Eigey', email: 'melgey3@blogger.com', phone: '+1-555-555-5555', calculatorsUsed: ['Loan'] },
  { id: 5, name: 'Gun Kaasmann', email: 'gkaasmann4@economist.com', phone: '+1-555-111-2222', calculatorsUsed: ['BMI', 'Mortgage', 'Retirement'] },
  { id: 6, name: 'Edmund McCrae', email: 'emccrae5@woothemes.com', phone: '+1-555-333-4444', calculatorsUsed: ['Savings'] },
  { id: 7, name: 'Samuel Totman', email: 'stotman6@wisc.edu', phone: '+1-555-777-8888', calculatorsUsed: ['Loan', 'BMI'] },
  { id: 8, name: 'Patsy Cuardall', email: 'pcuardall7@barnesandnoble.com', phone: '+1-555-999-0000', calculatorsUsed: ['Retirement'] },
  { id: 9, name: 'Barnaby Cart', email: 'bcart8@alexa.com', phone: '+1-555-222-1111', calculatorsUsed: ['BMI', 'Savings', 'Mortgage'] },
  { id: 10, name: 'Mary Stivens', email: 'mstivens9@facebook.com', phone: '+1-555-444-3333', calculatorsUsed: ['Loan'] },
];


// --- USER TABLE COMPONENTS ---
const UserTableRow = ({ user }) => {
    const [popoverOpen, setPopoverOpen] = useState(false);
    const popoverRef = useRef(null);
    const buttonRef = useRef(null);

    const getInitials = (name) => {
        const names = name.split(' ');
        if (names.length > 1) {
            return `${names[0][0]}${names[1][0]}`;
        }
        return name.substring(0, 2);
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (popoverRef.current && !popoverRef.current.contains(event.target) && buttonRef.current && !buttonRef.current.contains(event.target)) {
                setPopoverOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
            <td className="p-4 whitespace-nowrap">
                <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-full bg-slate-200 dark:bg-slate-700 flex-shrink-0 flex items-center justify-center text-slate-600 dark:text-slate-300 font-semibold`}>
                        {getInitials(user.name)}
                    </div>
                    <span className="font-medium text-slate-800 dark:text-slate-100">{user.name}</span>
                </div>
            </td>
            <td className="p-4 whitespace-nowrap text-slate-600 dark:text-slate-300">{user.email}</td>
            <td className="p-4 whitespace-nowrap text-slate-600 dark:text-slate-300">{user.phone}</td>
            <td className="p-4 whitespace-nowrap text-center text-slate-600 dark:text-slate-300">{user.calculatorsUsed.length}</td>
            <td className="p-4 whitespace-nowrap text-center">
                <div className="relative inline-block text-left">
                    <button
                        ref={buttonRef}
                        onClick={() => setPopoverOpen(!popoverOpen)}
                        className="p-2 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700"
                    >
                        <MoreHorizontal className="w-5 h-5 text-slate-500" />
                    </button>
                    <AnimatePresence>
                        {popoverOpen && (
                            <motion.div
                                ref={popoverRef}
                                initial={{ opacity: 0, scale: 0.9, y: -10 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.9, y: -10 }}
                                transition={{ duration: 0.15 }}
                                className="absolute right-0 mt-2 w-56 origin-top-right bg-white dark:bg-slate-800 rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-10 border dark:border-slate-700"
                            >
                                <div className="py-1">
                                    <div className="px-4 py-2 text-xs font-semibold text-slate-400 uppercase">Calculators Used</div>
                                    {user.calculatorsUsed.map(calc => (
                                        <a href="#" key={calc} className="block px-4 py-2 text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700">
                                            {calc}
                                        </a>
                                    ))}
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </td>
        </tr>
    );
};

const UsersView = () => {
    return (
        <motion.div 
            className="bg-white dark:bg-slate-800/50 rounded-xl shadow-lg border border-slate-200/50 dark:border-slate-700/50"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
        >
            <div className="p-4 md:p-6 border-b border-slate-200 dark:border-slate-700">
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Users</h2>
                        <p className="text-sm text-slate-500 dark:text-slate-400">Manage, view and edit your users.</p>
                    </div>
                    <button className="hidden sm:flex items-center gap-2 bg-slate-900 text-white px-4 py-2 rounded-lg hover:bg-slate-700 dark:bg-indigo-600 dark:hover:bg-indigo-500 transition-colors font-semibold">
                        <Plus className="w-5 h-5" /> Add New User
                    </button>
                </div>
                <div className="mt-4 flex items-center gap-2">
                    <div className="relative flex-grow">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                        <input type="text" placeholder="Search users..." className="w-full pl-10 pr-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"/>
                    </div>
                    <button className="flex items-center gap-2 px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700">
                        <SlidersHorizontal className="w-5 h-5" /> <span className="hidden md:inline">Filters</span>
                    </button>
                </div>
            </div>
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-700">
                    <thead className="bg-slate-50 dark:bg-slate-900/50">
                        <tr>
                            {['Name', 'Email', 'Phone Number', 'Calculators Used', ''].map(header => (
                                <th key={header} scope="col" className={`px-4 py-3 text-left text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider ${header === 'Calculators Used' ? 'text-center' : ''}`}>
                                    {header}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="bg-white dark:bg-slate-800 divide-y divide-slate-200 dark:divide-slate-700">
                        {dummyUsers.map(user => <UserTableRow key={user.id} user={user} />)}
                    </tbody>
                </table>
            </div>
            <div className="p-4 border-t border-slate-200 dark:border-slate-700 flex items-center justify-between">
                <p className="text-sm text-slate-500 dark:text-slate-400">Showing 1 to {dummyUsers.length} of {dummyUsers.length} results</p>
                <div className="flex items-center gap-2">
                    <button className="px-3 py-1 border border-slate-300 dark:border-slate-600 rounded-md text-sm hover:bg-slate-100 dark:hover:bg-slate-700 disabled:opacity-50" disabled>Previous</button>
                    <button className="px-3 py-1 border border-slate-300 dark:border-slate-600 rounded-md text-sm hover:bg-slate-100 dark:hover:bg-slate-700">Next</button>
                </div>
            </div>
        </motion.div>
    );
};

// --- SHARED COMPONENTS ---
const ViewToggle = ({ view, setView }) => {
    return (
        <div className="p-1 flex bg-slate-200/80 dark:bg-slate-800 rounded-full border border-slate-300/80 dark:border-slate-700/80">
            <button
                onClick={() => setView('users')}
                className="relative px-5 py-1.5 text-sm font-semibold rounded-full"
            >
                <span className={`relative z-10 transition-colors duration-300 ${view === 'users' ? 'text-white' : 'text-slate-600 dark:text-slate-300'}`}>Users</span>
                {view === 'users' && (
                    <motion.div
                        layoutId="toggle-active-bg"
                        className="absolute inset-0 bg-indigo-600 rounded-full"
                        transition={{ type: 'spring', stiffness: 400, damping: 35 }}
                    />
                )}
            </button>
            <button
                onClick={() => setView('analytics')}
                className="relative px-5 py-1.5 text-sm font-semibold rounded-full"
            >
                <span className={`relative z-10 transition-colors duration-300 ${view === 'analytics' ? 'text-white' : 'text-slate-600 dark:text-slate-300'}`}>Analytics</span>
                {view === 'analytics' && (
                    <motion.div
                        layoutId="toggle-active-bg"
                        className="absolute inset-0 bg-indigo-600 rounded-full"
                        transition={{ type: 'spring', stiffness: 400, damping: 35 }}
                    />
                )}
            </button>
        </div>
    );
};

// --- MAIN APP PAGE ---
export default function Page() {
    const [view, setView] = useState('users');

    return (
        <div className="font-sans bg-slate-100 dark:bg-gray-900 text-slate-900 dark:text-slate-100 min-h-screen p-4 sm:p-6 md:p-8">
            <div className="max-w-7xl mx-auto">
                <motion.header
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                >
                    <div>
                        <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">Admin Dashboard</h1>
                        <p className="text-slate-500 dark:text-slate-400 mt-1">An overview of your application's user base and performance.</p>
                    </div>
                    <ViewToggle view={view} setView={setView} />
                </motion.header>
                
                <main>
                    <AnimatePresence mode="wait">
                        {view === 'users' ? <UsersView key="users" /> : <AnalyticsView key="analytics" />}
                    </AnimatePresence>
                </main>
            </div>
        </div>
    );
}