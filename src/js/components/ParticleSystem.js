import * as THREE from 'three';
import { ParticleShaderMaterial } from '../shaders/ParticleShaderMaterial.js';

/**
 * ParticleSystem class manages the 3D particle visualization
 */
export class ParticleSystem {
    constructor(canvasId) {
        this.canvasId = canvasId;
        this.canvas = null;
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.particles = null;
        this.particleGeometry = null;
        this.particleMaterial = null;
        
        // Animation properties
        this.animationId = null;
        this.isPlaying = true;
        this.time = 0;
        this.speed = 1.0;
        this.rotationSpeed = 0.5;
        
        // Particle properties
        this.particleCount = 5000;
        this.particleSize = 2.0;
        this.particleShape = 'circle';
        this.baseColor = new THREE.Color(0xff6b6b);
        this.accentColor = new THREE.Color(0x4ecdc4);
        this.colorTransition = true;
        
        // Mouse interaction
        this.mouse = new THREE.Vector2();
        this.mouseInfluence = 0.1;
        this.mouseInteraction = true;
        
        // Preset configurations
        this.currentPreset = 'default';
        this.presetAnimations = new Map();
        
        this.init();
    }

    /**
     * Initialize the particle system
     */
    async init() {
        try {
            this.setupCanvas();
            this.setupScene();
            this.setupCamera();
            this.setupRenderer();
            this.setupLights();
            this.createParticles();
            this.setupEventListeners();
            
            console.log('✅ ParticleSystem initialized');
        } catch (error) {
            console.error('❌ Failed to initialize ParticleSystem:', error);
            throw error;
        }
    }

    /**
     * Setup canvas element
     */
    setupCanvas() {
        this.canvas = document.getElementById(this.canvasId);
        if (!this.canvas) {
            throw new Error(`Canvas element with id "${this.canvasId}" not found`);
        }
    }

    /**
     * Setup Three.js scene
     */
    setupScene() {
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0x0a0e27);
        
