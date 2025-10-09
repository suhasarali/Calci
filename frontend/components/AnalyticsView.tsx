"use client";

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from "next-themes";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, AreaChart, Area } from 'recharts';
import { AlertTriangle, Smartphone, Monitor, Tablet, Users, FileText, Globe, MousePointerClick, TrendingUp, Clock, UserCheck, CheckCircle, User } from 'lucide-react';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { chartTheme } from './charts-config';

// --- TypeScript Interfaces ---
interface MonthlyUserData { date: string; users: number; }
interface KeyStats { totalConversions: string; engagementRate: string; avgSessionDuration: string; }
interface TopEventData { name: string; count: string; }
interface UserTypeData { type: string; users: number; }
interface TopPageData { page: string; views: string; }
interface TrafficSourceData { source: string; sessions: number; }
interface CountryData { country: string; users: string; }
interface DeviceData { device: string; users: number; }
interface AnalyticsData {
    monthlyUsers: MonthlyUserData[];
    keyStats: KeyStats;
    topEvents: TopEventData[];
    userTypes: UserTypeData[];
    topPages: TopPageData[];
    topCountries: CountryData[];
    trafficSources: TrafficSourceData[];
    deviceBreakdown: DeviceData[];
    ageBrackets: Record<string, number>;
}

// --- Reusable Themed Chart & Stat Components ---
const StatCard = ({ title, value, icon: Icon, description }: { title: string; value: string; icon: React.ElementType; description?: string }) => (
    <Card>
        <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base font-medium text-muted-foreground">
                <Icon className="w-5 h-5" /> {title}
            </CardTitle>
        </CardHeader>
        <CardContent>
            <p className="text-4xl font-bold">{value}</p>
            {description && <p className="text-xs text-muted-foreground pt-1">{description}</p>}
        </CardContent>
    </Card>
);
const ThemedLineChart = ({ data, themeColors }: { data: MonthlyUserData[], themeColors: typeof chartTheme.light }) => (
     <Card className="col-span-1 md:col-span-3 lg:col-span-4">
        <CardHeader>
            <CardTitle>30-Day User Trend</CardTitle>
            <CardDescription>Daily active users over the last 30 days.</CardDescription>
        </CardHeader>
        <CardContent>
            <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={data}>
                    <defs><linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor={themeColors.primary} stopOpacity={0.8}/><stop offset="95%" stopColor={themeColors.primary} stopOpacity={0}/></linearGradient></defs>
                    <CartesianGrid vertical={false} stroke={themeColors.border} strokeDasharray="3 3" />
                    <XAxis dataKey="date" stroke={themeColors.mutedForeground} fontSize={12} tickLine={false} axisLine={false} tickFormatter={(tick) => new Date(tick).toLocaleDateString('en-US', { day: 'numeric', month: 'short' })} />
                    <YAxis stroke={themeColors.mutedForeground} fontSize={12} tickLine={false} axisLine={false} />
                    <Tooltip contentStyle={{ backgroundColor: themeColors.background, border: `1px solid ${themeColors.border}` }} />
                    <Area type="monotone" dataKey="users" stroke={themeColors.primary} fillOpacity={1} fill="url(#colorUv)" />
                </AreaChart>
            </ResponsiveContainer>
        </CardContent>
    </Card>
);
const ThemedPieChart = ({ data, themeColors, title, icon: Icon, dataKey, nameKey }: { data: any[], themeColors: any, title: string, icon: React.ElementType, dataKey: string, nameKey: string }) => {
    const COLORS = [themeColors.primary, themeColors.primaryMuted, '#6366f1', '#818cf8', '#a5b4fc'];
    return (
        <Card>
            <CardHeader><CardTitle className="flex items-center gap-2"><Icon className="w-5 h-5 text-muted-foreground" /> {title}</CardTitle></CardHeader>
            <CardContent>
                <ResponsiveContainer width="100%" height={250}>
                    <PieChart>
                        <Pie data={data} cx="50%" cy="50%" labelLine={false} outerRadius={80} dataKey={dataKey} nameKey={nameKey}>{data.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}</Pie>
                        <Tooltip contentStyle={{ backgroundColor: themeColors.background, border: `1px solid ${themeColors.border}` }} />
                        <Legend iconSize={10} />
                    </PieChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
    );
};


