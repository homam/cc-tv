// Enhanced UI module for streaming analytics dashboard
import { AnalyticsHelpers } from '../utils/helpers.js';
import { state } from '../config/data.js';

export class UI {
    constructor() {
        this.isFocused = false;
        this.focusedCountry = null;
        this.initializeUI();
    }

    initializeUI() {
        this.updateMetrics();
        this.createStreamingEventsPanel();
        this.createAlertsPanel();
        this.createPerformanceIndicators();
    }

    updateMetrics() {
        // Try to get enhanced metrics, fallback to legacy data if not available
        let globalMetrics;
        try {
            globalMetrics = AnalyticsHelpers.getGlobalMetrics();
        } catch (error) {
            // Fallback to legacy data structure
            globalMetrics = {
                views: { current: state.views, trend: 0, formatted: this.formatNumber(state.views) },
                leads: { current: state.leads, trend: 0, formatted: this.formatNumber(state.leads) },
                sales: { current: state.sales, trend: 0, formatted: this.formatNumber(state.sales) },
                transactions: { current: state.transactions, trend: 0, formatted: this.formatNumber(state.transactions) },
                revenue: { current: state.revenue, trend: 0, formatted: this.formatCurrency(state.revenue) },
                cost: { current: state.cost, trend: 0, formatted: this.formatCurrency(state.cost) },
                ecpa: { current: state.cost / state.leads || 0, trend: 0, formatted: this.formatCurrency(state.cost / state.leads || 0) },
                conversionRate: { current: (state.sales / state.leads * 100) || 0, trend: 0, formatted: this.formatPercentage((state.sales / state.leads * 100) || 0) }
            };
        }

        // Update existing metric elements with animation
        this.updateMetricElementWithAnimation('metric-views', globalMetrics.views.formatted);
        this.updateMetricElementWithAnimation('metric-leads', globalMetrics.leads.formatted);
        this.updateMetricElementWithAnimation('metric-sales', globalMetrics.sales.formatted);
        this.updateMetricElementWithAnimation('metric-transactions', globalMetrics.transactions.formatted);
        this.updateMetricElementWithAnimation('metric-revenue', globalMetrics.revenue.formatted);
        
        // Update conversion rate and CPA
        this.updateMetricElementWithAnimation('metric-cr', globalMetrics.conversionRate.formatted);
        this.updateMetricElementWithAnimation('metric-cpa', globalMetrics.ecpa.formatted);
        
        // Update progress indicators
        this.updateProgressIndicators(globalMetrics);
        
        // Update trend indicators
        this.updateTrendIndicators(globalMetrics);
        
        // Add real-time update indicator
        this.showRealTimeIndicator();
    }

    updateMetricElementWithAnimation(elementId, newValue) {
        const element = document.getElementById(elementId);
        if (element) {
            const oldValue = element.textContent;
            if (oldValue !== newValue) {
                // Extract numeric values for counting animation
                const oldNum = this.extractNumber(oldValue);
                const newNum = this.extractNumber(newValue);
                
                if (oldNum !== null && newNum !== null && oldNum !== newNum) {
                    // Animate the counting effect
                    this.animateCount(element, oldNum, newNum, newValue);
                } else {
                    // Direct update with highlight animation
                    element.classList.add('metric-update');
                    element.textContent = newValue;
                    
                    setTimeout(() => {
                        element.classList.remove('metric-update');
                    }, 300);
                }
            }
        }
    }

    updateTrendIndicators(globalMetrics) {
        // Update trend indicators for each metric
        const metrics = [
            { id: 'metric-views', trend: globalMetrics.views.trend },
            { id: 'metric-leads', trend: globalMetrics.leads.trend },
            { id: 'metric-sales', trend: globalMetrics.sales.trend },
            { id: 'metric-transactions', trend: globalMetrics.transactions.trend },
            { id: 'metric-revenue', trend: globalMetrics.revenue.trend }
        ];

        metrics.forEach(metric => {
            const element = document.getElementById(metric.id);
            if (element) {
                // Add trend indicator as a small badge
                let trendBadge = element.querySelector('.trend-badge');
                if (!trendBadge) {
                    trendBadge = document.createElement('span');
                    trendBadge.className = 'trend-badge ml-2 text-xs';
                    element.appendChild(trendBadge);
                }
                
                const trend = metric.trend;
                if (trend > 0) {
                    trendBadge.textContent = '↗️';
                    trendBadge.className = 'trend-badge ml-2 text-xs text-green-400';
                } else if (trend < 0) {
                    trendBadge.textContent = '↘️';
                    trendBadge.className = 'trend-badge ml-2 text-xs text-red-400';
                } else {
                    trendBadge.textContent = '→';
                    trendBadge.className = 'trend-badge ml-2 text-xs text-gray-400';
                }
            }
        });
    }

