// app/admin/page.tsx

"use client";

import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom'; // 👈 Add this import for the portal
import { motion, AnimatePresence } from 'framer-motion';
import { MoreHorizontal, Search, Plus, SlidersHorizontal } from 'lucide-react';
import AnalyticsView from '../../components/AnalyticsView';
import QuizGeneratorView from '../../components/QuizGeneratorView';

// --- 1. Portal Component (defined directly in this file) ---
// This component "teleports" its children to the end of the document body,
// allowing them to render on top of everything else without being clipped.
const Portal = ({ children }: { children: React.ReactNode }) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  return mounted ? createPortal(children, document.body) : null;
};
// --- End of Portal Component ---


// --- 2. Updated UserTableRow Component ---
const UserTableRow = ({ user }: { user: any }) => {
    const [popoverOpen, setPopoverOpen] = useState(false);
    // State to hold the screen coordinates for the popover
    const [coords, setCoords] = useState<{ top: number; right: number } | null>(null);
    const buttonRef = useRef<HTMLButtonElement>(null);

    const getInitials = (name: string) => {
        const names = name.split(' ');
        if (names.length > 1 && names[1]) {
            return `${names[0][0]}${names[1][0]}`;
        }
        return name.substring(0, 2);
    };

    // This function now calculates the button's position on the screen
    const handlePopoverToggle = () => {
        if (popoverOpen) {
            setPopoverOpen(false);
            return;
        }
        if (buttonRef.current) {
            const rect = buttonRef.current.getBoundingClientRect();
            setCoords({
                top: rect.top + window.scrollY + rect.height + 4, // Position below the button
                right: window.innerWidth - rect.right - window.scrollX, // Align to the right
            });
            setPopoverOpen(true);
        }
    };
    
    // Effect to close popover when clicking elsewhere
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (buttonRef.current && !buttonRef.current.contains(event.target as Node)) {
                setPopoverOpen(false);
            }
        };
        if (popoverOpen) {
            document.addEventListener("mousedown", handleClickOutside);
        }
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [popoverOpen]);

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
                {/* The button now calls our new position-calculating function */}
                <button ref={buttonRef} onClick={handlePopoverToggle} className="p-2 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700">
                    <MoreHorizontal className="w-5 h-5 text-slate-500" />
                </button>
                
                <AnimatePresence>
                    {popoverOpen && coords && (
                        // 👇 The popover is now rendered via the Portal
                        <Portal>
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                transition={{ duration: 0.15 }}
                                // We use the calculated coordinates to position the popover
                                style={{
                                    position: 'absolute',
                                    top: `${coords.top}px`,
                                    right: `${coords.right}px`,
                                }}
                                className="w-56 bg-white dark:bg-slate-800 rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-50 border dark:border-slate-700"
                            >
                                <div className="py-1">
                                    <div className="px-4 py-2 text-xs font-semibold text-slate-400 uppercase">Calculators Used</div>
                                    {user.calculatorsUsed.length > 0 ? user.calculatorsUsed.map((calc: string) => (
                                        <a href="#" key={calc} className="block px-4 py-2 text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700">
                                            {calc}
                                        </a>
                                    )) : <span className="block px-4 py-2 text-sm text-slate-500">None</span>}
                                </div>
                            </motion.div>
                        </Portal>
                    )}
                </AnimatePresence>
            </td>
        </tr>
    );
};
// --- End of Updated Component ---


const UsersView = () => {
    const [users, setUsers] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await fetch('/api/users');
                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.error || 'Failed to fetch users');
                }
                const data = await response.json();
                setUsers(data.users);
} catch (err: any) {
                setError(err.message);
            } finally {
                setIsLoading(false);
            }
        };
        fetchUsers();
    }, []);

    if (isLoading) {
        return <div className="flex justify-center items-center p-10"><p className="text-slate-500">Loading users...</p></div>;
    }

    if (error) {
        return <div className="flex justify-center items-center p-10"><p className="text-red-500">Error: {error}</p></div>;
    }

    return (
        <motion.div 
            className="bg-white dark:bg-slate-800/50 rounded-xl shadow-lg border border-slate-200/50 dark:border-slate-700/50"
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.3 }}
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
                        {users.map((user: any) => <UserTableRow key={user.id} user={user} />)}
                    </tbody>
                </table>
            </div>
            <div className="p-4 border-t border-slate-200 dark:border-slate-700 flex items-center justify-between">
                <p className="text-sm text-slate-500 dark:text-slate-400">Showing 1 to {users.length} of {users.length} results</p>
                <div className="flex items-center gap-2">
                    <button className="px-3 py-1 border border-slate-300 dark:border-slate-600 rounded-md text-sm hover:bg-slate-100 dark:hover:bg-slate-700 disabled:opacity-50" disabled>Previous</button>
                    <button className="px-3 py-1 border border-slate-300 dark:border-slate-600 rounded-md text-sm hover:bg-slate-100 dark:hover:bg-slate-700">Next</button>
                </div>
            </div>
        </motion.div>
    );
};

const ViewToggle = ({ view, setView }: { view: string; setView: (view: string) => void; }) => {
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
            <button onClick={() => setView('quizzes')} className="relative px-5 py-1.5 text-sm font-semibold rounded-full">
                <span className={`relative z-10 transition-colors duration-300 ${view === 'quizzes' ? 'text-white' : 'text-slate-600 dark:text-slate-300'}`}>AI Quiz</span>
                {view === 'quizzes' && <motion.div layoutId="toggle-active-bg" className="absolute inset-0 bg-indigo-600 rounded-full" />}
            </button>
        </div>
    );
};

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
                        {view === 'users' && <UsersView key="users" />}
        {view === 'analytics' && <AnalyticsView key="analytics" />}
        {view === 'quizzes' && <QuizGeneratorView key="quizzes" />}
                    </AnimatePresence>
                </main>
            </div>
        </div>
    );
}