// UI module for handling interface updates and interactions
import { countUp } from '../utils/helpers.js';
import { state } from '../config/data.js';

export class UI {
    constructor() {
        this.isFocused = false;
    }

    updateMetrics() {
        countUp(document.getElementById('metric-views'), state.views);
        countUp(document.getElementById('metric-leads'), state.leads);
        countUp(document.getElementById('metric-sales'), state.sales);
        countUp(document.getElementById('metric-transactions'), state.transactions);
        countUp(document.getElementById('metric-revenue'), state.revenue, 1500, '$');

        this.updateKeyMetrics();
        this.updateRevenueProgress();
    }

    updateKeyMetrics() {
        const crChangeEl = document.getElementById('metric-cr-change');
        const cpaChangeEl = document.getElementById('metric-cpa-change');
        
        const crChange = ((state.cr24h - state.cr7d_avg) / state.cr7d_avg) * 100;
        crChangeEl.innerText = `${crChange > 0 ? '▲' : '▼'} ${Math.abs(crChange).toFixed(1)}%`;
        crChangeEl.className = `text-lg font-semibold ${crChange > 0 ? 'text-green-400' : 'text-red-400'}`;
        document.getElementById('metric-cr').innerText = `${state.cr24h.toFixed(2)}%`;

        const cpaChange = ((state.cpa24h - state.cpa7d_avg) / state.cpa7d_avg) * 100;
        cpaChangeEl.innerText = `${cpaChange < 0 ? '▼' : '▲'} ${Math.abs(cpaChange).toFixed(1)}%`;
        cpaChangeEl.className = `text-lg font-semibold ${cpaChange < 0 ? 'text-green-400' : 'text-red-400'}`;
        document.getElementById('metric-cpa').innerText = `$${state.cpa24h.toFixed(2)}`;
    }

    updateRevenueProgress() {
        const sevenDayTotalRevenue = state.weeklyRevenue.reduce((a, b) => a + b, 0);
        const sevenDayAvgRevenue = sevenDayTotalRevenue / 7;
        const revenueProgress = Math.min((state.revenue / sevenDayAvgRevenue) * 100, 100);
        
        document.getElementById('progress-revenue').style.width = `${revenueProgress}%`;
        document.getElementById('revenue-progress-today').innerText = `$${state.revenue.toLocaleString()}`;
        document.getElementById('revenue-progress-target').innerText = `$${Math.round(sevenDayAvgRevenue).toLocaleString()}`;
    }

    setFocusView(countryName, countryData) {
        const globalView = document.getElementById('global-view-right');
        const focusView = document.getElementById('focus-view-right');
        
        globalView.classList.remove('opacity-100', 'pointer-events-auto');
        globalView.classList.add('opacity-0', 'pointer-events-none');
        
        focusView.classList.remove('opacity-0', 'pointer-events-none');
        focusView.classList.add('opacity-100', 'pointer-events-auto');

        document.getElementById('focus-country-name').innerText = countryName;
        countUp(document.getElementById('focus-country-sales'), countryData.sales);
        countUp(document.getElementById('focus-country-revenue'), countryData.revenue, 1500, '$');
        
        this.isFocused = true;
    }

    setGlobalView() {
        const globalView = document.getElementById('global-view-right');
        const focusView = document.getElementById('focus-view-right');

        focusView.classList.remove('opacity-100', 'pointer-events-auto');
        focusView.classList.add('opacity-0', 'pointer-events-none');

        globalView.classList.remove('opacity-0', 'pointer-events-none');
        globalView.classList.add('opacity-100', 'pointer-events-auto');
        
        this.isFocused = false;
    }

    get isFocused() {
        return this._isFocused;
    }

    set isFocused(value) {
        this._isFocused = value;
    }
} 