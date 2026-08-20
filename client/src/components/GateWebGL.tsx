import { useEffect, useRef } from "react";
import * as THREE from "three";

// Fullscreen WebGL "wow" background for the password gate. A flowing near-black liquid-metal
// surface (domain-warped fbm → pseudo-normals → metallic shading) with white glints and a single
// accent that blooms around the cursor and follows it with weight. Center stays calm so the
// name + card read. Monochrome + one accent, per the design direction.

const VERT = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = vec4(position.xy, 0.0, 1.0);
  }
`;

const FRAG = /* glsl */ `
  precision highp float;
  uniform float uTime;
  uniform vec2 uRes;
  uniform vec2 uMouse;   // eased cursor, 0..1 (y up)
  uniform float uEnergy; // movement energy, decays
  uniform vec3 uAccent;
  uniform float uMode;   // 0 = liquid metal, 1 = glassier
  varying vec2 vUv;

  float hash(vec2 p){ p = fract(p * vec2(123.34, 345.45)); p += dot(p, p + 34.345); return fract(p.x * p.y); }
  float noise(vec2 p){
    vec2 i = floor(p), f = fract(p);
    vec2 u = f * f * (3.0 - 2.0 * f);
    float a = hash(i), b = hash(i + vec2(1.0, 0.0)), c = hash(i + vec2(0.0, 1.0)), d = hash(i + vec2(1.0, 1.0));
    return mix(mix(a, b, u.x), mix(c, d, u.x), u.y);
  }
  float fbm(vec2 p){
    float v = 0.0, a = 0.5;
    for (int i = 0; i < 6; i++) { v += a * noise(p); p = p * 2.0 + 13.0; a *= 0.5; }
    return v;
  }
  // height field of the flowing surface at world-ish point p
  float height(vec2 p, float t){
    vec2 q = vec2(fbm(p * 2.0 + t), fbm(p * 2.0 - t + 5.2));
    vec2 r = vec2(fbm(p * 2.0 + 1.5 * q + 0.3 * t), fbm(p * 2.0 + 1.5 * q - 0.2 * t));
    return fbm(p * 2.0 + 2.0 * r);
  }

  void main(){
    vec2 uv = vUv;
    float aspect = uRes.x / max(uRes.y, 1.0);
    vec2 p = vec2(uv.x * aspect, uv.y);
    vec2 m = vec2(uMouse.x * aspect, uMouse.y);
    float t = uTime * 0.12;

    // cursor pulls the surface (weight) — a soft well that also lifts the flow
    float md = distance(p, m);
    float mInf = exp(-md * md * 3.0);

    float h = height(p, t) + mInf * 0.25 * (0.5 + uEnergy);

    // pseudo-normal from the height gradient
    float e = 0.0022;
    float hx = height(p + vec2(e, 0.0), t) - height(p - vec2(e, 0.0), t);
    float hy = height(p + vec2(0.0, e), t) - height(p - vec2(0.0, e), t);
    vec3 n = normalize(vec3(-hx, -hy, e * (uMode > 0.5 ? 6.0 : 9.0)));

    vec3 V = vec3(0.0, 0.0, 1.0);
    vec3 L1 = normalize(vec3(0.45, 0.72, 0.82));      // key light
    vec3 L2 = normalize(vec3(m - p, 0.5));            // cursor light
    float diff = max(dot(n, L1), 0.0);
    float spec1 = pow(max(dot(reflect(-L1, n), V), 0.0), uMode > 0.5 ? 60.0 : 26.0);
    float spec2 = pow(max(dot(reflect(-L2, n), V), 0.0), 44.0) * mInf;
    float fres = pow(1.0 - max(n.z, 0.0), 3.0);       // rim

    vec3 col = vec3(0.018, 0.02, 0.026);              // near-black metal base
    col += vec3(0.05, 0.055, 0.072) * diff;          // faint body
    col += vec3(1.0) * spec1 * 0.6;                  // white glints
    col += uAccent * spec2 * 1.25;                   // accent bloom that tracks the cursor
    col += uAccent * mInf * 0.05;                    // faint accent wash near cursor
    col += uAccent * fres * 0.05;                    // whisper of accent on the rims

    // a single thin accent band riding a height contour (the "one accent" moment)
    float band = smoothstep(0.55, 0.61, h) - smoothstep(0.61, 0.68, h);
    col += uAccent * band * 0.07;

    // keep the middle calm so the name + card stay legible
    vec2 cc = vec2((uv.x - 0.5) * aspect, uv.y - 0.5);
    float cd = length(cc);
    col *= mix(0.32, 1.0, smoothstep(0.0, 0.5, cd));

    // gentle edge vignette
    float vig = smoothstep(1.15, 0.45, length(cc));
    col *= mix(0.72, 1.0, vig);

    gl_FragColor = vec4(col, 1.0);
  }
`;

export function GateWebGL({ variant = "liquid" }: { variant?: "liquid" | "glass" }) {
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
      uTime: { value: 0 },
      uRes: { value: new THREE.Vector2(1, 1) },
      uMouse: { value: new THREE.Vector2(0.5, 0.5) },
      uEnergy: { value: 0 },
      uAccent: { value: new THREE.Color("#a3baff") },
      uMode: { value: variant === "glass" ? 1 : 0 },
    };
    const material = new THREE.ShaderMaterial({ uniforms, vertexShader: VERT, fragmentShader: FRAG });
    const quad = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), material);
    scene.add(quad);

    const canvas = renderer.domElement;
    canvas.style.width = "100%";
    canvas.style.height = "100%";
    canvas.style.display = "block";
    mount.appendChild(canvas);

    let W = 0, H = 0;
    const resize = () => {
      W = mount.clientWidth || window.innerWidth;
      H = mount.clientHeight || window.innerHeight;
      renderer.setSize(W, H, false);
      uniforms.uRes.value.set(W * dpr, H * dpr);
    };

    const target = new THREE.Vector2(0.5, 0.5);
    const cur = new THREE.Vector2(0.5, 0.5);
    const onMove = (e: PointerEvent) => { target.set(e.clientX / Math.max(W, 1), 1 - e.clientY / Math.max(H, 1)); };

    resize();
    window.addEventListener("resize", resize);
    window.addEventListener("pointermove", onMove);

    let raf = 0, t = 0, last = performance.now(), energy = 0;
    const frame = (now: number) => {
      const dt = Math.min(50, now - last); last = now;
      t += dt * 0.001;
      const ease = 1 - Math.pow(0.0025, dt / 1000); // time-constant weighty follow
      const dx = target.x - cur.x, dy = target.y - cur.y;
      cur.x += dx * ease; cur.y += dy * ease;
      energy = Math.min(1.4, energy * 0.9 + Math.hypot(dx, dy) * 10);
      uniforms.uMouse.value.set(cur.x, cur.y);
      uniforms.uEnergy.value = energy;
      uniforms.uTime.value = t;
      renderer.render(scene, camera);
      raf = requestAnimationFrame(frame);
    };
    renderer.render(scene, camera); // paint one frame immediately
    if (!reduce) raf = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", onMove);
      material.dispose();
      quad.geometry.dispose();
      renderer.dispose();
      if (canvas.parentNode) canvas.parentNode.removeChild(canvas);
    };
  }, [variant]);

  return <div ref={mountRef} className="absolute inset-0" style={{ width: "100%", height: "100%" }} />;
}
