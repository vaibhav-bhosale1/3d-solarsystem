import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

/**
 * SolarSystem class manages the 3D solar system visualization
 */
export class SolarSystem {
    constructor(canvasId) {
        this.canvasId = canvasId;
        this.canvas = null;
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.controls = null;
        this.clock = new THREE.Clock();
        this.textureLoader = new THREE.TextureLoader();
        
        // Animation properties
        this.animationId = null;
        this.isPlaying = true;
        this.globalSpeed = 1.0;
        
        // Solar system objects
        this.sun = null;
        this.planets = [];
        this.orbitLines = [];
        this.stars = null;
        this.labels = [];
        
        // Visual settings
        this.showOrbits = true;
        this.showLabels = true;
        this.showStars = true;
        this.darkMode = false;
        
        // Planet data with realistic proportions (scaled for visibility)
        this.planetData = [
            { name: 'Mercury', radius: 0.4, distance: 8, speed: 4.74, color: 0x8C7853, emissive: 0x2a1f15 },
            { name: 'Venus', radius: 0.9, distance: 12, speed: 3.50, color: 0xFFC649, emissive: 0x4a3510 },
            { name: 'Earth', radius: 1.0, distance: 16, speed: 2.98, color: 0x6B93D6, emissive: 0x1a2540 },
            { name: 'Mars', radius: 0.5, distance: 20, speed: 2.41, color: 0xCD5C5C, emissive: 0x3a1515 },
            { name: 'Jupiter', radius: 2.5, distance: 28, speed: 1.31, color: 0xD8CA9D, emissive: 0x403a2a },
            { name: 'Saturn', radius: 2.1, distance: 36, speed: 0.97, color: 0xFAD5A5, emissive: 0x4a3f2a },
            { name: 'Uranus', radius: 1.6, distance: 44, speed: 0.68, color: 0x4FD0E7, emissive: 0x153a40 },
            { name: 'Neptune', radius: 1.5, distance: 52, speed: 0.54, color: 0x4B70DD, emissive: 0x151f40 }
        ];
        
        // Planet info for tooltips
        this.planetInfo = {
            'Mercury': 'Closest planet to the Sun. Extremely hot days and cold nights.',
            'Venus': 'Hottest planet in the solar system due to greenhouse effect.',
            'Earth': 'Our home planet. The only known planet with life.',
            'Mars': 'The Red Planet. Has the largest volcano in the solar system.',
            'Jupiter': 'Largest planet. Has a Great Red Spot storm.',
            'Saturn': 'Famous for its beautiful ring system.',
            'Uranus': 'Tilted on its side. Has faint rings.',
            'Neptune': 'Windiest planet with speeds up to 2,100 km/h.'
        };
        
        this.init();
    }

