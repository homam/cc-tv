// Data simulation module for generating live data updates
import { state } from '../config/data.js';

export class DataSimulation {
    constructor(globe, charts, ui) {
        this.globe = globe;
        this.charts = charts;
        this.ui = ui;
    }

    updateData() {
        if (this.ui.isFocused) return;

        // Create view sparks
        for (let i = 0; i < 8; i++) {
            this.globe.createViewSpark();
        }

        // Update basic metrics
        state.views += Math.floor(Math.random() * 80 + 30);
        state.leads += Math.floor(Math.random() * 8 + 2);
        
        // Simulate sales
        if (Math.random() > 0.4) {
            this.simulateSale();
        }

        // Simulate small fluctuations in 24h metrics
        state.cr24h += (Math.random() - 0.5) * 0.02;
        state.cpa24h += (Math.random() - 0.5) * 0.1;

        this.updateUI();
    }

    simulateSale() {
        const saleAmount = Math.floor(Math.random() * 100 + 25);
        const countryKeys = Object.keys(state.countries);
        const randomCountryKey = countryKeys[Math.floor(Math.random() * countryKeys.length)];
        
        // Update sales metrics
        state.sales++;
        state.transactions++;
        state.revenue += saleAmount;
        state.cost += 7;
        state.countries[randomCountryKey].sales++;
        state.countries[randomCountryKey].revenue += saleAmount;
        state.countries[randomCountryKey].weeklySales[6]++;
        
        // Create globe effects
        this.createGlobeEffects(randomCountryKey, saleAmount);
        
        // Update payment methods
        this.updatePaymentMethods();
        
        // Update offers
        this.updateOffers(saleAmount);
    }

    createGlobeEffects(countryKey, saleAmount) {
        const bankKeys = Object.keys(state.banks);
        const randomBankKey = bankKeys[Math.floor(Math.random() * bankKeys.length)];
        const destinationBank = state.banks[randomBankKey];
        const { lat, lon } = state.countries[countryKey];
        
        this.globe.createAcquisitionEvent(lat, lon);
        this.globe.createRevenueArc(lat, lon, destinationBank.lat, destinationBank.lon);
    }

    updatePaymentMethods() {
        const randPay = Math.random();
        if (randPay < 0.6) {
            state.paymentMethods.card++;
        } else if (randPay < 0.85) {
            state.paymentMethods.applePay++;
        } else {
            state.paymentMethods.googlePay++;
        }
    }

    updateOffers(saleAmount) {
        const randOffer = Math.random();
        if (randOffer < 0.5) {
            state.offers['Offer A'] += saleAmount;
        } else if (randOffer < 0.8) {
            state.offers['Offer B'] += saleAmount;
        } else {
            state.offers['Offer C'] += saleAmount;
        }
    }

    updateUI() {
        this.ui.updateMetrics();
        
        this.charts.updatePaymentMethods(state.paymentMethods);
        this.charts.updateOffers(state.offers);
        this.charts.updateWeeklyTrends(state.sales, state.revenue);
        this.charts.updateTopCountries(state.countries);
    }

    startFocusCycle() {
        setInterval(() => {
            if (this.ui.isFocused) return;

            const sortedCountries = Object.entries(state.countries)
                .sort((a, b) => b[1].sales - a[1].sales)
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
} 