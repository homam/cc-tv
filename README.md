# CC-TV Dashboard - Enhanced Streaming Analytics

A real-time analytics dashboard with comprehensive streaming data visualization for views, leads, sales, transactions, revenue, cost, and eCPA metrics both globally and per country.

## 🚀 Features

### Enhanced Data Structure
- **Global Metrics**: Comprehensive tracking of views, leads, sales, transactions, revenue, cost, eCPA, and conversion rates
- **Country-Specific Metrics**: Detailed analytics for each country with individual performance indicators
- **Real-Time Streaming**: Live data updates with event-driven architecture
- **Trend Analysis**: Hourly trend calculations and performance indicators

### Streaming Analytics
- **Real-Time Events**: Live tracking of views, leads, sales, and transactions
- **Event Metadata**: Rich event data including payment methods, offers, customer segments, and device information
- **Alert System**: Intelligent alerts for unusual activity patterns and performance issues
- **Performance Indicators**: ROI, profit margin, average order value, and lead-to-sale ratios

### Data Visualization
- **Interactive Globe**: 3D globe visualization with real-time event sparks and revenue arcs
- **Metrics Dashboard**: Real-time display of all key performance indicators
- **Country Focus**: Detailed country-specific analytics with drill-down capabilities
- **Trend Indicators**: Visual trend analysis with color-coded indicators

## 📊 Data Structure

### Global Metrics
```javascript
globalMetrics: {
    views: { current: number, trend: number, hourly: [] },
    leads: { current: number, trend: number, hourly: [] },
    sales: { current: number, trend: number, hourly: [] },
    transactions: { current: number, trend: number, hourly: [] },
    revenue: { current: number, trend: number, hourly: [] },
    cost: { current: number, trend: number, hourly: [] },
    ecpa: { current: number, trend: number, hourly: [] },
    conversionRate: { current: number, trend: number, hourly: [] }
}
```

### Country Metrics
Each country includes the same comprehensive metrics structure with country-specific data and performance indicators.

### Streaming Events
```javascript
streamData: {
    realTimeEvents: [
        {
            id: string,
            timestamp: number,
            type: 'view' | 'lead' | 'sale' | 'transaction',
            country: string,
            location: { lat: number, lon: number },
            value: number,
            metadata: {
                paymentMethod?: string,
                offer?: string,
                customerSegment?: string,
                source?: string,
                quality?: string,
                device?: string,
                referrer?: string
            }
        }
    ],
    alerts: [
        {
            id: string,
            message: string,
            type: 'success' | 'warning' | 'error' | 'info',
            timestamp: number
        }
    ]
}
```

## 🛠️ Architecture

### Core Modules

#### DataSimulation (`src/js/modules/dataSimulation.js`)
- **Streaming Data Generation**: Creates realistic streaming events every 2 seconds
- **Event Processing**: Handles different event types with appropriate metadata
- **Metrics Calculation**: Updates global and country-specific metrics in real-time
- **Alert System**: Monitors performance and generates intelligent alerts
- **Data Export**: Provides comprehensive data export capabilities

#### UI (`src/js/modules/ui.js`)
- **Metrics Display**: Real-time display of all key performance indicators
- **Event Visualization**: Shows streaming events with rich metadata
- **Alert Management**: Displays and manages system alerts
- **Country Focus**: Handles country-specific analytics views
- **Report Generation**: Creates comprehensive analytics reports

#### AnalyticsHelpers (`src/js/utils/helpers.js`)
- **Data Formatting**: Currency, percentage, and number formatting utilities
- **Trend Calculation**: Computes trend indicators and performance metrics
- **Event Processing**: Handles event metadata and formatting
- **Performance Indicators**: Calculates ROI, profit margins, and other KPIs
- **Data Export**: Comprehensive data export and reporting utilities

### Data Flow

1. **Event Generation**: `DataSimulation` generates realistic streaming events
2. **Metrics Update**: Events trigger updates to global and country metrics
3. **UI Refresh**: Updated metrics are displayed in real-time
4. **Visual Effects**: Globe and charts update with new data
5. **Alert Monitoring**: System monitors for unusual patterns and generates alerts