    showRealTimeIndicator() {
        // Show a subtle real-time indicator
        let indicator = document.getElementById('realtime-indicator');
        if (!indicator) {
            indicator = document.createElement('div');
            indicator.id = 'realtime-indicator';
            indicator.className = 'fixed top-4 right-4 bg-green-500 text-white text-xs px-2 py-1 rounded-full opacity-75 z-50';
            indicator.textContent = 'LIVE';
            document.body.appendChild(indicator);
        }
        
        // Pulse animation
        indicator.classList.add('pulse');
        setTimeout(() => {
            indicator.classList.remove('pulse');
        }, 500);
    }

    updateProgressIndicators(globalMetrics) {
        // Update revenue progress
        const revenueToday = document.getElementById('revenue-progress-today');
        const revenueTarget = document.getElementById('revenue-progress-target');
        const progressRevenue = document.getElementById('progress-revenue');
        
        if (revenueToday && revenueTarget && progressRevenue) {
            const todayRevenue = globalMetrics.revenue.current;
            const targetRevenue = todayRevenue * 1.2; // Example target
            
            revenueToday.textContent = this.formatCurrency(todayRevenue);
            revenueTarget.textContent = this.formatCurrency(targetRevenue);
            
            const progressPercentage = Math.min((todayRevenue / targetRevenue) * 100, 100);
            progressRevenue.style.width = `${progressPercentage}%`;
        }
    }

    // Helper methods for fallback functionality
    formatNumber(num, decimals = 0) {
        // Show full numbers without K/M abbreviations
        return num.toLocaleString();
    }

    formatCurrency(amount, currency = '$') {
        return currency + amount.toLocaleString();
    }

    formatPercentage(value, decimals = 1) {
        return value.toFixed(decimals) + '%';
    }

    getTrendIndicator(trend) {
        if (trend > 0) return '↗️';
        if (trend < 0) return '↘️';
        return '→';
    }

    getTrendColor(trend) {
        if (trend > 0) return '#34d399';
        if (trend < 0) return '#f87171';
        return '#94a3b8';
    }

    extractNumber(value) {
        // Extract numeric value from string (handles currency symbols, commas, etc.)
        const match = value.toString().replace(/[$,]/g, '').match(/[\d.]+/);
        return match ? parseFloat(match[0]) : null;
    }

    animateCount(element, startValue, endValue, finalText) {
        const duration = 500; // Animation duration in milliseconds
        const startTime = Date.now();
        
        const animate = () => {
            const elapsed = Date.now() - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            // Easing function for smooth animation
            const easeOutQuart = 1 - Math.pow(1 - progress, 4);
            
            const currentValue = Math.floor(startValue + (endValue - startValue) * easeOutQuart);
            
            // Format the current value to match the final format
            let currentText;
            if (finalText.includes('$')) {
                currentText = '$' + currentValue.toLocaleString();
            } else if (finalText.includes('%')) {
                currentText = currentValue.toFixed(1) + '%';
            } else {
                currentText = currentValue.toLocaleString();
            }
            
            element.textContent = currentText;
            element.classList.add('metric-update');
            
            if (progress < 1) {
                requestAnimationFrame(animate);
            } else {
                // Ensure final value is exact
                element.textContent = finalText;
                setTimeout(() => {
                    element.classList.remove('metric-update');
                }, 100);
            }
        };
        
        requestAnimationFrame(animate);
    }

    createStreamingEventsPanel() {
        // Create streaming events panel if it doesn't exist
        let eventsContainer = document.getElementById('streaming-events');
        if (!eventsContainer) {
            eventsContainer = document.createElement('div');
            eventsContainer.id = 'streaming-events';
            eventsContainer.className = 'metric-card rounded-xl p-4';
            eventsContainer.innerHTML = `
                <h2 class="text-lg font-semibold text-white mb-2">Real-Time Events</h2>
                <div class="events-list" id="events-list">
                    <!-- Events will be populated here -->
                </div>
            `;
            // Add to the page (you might want to position this somewhere specific)
            document.body.appendChild(eventsContainer);
        }
        
        this.updateStreamingEvents();
    }

    updateStreamingEvents() {
        const eventsList = document.getElementById('events-list');
        if (!eventsList) return;

        try {
            const events = AnalyticsHelpers.getStreamingEvents(10);
            
            eventsList.innerHTML = events.map(event => `
                <div class="event-item" style="border-left-color: ${AnalyticsHelpers.getEventTypeColor(event.type)}">
                    <div class="event-header">
                        <span class="event-type">${event.type.toUpperCase()}</span>
                        <span class="event-time">${event.timeAgo}</span>
                    </div>
                    <div class="event-details">
                        <span class="event-country">${event.country}</span>
                        <span class="event-value">${event.formattedValue}</span>
                    </div>
                    ${event.metadata ? `
                        <div class="event-metadata">
                            ${this.formatEventMetadata(event.metadata)}
                        </div>
                    ` : ''}
                </div>
            `).join('');
        } catch (error) {
            // Fallback if streaming events are not available
            eventsList.innerHTML = '<div class="no-events">No events available</div>';
        }
    }

