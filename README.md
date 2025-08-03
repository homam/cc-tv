# Live Performance Dashboard

A modular, real-time performance dashboard with 3D globe visualization, interactive charts, and live data simulation.

## Features

- **3D Interactive Globe**: Real-time visualization of global activity using Three.js
- **Live Data Simulation**: Dynamic updates of metrics, sales, and revenue
- **Interactive Charts**: Payment methods, revenue by offers, weekly trends, and country performance
- **Focus Mode**: Automatic country highlighting with detailed analytics
- **Responsive Design**: Modern UI with Tailwind CSS

## Project Structure

```
src/
├── index.html              # Main HTML file
├── styles/
│   └── main.css           # All CSS styles
├── js/
│   ├── main.js            # Main application entry point
│   ├── config/
│   │   └── data.js        # Data configuration and state management
│   ├── utils/
│   │   └── helpers.js     # Utility functions (animations, calculations)
│   └── modules/
│       ├── globe.js       # 3D globe functionality (Three.js)
│       ├── charts.js      # Chart.js integration and management
│       ├── ui.js          # UI updates and interactions
│       └── dataSimulation.js # Live data simulation and updates
```

## Modules Overview

### 1. **Globe Module** (`js/modules/globe.js`)
- Handles 3D globe visualization using Three.js
- Manages camera controls, animations, and visual effects
- Creates acquisition events, revenue arcs, and view sparks
- Implements zoom functionality for country focus

### 2. **Charts Module** (`js/modules/charts.js`)
- Manages all Chart.js instances
- Handles chart updates and data visualization
- Supports payment methods, offers, trends, and country charts

### 3. **UI Module** (`js/modules/ui.js`)
- Updates DOM elements with live data
- Manages focus mode transitions
- Handles metric animations and progress bars

### 4. **Data Simulation Module** (`js/modules/dataSimulation.js`)
- Generates realistic live data updates
- Simulates sales, views, and revenue
- Coordinates globe effects with data changes

### 5. **Configuration** (`js/config/data.js`)
- Centralized state management
- Chart configurations
- Static data (countries, banks, metrics)

### 6. **Utilities** (`js/utils/helpers.js`)
- Animation functions (countUp, tween)
- Geographic calculations (latLonToVector3)
- Easing functions

## Getting Started

1. **Clone the repository**
2. **Open `src/index.html`** in a modern web browser
3. **View the dashboard** - it will automatically start with live data simulation

## Dependencies

- **Three.js**: 3D graphics and globe visualization
- **Chart.js**: Interactive charts and data visualization
- **Tailwind CSS**: Utility-first CSS framework
- **Inter Font**: Modern typography

## Browser Support

- Modern browsers with ES6 module support
- WebGL support for 3D graphics
- Canvas support for charts

## Customization

### Adding New Metrics
1. Update the state in `js/config/data.js`
2. Add corresponding UI elements in `index.html`
3. Update the UI module to handle new metrics

### Modifying Charts
1. Edit chart configurations in `js/config/data.js`
2. Update chart methods in `js/modules/charts.js`

### Changing Data Simulation
1. Modify the `DataSimulation` class in `js/modules/dataSimulation.js`
2. Adjust update frequencies and data ranges

## Architecture Benefits

- **Modularity**: Each feature is isolated in its own module
- **Maintainability**: Easy to modify individual components
- **Scalability**: Simple to add new features or modify existing ones
- **Reusability**: Modules can be reused in other projects
- **Testability**: Each module can be tested independently

## Performance

- Efficient 3D rendering with Three.js
- Optimized chart updates
- Smooth animations with requestAnimationFrame
- Memory management for 3D objects

## License

This project is open source and available under the MIT License. 