import { useEffect, useRef } from "react";
import * as THREE from "three";

// A calm 3D grid field for the password gate: a large plane of thin grid lines, gently undulating
// in real perspective, receding into fog. A single accent light glides over the surface following
// the cursor with weight. Grows out of the site's existing grid motif — geometric, dark, restrained.

const VERT = /* glsl */ `
  uniform float uTime;
  varying vec2 vUv;
  varying float vElev;
  varying float vFog;
  void main() {
    vUv = uv;
    vec3 pos = position; // local plane: x = width, y = depth, z = up (before the mesh's -90deg X tilt)
    float t = uTime;
    float e = 0.0;
    e += sin(pos.x * 0.55 + t * 0.45) * 0.34;
    e += sin(pos.y * 0.48 - t * 0.38) * 0.30;
    e += sin((pos.x + pos.y) * 0.32 + t * 0.28) * 0.20;
    e *= 0.6;
    pos.z += e;
    vElev = e;
    vec4 mv = modelViewMatrix * vec4(pos, 1.0);
    vFog = clamp((-mv.z - 3.5) / 15.0, 0.0, 1.0); // farther from camera → more fog
    gl_Position = projectionMatrix * mv;
  }
`;

const FRAG = /* glsl */ `
  precision highp float;
  uniform vec2 uRes;
  uniform vec2 uMouse;   // eased cursor, screen 0..1
  uniform float uEnergy; // movement energy
  uniform vec3 uAccent;
  varying vec2 vUv;
  varying float vElev;
  varying float vFog;

  void main() {
    // antialiased grid lines from the plane's uv
    float N = 52.0;
    vec2 gv = vUv * N;
    vec2 g = abs(fract(gv - 0.5) - 0.5) / fwidth(gv);
    float line = 1.0 - min(min(g.x, g.y), 1.0);

    float lit = 0.35 + 0.65 * smoothstep(-0.4, 0.6, vElev); // crests read brighter
    vec3 col = vec3(0.016, 0.018, 0.022);
    col += vec3(0.9) * line * 0.16 * lit; // thin white grid lines

    // screen-space accent light that follows the cursor and glides over the grid
    vec2 su = gl_FragCoord.xy / uRes;
    float aspect = uRes.x / max(uRes.y, 1.0);
    vec2 d = (su - uMouse); d.x *= aspect;
    float glow = exp(-dot(d, d) * 6.0);
    col += uAccent * glow * (0.10 + 0.22 * uEnergy) * (0.35 + line * 0.85);

    // a whisper of accent riding the highest crests
    col += uAccent * smoothstep(0.42, 0.7, vElev) * line * 0.09;

    // fog to near-black at distance so the far edge dissolves
    col *= (1.0 - vFog * 0.92);

    // keep the middle calm so the name + card stay legible
    vec2 cc = su - 0.5; cc.x *= aspect;
    col *= mix(0.4, 1.0, smoothstep(0.0, 0.42, length(cc)));

    gl_FragColor = vec4(col, 1.0);
  }
`;

export function GateField() {
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
    const camera = new THREE.PerspectiveCamera(50, 1, 0.1, 100);
    camera.position.set(0, 2.4, 5.6);
    camera.lookAt(0, -0.1, -3);

    const uniforms = {
      uTime: { value: 0 },
      uRes: { value: new THREE.Vector2(1, 1) },
      uMouse: { value: new THREE.Vector2(0.5, 0.5) },
      uEnergy: { value: 0 },
      uAccent: { value: new THREE.Color("#a3baff") },
    };
    const material = new THREE.ShaderMaterial({ uniforms, vertexShader: VERT, fragmentShader: FRAG });
    const geometry = new THREE.PlaneGeometry(28, 28, 170, 170);
    const mesh = new THREE.Mesh(geometry, material);
    mesh.rotation.x = -Math.PI / 2; // lay the plane flat so it recedes into the distance
    scene.add(mesh);

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
      camera.aspect = W / Math.max(H, 1);
      camera.updateProjectionMatrix();
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
      const ease = 1 - Math.pow(0.0025, dt / 1000);
      const dx = target.x - cur.x, dy = target.y - cur.y;
      cur.x += dx * ease; cur.y += dy * ease;
      energy = Math.min(1.4, energy * 0.9 + Math.hypot(dx, dy) * 10);
      uniforms.uMouse.value.set(cur.x, cur.y);
      uniforms.uEnergy.value = energy;
      uniforms.uTime.value = t;
      renderer.render(scene, camera);
      raf = requestAnimationFrame(frame);
    };
    renderer.render(scene, camera);
    if (!reduce) raf = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", onMove);
      geometry.dispose();
      material.dispose();
      renderer.dispose();
      if (canvas.parentNode) canvas.parentNode.removeChild(canvas);
    };
  }, []);

  return <div ref={mountRef} className="absolute inset-0" style={{ width: "100%", height: "100%" }} />;
}
