import { useEffect, useLayoutEffect, useRef } from "react";
import { motion } from "framer-motion";
import * as THREE from "three";

// A cheap-to-build studio environment (vertical gradient + a couple of soft
// "window" reflections) drawn to a canvas. Far faster to initialise than
// RoomEnvironment, so mounting the heart no longer stutters the main thread.
function makeEnvTexture() {
  const c = document.createElement("canvas");
  c.width = 256; c.height = 128;
  const ctx = c.getContext("2d")!;
  const g = ctx.createLinearGradient(0, 0, 0, 128);
  // High-contrast chrome horizon: bright sky → dark band → bright ground bounce.
  // The contrast is what makes it read as glassy mirror-chrome rather than flat white.
  g.addColorStop(0.0, "#ffffff");
  g.addColorStop(0.30, "#c6ccd3");
  g.addColorStop(0.46, "#525964");
  g.addColorStop(0.52, "#2e333c");
  g.addColorStop(0.58, "#3c424c");
  g.addColorStop(0.70, "#828a93");
  g.addColorStop(0.86, "#d2d7dc");
  g.addColorStop(1.0, "#eef1f4");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, 256, 128);
  // crisp bright softboxes → sharp moving glints on the chrome
  ctx.filter = "blur(4px)";
  ctx.fillStyle = "rgba(255,255,255,1)";
  ctx.fillRect(30, 12, 84, 30);
  ctx.fillRect(166, 14, 50, 22);
  ctx.filter = "none";
  const tex = new THREE.CanvasTexture(c);
  tex.mapping = THREE.EquirectangularReflectionMapping;
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

// A real 3D, puffed, chrome heart. Because it's a metallic mesh reflecting a
// studio environment, the highlights and reflections genuinely sweep across the
// surface as it rotates — i.e. the shading recomputes every frame, which is what
// makes it read as polished chrome rather than a flat shaded shape.

function makeHeartGeometry() {
  const s = new THREE.Shape();
  // Plump, symmetric "puffy heart" silhouette (Y2K amulet) — full round lobes,
  // soft point. Apex already at the bottom, lobes at top (y-up), so no flip.
  s.moveTo(0, 58);                               // cleft between the lobes
  s.bezierCurveTo(-22, 98, -74, 94, -80, 46);    // up & over the left lobe
  s.bezierCurveTo(-85, 14, -52, -8, 0, -58);     // down the left side to the point
  s.bezierCurveTo(52, -8, 85, 14, 80, 46);       // up the right side
  s.bezierCurveTo(74, 94, 22, 98, 0, 58);        // over the right lobe, back to cleft

  const geo = new THREE.ExtrudeGeometry(s, {
    depth: 8,
    bevelEnabled: true,
    bevelThickness: 22, // pushes the rounded "puff" outward in Z
    bevelSize: 14,      // how far the rounding eats into the face → pillowy edge
    bevelSegments: 24,  // smooth rounding (no facets)
    steps: 1,
    curveSegments: 90,
  });

  // Inflate the front & back faces so they bulge out like a stuffed pillow
  // instead of staying flat. Each vertex is pushed along Z by a dome falloff
  // based on its in-plane distance from the centre and how far it already sits
  // toward a face — center of each face pops out most, edges stay put (no crease).
  geo.computeBoundingBox();
  const bb = geo.boundingBox!;
  const cx = (bb.min.x + bb.max.x) / 2;
  const cy = (bb.min.y + bb.max.y) / 2;
  const cz = (bb.min.z + bb.max.z) / 2;
  const halfZ = (bb.max.z - bb.min.z) / 2 || 1;
  const R = Math.hypot(bb.max.x - cx, bb.max.y - cy) * 0.92;
  const DOME = 26; // how far the faces pop out
  const pos = geo.attributes.position as THREE.BufferAttribute;
  for (let i = 0; i < pos.count; i++) {
    const x = pos.getX(i), y = pos.getY(i), z = pos.getZ(i);
    const d = Math.hypot(x - cx, y - cy) / R;
    const f = Math.max(0, 1 - d * d);          // 1 at centre → 0 at rim
    const t = (z - cz) / halfZ;                // -1 back face … +1 front face
    pos.setZ(i, z + DOME * f * t);
  }
  pos.needsUpdate = true;

  geo.center();
  geo.computeVertexNormals();
  // Normalize size
  geo.computeBoundingSphere();
  const r = geo.boundingSphere!.radius;
  geo.scale(2.6 / r, 2.6 / r, 2.6 / r);
  return geo;
}

