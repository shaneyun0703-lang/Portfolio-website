import { useEffect, useRef } from "react";
import * as THREE from "three";

// A frontal sheet of gridded frosted glass. A per-pixel elevation field gently waves and, under the
// cursor, a concentric ripple disturbs it — its gradient refracts (bends) the grid lines like light
// through disturbed glass. Monochrome + one accent glow that follows the cursor with weight.

const VERT = /* glsl */ `
  varying vec2 vUv;
  void main() { vUv = uv; gl_Position = vec4(position.xy, 0.0, 1.0); }
`;

const FRAG = /* glsl */ `
  precision highp float;
  uniform float uTime;
  uniform vec2 uRes;
  uniform vec2 uMouse;
  uniform float uEnergy;
  uniform vec3 uAccent;
  varying vec2 vUv;

  float elev(vec2 uv, float t, vec2 m, float en, float aspect) {
    float e = 0.0;
    e += sin(uv.x * 10.0 + t * 0.55) * 0.05;
    e += sin(uv.y * 8.5 - t * 0.45) * 0.045;
    vec2 a = vec2(uv.x * aspect, uv.y), b = vec2(m.x * aspect, m.y);
    float md = distance(a, b);
    e += sin(md * 30.0 - t * 2.2) * exp(-md * md * 18.0) * 0.038 * (0.4 + en); // gentle cursor ripple
    return e;
  }

  void main() {
    float aspect = uRes.x / max(uRes.y, 1.0);
    vec2 uv = vUv;
    float t = uTime;
    float e = elev(uv, t, uMouse, uEnergy, aspect);
    float o = 0.0022;
    float ex = elev(uv + vec2(o, 0.0), t, uMouse, uEnergy, aspect) - elev(uv - vec2(o, 0.0), t, uMouse, uEnergy, aspect);
    float ey = elev(uv + vec2(0.0, o), t, uMouse, uEnergy, aspect) - elev(uv - vec2(0.0, o), t, uMouse, uEnergy, aspect);
    vec2 guv = uv + vec2(ex, ey) * 0.22; // refraction: bend the grid by the elevation gradient (dialed back)

    float N = 44.0;
    vec2 gv = guv * vec2(N * aspect, N);
    vec2 g = abs(fract(gv - 0.5) - 0.5) / fwidth(gv);
    float line = 1.0 - min(min(g.x, g.y), 1.0);

    float lit = 0.4 + 0.6 * smoothstep(-0.06, 0.08, e);
    vec3 col = vec3(0.016, 0.018, 0.022);
    col += vec3(0.9) * line * 0.15 * lit;

    vec2 d = (uv - uMouse); d.x *= aspect;
    float glow = exp(-dot(d, d) * 9.0);
    col += uAccent * glow * (0.04 + 0.09 * uEnergy) * (0.4 + line * 0.8); // subtle monochrome lift at the cursor

    vec2 cc = uv - 0.5; cc.x *= aspect;
    col *= mix(0.42, 1.0, smoothstep(0.0, 0.4, length(cc)));  // calm center
    col *= mix(0.72, 1.0, smoothstep(1.1, 0.4, length(cc)));  // vignette
    gl_FragColor = vec4(col, 1.0);
  }
`;

export function GateSheet() {
  const mountRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;
    const reduce = !!window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    const renderer = new THREE.WebGLRenderer({ alpha: false, antialias: false });
    renderer.setPixelRatio(dpr);
    renderer.setClearColor(0x000000, 1);
    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
    const uniforms = {
      uTime: { value: 0 }, uRes: { value: new THREE.Vector2(1, 1) },
      uMouse: { value: new THREE.Vector2(0.5, 0.5) }, uEnergy: { value: 0 },
      uAccent: { value: new THREE.Color("#ffffff") }, // monochrome — no blue hue
    };
    const material = new THREE.ShaderMaterial({ uniforms, vertexShader: VERT, fragmentShader: FRAG });
    const quad = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), material);
    scene.add(quad);
    const canvas = renderer.domElement;
    canvas.style.width = "100%"; canvas.style.height = "100%"; canvas.style.display = "block";
    mount.appendChild(canvas);

    let W = 0, H = 0;
    const resize = () => {
      W = mount.clientWidth || window.innerWidth; H = mount.clientHeight || window.innerHeight;
      renderer.setSize(W, H, false); uniforms.uRes.value.set(W * dpr, H * dpr);
    };
    const target = new THREE.Vector2(0.5, 0.5), cur = new THREE.Vector2(0.5, 0.5);
    const onMove = (e: PointerEvent) => { target.set(e.clientX / Math.max(W, 1), 1 - e.clientY / Math.max(H, 1)); };
    resize();
    window.addEventListener("resize", resize);
    window.addEventListener("pointermove", onMove);

    let raf = 0, t = 0, last = performance.now(), energy = 0;
    const frame = (now: number) => {
      const dt = Math.min(50, now - last); last = now; t += dt * 0.001;
      const ease = 1 - Math.pow(0.0025, dt / 1000);
      const dx = target.x - cur.x, dy = target.y - cur.y;
      cur.x += dx * ease; cur.y += dy * ease;
      energy = Math.min(1.4, energy * 0.9 + Math.hypot(dx, dy) * 10);
      uniforms.uMouse.value.set(cur.x, cur.y); uniforms.uEnergy.value = energy; uniforms.uTime.value = t;
      renderer.render(scene, camera); raf = requestAnimationFrame(frame);
    };
    renderer.render(scene, camera);
    if (!reduce) raf = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", onMove);
      material.dispose(); quad.geometry.dispose(); renderer.dispose();
      if (canvas.parentNode) canvas.parentNode.removeChild(canvas);
    };
  }, []);
  return <div ref={mountRef} className="absolute inset-0" style={{ width: "100%", height: "100%" }} />;
}
