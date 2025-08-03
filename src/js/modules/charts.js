// Charts module using Chart.js
import { chartConfigs } from '../config/data.js';

export class Charts {
    constructor() {
        this.charts = {};
    }

    init() {
        for (const [id, config] of Object.entries(chartConfigs)) {
            const ctx = document.getElementById(`${id}Chart`);
            if (ctx) {
                this.charts[id] = new Chart(ctx.getContext('2d'), config);
            }
        }
    }

    updatePaymentMethods(data) {
        if (this.charts.paymentMethods) {
            this.charts.paymentMethods.data.datasets[0].data = Object.values(data);
            this.charts.paymentMethods.update('none');
        }
    }

    updateOffers(data) {
        if (this.charts.offers) {
            this.charts.offers.data.datasets[0].data = Object.values(data);
            this.charts.offers.update('none');
        }
    }

    updateWeeklyTrends(sales, revenue) {
        if (this.charts.weeklyTrends) {
            this.charts.weeklyTrends.data.datasets[0].data[6] = sales;
            this.charts.weeklyTrends.data.datasets[1].data[6] = revenue;
            this.charts.weeklyTrends.update('none');
        }
    }

    updateTopCountries(countries) {
        if (this.charts.topCountries) {
            const sortedCountries = Object.entries(countries)
                .sort((a, b) => b[1].sales - a[1].sales)
                .slice(0, 5);
            
            this.charts.topCountries.data.labels = sortedCountries.map(c => c[0]);
            this.charts.topCountries.data.datasets[0].data = sortedCountries.map(c => c[1].sales);
            this.charts.topCountries.update('none');
        }
    }

    updateFocusCountry(weeklySales) {
        if (this.charts.focusCountry) {
            this.charts.focusCountry.data.datasets[0].data = weeklySales;
            this.charts.focusCountry.update();
        }
    }
} 