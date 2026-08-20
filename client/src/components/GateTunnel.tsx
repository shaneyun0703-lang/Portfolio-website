import { useEffect, useRef } from "react";
import * as THREE from "three";

// A grid corridor: the camera sits inside a long cylinder of grid lines that drifts gently forward
// (grid scrolls toward the viewer) and recedes to a fogged vanishing point — dark center, perfect
// for the card. The camera parallax-steers toward the cursor with weight. Monochrome + one accent.

const VERT = /* glsl */ `
  varying vec2 vUv;
  varying float vDepth;
  void main() {
    vUv = uv;
    vec4 mv = modelViewMatrix * vec4(position, 1.0);
    vDepth = -mv.z;
    gl_Position = projectionMatrix * mv;
  }
`;

const FRAG = /* glsl */ `
  precision highp float;
  uniform float uTime;
  uniform vec2 uRes;
  uniform vec2 uMouse;
  uniform float uEnergy;
  uniform vec3 uAccent;
  varying vec2 vUv;
  varying float vDepth;

  void main() {
    vec2 guv = vec2(vUv.x * 26.0, vUv.y * 96.0 + uTime * 1.1); // around, along (scrolls forward)
    vec2 g = abs(fract(guv - 0.5) - 0.5) / fwidth(guv);
    float line = 1.0 - min(min(g.x, g.y), 1.0);

    vec3 col = vec3(0.014, 0.016, 0.02);
    col += vec3(0.9) * line * 0.16;

    float fog = clamp((vDepth - 2.0) / 42.0, 0.0, 1.0); // far → black
    col *= (1.0 - fog * 0.96);

    vec2 su = gl_FragCoord.xy / uRes;
    float aspect = uRes.x / max(uRes.y, 1.0);
    vec2 d = (su - uMouse); d.x *= aspect;
    float glow = exp(-dot(d, d) * 5.0);
    col += uAccent * glow * (0.1 + 0.22 * uEnergy) * (0.4 + line * 0.8);

    gl_FragColor = vec4(col, 1.0);
  }
`;

export function GateTunnel() {
  const mountRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;
    const reduce = !!window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    const renderer = new THREE.WebGLRenderer({ alpha: false, antialias: true });
    renderer.setPixelRatio(dpr);
    renderer.setClearColor(0x000000, 1);
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(62, 1, 0.1, 100);
    camera.position.set(0, 0, 34);

    const uniforms = {
      uTime: { value: 0 }, uRes: { value: new THREE.Vector2(1, 1) },
      uMouse: { value: new THREE.Vector2(0.5, 0.5) }, uEnergy: { value: 0 },
      uAccent: { value: new THREE.Color("#a3baff") },
    };
    const material = new THREE.ShaderMaterial({ uniforms, vertexShader: VERT, fragmentShader: FRAG, side: THREE.BackSide });
    const geometry = new THREE.CylinderGeometry(5, 5, 96, 80, 1, true);
    const tube = new THREE.Mesh(geometry, material);
    tube.rotation.x = Math.PI / 2; // axis along Z → a corridor down the view
    scene.add(tube);

    const canvas = renderer.domElement;
    canvas.style.width = "100%"; canvas.style.height = "100%"; canvas.style.display = "block";
    mount.appendChild(canvas);

    let W = 0, H = 0;
    const resize = () => {
      W = mount.clientWidth || window.innerWidth; H = mount.clientHeight || window.innerHeight;
      renderer.setSize(W, H, false);
      camera.aspect = W / Math.max(H, 1); camera.updateProjectionMatrix();
      uniforms.uRes.value.set(W * dpr, H * dpr);
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
      // parallax-steer the camera toward the cursor (weight)
      camera.rotation.y = (cur.x - 0.5) * 0.4;
      camera.rotation.x = (cur.y - 0.5) * 0.28;
      uniforms.uMouse.value.set(cur.x, cur.y); uniforms.uEnergy.value = energy; uniforms.uTime.value = t;
      renderer.render(scene, camera); raf = requestAnimationFrame(frame);
    };
    renderer.render(scene, camera);
    if (!reduce) raf = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", onMove);
      geometry.dispose(); material.dispose(); renderer.dispose();
      if (canvas.parentNode) canvas.parentNode.removeChild(canvas);
    };
  }, []);
  return <div ref={mountRef} className="absolute inset-0" style={{ width: "100%", height: "100%" }} />;
}
