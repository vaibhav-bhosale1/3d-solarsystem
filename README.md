# 🌌 3D Solar System - Interactive Three.js Simulation

A stunning, interactive 3D solar system built with Three.js, featuring real-time speed controls, realistic planet materials, and immersive visual effects.

## 🚀 Live Demo

**[View Live Demo →](https://solarsystem-taupe-xi.vercel.app/)**

## ✨ Features

### 🌟 Core Functionality
- **Realistic 3D Solar System**: All 8 planets with accurate relative sizes and orbital distances
- **Individual Speed Controls**: Adjust each planet's orbital speed independently in real-time
- **Global Speed Control**: Master speed control for the entire solar system
- **Interactive Camera**: Click and drag to rotate, scroll to zoom, click planets to focus
- **Realistic Materials**: Each planet has unique colors, textures, and lighting properties

### 🎨 Visual Excellence
- **Saturn's Rings**: Beautiful ring system with transparency and realistic tilt
- **Sun Glow Effect**: Radiant sun with outer glow layer and emissive lighting
- **Background Stars**: 10,000 procedurally generated stars for cosmic atmosphere
- **Orbit Paths**: Toggleable orbital lines showing each planet's trajectory
- **Planet Tooltips**: Hover over planets to see detailed information

### 🎮 Interactive Controls
- **Play/Pause Animation**: Start and stop the entire solar system
- **Reset Functionality**: Return to default state with one click
- **Camera Presets**: Quick access to top view and reset camera position
- **Visual Toggles**: Show/hide orbits, labels, stars, and dark mode
- **Responsive Design**: Works perfectly on desktop, tablet, and mobile

### 🔧 Advanced Features
- **Performance Monitoring**: Real-time FPS tracking and optimization
- **Keyboard Shortcuts**: Space (pause), R (reset), H (toggle panel), F (fullscreen)
- **Accessibility**: Screen reader support and keyboard navigation
- **Mobile Optimized**: Touch controls and responsive UI layout

## 🛠️ Technology Stack

- **Three.js** - 3D graphics and WebGL rendering
- **Vanilla JavaScript** - Pure JS without frameworks for optimal performance
- **CSS3** - Modern styling with CSS Grid, Flexbox, and custom properties
- **Vite** - Fast development server and build tool
- **WebGL** - Hardware-accelerated 3D graphics

## 🏗️ Project Structure

```
src/
├── js/
│   ├── components/
│   │   ├── SolarSystem.js      # Core 3D solar system engine
│   │   └── UIController.js     # User interface management
│   ├── utils/
│   │   └── PerformanceMonitor.js # Performance tracking
│   └── main.js                 # Application entry point
├── styles/
│   └── main.css               # Comprehensive styling
└── index.html                 # Main HTML structure
```

## 🚀 Getting Started

### Prerequisites
- Node.js 16+ 
- Modern web browser with WebGL support

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/3d-solar-system.git

# Navigate to project directory
cd 3d-solar-system

# Install dependencies
npm install

# Start development server
npm run dev
```

### Building for Production

```bash
# Build the project
npm run build

# Preview the build
npm run preview
```

## 🌍 Deployment to Vercel

### Method 1: Vercel CLI (Recommended)

```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Deploy to Vercel
vercel

# Follow the prompts:
# ? Set up and deploy "~/3d-solar-system"? [Y/n] y
# ? Which scope do you want to deploy to? [Your Account]
# ? Link to existing project? [y/N] n
# ? What's your project's name? 3d-solar-system
# ? In which directory is your code located? ./
```

### Method 2: GitHub Integration

1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Click "New Project"
4. Import your GitHub repository
5. Vercel will automatically detect Vite and deploy

### Method 3: Drag & Drop

1. Run `npm run build`
2. Go to [vercel.com](https://vercel.com)
3. Drag the `dist` folder to the deployment area

## 🎮 Usage Guide

### Basic Controls
- **Mouse**: Click and drag to rotate the view
- **Scroll**: Zoom in and out of the solar system
- **Click Planet**: Focus camera on specific planet
- **Panel Toggle**: Click the hamburger menu to show/hide controls

### Speed Controls
- **Global Speed**: Master control affecting all planets (0x to 5x speed)
- **Individual Planets**: Fine-tune each planet's orbital speed independently
- **Play/Pause**: Stop and start the entire animation
- **Reset**: Return all settings to default values

### Visual Settings
- **Show Orbit Paths**: Toggle orbital trajectory lines
- **Show Planet Labels**: Enable/disable hover tooltips
- **Background Stars**: Toggle the starfield background
- **Dark Mode**: Switch between light and dark themes

### Camera Controls
- **Reset View**: Return camera to default position
- **Top View**: Switch to overhead orbital view
- **Planet Focus**: Click any planet to smoothly focus camera

### Keyboard Shortcuts
- `Space` - Play/Pause animation
- `R` - Reset to default state
- `H` - Toggle control panel
- `F` - Enter/exit fullscreen
- `Esc` - Exit fullscreen

## 🌟 Planet Information

| Planet  | Radius | Distance | Speed | Special Features |
|---------|--------|----------|-------|------------------|
| Mercury | 0.4    | 8 units  | 4.74  | Closest to Sun   |
| Venus   | 0.9    | 12 units | 3.50  | Hottest planet   |
| Earth   | 1.0    | 16 units | 2.98  | Blue oceans      |
| Mars    | 0.5    | 20 units | 2.41  | Red appearance   |
| Jupiter | 2.5    | 28 units | 1.31  | Largest planet   |
| Saturn  | 2.1    | 36 units | 0.97  | Beautiful rings  |
| Uranus  | 1.6    | 44 units | 0.68  | Ice giant        |
| Neptune | 1.5    | 52 units | 0.54  | Windiest planet  |

## 🎯 Performance Optimization

### Recommended Settings by Device
- **High-end Desktop**: All features enabled, 60+ FPS
- **Mid-range Desktop**: Standard settings, 45-60 FPS
- **Mobile/Tablet**: Optimized for touch, 30+ FPS
- **Low-end Devices**: Reduced effects, stable performance

### Performance Tips
- Monitor the FPS counter in the top-right corner
- Disable background stars on slower devices
- Use lower global speeds for smoother animation
- Hide orbit paths if experiencing lag

## 🔧 Customization

### Adding New Planets
1. Add planet data to `planetData` array in `SolarSystem.js`
2. Include planet information in `planetInfo` object
3. Add corresponding UI controls in `index.html`
4. Update the UI controller to handle the new planet

### Modifying Visual Effects
- **Planet Materials**: Edit the `createPlanet()` method
- **Lighting**: Adjust lights in `setupLights()` method
- **Colors**: Modify the color values in `planetData`
- **Animations**: Update the `updatePlanets()` method

### Custom Themes
- **CSS Variables**: Modify color scheme in `:root` selector
- **Dark Mode**: Extend the dark mode functionality
- **Responsive**: Adjust breakpoints in media queries

## 📱 Mobile Support

The application is fully responsive and optimized for mobile devices:
- **Touch Controls**: Intuitive touch-based camera controls
- **Responsive UI**: Adaptive layout for all screen sizes
- **Performance**: Optimized rendering for mobile GPUs
- **Battery Conscious**: Efficient animation loops

## 🐛 Troubleshooting

### Common Issues

**Low FPS / Performance Issues**
- Reduce global speed or individual planet speeds
- Disable background stars
- Hide orbit paths
- Close other browser tabs

**WebGL Errors**
- Ensure your browser supports WebGL 2.0
- Update your graphics drivers
- Try a different browser (Chrome recommended)

**Mobile Performance**
- Use recommended mobile settings
- Ensure good network connection
- Close other mobile apps

**Controls Not Working**
- Check browser console for errors
- Refresh the page
- Clear browser cache

### Browser Compatibility
- **Chrome 60+** (recommended)
- **Firefox 55+**
- **Safari 12+**
- **Edge 79+**

## 🤝 Contributing

Contributions are welcome! Please feel free to submit pull requests or open issues for bugs and feature requests.

### Development Setup
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Three.js Community** - For the amazing 3D library
- **NASA** - For planetary data and inspiration
- **Vercel** - For excellent hosting platform
- **Contributors** - For improvements and bug fixes

## 📧 Contact

For questions, suggestions, or support:
- **GitHub Issues**: [Create an issue](https://github.com/yourusername/3d-solar-system/issues)
- **Email**: your.email@example.com
- **Twitter**: [@yourusername](https://twitter.com/yourusername)

---

**Built with ❤️ and Three.js**

*Experience the wonder of our solar system in stunning 3D!*
