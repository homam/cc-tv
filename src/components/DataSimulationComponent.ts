import { state } from '../config/data.js';
import type { GlobeComponent } from './GlobeComponent.js';
import type { ChartsComponent } from './ChartsComponent.js';
import type { UIComponent } from './UIComponent.js';
import type { StreamingEvent, Alert, GlobalMetrics } from '../types/index.js';
import { getRandomCity, getRandomCityByCountry, majorCities } from '../config/cities-data.js';

export class DataSimulationComponent {
  private globe: GlobeComponent;
  private charts: ChartsComponent;
  private ui: UIComponent;
  private streamInterval: number | null = null;

  constructor(globe: GlobeComponent, charts: ChartsComponent, ui: UIComponent) {
    this.globe = globe;
    this.charts = charts;
    this.ui = ui;
    
    // Initialize enhanced data structure
    this.initializeEnhancedData();

    (window as any).zoomToCountry = function(lat: number, lon: number) {
      globe.zoomToCountry({ lat, lon });
    };
  }

  private initializeEnhancedData(): void {
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
        this.updateCountryDerivedMetrics(countryKey);
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

  startStreaming(): void {
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

  stopStreaming(): void {
    if (this.streamInterval) {
      clearInterval(this.streamInterval);
      this.streamInterval = null;
    }
  }

  private processStreamingData(): void {
    
    // Generate streaming events
    this.generateStreamingEvents();

    // Update global metrics
    this.updateGlobalMetrics();

    // Update country-specific metrics
    this.updateCountryMetrics();

    // Process data buffer
    this.processDataBuffer();

    // Create visual effects
    // this.createStreamingEffects();

    // Update UI
    this.updateUI();

    // Check for alerts
    this.checkAlerts();
    
  }

  private async getCityForEvent(countryKey: string): Promise<{ lat: number; lon: number; name: string }> {
    // Try to get city from static data first (faster)
    const staticCity = getRandomCityByCountry(countryKey);
    if (staticCity) {
      return { lat: staticCity.lat, lon: staticCity.lon, name: staticCity.name };
    }

    // Fallback to random city from any country
    const fallbackCity = getRandomCity();
    return { lat: fallbackCity.lat, lon: fallbackCity.lon, name: fallbackCity.name };
  }

  private generateStreamingEvents(): void {
    const countries = Object.keys(state.countries);
    
    // Generate 2-8 events per cycle for more frequent updates
    const eventCount = Math.floor(Math.random() * 100) + 2;
    
    for (let i = 0; i < eventCount; i++) {
      const eventType = this.getWeightedEventType();
      const countryKey = countries[Math.floor(Math.random() * countries.length)];
      
      // Get city data asynchronously
      this.getCityForEvent(countryKey).then(city => {
        const event: StreamingEvent = {
          id: `event_${Date.now()}_${i}`,
          timestamp: Date.now(),
          type: eventType,
          country: countryKey,
          location: { lat: city.lat, lon: city.lon },
          value: this.generateEventValue(eventType),
          metadata: this.generateEventMetadata(eventType, countryKey, city.name)
        };

        state.streamData.realTimeEvents.push(event);
        
        // Create visual effects for this event
        // this.createEventEffects(event);
        
        // Keep only last 50 events
        if (state.streamData.realTimeEvents.length > 50) {
          state.streamData.realTimeEvents.shift();
        }
      }).catch(() => {
        // Fallback to country coordinates if city lookup fails
        const fallbackCity = getRandomCity();
        const event: StreamingEvent = {
          id: `event_${Date.now()}_${i}`,
          timestamp: Date.now(),
          type: eventType,
          country: countryKey,
          location: { lat: fallbackCity.lat, lon: fallbackCity.lon },
          value: this.generateEventValue(eventType),
          metadata: this.generateEventMetadata(eventType, countryKey, fallbackCity.name)
        };

        state.streamData.realTimeEvents.push(event);
        
        // Keep only last 50 events
        if (state.streamData.realTimeEvents.length > 50) {
          state.streamData.realTimeEvents.shift();
        }
      });
    }
  }

  private getWeightedEventType(): 'view' | 'lead' | 'sale' | 'transaction' {
    // Probability distribution:
    // - View events: 20x more likely than sale events
    // - Transaction events: half as likely as sale events
    // - Lead events: same probability as sale events
    
    const random = Math.random();
    
    // Total probability distribution:
    // View: 20 units, Sale: 1 unit, Transaction: 0.5 units, Lead: 1 unit
    // Total: 22.5 units
    
    if (random < 20/22.5) {
      return 'view'; // ~88.9% probability
    } else if (random < 21/22.5) {
      return 'sale'; // ~4.4% probability
    } else if (random < 21.5/22.5) {
      return 'transaction'; // ~2.2% probability
    } else {
      return 'lead'; // ~4.4% probability
    }
  }

  private generateEventValue(eventType: string): number {
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

  private generateEventMetadata(eventType: string, countryKey: string, cityName?: string): any {
    const metadata: any = {
      country: countryKey,
      timestamp: Date.now()
    };

    if (cityName) {
      metadata.city = cityName;
    }

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

  private getRandomPaymentMethod(): string {
    const methods = ['card', 'applePay', 'googlePay'];
    return methods[Math.floor(Math.random() * methods.length)];
  }

  private getRandomOffer(): string {
    const offers = ['Offer A', 'Offer B', 'Offer C'];
    return offers[Math.floor(Math.random() * offers.length)];
  }

  private getRandomCustomerSegment(): string {
    const segments = ['new', 'returning', 'vip'];
    return segments[Math.floor(Math.random() * segments.length)];
  }

  private getRandomLeadSource(): string {
    const sources = ['organic', 'paid', 'social', 'email', 'direct'];
    return sources[Math.floor(Math.random() * sources.length)];
  }

  private getRandomDevice(): string {
    const devices = ['mobile', 'desktop', 'tablet'];
    return devices[Math.floor(Math.random() * devices.length)];
  }

  private getRandomReferrer(): string {
    const referrers = ['google', 'facebook', 'twitter', 'direct', 'email'];
    return referrers[Math.floor(Math.random() * referrers.length)];
  }

  private updateGlobalMetrics(): void {
    
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

  private simulateGlobalSale(): void {
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

  private updateCountryMetrics(): void {
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

  private updateCountryDerivedMetrics(countryKey: string): void {
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

  private updateDerivedGlobalMetrics(): void {
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

  private calculateTrend(hourlyData: any[], currentValue: number): number {
    if (hourlyData.length < 2) return 0;
    const previous = hourlyData[hourlyData.length - 2] || 0;
    return ((currentValue - previous) / previous) * 100;
  }

  private updateHourlyData(hourlyArray: any[], value: number): void {
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

  private processDataBuffer(): void {
    // Process real-time events for analytics
    const recentEvents = state.streamData.realTimeEvents.slice(-10);
    
    // Schedule visual effects to be spread out over 1 second
    this.scheduleEventEffects(recentEvents);
    
    // Update payment methods and offers for sales (immediate)
    recentEvents.forEach(event => {
      if (event.type === 'sale' && event.metadata) {
        this.updatePaymentMethods(event.metadata.paymentMethod || 'card');
        this.updateOffers(event.metadata.offer || 'Offer A', event.value);
      }
    });
  }

  private scheduleEventEffects(events: StreamingEvent[]): void {
    if (events.length === 0) return;
    
    const totalDuration = 1000; // 1 second in milliseconds
    const interval = totalDuration / events.length;
    
    events.forEach((event, index) => {
      const delay = index * interval;
      
      setTimeout(() => {
        this.createEventEffects(event);
      }, delay);
    });
  }

  private createEventEffects(event: StreamingEvent): void {
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

  private createRevenueArc(event: StreamingEvent): void {
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

  private updatePaymentMethods(method: string): void {
    if (method && state.paymentMethods[method] !== undefined) {
      state.paymentMethods[method]++;
    }
  }

  private updateOffers(offer: string, amount: number): void {
    if (offer && state.offers[offer] !== undefined) {
      state.offers[offer] += amount;
    }
  }

  private checkAlerts(): void {
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

  private createAlert(message: string, type: 'success' | 'warning' | 'error' | 'info'): void {
    const alert: Alert = {
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

  private updateUI(): void {
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

  // Enhanced focus cycle with streaming data
  startFocusCycle(): void {
    setInterval(() => {
      if (this.ui.isFocused) return;

      const sortedCountries = Object.entries(state.countries)
        .sort((a, b) => b[1].metrics.sales.current - a[1].metrics.sales.current)
        .slice(0, 5);
      const [countryName, countryData] = sortedCountries[Math.floor(Math.random() * sortedCountries.length)];
      
      this.ui.setFocusView(countryName);
      this.globe.zoomToCountry(countryData);
      this.charts.updateFocusCountry(countryData.weeklySales);

      setTimeout(() => {
        this.ui.setGlobalView();
        this.globe.zoomOut();
      }, 15000);

    }, 30000);
  }

  // Get streaming data for external consumption
  getStreamingData(): StreamingData {
    return {
      globalMetrics: state.globalMetrics,
      countryMetrics: Object.keys(state.countries).reduce((acc: any, key) => {
        acc[key] = state.countries[key].metrics;
        return acc;
      }, {}),
      realTimeEvents: state.streamData.realTimeEvents,
      alerts: state.streamData.alerts
    };
  }

  // Export data for analytics
  exportAnalyticsData(): any {
    return {
      timestamp: Date.now(),
      globalMetrics: state.globalMetrics,
      countries: Object.keys(state.countries).reduce((acc: any, key) => {
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

export type CountryMetrics = {
  sales: number;
  revenue: number;
  lat: number;
  lon: number;
  weeklySales: number[];
};

export type StreamingData = {
  globalMetrics: GlobalMetrics;
  countryMetrics: Record<string, CountryMetrics>;
  realTimeEvents: StreamingEvent[];
  alerts: Alert[];
};