// --- Main AnalyticsView Component ---
export default function AnalyticsView() {
    const [data, setData] = useState<AnalyticsData | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const { theme } = useTheme();

    const currentTheme = theme === 'dark' ? chartTheme.dark : chartTheme.light;

    useEffect(() => {
        const fetchData = async () => {
             try {
                const response = await fetch('/api/analytics');
                if (!response.ok) throw new Error((await response.json()).message || "Failed to fetch");
                setData(await response.json());
            } catch (err) {
                setError(err instanceof Error ? err.message : "An unknown error occurred");
            } finally {
                setIsLoading(false);
            }
        };
        fetchData();
    }, []);

    if (isLoading) {
        return (
            <div className="space-y-6">
                <Skeleton className="h-10 w-64" />
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {[...Array(3)].map((_, i) => <Card key={i}><CardHeader><Skeleton className="h-5 w-3/4" /></CardHeader><CardContent><Skeleton className="h-12 w-1/2" /></CardContent></Card>)}
                </div>
                <Card className="col-span-3"><CardHeader><Skeleton className="h-6 w-1/4" /></CardHeader><CardContent><Skeleton className="h-72 w-full" /></CardContent></Card>
            </div>
        );
    }

    if (error || !data) {
        return (
            <Card className="bg-destructive/10 border-destructive col-span-full">
                <CardHeader><CardTitle className="text-destructive flex items-center gap-2"><AlertTriangle />Error</CardTitle></CardHeader>
                <CardContent><p>{error || "Data could not be loaded."}</p></CardContent>
            </Card>
        );
    }
    
    return (
        <Tabs defaultValue="overview">
            <TabsList>
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="audience">Audience</TabsTrigger>
                <TabsTrigger value="acquisition">Acquisition</TabsTrigger>
                <TabsTrigger value="engagement">Engagement & Conversions</TabsTrigger>
            </TabsList>
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
                <TabsContent value="overview" className="space-y-6 mt-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <StatCard title="Total Conversions" value={data.keyStats?.totalConversions ?? '0'} icon={CheckCircle} description="Last 29 days" />
                        <StatCard title="Engagement Rate" value={data.keyStats?.engagementRate ?? '0%'} icon={TrendingUp} description="Last 29 days" />
                        <StatCard title="Avg. Session Duration" value={data.keyStats?.avgSessionDuration ?? '0m 0s'} icon={Clock} description="Last 29 days" />
                    </div>
                    <ThemedLineChart data={data.monthlyUsers} themeColors={currentTheme} />
                </TabsContent>
                <TabsContent value="audience" className="space-y-6 mt-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <ThemedPieChart data={data.userTypes} themeColors={currentTheme} title="New vs Returning" icon={UserCheck} dataKey="users" nameKey="type" />
                        <ThemedPieChart data={data.deviceBreakdown.map(d => ({...d, device: d.device || "Unknown"}))} themeColors={currentTheme} title="Device Breakdown" icon={Smartphone} dataKey="users" nameKey="device" />
                        <ThemedPieChart data={Object.entries(data.ageBrackets || {}).map(([age, users]) => ({ name: age, value: users }))} themeColors={currentTheme} title="Age Brackets" icon={User} dataKey="value" nameKey="name" />
                        
                        <Card className="lg:col-span-3">
                             <CardHeader><CardTitle className="flex items-center gap-2"><Globe/>Users by Country</CardTitle></CardHeader>
                             <CardContent>
                                <ResponsiveContainer width="100%" height={300}>
                                     <BarChart data={data.topCountries} layout="vertical" margin={{ left: 20 }}>
                                        <XAxis type="number" hide />
                                        <YAxis type="category" dataKey="country" width={80} stroke={currentTheme.mutedForeground} fontSize={12} tickLine={false} axisLine={false} />
                                        <Tooltip cursor={{ fill: currentTheme.accent }} contentStyle={{ backgroundColor: currentTheme.background, border: `1px solid ${currentTheme.border}` }} />
                                        <Bar dataKey="users" fill={currentTheme.primaryMuted} radius={[0, 4, 4, 0]} />
                                     </BarChart>
                                </ResponsiveContainer>
                             </CardContent>
                        </Card>
                    </div>
                </TabsContent>
                 <TabsContent value="acquisition" className="space-y-6 mt-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <ThemedPieChart data={data.trafficSources} themeColors={currentTheme} title="Traffic Sources" icon={MousePointerClick} dataKey="sessions" nameKey="source" />
                        <Card>
                             <CardHeader><CardTitle className="flex items-center gap-2"><FileText/>Top Landing Pages</CardTitle></CardHeader>
                             <CardContent><Table><TableHeader><TableRow><TableHead>Page</TableHead><TableHead className="text-right">Views</TableHead></TableRow></TableHeader><TableBody>{(data.topPages || []).map((page, index) => (<TableRow key={index}><TableCell className="font-medium truncate" title={page.page}>{page.page}</TableCell><TableCell className="text-right"><Badge variant="secondary">{page.views}</Badge></TableCell></TableRow>))}</TableBody></Table></CardContent>
                        </Card>
                    </div>
                 </TabsContent>
                 <TabsContent value="engagement" className="space-y-6 mt-4">
                     <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">Top Events</CardTitle>
                            <CardDescription>The most frequent user interactions. Set up custom events in GA4 to track specific actions like button clicks.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Table>
                                <TableHeader><TableRow><TableHead>Event Name</TableHead><TableHead className="text-right">Count</TableHead></TableRow></TableHeader>
                                <TableBody>{(data.topEvents || []).map((event, index) => (<TableRow key={index}><TableCell className="font-medium">{event.name}</TableCell><TableCell className="text-right"><Badge variant="outline">{event.count}</Badge></TableCell></TableRow>))}</TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                 </TabsContent>
            </motion.div>
        </Tabs>
    );
}