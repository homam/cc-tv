# Live Performance Dashboard

A modern, real-time analytics dashboard built with Web Components, TypeScript, and Vite. This dashboard provides live performance metrics with a 3D globe visualization, interactive charts, and streaming data simulation.

## Features

- **Web Components Architecture**: Modular, reusable components
- **TypeScript**: Full type safety and better developer experience
- **Vite Build System**: Fast development and optimized production builds
- **3D Globe Visualization**: Interactive Three.js globe with real-time events
- **Real-time Data Streaming**: Simulated live data with visual effects
- **Interactive Charts**: Chart.js powered visualizations
- **Responsive Design**: Tailwind CSS for modern, responsive UI
- **Focus Mode**: Zoom into specific countries for detailed analysis

## Tech Stack

- **Frontend**: Web Components, TypeScript, Vite
- **3D Graphics**: Three.js
- **Charts**: Chart.js
- **Styling**: Tailwind CSS
- **Build Tool**: Vite

## Project Structure

```
src/
├── components/           # Web Components
│   ├── DashboardComponent.ts
│   ├── GlobeComponent.ts
│   ├── ChartsComponent.ts
│   ├── UIComponent.ts
│   └── DataSimulationComponent.ts
├── config/              # Configuration and data
│   └── data.ts
├── types/               # TypeScript type definitions
│   └── index.ts
├── utils/               # Utility functions
│   └── helpers.ts
├── styles/              # CSS styles
│   └── main.css
├── index.html           # Main HTML file
└── main.ts             # Application entry point
```

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd cc-tv
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:3000`

### Build for Production

```bash
npm run build
```

The built files will be in the `dist/` directory.

### Type Checking

```bash
npm run type-check
```

## Web Components

### DashboardComponent
The main dashboard component that orchestrates all other components and manages the overall layout.

### GlobeComponent
Handles the 3D globe visualization using Three.js. Features:
- Interactive rotation and zoom
- Real-time event visualization
- Country focus mode
- Revenue arc animations

### ChartsComponent
Manages all Chart.js visualizations:
- Payment methods chart
- Revenue by offers chart
- Weekly trends chart
- Top countries chart
- Focus country chart

### UIComponent
Handles all user interface updates and interactions:
- Real-time metric updates
- Trend indicators
- Progress bars
- Streaming events panel
- Alerts system

### DataSimulationComponent
Simulates real-time data streaming:
- Event generation
- Metric calculations
- Visual effects coordination
- Alert system

## Data Flow

1. **Data Simulation** generates streaming events
2. **Globe Component** creates visual effects on the 3D globe
3. **Charts Component** updates chart visualizations
4. **UI Component** updates metrics and indicators
5. **Dashboard Component** orchestrates all updates

## Key Features

### Real-time Metrics
- Views, leads, sales, transactions, revenue
- Conversion rates and CPA
- Trend indicators with animations
- Progress bars for revenue targets

### 3D Globe Visualization
- Interactive globe with country markers
- Real-time event sparks and beams
- Revenue arc animations
- Focus mode for country-specific analysis

### Interactive Charts
- Payment methods distribution
- Revenue by offers
- Weekly trends
- Top performing countries
- Country-specific analytics

### Streaming Analytics
- Real-time event generation
- Live metric updates
- Visual effects and animations
- Alert system for anomalies

## Development

### Adding New Components

1. Create a new TypeScript file in `src/components/`
2. Extend `HTMLElement` for Web Components
3. Implement lifecycle methods (`connectedCallback`, `disconnectedCallback`)
4. Register the component with `customElements.define()`

### Adding New Charts

1. Add chart configuration to `src/config/data.ts`
2. Implement chart methods in `ChartsComponent`
3. Update data simulation to provide chart data

### Styling

The project uses Tailwind CSS for styling. Custom styles can be added to `src/styles/main.css`.

## Performance Optimizations

- **Lazy Loading**: Components are loaded on demand
- **Efficient Rendering**: Chart updates use minimal re-renders
- **Memory Management**: Proper cleanup of Three.js objects
- **Bundle Optimization**: Vite optimizes the final bundle

## Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)

## License

This project is licensed under the MIT License.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## Troubleshooting

### Common Issues

1. **Three.js not loading**: Ensure Three.js is properly imported
2. **Charts not rendering**: Check if Chart.js is available
3. **TypeScript errors**: Run `npm run type-check` to identify issues
4. **Build errors**: Clear `node_modules` and reinstall dependencies

### Development Tips

- Use browser dev tools to inspect Web Components
- Check the console for TypeScript compilation errors
- Monitor performance with browser performance tools
- Use Vite's hot module replacement for fast development 