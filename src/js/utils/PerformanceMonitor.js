/**
 * PerformanceMonitor tracks and reports application performance metrics
 */
export class PerformanceMonitor {
    constructor() {
        this.isRunning = false;
        this.frameCount = 0;
        this.lastTime = 0;
        this.deltaTime = 0;
        this.fps = 60;
        this.fpsHistory = [];
        this.maxHistoryLength = 60; // Keep 1 second of history at 60fps
        
        this.callbacks = [];
        this.stats = {
            fps: 60,
            avgFps: 60,
            minFps: 60,
            maxFps: 60,
            frameTime: 16.67
        };
        
        this.animationId = null;
    }

    /**
     * Start performance monitoring
     */
    start(callback) {
        if (this.isRunning) {
            console.warn('PerformanceMonitor is already running');
            return;
        }

        this.isRunning = true;
        this.lastTime = performance.now();
        
        if (callback && typeof callback === 'function') {
            this.callbacks.push(callback);
        }
        
        this.update();
        console.log('📊 Performance monitoring started');
    }

    /**
     * Stop performance monitoring
     */
    stop() {
        if (!this.isRunning) {
            return;
        }

        this.isRunning = false;
        
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
            this.animationId = null;
        }
        
        console.log('📊 Performance monitoring stopped');
    }

    /**
     * Add a callback function to receive performance updates
     */
    addCallback(callback) {
        if (typeof callback === 'function') {
            this.callbacks.push(callback);
        }
    }

    /**
     * Remove a callback function
     */
    removeCallback(callback) {
        const index = this.callbacks.indexOf(callback);
        if (index > -1) {
            this.callbacks.splice(index, 1);
        }
    }

    /**
     * Main update loop
     */
    update() {
        if (!this.isRunning) return;

        const currentTime = performance.now();
        this.deltaTime = currentTime - this.lastTime;
        this.lastTime = currentTime;

        // Calculate FPS
        this.fps = 1000 / this.deltaTime;
        this.fpsHistory.push(this.fps);
        
        // Maintain history length
        if (this.fpsHistory.length > this.maxHistoryLength) {
            this.fpsHistory.shift();
        }

        // Update frame count
        this.frameCount++;

        // Update stats every few frames to avoid overwhelming
        if (this.frameCount % 10 === 0) {
            this.updateStats();
            this.notifyCallbacks();
        }

        // Schedule next update
        this.animationId = requestAnimationFrame(() => this.update());
    }

    /**
     * Update performance statistics
     */
    updateStats() {
        // FPS calculations
        this.stats.fps = Math.round(this.fps);
        this.stats.frameTime = this.deltaTime;
        
        if (this.fpsHistory.length > 0) {
            this.stats.avgFps = Math.round(
                this.fpsHistory.reduce((sum, fps) => sum + fps, 0) / this.fpsHistory.length
            );
            this.stats.minFps = Math.round(Math.min(...this.fpsHistory));
            this.stats.maxFps = Math.round(Math.max(...this.fpsHistory));
        }
    }

    /**
     * Notify all registered callbacks with current stats
     */
    notifyCallbacks() {
        this.callbacks.forEach(callback => {
            try {
                callback(this.stats);
            } catch (error) {
                console.error('Error in performance monitor callback:', error);
            }
        });
    }

    /**
     * Get current performance statistics
     */
    getStats() {
        return { ...this.stats };
    }

    /**
     * Reset performance statistics
     */
    reset() {
        this.frameCount = 0;
        this.fpsHistory = [];
        this.stats = {
            fps: 60,
            avgFps: 60,
            minFps: 60,
            maxFps: 60,
            frameTime: 16.67
        };
        
        console.log('📊 Performance statistics reset');
    }
}