    formatEventMetadata(metadata) {
        const metadataItems = [];
        
        if (metadata.paymentMethod) {
            metadataItems.push(`Payment: ${metadata.paymentMethod}`);
        }
        if (metadata.offer) {
            metadataItems.push(`Offer: ${metadata.offer}`);
        }
        if (metadata.source) {
            metadataItems.push(`Source: ${metadata.source}`);
        }
        if (metadata.device) {
            metadataItems.push(`Device: ${metadata.device}`);
        }
        if (metadata.quality) {
            metadataItems.push(`Quality: ${metadata.quality}`);
        }
        
        return metadataItems.map(item => `<span class="metadata-item">${item}</span>`).join('');
    }

    createAlertsPanel() {
        // Create alerts panel if it doesn't exist
        let alertsContainer = document.getElementById('alerts-panel');
        if (!alertsContainer) {
            alertsContainer = document.createElement('div');
            alertsContainer.id = 'alerts-panel';
            alertsContainer.className = 'metric-card rounded-xl p-4';
            alertsContainer.innerHTML = `
                <h2 class="text-lg font-semibold text-white mb-2">Alerts</h2>
                <div class="alerts-list" id="alerts-list">
                    <!-- Alerts will be populated here -->
                </div>
            `;
            // Add to the page (you might want to position this somewhere specific)
            document.body.appendChild(alertsContainer);
        }
        
        this.updateAlerts();
    }

    updateAlerts() {
        const alertsList = document.getElementById('alerts-list');
        if (!alertsList) return;

        try {
            const alerts = AnalyticsHelpers.getAlerts(5);
            
            if (alerts.length === 0) {
                alertsList.innerHTML = '<div class="no-alerts">No active alerts</div>';
                return;
            }
            
            alertsList.innerHTML = alerts.map(alert => `
                <div class="alert-item ${alert.type}" style="border-left-color: ${AnalyticsHelpers.getAlertTypeColor(alert.type)}">
                    <div class="alert-header">
                        <span class="alert-type">${alert.type.toUpperCase()}</span>
                        <span class="alert-time">${alert.timeAgo}</span>
                    </div>
                    <div class="alert-message">${alert.message}</div>
                </div>
            `).join('');
        } catch (error) {
            // Fallback if alerts are not available
            alertsList.innerHTML = '<div class="no-alerts">No active alerts</div>';
        }
    }

    createPerformanceIndicators() {
        // Create performance indicators panel if it doesn't exist
        let performanceContainer = document.getElementById('performance-indicators');
        if (!performanceContainer) {
            performanceContainer = document.createElement('div');
            performanceContainer.id = 'performance-indicators';
            performanceContainer.className = 'metric-card rounded-xl p-4';
            performanceContainer.innerHTML = `
                <h2 class="text-lg font-semibold text-white mb-2">Performance Indicators</h2>
                <div class="performance-grid" id="performance-grid">
                    <!-- Performance indicators will be populated here -->
                </div>
            `;
            // Add to the page (you might want to position this somewhere specific)
            document.body.appendChild(performanceContainer);
        }
        
        this.updatePerformanceIndicators();
    }

    updatePerformanceIndicators() {
        const performanceGrid = document.getElementById('performance-grid');
        if (!performanceGrid) return;

        try {
            const performance = AnalyticsHelpers.getPerformanceIndicators();
            
            performanceGrid.innerHTML = `
                <div class="performance-card">
                    <h4>ROI</h4>
                    <div class="performance-value">${AnalyticsHelpers.formatPercentage(performance.roi)}</div>
                </div>
                <div class="performance-card">
                    <h4>Profit Margin</h4>
                    <div class="performance-value">${AnalyticsHelpers.formatPercentage(performance.profitMargin)}</div>
                </div>
                <div class="performance-card">
                    <h4>Avg Order Value</h4>
                    <div class="performance-value">${AnalyticsHelpers.formatCurrency(performance.averageOrderValue)}</div>
                </div>
                <div class="performance-card">
                    <h4>Lead to Sale Ratio</h4>
                    <div class="performance-value">${AnalyticsHelpers.formatPercentage(performance.leadToSaleRatio)}</div>
                </div>
            `;
        } catch (error) {
            // Fallback to basic performance indicators using legacy data
            const roi = state.revenue > 0 ? ((state.revenue - state.cost) / state.cost) * 100 : 0;
            const profitMargin = state.revenue > 0 ? ((state.revenue - state.cost) / state.revenue) * 100 : 0;
            const avgOrderValue = state.sales > 0 ? state.revenue / state.sales : 0;
            const leadToSaleRatio = state.leads > 0 ? (state.sales / state.leads) * 100 : 0;
            
            performanceGrid.innerHTML = `
                <div class="performance-card">
                    <h4>ROI</h4>
                    <div class="performance-value">${this.formatPercentage(roi)}</div>
                </div>
                <div class="performance-card">
                    <h4>Profit Margin</h4>
                    <div class="performance-value">${this.formatPercentage(profitMargin)}</div>
                </div>
                <div class="performance-card">
                    <h4>Avg Order Value</h4>
                    <div class="performance-value">${this.formatCurrency(avgOrderValue)}</div>
                </div>
                <div class="performance-card">
                    <h4>Lead to Sale Ratio</h4>
                    <div class="performance-value">${this.formatPercentage(leadToSaleRatio)}</div>
                </div>
            `;
        }
    }

