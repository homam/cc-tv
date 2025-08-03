// Main application file
import { Globe } from './modules/globe.js';
import { Charts } from './modules/charts.js';
import { UI } from './modules/ui.js';
import { DataSimulation } from './modules/dataSimulation.js';

class Dashboard {
    constructor() {
        this.globe = new Globe();
        this.charts = new Charts();
        this.ui = new UI();
        this.dataSimulation = new DataSimulation(this.globe, this.charts, this.ui);
    }

    init() {
        // Initialize all modules
        this.globe.init();
        this.charts.init();
        
        // Start the enhanced streaming system
        this.dataSimulation.startStreaming();
        this.dataSimulation.startFocusCycle();
    }
}

// Initialize the dashboard when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const dashboard = new Dashboard();
    dashboard.init();
}); 