/**
 * PresetManager handles saving, loading, and managing visual presets
 */
export class PresetManager {
    constructor(particleSystem, uiController) {
        this.particleSystem = particleSystem;
        this.uiController = uiController;
        this.presets = new Map();
        this.currentPreset = null;
        
        this.loadDefaultPresets();
        this.loadUserPresets();
    }

    /**
     * Load default system presets
     */
    loadDefaultPresets() {
        const defaultPresets = {
            galaxy: {
                name: 'Galaxy',
                description: 'Rotating spiral galaxy with dynamic particles',
                properties: {
                    baseColor: '#667eea',
                    accentColor: '#764ba2',
                    particleSize: 1.5,
                    particleCount: 8000,
                    speed: 0.8,
                    rotationSpeed: 0.3,
                    colorTransition: true,
                    mouseInteraction: true,
                    particleShape: 'circle'
                },
                animation: 'galaxy'
            },
            nebula: {
                name: 'Nebula',
                description: 'Floating cosmic dust with organic movement',
                properties: {
                    baseColor: '#ff6b6b',
                    accentColor: '#f093fb',
                    particleSize: 2.5,
                    particleCount: 6000,
                    speed: 1.2,
                    rotationSpeed: 0.1,
                    colorTransition: true,
                    mouseInteraction: true,
                    particleShape: 'circle'
                },
                animation: 'nebula'
            },
            explosion: {
                name: 'Explosion',
                description: 'Explosive particle burst with high energy',
                properties: {
                    baseColor: '#feca57',
                    accentColor: '#ff6b6b',
                    particleSize: 3.0,
                    particleCount: 10000,
                    speed: 2.0,
                    rotationSpeed: 0.8,
                    colorTransition: true,
                    mouseInteraction: false,
                    particleShape: 'star'
                },
                animation: 'explosion'
            },
            wave: {
                name: 'Wave',
                description: 'Rhythmic wave patterns with fluid motion',
                properties: {
                    baseColor: '#4ecdc4',
                    accentColor: '#44a08d',
                    particleSize: 1.8,
                    particleCount: 7000,
                    speed: 1.5,
                    rotationSpeed: 0.2,
                    colorTransition: true,
                    mouseInteraction: true,
                    particleShape: 'circle'
                },
                animation: 'wave'
            },
            spiral: {
                name: 'Spiral',
                description: 'Mathematical spiral with precise geometry',
                properties: {
                    baseColor: '#a8edea',
                    accentColor: '#fed6e3',
                    particleSize: 2.2,
                    particleCount: 5000,
                    speed: 1.0,
                    rotationSpeed: 0.6,
                    colorTransition: true,
                    mouseInteraction: true,
                    particleShape: 'square'
                },
                animation: 'spiral'
            },
            aurora: {
                name: 'Aurora',
                description: 'Northern lights with ethereal beauty',
                properties: {
                    baseColor: '#00c9ff',
                    accentColor: '#92fe9d',
                    particleSize: 1.5,
                    particleCount: 4000,
                    speed: 0.7,
                    rotationSpeed: 0.1,
                    colorTransition: true,
                    mouseInteraction: true,
                    particleShape: 'heart'
                },
                animation: 'aurora'
            }
        };

        // Store default presets
        Object.entries(defaultPresets).forEach(([key, preset]) => {
            this.presets.set(key, { ...preset, isDefault: true });
        });

        console.log(`📦 Loaded ${Object.keys(defaultPresets).length} default presets`);
    }

    /**
     * Load user-created presets from localStorage
     */
    loadUserPresets() {
        try {
            const storedPresets = localStorage.getItem('particleSystem_userPresets');
            if (storedPresets) {
                const userPresets = JSON.parse(storedPresets);
                Object.entries(userPresets).forEach(([key, preset]) => {
                    this.presets.set(key, { ...preset, isDefault: false });
                });
                console.log(`👤 Loaded ${Object.keys(userPresets).length} user presets`);
            }
        } catch (error) {
            console.warn('Failed to load user presets:', error);
        }
    }

