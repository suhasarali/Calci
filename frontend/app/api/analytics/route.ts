// // app/api/analytics/route.js
// import { BetaAnalyticsDataClient } from '@google-analytics/data';
// import { GoogleAuth } from 'google-auth-library';
// import { NextResponse } from 'next/server';

// // --- ADD THIS CHECK ---
// const clientEmail = process.env.GA_CLIENT_EMAIL;
// const privateKey = process.env.GA_PRIVATE_KEY;

// if (!clientEmail || !privateKey) {
//   console.error("Missing Google Analytics credentials in .env file");
//   return NextResponse.json(
//     { message: "Server configuration error: Missing analytics credentials." },
//     { status: 500 }
//   );
// }
// // --------------------

// const auth = new GoogleAuth({
//     credentials: {
//         client_email: clientEmail, // Use the checked variable
//         private_key: privateKey.replace(/\\n/g, '\n'), // Use the checked variable
//     },
//     scopes: 'https://www.googleapis.com/auth/analytics.readonly',
// });
// const analyticsDataClient = new BetaAnalyticsDataClient({ auth });
// const propertyId = process.env.GA_PROPERTY_ID;

// async function runReport(request) {
//     const [response] = await analyticsDataClient.runReport(request);
//     return response;
// }

// export async function GET(request) {
//     try {
//         const requests = {
//             // ... (all other requests remain the same)
//             monthlyUsers: runReport({ property: `properties/${propertyId}`, dateRanges: [{ startDate: '29daysAgo', endDate: 'today' }], dimensions: [{ name: 'date' }], metrics: [{ name: 'activeUsers' }] }),
//             keyStats: runReport({ property: `properties/${propertyId}`, dateRanges: [{ startDate: '29daysAgo', endDate: 'today' }], metrics: [{ name: 'engagementRate' }, { name: 'averageSessionDuration' }, { name: 'conversions' }] }),
//             topEvents: runReport({ property: `properties/${propertyId}`, dateRanges: [{ startDate: '29daysAgo', endDate: 'today' }], dimensions: [{ name: 'eventName' }], metrics: [{ name: 'eventCount' }], orderBys: [{ metric: { metricName: 'eventCount' }, desc: true }], limit: 7 }),
//             userTypes: runReport({ property: `properties/${propertyId}`, dateRanges: [{ startDate: '29daysAgo', endDate: 'today' }], dimensions: [{ name: 'newVsReturning' }], metrics: [{ name: 'activeUsers' }] }),
//             topCountries: runReport({ property: `properties/${propertyId}`, dateRanges: [{ startDate: '29daysAgo', endDate: 'today' }], dimensions: [{ name: 'country' }], metrics: [{ name: 'activeUsers' }], orderBys: [{ metric: { metricName: 'activeUsers' }, desc: true }], limit: 7 }),
//             deviceBreakdown: runReport({ property: `properties/${propertyId}`, dateRanges: [{ startDate: '29daysAgo', endDate: 'today' }], dimensions: [{ name: 'deviceCategory' }], metrics: [{ name: 'activeUsers' }] }),
//             demographics: runReport({ property: `properties/${propertyId}`, dateRanges: [{ startDate: '29daysAgo', endDate: 'today' }], dimensions: [{ name: 'userAgeBracket' }, { name: 'userGender' }], metrics: [{ name: 'activeUsers' }] }),
//             trafficSources: runReport({ property: `properties/${propertyId}`, dateRanges: [{ startDate: '29daysAgo', endDate: 'today' }], dimensions: [{ name: 'sessionDefaultChannelGroup' }], metrics: [{ name: 'sessions' }] }),
//             topPages: runReport({ property: `properties/${propertyId}`, dateRanges: [{ startDate: '29daysAgo', endDate: 'today' }], dimensions: [{ name: 'pagePath' }], metrics: [{ name: 'screenPageViews' }], orderBys: [{ metric: { metricName: 'screenPageViews' }, desc: true }], limit: 5 }),
//         };

//         const results = await Promise.allSettled(Object.values(requests));
//         const [
//             monthlyUsersRes, keyStatsRes, topEventsRes, userTypesRes, topCountriesRes,
//             deviceBreakdownRes, demographicsRes, trafficSourcesRes, topPagesRes
//         ] = results.map(res => res.status === 'fulfilled' ? res.value : null);

//         const keyStats = keyStatsRes?.rows?.[0]?.metricValues || [];
//         const engagementRate = parseFloat(keyStats[0]?.value || '0') * 100;
//         const avgSessionDuration = parseFloat(keyStats[1]?.value || '0');
        
