// Enhanced Data Simulation Module for Streaming Analytics
import { state } from '../config/data.js';

export class DataSimulation {
    constructor(globe, charts, ui) {
        this.globe = globe;
        this.charts = charts;
        this.ui = ui;
        this.streamInterval = null;
        this.dataBuffer = [];
        this.maxBufferSize = 100;
        this.lastUpdateTime = Date.now();
        
        // Initialize enhanced data structure
        this.initializeEnhancedData();
    }

    initializeEnhancedData() {
        // Add enhanced metrics to state if they don't exist
        if (!state.globalMetrics) {
            state.globalMetrics = {
                views: { current: state.views, trend: 0, hourly: [] },
                leads: { current: state.leads, trend: 0, hourly: [] },
                sales: { current: state.sales, trend: 0, hourly: [] },
                transactions: { current: state.transactions, trend: 0, hourly: [] },
                revenue: { current: state.revenue, trend: 0, hourly: [] },
                cost: { current: state.cost, trend: 0, hourly: [] },
                ecpa: { current: state.cost / state.leads || 0, trend: 0, hourly: [] },
                conversionRate: { current: (state.sales / state.leads * 100) || 0, trend: 0, hourly: [] }
            };
        }

        // Enhance country data with detailed metrics
        Object.keys(state.countries).forEach(countryKey => {
            const country = state.countries[countryKey];
            if (!country.metrics) {
                country.metrics = {
                    views: { current: Math.floor(country.sales * 100), trend: 0, hourly: [] },
                    leads: { current: Math.floor(country.sales * 8), trend: 0, hourly: [] },
                    sales: { current: country.sales, trend: 0, hourly: [] },
                    transactions: { current: country.sales, trend: 0, hourly: [] },
                    revenue: { current: country.revenue, trend: 0, hourly: [] },
                    cost: { current: Math.floor(country.sales * 7), trend: 0, hourly: [] },
                    ecpa: { current: 0, trend: 0, hourly: [] },
                    conversionRate: { current: 0, trend: 0, hourly: [] }
                };
                this.updateCountryMetrics(countryKey);
            }
        });

        // Initialize streaming data structure
        state.streamData = {
            realTimeEvents: [],
            hourlyAggregates: [],
            dailyAggregates: [],
            alerts: []
        };
    }

    startStreaming() {
        if (this.streamInterval) {
            clearInterval(this.streamInterval);
        }

        // Process data immediately to initialize the UI
        this.processStreamingData();

        // Then start the regular interval - update every second for real-time feel
        this.streamInterval = setInterval(() => {
            this.processStreamingData();
        }, 1000); // Process every 1 second for continuous updates
    }

    stopStreaming() {
        if (this.streamInterval) {
            clearInterval(this.streamInterval);
            this.streamInterval = null;
        }
    }

    processStreamingData() {
        const now = Date.now();
        const timeDiff = now - this.lastUpdateTime;
        this.lastUpdateTime = now;

        // Generate streaming events
        this.generateStreamingEvents();

        // Update global metrics
        this.updateGlobalMetrics();

        // Update country-specific metrics
        this.updateCountryMetrics();

        // Process data buffer
        this.processDataBuffer();

        // Create visual effects
        this.createStreamingEffects();

        // Update UI
        this.updateUI();

        // Check for alerts
        this.checkAlerts();
    }

    generateStreamingEvents() {
        const eventTypes = ['view', 'lead', 'sale', 'transaction'];
        const countries = Object.keys(state.countries);
        
        // Generate 2-8 events per cycle for more frequent updates
        const eventCount = Math.floor(Math.random() * 7) + 2;
        
        for (let i = 0; i < eventCount; i++) {
            const eventType = eventTypes[Math.floor(Math.random() * eventTypes.length)];
            const countryKey = countries[Math.floor(Math.random() * countries.length)];
            const country = state.countries[countryKey];
            
            const event = {
                id: `event_${Date.now()}_${i}`,
                timestamp: Date.now(),
                type: eventType,
                country: countryKey,
                location: { lat: country.lat, lon: country.lon },
                value: this.generateEventValue(eventType),
                metadata: this.generateEventMetadata(eventType, countryKey)
            };

            state.streamData.realTimeEvents.push(event);
            
            // Keep only last 50 events
            if (state.streamData.realTimeEvents.length > 50) {
                state.streamData.realTimeEvents.shift();
            }
        }
    }