    setFocusView(countryName, countryData) {
        this.isFocused = true;
        this.focusedCountry = countryName;
        
        const countryMetrics = AnalyticsHelpers.getCountryMetrics(countryName);
        if (!countryMetrics) return;

        // Update focus view elements
        const focusCountryName = document.getElementById('focus-country-name');
        const focusCountrySales = document.getElementById('focus-country-sales');
        const focusCountryRevenue = document.getElementById('focus-country-revenue');
        
        if (focusCountryName) focusCountryName.textContent = countryName;
        if (focusCountrySales) focusCountrySales.textContent = countryMetrics.sales.formatted;
        if (focusCountryRevenue) focusCountryRevenue.textContent = countryMetrics.revenue.formatted;

        // Show focus view
        const globalView = document.getElementById('global-view-right');
        const focusView = document.getElementById('focus-view-right');
        
        if (globalView && focusView) {
            globalView.classList.add('opacity-0', 'pointer-events-none');
            globalView.classList.remove('opacity-100', 'pointer-events-auto');
            focusView.classList.add('opacity-100', 'pointer-events-auto');
            focusView.classList.remove('opacity-0', 'pointer-events-none');
        }
    }

    setGlobalView() {
        this.isFocused = false;
        this.focusedCountry = null;
        
        // Show global view
        const globalView = document.getElementById('global-view-right');
        const focusView = document.getElementById('focus-view-right');
        
        if (globalView && focusView) {
            globalView.classList.add('opacity-100', 'pointer-events-auto');
            globalView.classList.remove('opacity-0', 'pointer-events-none');
            focusView.classList.add('opacity-0', 'pointer-events-none');
            focusView.classList.remove('opacity-100', 'pointer-events-auto');
        }
        
        this.updateMetrics();
    }

    // Export data functionality
    exportData() {
        const data = AnalyticsHelpers.exportMetricsData();
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `analytics-data-${new Date().toISOString().split('T')[0]}.json`;
        a.click();
        URL.revokeObjectURL(url);
    }

    generateReport() {
        const report = AnalyticsHelpers.generateReport();
        
        const reportWindow = window.open('', '_blank');
        reportWindow.document.write(`
            <html>
                <head>
                    <title>Analytics Report</title>
                    <style>
                        body { font-family: Arial, sans-serif; margin: 20px; }
                        .report-section { margin-bottom: 30px; }
                        .metric { margin: 10px 0; }
                        .positive { color: green; }
                        .negative { color: red; }
                    </style>
                </head>
                <body>
                    <h1>Analytics Report</h1>
                    <div class="report-section">
                        <h2>Summary</h2>
                        <div class="metric">Total Revenue: ${report.summary.totalRevenue}</div>
                        <div class="metric">Total Sales: ${report.summary.totalSales}</div>
                        <div class="metric">Conversion Rate: ${report.summary.conversionRate}</div>
                        <div class="metric">Average Order Value: ${report.summary.averageOrderValue}</div>
                        <div class="metric">ROI: ${report.summary.roi}</div>
                    </div>
                    <div class="report-section">
                        <h2>Top Performers</h2>
                        ${report.topPerformers.map(country => `
                            <div class="metric">${country.name}: ${country.revenue} ${country.trend}</div>
                        `).join('')}
                    </div>
                    <div class="report-section">
                        <h2>Recent Activity</h2>
                        ${report.recentActivity.map(event => `
                            <div class="metric">${event.timeAgo}: ${event.type} in ${event.country} - ${event.formattedValue}</div>
                        `).join('')}
                    </div>
                    <div class="report-section">
                        <h2>Alerts</h2>
                        ${report.alerts.map(alert => `
                            <div class="metric">${alert.timeAgo}: ${alert.message}</div>
                        `).join('')}
                    </div>
                </body>
            </html>
        `);
        reportWindow.document.close();
    }
} 