        // Add fog for depth perception
        this.scene.fog = new THREE.Fog(0x0a0e27, 100, 1000);
    }

    /**
     * Setup camera
     */
    setupCamera() {
        const aspect = window.innerWidth / window.innerHeight;
        this.camera = new THREE.PerspectiveCamera(75, aspect, 0.1, 2000);
        this.camera.position.set(0, 0, 100);
        this.camera.lookAt(0, 0, 0);
    }

    /**
     * Setup WebGL renderer
     */
    setupRenderer() {
        this.renderer = new THREE.WebGLRenderer({
            canvas: this.canvas,
            antialias: true,
            alpha: true,
            powerPreference: 'high-performance'
        });
        
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        this.renderer.outputColorSpace = THREE.SRGBColorSpace;
        
        // Enable advanced features
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    }

    /**
     * Setup scene lighting
     */
    setupLights() {
        // Ambient light
        const ambientLight = new THREE.AmbientLight(0x404040, 0.4);
        this.scene.add(ambientLight);
        
        // Point lights for dynamic lighting
        const light1 = new THREE.PointLight(0xff6b6b, 1, 200);
        light1.position.set(50, 50, 50);
        this.scene.add(light1);
        
        const light2 = new THREE.PointLight(0x4ecdc4, 1, 200);
        light2.position.set(-50, -50, 50);
        this.scene.add(light2);
        
        const light3 = new THREE.PointLight(0x667eea, 0.8, 150);
        light3.position.set(0, 100, -50);
        this.scene.add(light3);
    }

    /**
     * Create particle system
     */
    createParticles() {
        // Dispose of existing particles
        if (this.particles) {
            this.scene.remove(this.particles);
            this.particleGeometry?.dispose();
            this.particleMaterial?.dispose();
        }

        // Create geometry
        this.particleGeometry = new THREE.BufferGeometry();
        
        // Generate particle positions
        const positions = new Float32Array(this.particleCount * 3);
        const colors = new Float32Array(this.particleCount * 3);
        const sizes = new Float32Array(this.particleCount);
        const velocities = new Float32Array(this.particleCount * 3);
        const phases = new Float32Array(this.particleCount);
        
        for (let i = 0; i < this.particleCount; i++) {
            const i3 = i * 3;
            
            // Spherical distribution
            const radius = Math.random() * 80 + 20;
            const theta = Math.random() * Math.PI * 2;
            const phi = Math.acos(2 * Math.random() - 1);
            
            positions[i3] = radius * Math.sin(phi) * Math.cos(theta);
            positions[i3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
            positions[i3 + 2] = radius * Math.cos(phi);
            
            // Random velocities
            velocities[i3] = (Math.random() - 0.5) * 0.02;
            velocities[i3 + 1] = (Math.random() - 0.5) * 0.02;
            velocities[i3 + 2] = (Math.random() - 0.5) * 0.02;
            
            // Random colors
            const color = new THREE.Color();
            color.lerpColors(this.baseColor, this.accentColor, Math.random());
            colors[i3] = color.r;
            colors[i3 + 1] = color.g;
            colors[i3 + 2] = color.b;
            
            // Random sizes
            sizes[i] = Math.random() * this.particleSize + 0.5;
            
            // Random phases for animation
            phases[i] = Math.random() * Math.PI * 2;
        }
        
        // Set geometry attributes
        this.particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        this.particleGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
        this.particleGeometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));
        this.particleGeometry.setAttribute('velocity', new THREE.BufferAttribute(velocities, 3));
        this.particleGeometry.setAttribute('phase', new THREE.BufferAttribute(phases, 1));
        
        // Create material with custom shader
        this.particleMaterial = new ParticleShaderMaterial({
            baseColor: this.baseColor,
            accentColor: this.accentColor,
            size: this.particleSize,
            shape: this.particleShape
        });
        
        // Create particle system
        this.particles = new THREE.Points(this.particleGeometry, this.particleMaterial);
        this.scene.add(this.particles);
    }

    /**
     * Setup event listeners
     */
    setupEventListeners() {
        // Mouse move for interaction
        this.canvas.addEventListener('mousemove', (event) => {
            if (!this.mouseInteraction) return;
            
            const rect = this.canvas.getBoundingClientRect();
            this.mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
            this.mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
        });
        
        // Touch support for mobile
        this.canvas.addEventListener('touchmove', (event) => {
            if (!this.mouseInteraction) return;
            
            event.preventDefault();
            const touch = event.touches[0];
            const rect = this.canvas.getBoundingClientRect();
            this.mouse.x = ((touch.clientX - rect.left) / rect.width) * 2 - 1;
            this.mouse.y = -((touch.clientY - rect.top) / rect.height) * 2 + 1;
        });
    }

    /**
     * Animation loop
     */
    animate() {
        if (!this.isPlaying) return;
        
        this.animationId = requestAnimationFrame(() => this.animate());
        
        this.time += 0.016 * this.speed; // Roughly 60fps
        
        this.updateParticles();
        this.updateCamera();
        this.render();
    }

    /**
     * Update particle positions and properties
     */
    updateParticles() {
        if (!this.particles || !this.particleGeometry) return;
        
        const positions = this.particleGeometry.attributes.position.array;
        const velocities = this.particleGeometry.attributes.velocity.array;
        const phases = this.particleGeometry.attributes.phase.array;
        const colors = this.particleGeometry.attributes.color.array;
        
        // Mouse influence vector
        const mouseInfluenceVector = new THREE.Vector3(
            this.mouse.x * 10,
            this.mouse.y * 10,
            0
        );
        
        for (let i = 0; i < this.particleCount; i++) {
            const i3 = i * 3;
            
            // Get current position
            const position = new THREE.Vector3(
                positions[i3],
                positions[i3 + 1],
                positions[i3 + 2]
            );
            
            // Apply preset-specific animations
            this.applyPresetAnimation(position, i, this.time);
            
            // Apply mouse interaction
            if (this.mouseInteraction) {
                const distance = position.distanceTo(mouseInfluenceVector);
                const influence = Math.max(0, 1 - distance / 50);
                const direction = position.clone().sub(mouseInfluenceVector).normalize();
                position.add(direction.multiplyScalar(influence * this.mouseInfluence));
            }
            
            // Apply velocities with some randomness
            positions[i3] = position.x + Math.sin(this.time + phases[i]) * 0.5;
            positions[i3 + 1] = position.y + Math.cos(this.time + phases[i]) * 0.5;
            positions[i3 + 2] = position.z + Math.sin(this.time * 0.5 + phases[i]) * 0.3;
            
            // Update colors if color transition is enabled
            if (this.colorTransition) {
                const factor = (Math.sin(this.time * 0.5 + phases[i]) + 1) / 2;
                const color = new THREE.Color();
                color.lerpColors(this.baseColor, this.accentColor, factor);
                colors[i3] = color.r;
                colors[i3 + 1] = color.g;
                colors[i3 + 2] = color.b;
            }
        }
        
        // Mark attributes for update
        this.particleGeometry.attributes.position.needsUpdate = true;
        if (this.colorTransition) {
            this.particleGeometry.attributes.color.needsUpdate = true;
        }
        
        // Update material uniforms
        if (this.particleMaterial) {
            this.particleMaterial.updateTime(this.time);
        }
    }

    /**
     * Apply preset-specific animations
     */
    applyPresetAnimation(position, index, time) {
        switch (this.currentPreset) {
            case 'galaxy':
                this.applyGalaxyAnimation(position, index, time);
                break;
            case 'nebula':
                this.applyNebulaAnimation(position, index, time);
                break;
            case 'explosion':
                this.applyExplosionAnimation(position, index, time);
                break;
            case 'wave':
                this.applyWaveAnimation(position, index, time);
                break;
            case 'spiral':
                this.applySpiralAnimation(position, index, time);
                break;
            case 'aurora':
                this.applyAuroraAnimation(position, index, time);
                break;
            default:
                // Default gentle floating animation
                break;
        }
    }

    /**
     * Galaxy preset animation
     */
    applyGalaxyAnimation(position, index, time) {
        const distance = Math.sqrt(position.x * position.x + position.z * position.z);
        const angle = Math.atan2(position.z, position.x);
        const rotationSpeed = 0.001 / (distance * 0.01 + 1);
        
        const newAngle = angle + rotationSpeed * time;
        position.x = distance * Math.cos(newAngle);
        position.z = distance * Math.sin(newAngle);
        position.y += Math.sin(time * 0.5 + index * 0.01) * 0.1;
    }

    /**
     * Nebula preset animation
     */
    applyNebulaAnimation(position, index, time) {
        const noise = Math.sin(time * 0.3 + index * 0.1) * Math.cos(time * 0.2 + index * 0.05);
        position.x += noise * 0.2;
        position.y += Math.sin(time * 0.4 + index * 0.08) * 0.15;
        position.z += Math.cos(time * 0.35 + index * 0.06) * 0.18;
    }

    /**
     * Explosion preset animation
     */
    applyExplosionAnimation(position, index, time) {
        const explosionFactor = Math.sin(time * 0.5) * 0.5 + 0.5;
        const direction = position.clone().normalize();
        position.add(direction.multiplyScalar(explosionFactor * 2));
    }

    /**
     * Wave preset animation
     */
    applyWaveAnimation(position, index, time) {
        const waveHeight = Math.sin(position.x * 0.05 + time) * 10;
        position.y = waveHeight + Math.sin(time * 2 + index * 0.1) * 2;
    }

    /**
     * Spiral preset animation
     */
    applySpiralAnimation(position, index, time) {
        const height = position.y;
        const radius = Math.sqrt(position.x * position.x + position.z * position.z);
        const angle = Math.atan2(position.z, position.x) + time * 0.5 + height * 0.01;
        
        position.x = radius * Math.cos(angle);
        position.z = radius * Math.sin(angle);
    }

    /**
     * Aurora preset animation
     */
    applyAuroraAnimation(position, index, time) {
        const wave1 = Math.sin(position.x * 0.02 + time * 2) * 5;
        const wave2 = Math.cos(position.z * 0.03 + time * 1.5) * 3;
        position.y = wave1 + wave2 + Math.sin(time + index * 0.1) * 2;
    }

    /**
     * Update camera rotation
     */
    updateCamera() {
        if (this.rotationSpeed > 0) {
            const radius = 100;
            this.camera.position.x = Math.cos(this.time * this.rotationSpeed * 0.1) * radius;
            this.camera.position.z = Math.sin(this.time * this.rotationSpeed * 0.1) * radius;
            this.camera.lookAt(0, 0, 0);
        }
    }

    /**
     * Render the scene
     */
    render() {
        this.renderer.render(this.scene, this.camera);
    }

    /**
     * Start animation
     */
    start() {
        this.isPlaying = true;
        this.animate();
    }

    /**
     * Pause animation
     */
    pause() {
        this.isPlaying = false;
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
            this.animationId = null;
        }
    }

    /**
     * Resume animation
     */
    resume() {
        if (!this.isPlaying) {
            this.isPlaying = true;
            this.animate();
        }
    }

    /**
     * Reset animation
     */
    reset() {
        this.time = 0;
        this.createParticles();
    }

    /**
     * Handle window resize
     */
    handleResize() {
        const width = window.innerWidth;
        const height = window.innerHeight;
        
        this.camera.aspect = width / height;
        this.camera.updateProjectionMatrix();
        
        this.renderer.setSize(width, height);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    }

    /**
     * Update particle system properties
     */
    updateProperties(properties) {
        const needsRecreate = 
            properties.particleCount !== undefined && properties.particleCount !== this.particleCount ||
            properties.particleShape !== undefined && properties.particleShape !== this.particleShape;
        
        // Update properties
        Object.assign(this, properties);
        
        // Recreate particles if necessary
        if (needsRecreate) {
            this.createParticles();
        } else {
            // Update material properties
            if (this.particleMaterial) {
                this.particleMaterial.updateProperties({
                    baseColor: this.baseColor,
                    accentColor: this.accentColor,
                    size: this.particleSize
                });
            }
        }
    }

    /**
     * Set preset configuration
     */
    setPreset(presetName) {
        this.currentPreset = presetName;
        console.log(`Applied preset: ${presetName}`);
    }

    /**
     * Get current particle count
     */
    getParticleCount() {
        return this.particleCount;
    }

    /**
     * Dispose of resources
     */
    dispose() {
        this.pause();
        
        if (this.particles) {
            this.scene.remove(this.particles);
        }
        
        if (this.particleGeometry) {
            this.particleGeometry.dispose();
        }
        
        if (this.particleMaterial) {
            this.particleMaterial.dispose();
        }
        
        if (this.renderer) {
            this.renderer.dispose();
        }
        
        console.log('🧹 ParticleSystem disposed');
    }
}