## 🎯 Key Metrics

### Primary Metrics
- **Views**: Total page views and traffic
- **Leads**: Generated leads and prospects
- **Sales**: Completed sales transactions
- **Transactions**: Total transaction volume
- **Revenue**: Total revenue generated
- **Cost**: Total cost of operations
- **eCPA**: Effective cost per acquisition
- **Conversion Rate**: Lead to sale conversion percentage

### Performance Indicators
- **ROI**: Return on investment percentage
- **Profit Margin**: Revenue minus cost percentage
- **Average Order Value**: Revenue per sale
- **Lead to Sale Ratio**: Conversion efficiency

## 🔧 Usage

### Starting the Dashboard
```javascript
import { DataSimulation } from './modules/dataSimulation.js';
import { UI } from './modules/ui.js';

const dataSim = new DataSimulation(globe, charts, ui);
dataSim.startStreaming();
```

### Accessing Analytics Data
```javascript
import { AnalyticsHelpers } from './utils/helpers.js';

// Get global metrics
const globalMetrics = AnalyticsHelpers.getGlobalMetrics();

// Get country-specific metrics
const countryMetrics = AnalyticsHelpers.getCountryMetrics('USA');

// Get streaming events
const events = AnalyticsHelpers.getStreamingEvents(10);

// Export comprehensive data
const exportData = AnalyticsHelpers.exportMetricsData();
```

### Data Export
```javascript
// Export analytics data
ui.exportData();

// Generate comprehensive report
ui.generateReport();
```

## 📈 Event Types

### View Events
- **Type**: `view`
- **Value**: Number of page views
- **Metadata**: Device type, referrer source

### Lead Events
- **Type**: `lead`
- **Value**: Number of leads generated
- **Metadata**: Lead source, quality rating

### Sale Events
- **Type**: `sale`
- **Value**: Sale amount in currency
- **Metadata**: Payment method, offer, customer segment

### Transaction Events
- **Type**: `transaction`
- **Value**: Transaction amount
- **Metadata**: Payment processing details

## 🎨 Visualization Features

### Globe Effects
- **View Sparks**: Visual indicators for page views
- **Lead Sparks**: Special effects for lead generation
- **Acquisition Events**: Highlight successful sales
- **Revenue Arcs**: Show money flow to payment processors

### Dashboard Elements
- **Metrics Cards**: Real-time display of all KPIs
- **Trend Indicators**: Visual trend analysis with arrows and colors
- **Event Stream**: Live feed of streaming events
- **Alert Panel**: System alerts and notifications
- **Performance Grid**: Key performance indicators

## 🔍 Monitoring & Alerts

### Alert Types
- **High Sales Activity**: Detects unusual sales spikes
- **Low Conversion Rate**: Warns about poor conversion performance
- **Performance Issues**: Monitors for system anomalies

### Alert Management
- Real-time alert generation
- Time-based alert tracking
- Alert severity classification
- Historical alert analysis

## 📊 Reporting

### Export Formats
- **JSON Export**: Complete data structure export
- **HTML Reports**: Formatted analytics reports
- **Real-time Dashboards**: Live performance monitoring

### Report Contents
- Summary metrics and KPIs
- Top performing countries
- Recent activity timeline
- System alerts and notifications
- Performance trend analysis

## 🚀 Performance

- **Real-time Updates**: 2-second update intervals
- **Event Buffering**: Efficient event processing and storage
- **Memory Management**: Automatic cleanup of old data
- **Scalable Architecture**: Modular design for easy expansion

## 🔧 Configuration

### Update Intervals
- **Streaming**: 2 seconds
- **UI Updates**: Real-time
- **Alert Checks**: Every update cycle
- **Data Cleanup**: Automatic hourly cleanup

### Data Retention
- **Events**: Last 50 events
- **Alerts**: Last 10 alerts
- **Hourly Data**: Last 24 hours
- **Historical Data**: Configurable retention

This enhanced module provides a comprehensive streaming analytics solution with detailed metrics tracking, real-time visualization, and intelligent alerting for optimal performance monitoring. 