    /**
     * Save user presets to localStorage
     */
    saveUserPresets() {
        try {
            const userPresets = {};
            this.presets.forEach((preset, key) => {
                if (!preset.isDefault) {
                    userPresets[key] = preset;
                }
            });
            localStorage.setItem('particleSystem_userPresets', JSON.stringify(userPresets));
            console.log('💾 User presets saved');
        } catch (error) {
            console.warn('Failed to save user presets:', error);
        }
    }

    /**
     * Apply a preset to the particle system
     */
    applyPreset(presetKey) {
        const preset = this.presets.get(presetKey);
        if (!preset) {
            console.warn(`Preset "${presetKey}" not found`);
            return false;
        }

        try {
            // Convert color strings to THREE.Color objects
            const properties = { ...preset.properties };
            if (properties.baseColor) {
                properties.baseColor = new THREE.Color(properties.baseColor);
            }
            if (properties.accentColor) {
                properties.accentColor = new THREE.Color(properties.accentColor);
            }

            // Apply properties to particle system
            this.particleSystem.updateProperties(properties);
            
            // Apply animation preset
            if (preset.animation) {
                this.particleSystem.setPreset(preset.animation);
            }

            // Update UI controls
            this.updateUIFromPreset(preset);

            this.currentPreset = presetKey;
            console.log(`✨ Applied preset: ${preset.name}`);
            return true;

        } catch (error) {
            console.error(`Failed to apply preset "${presetKey}":`, error);
            return false;
        }
    }

    /**
     * Update UI controls to match preset
     */
    updateUIFromPreset(preset) {
        const properties = preset.properties;
        
        // Update sliders
        this.updateSlider('speed-slider', 'speed-value', properties.speed, 'x');
        this.updateSlider('rotation-speed', 'rotation-value', properties.rotationSpeed, 'x');
        this.updateSlider('particle-count', 'count-value', properties.particleCount);
        this.updateSlider('particle-size', 'size-value', properties.particleSize);
        
        // Update color inputs
        this.updateColorInput('base-color', properties.baseColor);
        this.updateColorInput('accent-color', properties.accentColor);
        
        // Update checkboxes
        this.updateCheckbox('color-transition', properties.colorTransition);
        this.updateCheckbox('mouse-interaction', properties.mouseInteraction);
        
        // Update select
        this.updateSelect('particle-shape', properties.particleShape);
    }

    /**
     * Update slider value and display
     */
    updateSlider(sliderId, valueId, value, suffix = '') {
        const slider = document.getElementById(sliderId);
        const display = document.getElementById(valueId);
        
        if (slider && value !== undefined) {
            slider.value = value;
        }
        
        if (display && value !== undefined) {
            const formattedValue = typeof value === 'number' ? 
                (value % 1 === 0 ? value.toString() : value.toFixed(1)) : 
                value.toString();
            display.textContent = formattedValue + suffix;
        }
    }

    /**
     * Update color input
     */
    updateColorInput(inputId, color) {
        const input = document.getElementById(inputId);
        if (input && color) {
            input.value = typeof color === 'string' ? color : `#${color.getHexString()}`;
        }
    }

    /**
     * Update checkbox
     */
    updateCheckbox(checkboxId, value) {
        const checkbox = document.getElementById(checkboxId);
        if (checkbox && value !== undefined) {
            checkbox.checked = value;
        }
    }

    /**
     * Update select element
     */
    updateSelect(selectId, value) {
        const select = document.getElementById(selectId);
        if (select && value !== undefined) {
            select.value = value;
        }
    }