    generateEventValue(eventType) {
        switch (eventType) {
            case 'view':
                return Math.floor(Math.random() * 10) + 1;
            case 'lead':
                return Math.floor(Math.random() * 3) + 1;
            case 'sale':
                return Math.floor(Math.random() * 100) + 25;
            case 'transaction':
                return Math.floor(Math.random() * 150) + 50;
            default:
                return 1;
        }
    }

    generateEventMetadata(eventType, countryKey) {
        const metadata = {
            country: countryKey,
            timestamp: Date.now()
        };

        switch (eventType) {
            case 'sale':
                metadata.paymentMethod = this.getRandomPaymentMethod();
                metadata.offer = this.getRandomOffer();
                metadata.customerSegment = this.getRandomCustomerSegment();
                break;
            case 'lead':
                metadata.source = this.getRandomLeadSource();
                metadata.quality = Math.random() > 0.7 ? 'high' : 'medium';
                break;
            case 'view':
                metadata.device = this.getRandomDevice();
                metadata.referrer = this.getRandomReferrer();
                break;
        }

        return metadata;
    }

    getRandomPaymentMethod() {
        const methods = ['card', 'applePay', 'googlePay'];
        return methods[Math.floor(Math.random() * methods.length)];
    }

    getRandomOffer() {
        const offers = ['Offer A', 'Offer B', 'Offer C'];
        return offers[Math.floor(Math.random() * offers.length)];
    }

    getRandomCustomerSegment() {
        const segments = ['new', 'returning', 'vip'];
        return segments[Math.floor(Math.random() * segments.length)];
    }

    getRandomLeadSource() {
        const sources = ['organic', 'paid', 'social', 'email', 'direct'];
        return sources[Math.floor(Math.random() * sources.length)];
    }

    getRandomDevice() {
        const devices = ['mobile', 'desktop', 'tablet'];
        return devices[Math.floor(Math.random() * devices.length)];
    }

    getRandomReferrer() {
        const referrers = ['google', 'facebook', 'twitter', 'direct', 'email'];
        return referrers[Math.floor(Math.random() * referrers.length)];
    }

    updateGlobalMetrics() {
        // Update views with larger increments for more visible ticking effect
        const viewIncrement = Math.floor(Math.random() * 200) + 100;
        state.globalMetrics.views.current += viewIncrement;
        state.globalMetrics.views.trend = this.calculateTrend(state.globalMetrics.views.hourly, viewIncrement);
        this.updateHourlyData(state.globalMetrics.views.hourly, viewIncrement);

        // Update leads with larger increments
        const leadIncrement = Math.floor(Math.random() * 20) + 8;
        state.globalMetrics.leads.current += leadIncrement;
        state.globalMetrics.leads.trend = this.calculateTrend(state.globalMetrics.leads.hourly, leadIncrement);
        this.updateHourlyData(state.globalMetrics.leads.hourly, leadIncrement);

        // Simulate sales with higher probability and larger amounts
        if (Math.random() > 0.25) {
            this.simulateGlobalSale();
        }

        // Update derived metrics
        this.updateDerivedGlobalMetrics();
    }

    simulateGlobalSale() {
        const saleAmount = Math.floor(Math.random() * 200) + 50; // Larger sale amounts
        const cost = Math.floor(Math.random() * 25) + 10; // Larger cost increments
        
        // Update sales metrics
        state.globalMetrics.sales.current++;
        state.globalMetrics.transactions.current++;
        state.globalMetrics.revenue.current += saleAmount;
        state.globalMetrics.cost.current += cost;
        
        // Update trends
        state.globalMetrics.sales.trend = this.calculateTrend(state.globalMetrics.sales.hourly, 1);
        state.globalMetrics.revenue.trend = this.calculateTrend(state.globalMetrics.revenue.hourly, saleAmount);
        state.globalMetrics.cost.trend = this.calculateTrend(state.globalMetrics.cost.hourly, cost);
        
        // Update hourly data
        this.updateHourlyData(state.globalMetrics.sales.hourly, 1);
        this.updateHourlyData(state.globalMetrics.revenue.hourly, saleAmount);
        this.updateHourlyData(state.globalMetrics.cost.hourly, cost);
    }

