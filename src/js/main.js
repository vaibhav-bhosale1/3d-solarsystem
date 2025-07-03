import { SolarSystem } from './components/SolarSystem.js';
import { UIController } from './components/UIController.js';
import { PerformanceMonitor } from './utils/PerformanceMonitor.js';

/**
 * Main Application Class
 * Coordinates all components and manages the application lifecycle
 */
class App {
    constructor() {
        this.solarSystem = null;
        this.uiController = null;
        this.performanceMonitor = null;
        this.isInitialized = false;
        
        this.init();
    }

    /**
     * Initialize the application
     */
    async init() {
        try {
            console.log('🚀 Initializing 3D Solar System...');
            
            // Show loading screen
            this.showLoadingScreen();
            
            // Initialize core components
            await this.initializeComponents();
            
            // Setup event listeners
            this.setupEventListeners();
            
            // Start the application
            this.start();
            
            // Hide loading screen
            this.hideLoadingScreen();
            
            this.isInitialized = true;
            console.log('✅ Solar System initialized successfully');
            
        } catch (error) {
            console.error('❌ Failed to initialize application:', error);
            this.handleInitializationError(error);
        }
    }

    /**
     * Initialize all core components
     */
    async initializeComponents() {
        // Initialize solar system
        this.solarSystem = new SolarSystem('solar-canvas');
        await this.solarSystem.init();
        
        // Initialize UI controller
        this.uiController = new UIController(this.solarSystem);
        
        // Initialize performance monitor
        this.performanceMonitor = new PerformanceMonitor();
    }

    /**
     * Setup global event listeners
     */
    setupEventListeners() {
        // Window resize handler
        window.addEventListener('resize', () => {
            if (this.solarSystem) {
                this.solarSystem.handleResize();
            }
        });

        // Visibility change handler (pause when tab is hidden)
        document.addEventListener('visibilitychange', () => {
            if (this.solarSystem) {
                if (document.hidden) {
                    this.solarSystem.pause();
                } else {
                    this.solarSystem.resume();
                }
            }
        });

        // Keyboard shortcuts
        document.addEventListener('keydown', (event) => {
            this.handleKeyboardShortcuts(event);
        });

        // Error handling
        window.addEventListener('error', (event) => {
            console.error('Global error:', event.error);
        });

        window.addEventListener('unhandledrejection', (event) => {
            console.error('Unhandled promise rejection:', event.reason);
        });
    }

    /**
     * Handle keyboard shortcuts
     */
    handleKeyboardShortcuts(event) {
        // Prevent shortcuts when typing in inputs
        if (event.target.tagName === 'INPUT' || event.target.tagName === 'SELECT') {
            return;
        }

        switch (event.key.toLowerCase()) {
            case ' ':
                event.preventDefault();
                this.uiController.togglePlayPause();
                break;
            case 'r':
                event.preventDefault();
                this.uiController.reset();
                break;
            case 'h':
                event.preventDefault();
                this.uiController.toggleControlPanel();
                break;
            case 'f':
                event.preventDefault();
                this.toggleFullscreen();
                break;
            case 'escape':
                if (document.fullscreenElement) {
                    document.exitFullscreen();
                }
                break;
        }
    }

    /**
     * Toggle fullscreen mode
     */
    toggleFullscreen() {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen().catch(err => {
                console.warn('Could not enter fullscreen:', err);
            });
        } else {
            document.exitFullscreen();
        }
    }

    /**
     * Start the application
     */
    start() {
        // Start the solar system animation loop
        this.solarSystem.start();
        
        // Start performance monitoring
        this.performanceMonitor.start((stats) => {
            this.updatePerformanceDisplay(stats);
        });
        
        console.log('🌟 Solar System started');
    }

    /**
     * Update performance display
     */
    updatePerformanceDisplay(stats) {
        const fpsElement = document.getElementById('fps-value');
        
        if (fpsElement) {
            fpsElement.textContent = Math.round(stats.fps);
            
            // Color code FPS for visual feedback
            if (stats.fps >= 55) {
                fpsElement.style.color = 'var(--success-color)';
            } else if (stats.fps >= 30) {
                fpsElement.style.color = 'var(--warning-color)';
            } else {
                fpsElement.style.color = 'var(--error-color)';
            }
        }
    }

    /**
     * Show loading screen
     */
    showLoadingScreen() {
        const loadingScreen = document.getElementById('loading-screen');
        if (loadingScreen) {
            loadingScreen.classList.remove('hidden');
        }
    }

    /**
     * Hide loading screen
     */
    hideLoadingScreen() {
        const loadingScreen = document.getElementById('loading-screen');
        if (loadingScreen) {
            setTimeout(() => {
                loadingScreen.classList.add('hidden');
            }, 500); // Small delay for smooth transition
        }
    }

    /**
     * Handle initialization errors
     */
    handleInitializationError(error) {
        const loadingScreen = document.getElementById('loading-screen');
        if (loadingScreen) {
            const spinner = loadingScreen.querySelector('.loading-spinner');
            const text = loadingScreen.querySelector('p');
            
            if (spinner) spinner.style.display = 'none';
            if (text) {
                text.textContent = 'Failed to initialize. Please refresh the page.';
                text.style.color = 'var(--error-color)';
            }
        }
    }

    /**
     * Cleanup and dispose of resources
     */
    dispose() {
        if (this.solarSystem) {
            this.solarSystem.dispose();
        }
        
        if (this.performanceMonitor) {
            this.performanceMonitor.stop();
        }
        
        console.log('🧹 Application disposed');
    }
}

// Initialize the application when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Create global app instance
    window.app = new App();
});

// Handle page unload
window.addEventListener('beforeunload', () => {
    if (window.app) {
        window.app.dispose();
    }
});