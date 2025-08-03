// Data configuration and state management
export const state = {
    views: 184032,
    leads: 15321,
    sales: 1845,
    cost: 12540,
    transactions: 1820,
    revenue: 95420,
    cr24h: 1.02,
    cpa24h: 6.80,
    cr7d_avg: 1.0,
    cpa7d_avg: 7.10,
    paymentMethods: { card: 1100, applePay: 450, googlePay: 270 },
    offers: { 'Offer A': 45000, 'Offer B': 30000, 'Offer C': 20420 },
    banks: {
        'Rapyd': { lat: 51.5074, lon: -0.1278 },
        'Shift4': { lat: 40.5562, lon: -75.4852 },
        'Paynt': { lat: 54.6872, lon: 25.2797 },
        'Paynetics': { lat: 42.6977, lon: 23.3219 },
        'Worldline': { lat: 48.8857, lon: 2.2413 },
        'Paysafe': { lat: 25.276987, lon: 55.296249 }
    },
    countries: {
        'USA': { 
            sales: 500, 
            revenue: 25000, 
            lat: 37.0902, 
            lon: -95.7129, 
            weeklySales: [30, 45, 50, 60, 80, 90, 145],
            metrics: {
                views: { current: 50000, trend: 0, hourly: [] },
                leads: { current: 4000, trend: 0, hourly: [] },
                sales: { current: 500, trend: 0, hourly: [] },
                transactions: { current: 500, trend: 0, hourly: [] },
                revenue: { current: 25000, trend: 0, hourly: [] },
                cost: { current: 3500, trend: 0, hourly: [] },
                ecpa: { current: 0.875, trend: 0, hourly: [] },
                conversionRate: { current: 12.5, trend: 0, hourly: [] }
            }
        },
        'Germany': { 
            sales: 250, 
            revenue: 12500, 
            lat: 51.1657, 
            lon: 10.4515, 
            weeklySales: [15, 20, 25, 30, 40, 50, 70],
            metrics: {
                views: { current: 25000, trend: 0, hourly: [] },
                leads: { current: 2000, trend: 0, hourly: [] },
                sales: { current: 250, trend: 0, hourly: [] },
                transactions: { current: 250, trend: 0, hourly: [] },
                revenue: { current: 12500, trend: 0, hourly: [] },
                cost: { current: 1750, trend: 0, hourly: [] },
                ecpa: { current: 0.875, trend: 0, hourly: [] },
                conversionRate: { current: 12.5, trend: 0, hourly: [] }
            }
        },
        'UK': { 
            sales: 210, 
            revenue: 11000, 
            lat: 55.3781, 
            lon: -3.4360, 
            weeklySales: [10, 15, 20, 25, 35, 45, 60],
            metrics: {
                views: { current: 21000, trend: 0, hourly: [] },
                leads: { current: 1680, trend: 0, hourly: [] },
                sales: { current: 210, trend: 0, hourly: [] },
                transactions: { current: 210, trend: 0, hourly: [] },
                revenue: { current: 11000, trend: 0, hourly: [] },
                cost: { current: 1470, trend: 0, hourly: [] },
                ecpa: { current: 0.875, trend: 0, hourly: [] },
                conversionRate: { current: 12.5, trend: 0, hourly: [] }
            }
        },
        'Canada': { 
            sales: 180, 
            revenue: 9000, 
            lat: 56.1304, 
            lon: -106.3468, 
            weeklySales: [8, 12, 18, 22, 30, 40, 50],
            metrics: {
                views: { current: 18000, trend: 0, hourly: [] },
                leads: { current: 1440, trend: 0, hourly: [] },
                sales: { current: 180, trend: 0, hourly: [] },
                transactions: { current: 180, trend: 0, hourly: [] },
                revenue: { current: 9000, trend: 0, hourly: [] },
                cost: { current: 1260, trend: 0, hourly: [] },
                ecpa: { current: 0.875, trend: 0, hourly: [] },
                conversionRate: { current: 12.5, trend: 0, hourly: [] }
            }
        },
        'Australia': { 
            sales: 150, 
            revenue: 8000, 
            lat: -25.2744, 
            lon: 133.7751, 
            weeklySales: [7, 10, 15, 20, 25, 33, 40],
            metrics: {
                views: { current: 15000, trend: 0, hourly: [] },
                leads: { current: 1200, trend: 0, hourly: [] },
                sales: { current: 150, trend: 0, hourly: [] },
                transactions: { current: 150, trend: 0, hourly: [] },
                revenue: { current: 8000, trend: 0, hourly: [] },
                cost: { current: 1050, trend: 0, hourly: [] },
                ecpa: { current: 0.875, trend: 0, hourly: [] },
                conversionRate: { current: 12.5, trend: 0, hourly: [] }
            }
        },
        'France': { 
            sales: 120, 
            revenue: 6000, 
            lat: 46.6033, 
            lon: 1.8883, 
            weeklySales: [5, 8, 12, 18, 22, 25, 30],
            metrics: {
                views: { current: 12000, trend: 0, hourly: [] },
                leads: { current: 960, trend: 0, hourly: [] },
                sales: { current: 120, trend: 0, hourly: [] },
                transactions: { current: 120, trend: 0, hourly: [] },
                revenue: { current: 6000, trend: 0, hourly: [] },
                cost: { current: 840, trend: 0, hourly: [] },
                ecpa: { current: 0.875, trend: 0, hourly: [] },
                conversionRate: { current: 12.5, trend: 0, hourly: [] }
            }
        },
        'Brazil': { 
            sales: 95, 
            revenue: 4500, 
            lat: -14.2350, 
            lon: -51.9253, 
            weeklySales: [4, 6, 10, 14, 18, 21, 22],
            metrics: {
                views: { current: 9500, trend: 0, hourly: [] },
                leads: { current: 760, trend: 0, hourly: [] },
                sales: { current: 95, trend: 0, hourly: [] },
                transactions: { current: 95, trend: 0, hourly: [] },
                revenue: { current: 4500, trend: 0, hourly: [] },
                cost: { current: 665, trend: 0, hourly: [] },
                ecpa: { current: 0.875, trend: 0, hourly: [] },
                conversionRate: { current: 12.5, trend: 0, hourly: [] }
            }
        },
        'Japan': { 
            sales: 85, 
            revenue: 4800, 
            lat: 36.2048, 
            lon: 138.2529, 
            weeklySales: [3, 5, 8, 12, 16, 20, 21],
            metrics: {
                views: { current: 8500, trend: 0, hourly: [] },
                leads: { current: 680, trend: 0, hourly: [] },
                sales: { current: 85, trend: 0, hourly: [] },
                transactions: { current: 85, trend: 0, hourly: [] },
                revenue: { current: 4800, trend: 0, hourly: [] },
                cost: { current: 595, trend: 0, hourly: [] },
                ecpa: { current: 0.875, trend: 0, hourly: [] },
                conversionRate: { current: 12.5, trend: 0, hourly: [] }
            }
        },
        'India': { 
            sales: 75, 
            revenue: 3000, 
            lat: 20.5937, 
            lon: 78.9629, 
            weeklySales: [2, 4, 7, 11, 15, 16, 20],
            metrics: {
                views: { current: 7500, trend: 0, hourly: [] },
                leads: { current: 600, trend: 0, hourly: [] },
                sales: { current: 75, trend: 0, hourly: [] },
                transactions: { current: 75, trend: 0, hourly: [] },
                revenue: { current: 3000, trend: 0, hourly: [] },
                cost: { current: 525, trend: 0, hourly: [] },
                ecpa: { current: 0.875, trend: 0, hourly: [] },
                conversionRate: { current: 12.5, trend: 0, hourly: [] }
            }
        },
        'Nigeria': { 
            sales: 50, 
            revenue: 2000, 
            lat: 9.0820, 
            lon: 8.6753, 
            weeklySales: [1, 2, 4, 6, 10, 12, 15],
            metrics: {
                views: { current: 5000, trend: 0, hourly: [] },
                leads: { current: 400, trend: 0, hourly: [] },
                sales: { current: 50, trend: 0, hourly: [] },
                transactions: { current: 50, trend: 0, hourly: [] },
                revenue: { current: 2000, trend: 0, hourly: [] },
                cost: { current: 350, trend: 0, hourly: [] },
                ecpa: { current: 0.875, trend: 0, hourly: [] },
                conversionRate: { current: 12.5, trend: 0, hourly: [] }
            }
        },
    },
    weeklySales: [1200, 1350, 1300, 1500, 1650, 1600, 1845],
    weeklyRevenue: [65000, 71000, 68000, 78000, 85000, 84000, 95420],
    
    // Enhanced global metrics for streaming analytics
    globalMetrics: {
        views: { current: 184032, trend: 0, hourly: [] },
        leads: { current: 15321, trend: 0, hourly: [] },
        sales: { current: 1845, trend: 0, hourly: [] },
        transactions: { current: 1820, trend: 0, hourly: [] },
        revenue: { current: 95420, trend: 0, hourly: [] },
        cost: { current: 12540, trend: 0, hourly: [] },
        ecpa: { current: 0.818, trend: 0, hourly: [] },
        conversionRate: { current: 12.04, trend: 0, hourly: [] }
    },
    
    // Streaming data structure
    streamData: {
        realTimeEvents: [],
        hourlyAggregates: [],
        dailyAggregates: [],
        alerts: []
    }
};