export default function ChromeHeart({ spin = true, popIn = true }: { spin?: boolean; popIn?: boolean }) {
  const mountRef = useRef<HTMLDivElement>(null);
  // Spin state lives in a ref so toggling it never tears down / rebuilds the
  // WebGL context — the same heart just starts turning.
  const spinRef = useRef(spin);
  useEffect(() => { spinRef.current = spin; }, [spin]);

  useLayoutEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const RES = 220;
    const reduce = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.setSize(RES, RES, false);
    renderer.setClearAlpha(0);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.25;
    renderer.outputColorSpace = THREE.SRGBColorSpace;

    const canvas = renderer.domElement;
    canvas.style.width = "100%";
    canvas.style.height = "100%";
    canvas.style.display = "block";
    mount.appendChild(canvas);

    const scene = new THREE.Scene();

    // Studio environment → the chrome reflection. Cheap canvas gradient, PMREM'd.
    const pmrem = new THREE.PMREMGenerator(renderer);
    const srcTex = makeEnvTexture();
    const envTex = pmrem.fromEquirectangular(srcTex).texture;
    srcTex.dispose();
    scene.environment = envTex;

    const camera = new THREE.PerspectiveCamera(30, 1, 0.1, 100);
    camera.position.set(0, 0, 10.5); // pulled back → heart sits with padding inside the canvas

    // A couple of crisp lights add moving specular streaks on top of the env.
    const key = new THREE.DirectionalLight(0xffffff, 2.2);
    key.position.set(-3, 4, 5);
    scene.add(key);
    const rim = new THREE.DirectionalLight(0xbcd0ff, 1.4);
    rim.position.set(4, -2, 3);
    scene.add(rim);

    const geometry = makeHeartGeometry();
    const material = new THREE.MeshPhysicalMaterial({
      color: 0xffffff,
      metalness: 1.0,
      roughness: 0.045,        // near-mirror → sharp chrome reflections
      envMap: envTex,
      envMapIntensity: 1.7,
      clearcoat: 1.0,          // glossy glass-like clear layer over the metal
      clearcoatRoughness: 0.05,
    });
    const mesh = new THREE.Mesh(geometry, material);
    mesh.rotation.x = -0.18;
    scene.add(mesh);

    let raf = 0;
    const render = () => renderer.render(scene, camera);

    let angle = -0.35;             // resting angle before it starts turning
    let last = performance.now();
    mesh.rotation.y = angle;
    render();                      // paint one frame immediately so the pop-in is never blank

    if (!reduce) {
      const loop = (now: number) => {
        const dt = Math.min(50, now - last); last = now;
        if (spinRef.current) {
          angle += dt * 0.00105;                                       // ~1.05 rad/s spin
          mesh.rotation.x = -0.18 + Math.sin(now / 1000 * 0.8) * 0.12; // gentle bob while turning
        }
        mesh.rotation.y = angle;
        render();
        raf = requestAnimationFrame(loop);
      };
      raf = requestAnimationFrame(loop);
    }

    return () => {
      cancelAnimationFrame(raf);
      geometry.dispose();
      material.dispose();
      envTex.dispose();
      pmrem.dispose();
      renderer.dispose();
      if (canvas.parentNode) canvas.parentNode.removeChild(canvas);
    };
  }, []);

  return (
    // Sized block. The call site wraps this in an absolutely-positioned span, so
    // the heart is entirely out of text flow — it cannot affect the pill's
    // baseline, height, or width, hence zero layout shift.
    <motion.span
      ref={mountRef}
      className="block"
      style={{ width: "1.18em", height: "1.18em", filter: "drop-shadow(0 1px 2px rgba(0,0,0,0.3))" }}
      initial={{ scale: popIn ? 0.2 : 1, opacity: popIn ? 0 : 1 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: "spring", stiffness: 240, damping: 14, mass: 0.9, opacity: { duration: 0.25 } }}
    />
  );
}