//         const finalData = {
//             monthlyUsers: (monthlyUsersRes?.rows || []).map(row => ({ date: row.dimensionValues[0].value.replace(/(\d{4})(\d{2})(\d{2})/, '$1-$2-$3'), users: parseInt(row.metricValues[0].value, 10) })),
//             keyStats: {
//                 totalConversions: keyStats[2]?.value || '0',
//                 engagementRate: engagementRate.toFixed(1) + '%',
//                 avgSessionDuration: `${Math.floor(avgSessionDuration / 60)}m ${Math.round(avgSessionDuration % 60)}s`,
//             },
//             topEvents: (topEventsRes?.rows || []).map(row => ({ name: row.dimensionValues[0].value, count: row.metricValues[0].value })),
//             userTypes: (userTypesRes?.rows || []).map(row => ({ type: row.dimensionValues[0].value, users: parseInt(row.metricValues[0].value, 10) })),
//             topCountries: (topCountriesRes?.rows || []).map(row => ({ country: row.dimensionValues[0].value, users: row.metricValues[0].value })),
//             deviceBreakdown: (deviceBreakdownRes?.rows || []).map(row => ({ device: row.dimensionValues[0].value, users: parseInt(row.metricValues[0].value, 10) })),
            
//             // --- FIX: Ensure demographics are always objects, even if the API response is null ---
//             ageBrackets: (demographicsRes?.rows || []).reduce((acc, row) => { const age = row.dimensionValues[0].value; acc[age] = (acc[age] || 0) + parseInt(row.metricValues[0].value, 10); return acc; }, {}),
//             gender: (demographicsRes?.rows || []).reduce((acc, row) => { const gender = row.dimensionValues[1].value; acc[gender] = (acc[gender] || 0) + parseInt(row.metricValues[0].value, 10); return acc; }, {}),
            
//             trafficSources: (trafficSourcesRes?.rows || []).map(row => ({ source: row.dimensionValues[0].value, sessions: parseInt(row.metricValues[0].value, 10) })),
//             topPages: (topPagesRes?.rows || []).map(row => ({ page: row.dimensionValues[0].value, views: row.metricValues[0].value })),
//         };

//         return NextResponse.json(finalData, { status: 200 });
//     } catch (error) {
//         console.error("Error fetching Google Analytics data:", error);
//         return NextResponse.json({ message: "Failed to fetch analytics data", error: error.details || error.message }, { status: 500 });
//     }
// }





import { BetaAnalyticsDataClient } from '@google-analytics/data';
import { GoogleAuth } from 'google-auth-library';
import { NextResponse } from 'next/server';