export const chartConfigs = {
    paymentMethods: {
        type: 'bar',
        data: {
            labels: ['Card', 'Apple Pay', 'G Pay'],
            datasets: [{
                label: 'Transactions',
                data: [0, 0, 0],
                backgroundColor: ['#6366f1', '#818cf8', '#a5b4fc']
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            indexAxis: 'y',
            plugins: {
                legend: { display: false },
                legend: { labels: { color: '#94a3b8' } }
            },
            scales: {
                x: { ticks: { color: '#94a3b8' }, grid: { color: 'rgba(255, 255, 255, 0.1)' } },
                y: { ticks: { color: '#94a3b8' }, grid: { display: false } }
            }
        }
    },
    offers: {
        type: 'doughnut',
        data: {
            labels: ['Offer A', 'Offer B', 'Offer C'],
            datasets: [{
                data: [0, 0, 0],
                backgroundColor: ['#34d399', '#6ee7b7', '#a7f3d0'],
                hoverOffset: 4
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { position: 'bottom', labels: { boxWidth: 12, color: '#94a3b8' } }
            },
            scales: {
                x: { ticks: { color: '#94a3b8' }, grid: { color: 'rgba(255, 255, 255, 0.1)' } },
                y: { ticks: { color: '#94a3b8' }, grid: { color: 'rgba(255, 255, 255, 0.1)' } }
            }
        }
    },
    weeklyTrends: {
        type: 'line',
        data: {
            labels: ['Day 1', 'Day 2', 'Day 3', 'Day 4', 'Day 5', 'Day 6', 'Today'],
            datasets: [
                { label: 'Sales', data: [0, 0, 0, 0, 0, 0, 0], borderColor: '#38bdf8', tension: 0.4 },
                { label: 'Revenue', data: [0, 0, 0, 0, 0, 0, 0], borderColor: '#4ade80', tension: 0.4 }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { labels: { color: '#94a3b8' } } },
            scales: {
                x: { ticks: { color: '#94a3b8' }, grid: { color: 'rgba(255, 255, 255, 0.1)' } },
                y: { ticks: { color: '#94a3b8' }, grid: { color: 'rgba(255, 255, 255, 0.1)' } }
            }
        }
    },
    topCountries: {
        type: 'bar',
        data: {
            labels: [],
            datasets: [{
                label: 'Sales',
                data: [],
                backgroundColor: '#f472b6'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            indexAxis: 'y',
            plugins: { legend: { display: false } },
            scales: {
                x: { ticks: { color: '#94a3b8' }, grid: { color: 'rgba(255, 255, 255, 0.1)' } },
                y: { ticks: { color: '#94a3b8' }, grid: { color: 'rgba(255, 255, 255, 0.1)' } }
            }
        }
    },
    focusCountry: {
        type: 'line',
        data: {
            labels: ['Day 1', 'Day 2', 'Day 3', 'Day 4', 'Day 5', 'Day 6', 'Today'],
            datasets: [{
                label: 'Daily Sales',
                data: [],
                borderColor: '#facc15',
                tension: 0.4
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { display: false } },
            scales: {
                x: { ticks: { color: '#94a3b8' }, grid: { color: 'rgba(255, 255, 255, 0.1)' } },
                y: { ticks: { color: '#94a3b8' }, grid: { color: 'rgba(255, 255, 255, 0.1)' } }
            }
        }
    }
}; 