    /**
     * Initialize the solar system
     */
    async init() {
        try {
            this.setupCanvas();
            this.setupScene();
            this.setupCamera();
            this.setupRenderer();
            this.setupControls();
            this.setupLights();
            this.createStars();
            this.createSun();
            this.createPlanets();
            this.createOrbitLines();
            this.setupEventListeners();
            
            console.log('✅ SolarSystem initialized');
        } catch (error) {
            console.error('❌ Failed to initialize SolarSystem:', error);
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
        this.scene.background = new THREE.Color(0x000011);
    }

    /**
     * Setup camera
     */
    setupCamera() {
        const aspect = window.innerWidth / window.innerHeight;
        this.camera = new THREE.PerspectiveCamera(75, aspect, 0.1, 1000);
        this.camera.position.set(0, 30, 60);
        this.camera.lookAt(0, 0, 0);
    }

    /**
     * Setup WebGL renderer
     */
    setupRenderer() {
        this.renderer = new THREE.WebGLRenderer({
            canvas: this.canvas,
            antialias: true,
            alpha: true
        });
        
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
        this.renderer.toneMappingExposure = 1.0;
    }

    /**
     * Setup orbit controls
     */
    setupControls() {
        this.controls = new OrbitControls(this.camera, this.canvas);
        this.controls.enableDamping = true;
        this.controls.dampingFactor = 0.05;
        this.controls.minDistance = 10;
        this.controls.maxDistance = 200;
        this.controls.enablePan = true;
    }

    /**
     * Setup scene lighting
     */
    setupLights() {
        // Ambient light for general illumination
        const ambientLight = new THREE.AmbientLight(0x404040, 0.4);
        this.scene.add(ambientLight);
        
        // Sun light (point light at center)
        const sunLight = new THREE.PointLight(0xffffff, 3, 300);
        sunLight.position.set(0, 0, 0);
        sunLight.castShadow = true;
        sunLight.shadow.mapSize.width = 2048;
        sunLight.shadow.mapSize.height = 2048;
        sunLight.shadow.camera.near = 0.1;
        sunLight.shadow.camera.far = 300;
        this.scene.add(sunLight);
        
        // Additional directional light for better planet visibility
        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
        directionalLight.position.set(10, 10, 5);
        this.scene.add(directionalLight);
    }

    /**
     * Create background stars
     */
    createStars() {
        const starsGeometry = new THREE.BufferGeometry();
        const starsMaterial = new THREE.PointsMaterial({
            color: 0xffffff,
            size: 1,
            sizeAttenuation: false
        });

        const starsVertices = [];
        for (let i = 0; i < 10000; i++) {
            const x = (Math.random() - 0.5) * 2000;
            const y = (Math.random() - 0.5) * 2000;
            const z = (Math.random() - 0.5) * 2000;
            starsVertices.push(x, y, z);
        }

        starsGeometry.setAttribute('position', new THREE.Float32BufferAttribute(starsVertices, 3));
        this.stars = new THREE.Points(starsGeometry, starsMaterial);
        this.scene.add(this.stars);
    }

    /**
     * Create the Sun
     */
    createSun() {
        const sunGeometry = new THREE.SphereGeometry(3, 32, 32);
        
        // Create a glowing sun material
        const sunMaterial = new THREE.MeshBasicMaterial({
            color: 0xffff00,
            emissive: 0xffaa00,
            emissiveIntensity: 0.8
        });
        
        this.sun = new THREE.Mesh(sunGeometry, sunMaterial);
        this.sun.name = 'Sun';
        
        // Add sun glow effect
        const glowGeometry = new THREE.SphereGeometry(3.5, 32, 32);
        const glowMaterial = new THREE.MeshBasicMaterial({
            color: 0xffaa00,
            transparent: true,
            opacity: 0.3,
            side: THREE.BackSide
        });
        const sunGlow = new THREE.Mesh(glowGeometry, glowMaterial);
        this.sun.add(sunGlow);
        
        this.scene.add(this.sun);
    }

    /**
     * Create all planets
     */
    createPlanets() {
        this.planetData.forEach((data, index) => {
            const planet = this.createPlanet(data);
            planet.userData = {
                ...data,
                angle: Math.random() * Math.PI * 2, // Random starting position
                speed: data.speed * 0.01, // Scale down speed
                individualSpeed: 1.0 // Individual speed multiplier
            };
            
            this.planets.push(planet);
            this.scene.add(planet);
        });
    }

    /**
     * Create a single planet with realistic materials
     */
    createPlanet(data) {
        const geometry = new THREE.SphereGeometry(data.radius, 32, 32);
        
        // Create realistic planet material
        const material = new THREE.MeshPhongMaterial({
            color: data.color,
            emissive: data.emissive,
            emissiveIntensity: 0.1,
            shininess: data.name === 'Venus' ? 100 : 30,
            specular: data.name === 'Earth' ? 0x111111 : 0x000000
        });
        
        // Add special effects for specific planets
        if (data.name === 'Earth') {
            // Earth gets a slight blue glow and higher specular for oceans
            material.specular = new THREE.Color(0x004466);
            material.shininess = 100;
        } else if (data.name === 'Jupiter') {
            // Jupiter gets bands (simulated with emissive variation)
            material.emissiveIntensity = 0.15;
        } else if (data.name === 'Saturn') {
            // Saturn will get rings added separately
            material.emissiveIntensity = 0.12;
        }
        
        const planet = new THREE.Mesh(geometry, material);
        planet.name = data.name;
        planet.castShadow = true;
        planet.receiveShadow = true;
        
        // Add Saturn's rings
        if (data.name === 'Saturn') {
            this.addSaturnRings(planet, data.radius);
        }
        
        // Position planet at its orbital distance
        planet.position.x = data.distance;
        planet.position.y = 0;
        planet.position.z = 0;
        
        return planet;
    }

    /**
     * Add rings to Saturn
     */
    addSaturnRings(planet, planetRadius) {
        const ringGeometry = new THREE.RingGeometry(planetRadius * 1.2, planetRadius * 2.2, 64);
        const ringMaterial = new THREE.MeshBasicMaterial({
            color: 0xaaaaaa,
            side: THREE.DoubleSide,
            transparent: true,
            opacity: 0.6
        });
        
        const rings = new THREE.Mesh(ringGeometry, ringMaterial);
        rings.rotation.x = Math.PI / 2;
        rings.rotation.z = Math.PI / 6; // Slight tilt
        planet.add(rings);
    }

    /**
     * Create orbit lines
     */
    createOrbitLines() {
        this.planetData.forEach(data => {
            const points = [];
            const segments = 128;
            
            for (let i = 0; i <= segments; i++) {
                const angle = (i / segments) * Math.PI * 2;
                points.push(new THREE.Vector3(
                    Math.cos(angle) * data.distance,
                    0,
                    Math.sin(angle) * data.distance
                ));
            }
            
            const orbitGeometry = new THREE.BufferGeometry().setFromPoints(points);
            const orbitMaterial = new THREE.LineBasicMaterial({
                color: 0x444444,
                transparent: true,
                opacity: 0.3
            });
            
            const orbit = new THREE.Line(orbitGeometry, orbitMaterial);
            this.orbitLines.push(orbit);
            this.scene.add(orbit);
        });
    }

    /**
     * Setup event listeners
     */
    setupEventListeners() {
        // Mouse click for planet selection
        this.canvas.addEventListener('click', (event) => {
            this.handlePlanetClick(event);
        });
        
        // Mouse move for tooltips
        this.canvas.addEventListener('mousemove', (event) => {
            this.handleMouseMove(event);
        });
    }

    /**
     * Handle planet click for camera focus
     */
    handlePlanetClick(event) {
        const mouse = new THREE.Vector2();
        const rect = this.canvas.getBoundingClientRect();
        
        mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
        mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
        
        const raycaster = new THREE.Raycaster();
        raycaster.setFromCamera(mouse, this.camera);
        
        const intersects = raycaster.intersectObjects([...this.planets, this.sun]);
        
        if (intersects.length > 0) {
            const clickedObject = intersects[0].object;
            this.focusOnObject(clickedObject);
        }
    }

    /**
     * Handle mouse move for tooltips
     */
    handleMouseMove(event) {
        if (!this.showLabels) return;
        
        const mouse = new THREE.Vector2();
        const rect = this.canvas.getBoundingClientRect();
        
        mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
        mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
        
        const raycaster = new THREE.Raycaster();
        raycaster.setFromCamera(mouse, this.camera);
        
        const intersects = raycaster.intersectObjects([...this.planets, this.sun]);
        const tooltip = document.getElementById('planet-tooltip');
        
        if (intersects.length > 0 && tooltip) {
            const hoveredObject = intersects[0].object;
            const name = hoveredObject.name;
            
            tooltip.style.display = 'block';
            tooltip.style.left = event.clientX + 10 + 'px';
            tooltip.style.top = event.clientY - 10 + 'px';
            
            document.getElementById('tooltip-name').textContent = name;
            document.getElementById('tooltip-info').textContent = 
                this.planetInfo[name] || 'Our central star that provides light and heat.';
        } else if (tooltip) {
            tooltip.style.display = 'none';
        }
    }

    /**
     * Focus camera on a specific object
     */
    focusOnObject(object) {
        const position = object.position.clone();
        const distance = object.userData?.distance || 20;
        
        // Calculate camera position
        const cameraPosition = position.clone();
        cameraPosition.z += distance * 0.5;
        cameraPosition.y += distance * 0.3;
        
        // Animate camera to new position
        const startPosition = this.camera.position.clone();
        const startTime = Date.now();
        const duration = 1000; // 1 second
        
        const animateCamera = () => {
            const elapsed = Date.now() - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            // Smooth easing
            const eased = 1 - Math.pow(1 - progress, 3);
            
            this.camera.position.lerpVectors(startPosition, cameraPosition, eased);
            this.camera.lookAt(position);
            
            if (progress < 1) {
                requestAnimationFrame(animateCamera);
            }
        };
        
        animateCamera();
    }

    /**
     * Animation loop
     */
    animate() {
        if (!this.isPlaying) return;
        
        this.animationId = requestAnimationFrame(() => this.animate());
        
        const deltaTime = this.clock.getDelta();
        
        this.updatePlanets(deltaTime);
        this.updateControls();
        this.render();
    }

    /**
     * Update planet positions
     */
    updatePlanets(deltaTime) {
        this.planets.forEach(planet => {
            const userData = planet.userData;
            
            // Update angle based on speed
            userData.angle += userData.speed * userData.individualSpeed * this.globalSpeed * deltaTime;
            
            // Update position
            planet.position.x = Math.cos(userData.angle) * userData.distance;
            planet.position.z = Math.sin(userData.angle) * userData.distance;
            
            // Rotate planet on its axis
            planet.rotation.y += deltaTime * 2;
        });
        
        // Rotate sun
        if (this.sun) {
            this.sun.rotation.y += deltaTime * 0.5;
        }
    }

    /**
     * Update controls
     */
    updateControls() {
        if (this.controls) {
            this.controls.update();
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
        // Reset planet positions
        this.planets.forEach(planet => {
            planet.userData.angle = Math.random() * Math.PI * 2;
            planet.userData.individualSpeed = 1.0;
        });
        
        this.globalSpeed = 1.0;
        
        // Reset camera
        this.camera.position.set(0, 30, 60);
        this.camera.lookAt(0, 0, 0);
        this.controls.reset();
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
     * Update visual settings
     */
    updateVisualSettings(settings) {
        if (settings.showOrbits !== undefined) {
            this.showOrbits = settings.showOrbits;
            this.orbitLines.forEach(orbit => {
                orbit.visible = this.showOrbits;
            });
        }
        
        if (settings.showLabels !== undefined) {
            this.showLabels = settings.showLabels;
        }
        
        if (settings.showStars !== undefined) {
            this.showStars = settings.showStars;
            if (this.stars) {
                this.stars.visible = this.showStars;
            }
        }
        
        if (settings.darkMode !== undefined) {
            this.darkMode = settings.darkMode;
            this.scene.background = new THREE.Color(this.darkMode ? 0x000000 : 0x000011);
        }
    }

    /**
     * Set global speed
     */
    setGlobalSpeed(speed) {
        this.globalSpeed = speed;
    }

    /**
     * Set individual planet speed
     */
    setPlanetSpeed(planetName, speed) {
        const planet = this.planets.find(p => p.name === planetName);
        if (planet) {
            planet.userData.individualSpeed = speed;
        }
    }

    /**
     * Reset camera to default view
     */
    resetCamera() {
        this.camera.position.set(0, 30, 60);
        this.camera.lookAt(0, 0, 0);
        this.controls.reset();
    }

    /**
     * Set camera to top view
     */
    setTopView() {
        this.camera.position.set(0, 100, 0);
        this.camera.lookAt(0, 0, 0);
        this.controls.update();
    }

    /**
     * Dispose of resources
     */
    dispose() {
        this.pause();
        
        // Dispose geometries and materials
        this.scene.traverse((object) => {
            if (object.geometry) {
                object.geometry.dispose();
            }
            if (object.material) {
                if (Array.isArray(object.material)) {
                    object.material.forEach(material => material.dispose());
                } else {
                    object.material.dispose();
                }
            }
        });
        
        if (this.renderer) {
            this.renderer.dispose();
        }
        
        console.log('🧹 SolarSystem disposed');
    }
}