export async function GET(request) {
    // Step 1: Load environment variables inside the function.
    const clientEmail = process.env.GA_CLIENT_EMAIL;
    const privateKey = process.env.GA_PRIVATE_KEY;
    const propertyId = process.env.GA_PROPERTY_ID;

    // Step 2: Validate that all required environment variables are present.
    // This check now correctly resides inside the function body.
    if (!clientEmail || !privateKey || !propertyId) {
        console.error("Missing Google Analytics credentials in .env file");
        return NextResponse.json(
            { message: "Server configuration error: Missing analytics credentials." },
            { status: 500 }
        );
    }

    try {
        // Step 3: Initialize authentication and the data client.
        // This is done within the try block to catch any potential setup errors.
        const auth = new GoogleAuth({
            credentials: {
                client_email: clientEmail,
                private_key: privateKey.replace(/\\n/g, '\n'), // Safely replace newlines
            },
            scopes: 'https://www.googleapis.com/auth/analytics.readonly',
        });

        const analyticsDataClient = new BetaAnalyticsDataClient({ auth });

        // Helper function defined within the scope to access the client
        async function runReport(reportRequest) {
            const [response] = await analyticsDataClient.runReport(reportRequest);
            return response;
        }

        // Step 4: Define all the analytics report requests.
        const requests = {
            monthlyUsers: runReport({ property: `properties/${propertyId}`, dateRanges: [{ startDate: '29daysAgo', endDate: 'today' }], dimensions: [{ name: 'date' }], metrics: [{ name: 'activeUsers' }] }),
            keyStats: runReport({ property: `properties/${propertyId}`, dateRanges: [{ startDate: '29daysAgo', endDate: 'today' }], metrics: [{ name: 'engagementRate' }, { name: 'averageSessionDuration' }, { name: 'conversions' }] }),
            topEvents: runReport({ property: `properties/${propertyId}`, dateRanges: [{ startDate: '29daysAgo', endDate: 'today' }], dimensions: [{ name: 'eventName' }], metrics: [{ name: 'eventCount' }], orderBys: [{ metric: { metricName: 'eventCount' }, desc: true }], limit: 7 }),
            userTypes: runReport({ property: `properties/${propertyId}`, dateRanges: [{ startDate: '29daysAgo', endDate: 'today' }], dimensions: [{ name: 'newVsReturning' }], metrics: [{ name: 'activeUsers' }] }),
            topCountries: runReport({ property: `properties/${propertyId}`, dateRanges: [{ startDate: '29daysAgo', endDate: 'today' }], dimensions: [{ name: 'country' }], metrics: [{ name: 'activeUsers' }], orderBys: [{ metric: { metricName: 'activeUsers' }, desc: true }], limit: 7 }),
            deviceBreakdown: runReport({ property: `properties/${propertyId}`, dateRanges: [{ startDate: '29daysAgo', endDate: 'today' }], dimensions: [{ name: 'deviceCategory' }], metrics: [{ name: 'activeUsers' }] }),
            demographics: runReport({ property: `properties/${propertyId}`, dateRanges: [{ startDate: '29daysAgo', endDate: 'today' }], dimensions: [{ name: 'userAgeBracket' }, { name: 'userGender' }], metrics: [{ name: 'activeUsers' }] }),
            trafficSources: runReport({ property: `properties/${propertyId}`, dateRanges: [{ startDate: '29daysAgo', endDate: 'today' }], dimensions: [{ name: 'sessionDefaultChannelGroup' }], metrics: [{ name: 'sessions' }] }),
            topPages: runReport({ property: `properties/${propertyId}`, dateRanges: [{ startDate: '29daysAgo', endDate: 'today' }], dimensions: [{ name: 'pagePath' }], metrics: [{ name: 'screenPageViews' }], orderBys: [{ metric: { metricName: 'screenPageViews' }, desc: true }], limit: 5 }),
        };

        // Step 5: Execute all requests in parallel.
        const results = await Promise.allSettled(Object.values(requests));
        const [
            monthlyUsersRes, keyStatsRes, topEventsRes, userTypesRes, topCountriesRes,
            deviceBreakdownRes, demographicsRes, trafficSourcesRes, topPagesRes
        ] = results.map(res => res.status === 'fulfilled' ? res.value : null);

        // Step 6: Process the results and format the final JSON response.
        const keyStats = keyStatsRes?.rows?.[0]?.metricValues || [];
        const engagementRate = parseFloat(keyStats[0]?.value || '0') * 100;
        const avgSessionDuration = parseFloat(keyStats[1]?.value || '0');

        const finalData = {
            monthlyUsers: (monthlyUsersRes?.rows || []).map(row => ({ date: row.dimensionValues[0].value.replace(/(\d{4})(\d{2})(\d{2})/, '$1-$2-$3'), users: parseInt(row.metricValues[0].value, 10) })),
            keyStats: {
                totalConversions: keyStats[2]?.value || '0',
                engagementRate: engagementRate.toFixed(1) + '%',
                avgSessionDuration: `${Math.floor(avgSessionDuration / 60)}m ${Math.round(avgSessionDuration % 60)}s`,
            },
            topEvents: (topEventsRes?.rows || []).map(row => ({ name: row.dimensionValues[0].value, count: row.metricValues[0].value })),
            userTypes: (userTypesRes?.rows || []).map(row => ({ type: row.dimensionValues[0].value, users: parseInt(row.metricValues[0].value, 10) })),
            topCountries: (topCountriesRes?.rows || []).map(row => ({ country: row.dimensionValues[0].value, users: row.metricValues[0].value })),
            deviceBreakdown: (deviceBreakdownRes?.rows || []).map(row => ({ device: row.dimensionValues[0].value, users: parseInt(row.metricValues[0].value, 10) })),
            ageBrackets: (demographicsRes?.rows || []).reduce((acc, row) => { const age = row.dimensionValues[0].value; acc[age] = (acc[age] || 0) + parseInt(row.metricValues[0].value, 10); return acc; }, {}),
            gender: (demographicsRes?.rows || []).reduce((acc, row) => { const gender = row.dimensionValues[1].value; acc[gender] = (acc[gender] || 0) + parseInt(row.metricValues[0].value, 10); return acc; }, {}),
            trafficSources: (trafficSourcesRes?.rows || []).map(row => ({ source: row.dimensionValues[0].value, sessions: parseInt(row.metricValues[0].value, 10) })),
            topPages: (topPagesRes?.rows || []).map(row => ({ page: row.dimensionValues[0].value, views: row.metricValues[0].value })),
        };

        return NextResponse.json(finalData, { status: 200 });

    } catch (error) {
        // Step 7: Catch any errors during the process and return a standardized error response.
        console.error("Error fetching Google Analytics data:", error);
        return NextResponse.json(
            { message: "Failed to fetch analytics data", error: error.details || error.message },
            { status: 500 }
        );
    }
}