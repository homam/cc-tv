import { GlobeComponent } from './GlobeComponent.js';
import { ChartsComponent } from './ChartsComponent.js';
import { UIComponent } from './UIComponent.js';
import { DataSimulationComponent } from './DataSimulationComponent.js';

export class DashboardComponent extends HTMLElement {
  private globe: GlobeComponent;
  private charts: ChartsComponent;
  private ui: UIComponent;
  private dataSimulation: DataSimulationComponent;

  constructor() {
    super();
    this.globe = new GlobeComponent();
    this.charts = new ChartsComponent();
    this.ui = new UIComponent();
    this.dataSimulation = new DataSimulationComponent(this.globe, this.charts, this.ui);
  }

  connectedCallback() {
    this.render();
    // Add a small delay to ensure DOM is fully rendered
    setTimeout(() => {
      this.initializeComponents();
    }, 100);
  }

  private render() {
    this.innerHTML = `
      <div class="grid grid-cols-12 grid-rows-6 gap-4 h-[calc(100vh-2rem)]">
        
        <!-- Header -->
        <header class="col-span-12 row-span-1 grid grid-cols-12 gap-4">
          <div class="col-span-3 flex items-center">
            <h1 class="text-3xl font-bold text-white">Live Performance</h1>
          </div>
          <!-- Acquisition Funnel -->
          <div class="col-span-5 metric-card rounded-xl p-4 flex justify-around items-center">
            <div class="text-center funnel-step">
              <p class="text-sm text-slate-400 uppercase">Views</p>
              <p id="metric-views" class="text-4xl font-bold text-indigo-400 metric-value w-36">0</p>
            </div>
            <div class="text-center funnel-step">
              <p class="text-sm text-slate-400 uppercase">Leads</p>
              <p id="metric-leads" class="text-4xl font-bold text-indigo-400 metric-value w-36">0</p>
            </div>
            <div class="text-center">
              <p class="text-sm text-slate-400 uppercase">Sales</p>
              <p id="metric-sales" class="text-4xl font-bold text-indigo-400 metric-value w-36">0</p>
            </div>
          </div>
          <!-- Monetization Funnel -->
          <div class="col-span-4 metric-card rounded-xl p-4 flex justify-around items-center">
            <div class="text-center funnel-step">
              <p class="text-sm text-slate-400 uppercase">Transactions</p>
              <p id="metric-transactions" class="text-3xl font-bold text-emerald-400 metric-value w-32">0</p>
            </div>
            <div class="text-center">
              <p class="text-sm text-slate-400 uppercase">Revenue</p>
              <p id="metric-revenue" class="text-3xl font-bold text-emerald-400 metric-value w-32">$0</p>
            </div>
          </div>
        </header>

        <!-- Left Column -->
        <div class="col-span-3 row-span-5 flex flex-col gap-4">
          <div class="metric-card rounded-xl p-4 flex-1 flex flex-col justify-between">
            <div>
              <h2 class="text-lg font-semibold text-white mb-2">Key Metrics</h2>
              <div class="space-y-4">
                <div>
                  <p class="text-slate-300">Conversion Rate (24h)</p>
                  <div class="flex justify-between items-baseline">
                    <p id="metric-cr" class="text-2xl font-bold text-white">0.00%</p>
                    <p id="metric-cr-change" class="text-lg font-semibold"></p>
                  </div>
                </div>
                <div>
                  <p class="text-slate-300">CPA (24h)</p>
                  <div class="flex justify-between items-baseline">
                    <p id="metric-cpa" class="text-2xl font-bold text-white">$0.00</p>
                    <p id="metric-cpa-change" class="text-lg font-semibold"></p>
                  </div>
                </div>
                <div>
                  <p class="text-slate-300">Today's Revenue vs 7d Avg</p>
                  <div class="flex justify-between items-baseline text-sm text-slate-400">
                    <span id="revenue-progress-today">$0</span>
                    <span id="revenue-progress-target">$0</span>
                  </div>
                  <div class="w-full bg-slate-700 rounded-full h-2.5 mt-1">
                    <div id="progress-revenue" class="bg-emerald-500 h-2.5 rounded-full" style="width: 0%"></div>
                  </div>
                </div>
              </div>
            </div>
            <div class="chart-container rounded-lg p-2 mt-4">
              <canvas id="paymentMethodsChart"></canvas>
            </div>
          </div>
          <div class="metric-card rounded-xl p-4 flex-1">
            <h2 class="text-lg font-semibold text-white mb-2">Revenue by Offer</h2>
            <div class="chart-container rounded-lg p-2 h-5/6">
              <canvas id="offersChart"></canvas>
            </div>
          </div>
        </div>

        <!-- Center Column (Globe) -->
        <div class="col-span-6 row-span-5 rounded-xl relative overflow-hidden metric-card" id="globe-container">
          <div class="absolute top-2 left-4 text-lg font-semibold">Live Global Activity</div>
        </div>

        <!-- Right Column -->
        <div class="col-span-3 row-span-5 relative">
          <!-- Global View -->
          <div id="global-view-right" class="view-container absolute inset-0 flex flex-col gap-4 h-full opacity-100 pointer-events-auto">
            <div class="metric-card rounded-xl p-4 flex-1">
              <h2 class="text-lg font-semibold text-white mb-2">Weekly Trends</h2>
              <div class="chart-container rounded-lg p-2 h-5/6">
                <canvas id="weeklyTrendsChart"></canvas>
              </div>
            </div>
            <div class="metric-card rounded-xl p-4 flex-1">
              <h2 class="text-lg font-semibold text-white mb-2">Top Countries by Sales</h2>
              <div class="chart-container rounded-lg p-2 h-5/6">
                <canvas id="topCountriesChart"></canvas>
              </div>
            </div>
          </div>
          <!-- Focus View -->
          <div id="focus-view-right" class="view-container absolute inset-0 metric-card rounded-xl p-4 flex flex-col opacity-0 pointer-events-none">
            <h2 class="text-lg font-semibold text-white">Focus On:</h2>
            <h3 id="focus-country-name" class="text-3xl font-bold text-amber-400 mb-4"></h3>
            <div class="space-y-3">
              <div>
                <p class="text-sm text-slate-400">Total Sales</p>
                <p id="focus-country-sales" class="text-2xl font-bold text-white">0</p>
              </div>
              <div>
                <p class="text-sm text-slate-400">Total Revenue</p>
                <p id="focus-country-revenue" class="text-2xl font-bold text-white">$0</p>
              </div>
            </div>
            <div class="chart-container rounded-lg p-2 mt-4 flex-grow">
              <canvas id="focusCountryChart"></canvas>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  private initializeComponents() {
    // Initialize all components
    this.globe.init();
    this.charts.init();
    
    // Start the enhanced streaming system
    this.dataSimulation.startStreaming();
    this.dataSimulation.startFocusCycle();
  }

  disconnectedCallback() {
    // Cleanup when component is removed
    this.dataSimulation.stopStreaming();
  }
}

// Register the custom element
customElements.define('dashboard-component', DashboardComponent); 