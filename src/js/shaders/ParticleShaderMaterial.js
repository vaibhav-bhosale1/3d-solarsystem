import * as THREE from 'three';

/**
 * Custom shader material for advanced particle rendering
 */
export class ParticleShaderMaterial extends THREE.ShaderMaterial {
    constructor(options = {}) {
        // Vertex shader for particle positioning and sizing
        const vertexShader = `
            attribute float size;
            attribute float phase;
            
            varying vec3 vColor;
            varying float vPhase;
            
            uniform float time;
            uniform float globalSize;
            
            void main() {
                vColor = color;
                vPhase = phase;
                
                vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
                
                // Dynamic size based on distance and time
                float distance = length(mvPosition.xyz);
                float sizeFactor = 1.0 + sin(time * 2.0 + phase) * 0.3;
                float distanceFactor = 1.0 / (1.0 + distance * 0.01);
                
                gl_PointSize = size * globalSize * sizeFactor * distanceFactor * 100.0;
                gl_Position = projectionMatrix * mvPosition;
            }
        `;

        // Fragment shader for particle appearance and effects
        const fragmentShader = `
            varying vec3 vColor;
            varying float vPhase;
            
            uniform float time;
            uniform vec3 baseColor;
            uniform vec3 accentColor;
            uniform int shapeType; // 0: circle, 1: square, 2: star, 3: heart
            
            // Distance function for circle
            float circle(vec2 uv) {
                return length(uv);
            }
            
            // Distance function for square
            float square(vec2 uv) {
                vec2 d = abs(uv) - vec2(0.3);
                return length(max(d, 0.0)) + min(max(d.x, d.y), 0.0);
            }
            
            // Distance function for star
            float star(vec2 uv) {
                float a = atan(uv.x, uv.y) / 3.14159 * 5.0;
                float r = length(uv);
                float f = abs(fract(a) - 0.5);
                return r * (0.3 + 0.2 * f);
            }
            
            // Distance function for heart
            float heart(vec2 uv) {
                uv.y -= 0.1;
                float x = uv.x;
                float y = uv.y;
                float h = sqrt(abs(x)) + sqrt(abs(y)) - 1.0;
                return h;
            }
            
            void main() {
                // Convert to centered UV coordinates
                vec2 uv = gl_PointCoord - 0.5;
                
                float dist = 1.0;
                
                // Calculate distance based on shape type
                if (shapeType == 0) {
                    dist = circle(uv);
                } else if (shapeType == 1) {
                    dist = square(uv);
                } else if (shapeType == 2) {
                    dist = star(uv);
                } else if (shapeType == 3) {
                    dist = heart(uv);
                }
                
                // Create smooth edges
                float alpha = 1.0 - smoothstep(0.3, 0.5, dist);
                
                // Add glow effect
                float glow = exp(-dist * 3.0) * 0.3;
                alpha += glow;
                
                // Pulsing effect
                float pulse = sin(time * 3.0 + vPhase) * 0.5 + 0.5;
                alpha *= 0.7 + pulse * 0.3;
                
                // Color mixing
                vec3 finalColor = mix(baseColor, accentColor, pulse);
                finalColor = mix(finalColor, vColor, 0.5);
                
                // Add sparkle effect
                vec2 sparkleUV = uv * 10.0 + time;
                float sparkle = sin(sparkleUV.x) * sin(sparkleUV.y);
                finalColor += sparkle * 0.1;
                
                // Final color with transparency
                gl_FragColor = vec4(finalColor, alpha * 0.8);
            }
        `;

        const uniforms = {
            time: { value: 0.0 },
            globalSize: { value: options.size || 2.0 },
            baseColor: { value: options.baseColor || new THREE.Color(0xff6b6b) },
            accentColor: { value: options.accentColor || new THREE.Color(0x4ecdc4) },
            shapeType: { value: ParticleShaderMaterial.getShapeType(options.shape || 'circle') }
        };

        super({
            vertexShader,
            fragmentShader,
            uniforms,
            transparent: true,
            depthTest: true,
            depthWrite: false,
            blending: THREE.AdditiveBlending,
            vertexColors: true
        });

        this.isParticleShaderMaterial = true;
    }

    /**
     * Convert shape name to shader type number
     */
    static getShapeType(shapeName) {
        const shapeMap = {
            'circle': 0,
            'square': 1,
            'star': 2,
            'heart': 3
        };
        return shapeMap[shapeName] || 0;
    }

    /**
     * Update time uniform for animation
     */
    updateTime(time) {
        this.uniforms.time.value = time;
    }

    /**
     * Update material properties
     */
    updateProperties(properties) {
        if (properties.baseColor) {
            this.uniforms.baseColor.value.copy(properties.baseColor);
        }
        
        if (properties.accentColor) {
            this.uniforms.accentColor.value.copy(properties.accentColor);
        }
        
        if (properties.size !== undefined) {
            this.uniforms.globalSize.value = properties.size;
        }
        
        if (properties.shape) {
            this.uniforms.shapeType.value = ParticleShaderMaterial.getShapeType(properties.shape);
        }
    }

    /**
     * Clone the material
     */
    clone() {
        const material = new ParticleShaderMaterial({
            baseColor: this.uniforms.baseColor.value.clone(),
            accentColor: this.uniforms.accentColor.value.clone(),
            size: this.uniforms.globalSize.value,
            shape: this.getShapeName()
        });
        
        material.uniforms.time.value = this.uniforms.time.value;
        
        return material;
    }

    /**
     * Get current shape name from type number
     */
    getShapeName() {
        const typeMap = {
            0: 'circle',
            1: 'square',
            2: 'star',
            3: 'heart'
        };
        return typeMap[this.uniforms.shapeType.value] || 'circle';
    }

    /**
     * Dispose of the material
     */
    dispose() {
        super.dispose();
    }
}