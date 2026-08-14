import { useRef } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

// Single shared material ref — no manual RAF, all updates via useFrame
const material = new THREE.ShaderMaterial({
  uniforms: {
    time:  { value: 0 },
    mouse: { value: new THREE.Vector2(0.5, 0.5) },
    hover: { value: 0.0 },
  },
  vertexShader: `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  fragmentShader: `
    uniform float time;
    uniform vec2  mouse;
    uniform float hover;
    varying vec2  vUv;

    // Simplex 2D noise
    vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
    vec2 mod289(vec2 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
    vec3 permute(vec3 x) { return mod289(((x*34.0)+1.0)*x); }
    float snoise(vec2 v) {
      const vec4 C = vec4(0.211324865405187, 0.366025403784439,
                         -0.577350269189626, 0.024390243902439);
      vec2 i  = floor(v + dot(v, C.yy));
      vec2 x0 = v - i + dot(i, C.xx);
      vec2 i1  = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
      vec4 x12 = x0.xyxy + C.xxzz;
      x12.xy  -= i1;
      i = mod289(i);
      vec3 p = permute(permute(i.y + vec3(0.0, i1.y, 1.0)) + i.x + vec3(0.0, i1.x, 1.0));
      vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy), dot(x12.zw,x12.zw)), 0.0);
      m = m*m; m = m*m;
      vec3 x  = 2.0 * fract(p * C.www) - 1.0;
      vec3 h  = abs(x) - 0.5;
      vec3 a0 = x - floor(x + 0.5);
      m *= 1.79284291400159 - 0.85373472095314 * (a0*a0 + h*h);
      vec3 g;
      g.x  = a0.x  * x0.x  + h.x  * x0.y;
      g.yz = a0.yz * x12.xz + h.yz * x12.yw;
      return 130.0 * dot(m, g);
    }

    void main() {
      vec2 uv = vUv;

      // Subtle cursor pull (only when hovering)
      vec2 toMouse = mouse - uv;
      float mdist  = length(toMouse);
      uv += toMouse * smoothstep(0.5, 0.0, mdist) * hover * 0.05;

      // 4 noise calls (down from 7+) — sufficient for cinematic look
      float f1 = snoise(vec2(uv.x * 0.7  + time * 0.022, uv.y * 2.0 + time * 0.014));
      float f2 = snoise(vec2(uv.x * 1.0  - time * 0.018, uv.y * 1.6 + time * 0.011));

      // Aurora curtain band
      float curtain = snoise(vec2(uv.x * 0.35 + time * 0.016, uv.y * 1.4 + f1 * 0.45));
      curtain = curtain * 0.5 + 0.5;
      curtain = pow(curtain, 1.8);

      // Green on right side
      float gNoise   = snoise(vec2(uv.x * 1.1 + time * 0.017, uv.y * 1.7 - time * 0.012));
      float gBand    = smoothstep(0.40, 0.72, gNoise * 0.5 + 0.5 + curtain * 0.22);
      float gBias    = smoothstep(0.38, 1.0, uv.x);

      float aurora = (f1 + f2) * 0.5 * 0.5 + 0.5;
      aurora = pow(aurora, 1.5);

      // Palette
      vec3 voidBlack = vec3(0.006, 0.003, 0.018);
      vec3 deepNight = vec3(0.022, 0.010, 0.058);
      vec3 midViolet = vec3(0.088, 0.026, 0.195);
      vec3 brightVio = vec3(0.165, 0.048, 0.340);
      vec3 softLav   = vec3(0.260, 0.125, 0.500);
      vec3 paleLav   = vec3(0.400, 0.190, 0.650);
      vec3 green     = vec3(0.038, 0.220, 0.100);
      vec3 warmGreen = vec3(0.065, 0.140, 0.070);

      vec3 color = voidBlack;
      color = mix(color, deepNight, smoothstep(0.0, 0.58, aurora) * 0.78);
      color = mix(color, midViolet, smoothstep(0.30, 0.65, aurora + curtain * 0.22) * 0.68);
      color = mix(color, brightVio, smoothstep(0.52, 0.82, curtain + aurora * 0.28) * 0.58);
      color = mix(color, softLav,   smoothstep(0.70, 0.90, curtain + f1 * 0.20) * 0.46);
      color = mix(color, paleLav,   smoothstep(0.84, 0.97, curtain + aurora * 0.25) * 0.32);

      // Right green
      color = mix(color, green,     gBand * gBias * 0.68);
      color = mix(color, warmGreen, gBand * smoothstep(0.60, 1.0, uv.x) * 0.35);

      // Hover glow
      float hGlow = smoothstep(0.38, 0.0, mdist) * hover;
      color += color * hGlow * 0.55;
      color += vec3(0.040, 0.008, 0.100) * hGlow * hGlow;

      // Subtle grain (single noise, not extra snoise call)
      color += (fract(sin(dot(uv * 800.0 + time, vec2(12.9898, 78.233))) * 43758.5453) - 0.5) * 0.008;

      // Vignette
      float vig = 1.0 - smoothstep(0.22, 1.02, length((uv - vec2(0.5, 0.44)) * vec2(1.0, 0.85)));
      color *= 0.58 + vig * 0.42;

      gl_FragColor = vec4(clamp(color, 0.0, 1.0), 1.0);
    }
  `,
  side: THREE.DoubleSide,
});

type HoverState = { x: number; y: number; hovering: boolean; hover: number };

// Inner component — uses useFrame (R3F's loop, zero extra RAF)
const AuroraScene = ({ hoverRef }: { hoverRef: React.MutableRefObject<HoverState> }) => {
  const { scene, camera } = useThree();

  // Add mesh once
  const meshRef = useRef<THREE.Mesh | null>(null);
  if (!meshRef.current) {
    const geo  = new THREE.PlaneGeometry(200, 200);
    meshRef.current = new THREE.Mesh(geo, material);
    meshRef.current.position.z = -50;
    scene.add(meshRef.current);
  }

  useFrame((state) => {
    const t  = state.clock.elapsedTime;
    const h  = hoverRef.current;

    // Lerp hover
    h.hover += ((h.hovering ? 1.0 : 0.0) - h.hover) * 0.04;

    // Update uniforms
    material.uniforms.time.value  = t * 0.35; // deterministic, no drift
    material.uniforms.mouse.value.set(h.x, h.y);
    material.uniforms.hover.value = h.hover;

    // Subtle camera drift
    camera.position.x = Math.sin(t * 0.025) * 1.0;
    camera.position.y = Math.cos(t * 0.033) * 0.7;

    // Always cover the full viewport — no black bars at any aspect ratio.
    // Scale the (200×200) plane to the visible frustum at the plane's depth.
    const mesh = meshRef.current;
    if (mesh) {
      const cam = camera as THREE.PerspectiveCamera;
      const dist = cam.position.z - mesh.position.z;          // 30 − (−50) = 80
      const vH = 2 * Math.tan((cam.fov * Math.PI) / 180 / 2) * dist;
      const vW = vH * cam.aspect;
      const BASE = 200;
      const MARGIN = 1.15;                                     // covers camera drift
      mesh.scale.set((vW / BASE) * MARGIN, (vH / BASE) * MARGIN, 1);
    }
  });

  return null;
};

export const AuroraFlow = () => {
  const hoverRef  = useRef<HoverState>({ x: 0.5, y: 0.5, hovering: false, hover: 0 });
  const wrapRef   = useRef<HTMLDivElement>(null);

  const onMove = (e: React.MouseEvent) => {
    const r = wrapRef.current?.getBoundingClientRect();
    if (!r) return;
    hoverRef.current.x = (e.clientX - r.left)  / r.width;
    hoverRef.current.y = 1.0 - (e.clientY - r.top) / r.height;
    hoverRef.current.hovering = true;
  };

  return (
    <div
      ref={wrapRef}
      style={{ width: '100%', height: '100%' }}
      onMouseMove={onMove}
      onMouseLeave={() => { hoverRef.current.hovering = false; }}
    >
      <Canvas
        camera={{ position: [0, 0, 30], fov: 75 }}
        dpr={[1, 1.5]}
        gl={{ antialias: false, alpha: false, powerPreference: 'high-performance' }}
        style={{ width: '100%', height: '100%' }}
      >
        <AuroraScene hoverRef={hoverRef} />
      </Canvas>
    </div>
  );
};