    /**
     * Create a new preset from current settings
     */
    createPreset(name, description = '') {
        const properties = this.getCurrentProperties();
        const presetKey = this.generatePresetKey(name);
        
        const preset = {
            name,
            description,
            properties,
            animation: this.particleSystem.currentPreset,
            isDefault: false,
            created: new Date().toISOString()
        };
        
        this.presets.set(presetKey, preset);
        this.saveUserPresets();
        
        console.log(`💾 Created preset: ${name}`);
        return presetKey;
    }

    /**
     * Get current particle system properties
     */
    getCurrentProperties() {
        return {
            baseColor: `#${this.particleSystem.baseColor.getHexString()}`,
            accentColor: `#${this.particleSystem.accentColor.getHexString()}`,
            particleSize: this.particleSystem.particleSize,
            particleCount: this.particleSystem.particleCount,
            speed: this.particleSystem.speed,
            rotationSpeed: this.particleSystem.rotationSpeed,
            colorTransition: this.particleSystem.colorTransition,
            mouseInteraction: this.particleSystem.mouseInteraction,
            particleShape: this.particleSystem.particleShape
        };
    }

    /**
     * Generate a unique key for a preset
     */
    generatePresetKey(name) {
        const baseKey = name.toLowerCase().replace(/[^a-z0-9]/g, '_');
        let key = baseKey;
        let counter = 1;
        
        while (this.presets.has(key)) {
            key = `${baseKey}_${counter}`;
            counter++;
        }
        
        return key;
    }

    /**
     * Delete a user preset
     */
    deletePreset(presetKey) {
        const preset = this.presets.get(presetKey);
        if (!preset) {
            console.warn(`Preset "${presetKey}" not found`);
            return false;
        }
        
        if (preset.isDefault) {
            console.warn(`Cannot delete default preset "${presetKey}"`);
            return false;
        }
        
        this.presets.delete(presetKey);
        this.saveUserPresets();
        
        console.log(`🗑️ Deleted preset: ${preset.name}`);
        return true;
    }

    /**
     * Get all available presets
     */
    getAllPresets() {
        const presetList = [];
        this.presets.forEach((preset, key) => {
            presetList.push({ key, ...preset });
        });
        return presetList.sort((a, b) => {
            // Sort default presets first, then by name
            if (a.isDefault && !b.isDefault) return -1;
            if (!a.isDefault && b.isDefault) return 1;
            return a.name.localeCompare(b.name);
        });
    }

    /**
     * Get preset by key
     */
    getPreset(presetKey) {
        return this.presets.get(presetKey);
    }

    /**
     * Export presets to JSON
     */
    exportPresets() {
        const exportData = {
            version: '1.0',
            exported: new Date().toISOString(),
            presets: {}
        };
        
        this.presets.forEach((preset, key) => {
            if (!preset.isDefault) {
                exportData.presets[key] = preset;
            }
        });
        
        return JSON.stringify(exportData, null, 2);
    }

    /**
     * Import presets from JSON
     */
    importPresets(jsonData) {
        try {
            const data = JSON.parse(jsonData);
            let importedCount = 0;
            
            if (data.presets) {
                Object.entries(data.presets).forEach(([key, preset]) => {
                    // Ensure the preset has required properties
                    if (preset.name && preset.properties) {
                        preset.isDefault = false;
                        preset.imported = new Date().toISOString();
                        
                        // Generate new key if conflict
                        const newKey = this.generatePresetKey(preset.name);
                        this.presets.set(newKey, preset);
                        importedCount++;
                    }
                });
                
                this.saveUserPresets();
            }
            
            console.log(`📥 Imported ${importedCount} presets`);
            return importedCount;
            
        } catch (error) {
            console.error('Failed to import presets:', error);
            throw new Error('Invalid preset data format');
        }
    }

    /**
     * Reset to default preset
     */
    resetToDefault() {
        this.applyPreset('galaxy');
    }

    /**
     * Get current preset key
     */
    getCurrentPreset() {
        return this.currentPreset;
    }
}

// Import THREE.js for color handling
import * as THREE from 'three';