    updateCountryMetrics() {
        Object.keys(state.countries).forEach(countryKey => {
            const country = state.countries[countryKey];
            const metrics = country.metrics;
            
            // Update country-specific metrics based on global events
            const countryEvents = state.streamData.realTimeEvents.filter(
                event => event.country === countryKey
            );

            countryEvents.forEach(event => {
                switch (event.type) {
                    case 'view':
                        metrics.views.current += event.value;
                        this.updateHourlyData(metrics.views.hourly, event.value);
                        break;
                    case 'lead':
                        metrics.leads.current += event.value;
                        this.updateHourlyData(metrics.leads.hourly, event.value);
                        break;
                    case 'sale':
                        metrics.sales.current += 1;
                        metrics.transactions.current += 1;
                        metrics.revenue.current += event.value;
                        metrics.cost.current += Math.floor(event.value * 0.1);
                        this.updateHourlyData(metrics.sales.hourly, 1);
                        this.updateHourlyData(metrics.revenue.hourly, event.value);
                        this.updateHourlyData(metrics.cost.hourly, Math.floor(event.value * 0.1));
                        break;
                }
            });

            // Update derived metrics
            this.updateCountryDerivedMetrics(countryKey);
        });
    }

    updateCountryDerivedMetrics(countryKey) {
        const country = state.countries[countryKey];
        const metrics = country.metrics;
        
        // Calculate eCPA
        metrics.ecpa.current = metrics.leads.current > 0 ? 
            metrics.cost.current / metrics.leads.current : 0;
        
        // Calculate conversion rate
        metrics.conversionRate.current = metrics.leads.current > 0 ? 
            (metrics.sales.current / metrics.leads.current) * 100 : 0;
        
        // Calculate trends
        metrics.ecpa.trend = this.calculateTrend(metrics.ecpa.hourly, metrics.ecpa.current);
        metrics.conversionRate.trend = this.calculateTrend(metrics.conversionRate.hourly, metrics.conversionRate.current);
    }

    updateDerivedGlobalMetrics() {
        // Calculate global eCPA
        state.globalMetrics.ecpa.current = state.globalMetrics.leads.current > 0 ? 
            state.globalMetrics.cost.current / state.globalMetrics.leads.current : 0;
        
        // Calculate global conversion rate
        state.globalMetrics.conversionRate.current = state.globalMetrics.leads.current > 0 ? 
            (state.globalMetrics.sales.current / state.globalMetrics.leads.current) * 100 : 0;
        
        // Update trends
        state.globalMetrics.ecpa.trend = this.calculateTrend(state.globalMetrics.ecpa.hourly, state.globalMetrics.ecpa.current);
        state.globalMetrics.conversionRate.trend = this.calculateTrend(state.globalMetrics.conversionRate.hourly, state.globalMetrics.conversionRate.current);
    }

    calculateTrend(hourlyData, currentValue) {
        if (hourlyData.length < 2) return 0;
        const previous = hourlyData[hourlyData.length - 2] || 0;
        return ((currentValue - previous) / previous) * 100;
    }

    updateHourlyData(hourlyArray, value) {
        const now = new Date();
        const hour = now.getHours();
        
        if (hourlyArray.length === 0 || hourlyArray[hourlyArray.length - 1].hour !== hour) {
            hourlyArray.push({ hour, value });
        } else {
            hourlyArray[hourlyArray.length - 1].value += value;
        }
        
        // Keep only last 24 hours
        if (hourlyArray.length > 24) {
            hourlyArray.shift();
        }
    }

    processDataBuffer() {
        // Process real-time events for analytics
        const recentEvents = state.streamData.realTimeEvents.slice(-10);
        
        recentEvents.forEach(event => {
            // Create visual effects based on event type
            this.createEventEffects(event);
            
            // Update payment methods and offers for sales
            if (event.type === 'sale') {
                this.updatePaymentMethods(event.metadata.paymentMethod);
                this.updateOffers(event.metadata.offer, event.value);
            }
        });
    }

    createEventEffects(event) {
        const { lat, lon } = event.location;
        
        switch (event.type) {
            case 'view':
                this.globe.createViewSparkAtLocation(lat, lon);
                break;
            case 'lead':
                this.globe.createLeadSparkAtLocation(lat, lon);
                break;
            case 'sale':
                this.globe.createAcquisitionEvent(lat, lon);
                this.createRevenueArc(event);
                break;
            case 'transaction':
                this.globe.createTransactionSparkAtLocation(lat, lon);
                break;
        }
    }

