/**
 * UIController manages all user interface interactions and updates
 */
export class UIController {
    constructor(solarSystem) {
        this.solarSystem = solarSystem;
        this.controlPanel = document.getElementById('control-panel');
        this.isPanelCollapsed = false;
        this.isPlaying = true;
        
        this.initializeControls();
        this.setupEventListeners();
    }

    /**
     * Initialize all UI controls with default values
     */
    initializeControls() {
        // Get all control elements
        this.elements = {
            // Animation controls
            globalSpeedSlider: document.getElementById('global-speed'),
            globalSpeedValue: document.getElementById('global-speed-value'),
            playPauseBtn: document.getElementById('play-pause-btn'),
            resetBtn: document.getElementById('reset-btn'),
            
            // Planet speed controls
            mercurySpeedSlider: document.getElementById('mercury-speed'),
            mercurySpeedValue: document.getElementById('mercury-speed-value'),
            venusSpeedSlider: document.getElementById('venus-speed'),
            venusSpeedValue: document.getElementById('venus-speed-value'),
            earthSpeedSlider: document.getElementById('earth-speed'),
            earthSpeedValue: document.getElementById('earth-speed-value'),
            marsSpeedSlider: document.getElementById('mars-speed'),
            marsSpeedValue: document.getElementById('mars-speed-value'),
            jupiterSpeedSlider: document.getElementById('jupiter-speed'),
            jupiterSpeedValue: document.getElementById('jupiter-speed-value'),
            saturnSpeedSlider: document.getElementById('saturn-speed'),
            saturnSpeedValue: document.getElementById('saturn-speed-value'),
            uranusSpeedSlider: document.getElementById('uranus-speed'),
            uranusSpeedValue: document.getElementById('uranus-speed-value'),
            neptuneSpeedSlider: document.getElementById('neptune-speed'),
            neptuneSpeedValue: document.getElementById('neptune-speed-value'),
            
            // Visual controls
            showOrbitsCheck: document.getElementById('show-orbits'),
            showLabelsCheck: document.getElementById('show-labels'),
            showStarsCheck: document.getElementById('show-stars'),
            darkModeCheck: document.getElementById('dark-mode'),
            
            // Camera controls
            resetCameraBtn: document.getElementById('reset-camera'),
            topViewBtn: document.getElementById('top-view'),
            
            // Panel controls
            panelToggle: document.getElementById('panel-toggle'),
            infoToggle: document.getElementById('info-toggle')
        };

        // Validate all elements exist
        for (const [key, element] of Object.entries(this.elements)) {
            if (!element) {
                console.warn(`UI element not found: ${key}`);
            }
        }
    }

    /**
     * Setup all event listeners for UI controls
     */
    setupEventListeners() {
        this.setupAnimationControls();
        this.setupPlanetControls();
        this.setupVisualControls();
        this.setupCameraControls();
        this.setupPanelControls();
    }

    /**
     * Setup animation control event listeners
     */
    setupAnimationControls() {
        // Global speed control
        if (this.elements.globalSpeedSlider) {
            this.elements.globalSpeedSlider.addEventListener('input', (e) => {
                const speed = parseFloat(e.target.value);
                this.solarSystem.setGlobalSpeed(speed);
                this.elements.globalSpeedValue.textContent = `${speed.toFixed(1)}x`;
            });
        }

        // Play/Pause button
        if (this.elements.playPauseBtn) {
            this.elements.playPauseBtn.addEventListener('click', () => {
                this.togglePlayPause();
            });
        }

        // Reset button
        if (this.elements.resetBtn) {
            this.elements.resetBtn.addEventListener('click', () => {
                this.reset();
            });
        }
    }

    /**
     * Setup planet control event listeners
     */
    setupPlanetControls() {
        const planets = ['mercury', 'venus', 'earth', 'mars', 'jupiter', 'saturn', 'uranus', 'neptune'];
        
        planets.forEach(planet => {
            const slider = this.elements[`${planet}SpeedSlider`];
            const value = this.elements[`${planet}SpeedValue`];
            
            if (slider && value) {
                slider.addEventListener('input', (e) => {
                    const speed = parseFloat(e.target.value);
                    const planetName = planet.charAt(0).toUpperCase() + planet.slice(1);
                    this.solarSystem.setPlanetSpeed(planetName, speed);
                    value.textContent = `${speed.toFixed(1)}x`;
                });
            }
        });
    }

    /**
     * Setup visual control event listeners
     */
    setupVisualControls() {
        // Show orbits toggle
        if (this.elements.showOrbitsCheck) {
            this.elements.showOrbitsCheck.addEventListener('change', (e) => {
                this.solarSystem.updateVisualSettings({ showOrbits: e.target.checked });
            });
        }

        // Show labels toggle
        if (this.elements.showLabelsCheck) {
            this.elements.showLabelsCheck.addEventListener('change', (e) => {
                this.solarSystem.updateVisualSettings({ showLabels: e.target.checked });
            });
        }

        // Show stars toggle
        if (this.elements.showStarsCheck) {
            this.elements.showStarsCheck.addEventListener('change', (e) => {
                this.solarSystem.updateVisualSettings({ showStars: e.target.checked });
            });
        }

        // Dark mode toggle
        if (this.elements.darkModeCheck) {
            this.elements.darkModeCheck.addEventListener('change', (e) => {
                this.solarSystem.updateVisualSettings({ darkMode: e.target.checked });
                document.body.classList.toggle('dark-mode', e.target.checked);
            });
        }
    }

