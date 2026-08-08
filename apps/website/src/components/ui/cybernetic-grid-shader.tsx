import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { useIsMobile } from '@/hooks/use-mobile';
import { shouldDisableHeavyPreviewEffects } from '@/utils/runtimeEnvironment';

const CyberneticGridShader = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile();
  const disableHeavyEffects = shouldDisableHeavyPreviewEffects();

  useEffect(() => {
    // Disable on mobile for performance
    if (isMobile || disableHeavyEffects) return;
    const container = containerRef.current;
    if (!container) return;

    let renderer: THREE.WebGLRenderer | null = null;

    // 1) Renderer, Scene, Camera, Clock
    try {
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      container.appendChild(renderer.domElement);
    } catch (error) {
      console.warn('Cybernetic grid disabled:', error);
      return;
    }

    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
    const clock = new THREE.Clock();

    // 2) GLSL Shaders
    const vertexShader = `
      void main() {
        gl_Position = vec4(position, 1.0);
      }
    `;

    const fragmentShader = `
      precision highp float;
      uniform vec2 iResolution;
      uniform float iTime;
      uniform vec2 iMouse;

      float random(vec2 st) {
        return fract(sin(dot(st.xy, vec2(12.9898, 78.233)))
                     * 43758.5453123);
      }

      void main() {
        // Korrekte Normalisierung für präzises Cursor-Tracking
        vec2 uv = gl_FragCoord.xy / iResolution.xy;
        vec2 mouse = iMouse / iResolution.xy;
        
        // Zentriere um (0,0) für symmetrische Effekte
        uv = (uv - 0.5) * 2.0;
        mouse = (mouse - 0.5) * 2.0;

        float t         = iTime * 0.2;
        float mouseDist = length(uv - mouse);

        // warp effect around mouse
        float warp = sin(mouseDist * 20.0 - t * 4.0) * 0.1;
        warp *= smoothstep(0.4, 0.0, mouseDist);
        uv += warp;

        // grid lines
        vec2 gridUv = abs(fract(uv * 10.0) - 0.5);
        float line  = pow(1.0 - min(gridUv.x, gridUv.y), 50.0);

        // base grid color pulsing
        vec3 gridColor = vec3(0.1, 0.5, 1.0);
        vec3 color     = gridColor
                       * line
                       * (0.5 + sin(t * 2.0) * 0.2);

        // energetic pulses along grid
        float energy = sin(uv.x * 20.0 + t * 5.0)
                     * sin(uv.y * 20.0 + t * 3.0);
        energy = smoothstep(0.8, 1.0, energy);
        color += vec3(1.0, 0.2, 0.8) * energy * line;

        // glow around mouse
        float glow = smoothstep(0.1, 0.0, mouseDist);
        color += vec3(1.0) * glow * 0.5;

        // subtle noise
        color += random(uv + t * 0.1) * 0.05;

        gl_FragColor = vec4(color, 1.0);
      }
    `;

    // 3) Uniforms, Material, Mesh
    const uniforms = {
      iTime:       { value: 0 },
      iResolution: { value: new THREE.Vector2() },
      iMouse:      { value: new THREE.Vector2(
                       window.innerWidth / 2,
                       window.innerHeight / 2
                     ) }
    };

    const material = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms
    });

    const geometry = new THREE.PlaneGeometry(2, 2);
    const mesh     = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    // 4) Resize handler – use canvas container size, not window
    const onResize = () => {
      const rect = container.getBoundingClientRect();
      const width  = rect.width;
      const height = rect.height;
      renderer?.setSize(width, height);
      uniforms.iResolution.value.set(width * window.devicePixelRatio, height * window.devicePixelRatio);
    };
    window.addEventListener('resize', onResize);
    onResize(); // set initial size

    // 5) Mouse handler – map to canvas-relative coordinates, accounting for devicePixelRatio
    const onMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const mouseX = (e.clientX - rect.left) * window.devicePixelRatio;
      const mouseY = (rect.height - (e.clientY - rect.top)) * window.devicePixelRatio;
      
      uniforms.iMouse.value.set(mouseX, mouseY);
    };
    window.addEventListener('mousemove', onMouseMove);

    // 6) Animation loop
    renderer.setAnimationLoop(() => {
      uniforms.iTime.value = clock.getElapsedTime();
      renderer?.render(scene, camera);
    });

    // 7) Cleanup on unmount
    return () => {
      window.removeEventListener('resize', onResize);
      window.removeEventListener('mousemove', onMouseMove);

      renderer?.setAnimationLoop(null);

      const canvas = renderer?.domElement;
      if (canvas?.parentNode) {
        canvas.parentNode.removeChild(canvas);
      }

      material.dispose();
      geometry.dispose();
      renderer?.dispose();
    };
  }, [disableHeavyEffects, isMobile]);

  return (
    <div
      ref={containerRef}
      className="shader-container"
      style={{
        position:      'absolute',
        top:           0,
        left:          0,
        width:         '100%',
        height:        '100%',
        zIndex:        0,
        pointerEvents: 'none'
      }}
      aria-label="Cybernetic Grid animated background"
    />
  );
};

export default CyberneticGridShader;