    createRevenueArc(event) {
        const bankKeys = Object.keys(state.banks);
        const randomBankKey = bankKeys[Math.floor(Math.random() * bankKeys.length)];
        const destinationBank = state.banks[randomBankKey];
        
        this.globe.createRevenueArc(
            event.location.lat, 
            event.location.lon, 
            destinationBank.lat, 
            destinationBank.lon
        );
    }

    createStreamingEffects() {
        // Create view sparks (reduced frequency when focused)
        const sparkCount = this.ui.isFocused ? 3 : 8;
        for (let i = 0; i < sparkCount; i++) {
            this.globe.createViewSpark();
        }
    }

    updatePaymentMethods(method) {
        if (method && state.paymentMethods[method] !== undefined) {
            state.paymentMethods[method]++;
        }
    }

    updateOffers(offer, amount) {
        if (offer && state.offers[offer] !== undefined) {
            state.offers[offer] += amount;
        }
    }

    checkAlerts() {
        // Check for unusual activity patterns
        const recentEvents = state.streamData.realTimeEvents.slice(-20);
        const salesCount = recentEvents.filter(e => e.type === 'sale').length;
        
        if (salesCount > 5) {
            this.createAlert('High sales activity detected', 'success');
        }
        
        // Check for conversion rate drops
        Object.keys(state.countries).forEach(countryKey => {
            const country = state.countries[countryKey];
            if (country.metrics.conversionRate.current < 5 && country.metrics.leads.current > 10) {
                this.createAlert(`Low conversion rate in ${countryKey}`, 'warning');
            }
        });
    }

    createAlert(message, type) {
        const alert = {
            id: `alert_${Date.now()}`,
            message,
            type,
            timestamp: Date.now()
        };
        
        state.streamData.alerts.push(alert);
        
        // Keep only last 10 alerts
        if (state.streamData.alerts.length > 10) {
            state.streamData.alerts.shift();
        }
    }

    updateUI() {
        this.ui.updateMetrics();
        
        this.charts.updatePaymentMethods(state.paymentMethods);
        this.charts.updateOffers(state.offers);
        this.charts.updateWeeklyTrends(state.sales, state.revenue);
        this.charts.updateTopCountries(state.countries);
        
        // Update new streaming charts if they exist
        if (this.charts.updateStreamingData) {
            this.charts.updateStreamingData(state.streamData);
        }
    }

    // Legacy method for backward compatibility
    updateData() {
        this.processStreamingData();
    }

    // Enhanced focus cycle with streaming data
    startFocusCycle() {
        setInterval(() => {
            if (this.ui.isFocused) return;

            const sortedCountries = Object.entries(state.countries)
                .sort((a, b) => b[1].metrics.sales.current - a[1].metrics.sales.current)
                .slice(0, 5);
            const [countryName, countryData] = sortedCountries[Math.floor(Math.random() * sortedCountries.length)];
            
            this.ui.setFocusView(countryName, countryData);
            this.globe.zoomToCountry(countryData);
            this.charts.updateFocusCountry(countryData.weeklySales);

            setTimeout(() => {
                this.ui.setGlobalView();
                this.globe.zoomOut();
            }, 15000);

        }, 30000);
    }

    // Get streaming data for external consumption
    getStreamingData() {
        return {
            globalMetrics: state.globalMetrics,
            countryMetrics: Object.keys(state.countries).reduce((acc, key) => {
                acc[key] = state.countries[key].metrics;
                return acc;
            }, {}),
            realTimeEvents: state.streamData.realTimeEvents,
            alerts: state.streamData.alerts
        };
    }

        // Export data for analytics
    exportAnalyticsData() {
        return {
            timestamp: Date.now(),
            globalMetrics: state.globalMetrics,
            countries: Object.keys(state.countries).reduce((acc, key) => {
                acc[key] = {
                    ...state.countries[key],
                    metrics: state.countries[key].metrics
                };
                return acc;
            }, {}),
            paymentMethods: state.paymentMethods,
            offers: state.offers,
            streamData: state.streamData
        };
    }
} 