    /**
     * Setup camera control event listeners
     */
    setupCameraControls() {
        // Reset camera button
        if (this.elements.resetCameraBtn) {
            this.elements.resetCameraBtn.addEventListener('click', () => {
                this.solarSystem.resetCamera();
            });
        }

        // Top view button
        if (this.elements.topViewBtn) {
            this.elements.topViewBtn.addEventListener('click', () => {
                this.solarSystem.setTopView();
            });
        }
    }

    /**
     * Setup panel control event listeners
     */
    setupPanelControls() {
        // Panel toggle button
        if (this.elements.panelToggle) {
            this.elements.panelToggle.addEventListener('click', () => {
                this.toggleControlPanel();
            });
        }

        // Info panel toggle
        if (this.elements.infoToggle) {
            this.elements.infoToggle.addEventListener('click', () => {
                this.toggleInfoPanel();
            });
        }

        // Auto-collapse panel on mobile after interaction
        if (window.innerWidth <= 768) {
            const controls = this.controlPanel?.querySelectorAll('input, select, button');
            controls?.forEach(control => {
                control.addEventListener('change', () => {
                    setTimeout(() => {
                        if (!this.isPanelCollapsed) {
                            this.toggleControlPanel();
                        }
                    }, 1000);
                });
            });
        }
    }

    /**
     * Toggle play/pause state
     */
    togglePlayPause() {
        this.isPlaying = !this.isPlaying;
        
        if (this.isPlaying) {
            this.solarSystem.resume();
            this.elements.playPauseBtn.textContent = 'Pause';
        } else {
            this.solarSystem.pause();
            this.elements.playPauseBtn.textContent = 'Play';
        }
        
        // Add visual feedback
        this.elements.playPauseBtn.style.transform = 'scale(0.95)';
        setTimeout(() => {
            this.elements.playPauseBtn.style.transform = '';
        }, 150);
    }

    /**
     * Reset the solar system
     */
    reset() {
        this.solarSystem.reset();
        
        // Reset UI controls to defaults
        this.resetUIToDefaults();
        
        // Add visual feedback
        this.elements.resetBtn.style.transform = 'scale(0.95)';
        setTimeout(() => {
            this.elements.resetBtn.style.transform = '';
        }, 150);
        
        console.log('🔄 Solar System reset');
    }

    /**
     * Reset UI controls to default values
     */
    resetUIToDefaults() {
        // Reset global speed
        if (this.elements.globalSpeedSlider) {
            this.elements.globalSpeedSlider.value = '1';
            this.elements.globalSpeedValue.textContent = '1.0x';
        }
        
        // Reset planet speeds
        const planets = ['mercury', 'venus', 'earth', 'mars', 'jupiter', 'saturn', 'uranus', 'neptune'];
        planets.forEach(planet => {
            const slider = this.elements[`${planet}SpeedSlider`];
            const value = this.elements[`${planet}SpeedValue`];
            
            if (slider && value) {
                slider.value = '1';
                value.textContent = '1.0x';
            }
        });
        
        // Reset visual settings
        if (this.elements.showOrbitsCheck) {
            this.elements.showOrbitsCheck.checked = true;
        }
        
        if (this.elements.showLabelsCheck) {
            this.elements.showLabelsCheck.checked = true;
        }
        
        if (this.elements.showStarsCheck) {
            this.elements.showStarsCheck.checked = true;
        }
        
        if (this.elements.darkModeCheck) {
            this.elements.darkModeCheck.checked = false;
            document.body.classList.remove('dark-mode');
        }
        
        // Update solar system settings
        this.solarSystem.setGlobalSpeed(1.0);
        this.solarSystem.updateVisualSettings({
            showOrbits: true,
            showLabels: true,
            showStars: true,
            darkMode: false
        });
    }

    /**
     * Toggle control panel visibility
     */
    toggleControlPanel() {
        if (!this.controlPanel) return;
        
        this.isPanelCollapsed = !this.isPanelCollapsed;
        this.controlPanel.classList.toggle('collapsed', this.isPanelCollapsed);
        
        // Announce state change for accessibility
        const announcement = this.isPanelCollapsed ? 'Control panel collapsed' : 'Control panel expanded';
        this.announceToScreenReader(announcement);
    }

    /**
     * Toggle info panel visibility
     */
    toggleInfoPanel() {
        const infoPanel = document.getElementById('info-panel');
        if (!infoPanel) return;
        
        infoPanel.classList.toggle('expanded');
    }

    /**
     * Announce messages to screen readers for accessibility
     */
    announceToScreenReader(message) {
        const announcement = document.createElement('div');
        announcement.setAttribute('aria-live', 'polite');
        announcement.setAttribute('aria-atomic', 'true');
        announcement.className = 'sr-only';
        announcement.style.position = 'absolute';
        announcement.style.left = '-10000px';
        announcement.style.width = '1px';
        announcement.style.height = '1px';
        announcement.style.overflow = 'hidden';
        announcement.textContent = message;
        
        document.body.appendChild(announcement);
        
        setTimeout(() => {
            document.body.removeChild(announcement);
        }, 1000);
    }
}