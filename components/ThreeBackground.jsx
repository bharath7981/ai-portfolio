// components/ThreeBackground.jsx
"use client";
import { Canvas, useFrame } from "@react-three/fiber";
import { Sparkles } from "@react-three/drei";
import * as THREE from "three";
import { Suspense, useEffect, useRef, useState } from "react";

// Regular icosahedron vertices for node graph dots
const PHI = (1 + Math.sqrt(5)) / 2;
const RAW_VERTICES = [
  [0, 1, PHI], [0, 1, -PHI], [0, -1, PHI], [0, -1, -PHI],
  [1, PHI, 0], [1, -PHI, 0], [-1, PHI, 0], [-1, -PHI, 0],
  [PHI, 0, 1], [PHI, 0, -1], [-PHI, 0, 1], [-PHI, 0, -1],
];
const VLEN = Math.sqrt(1 + PHI * PHI);
const NODE_VERTICES = RAW_VERTICES.map(([x, y, z]) => [x / VLEN, y / VLEN, z / VLEN]).filter(
  (_, i) => i % 2 === 0
);

function NodeGraph({ reduceMotion, mousePos }) {
  const groupRef = useRef();
  const wireMaterialRef = useRef();
  const nodeRefs = useRef([]);
  const nodeMaterialsRef = useRef([]);

  // Animated values lerped each frame
  const currentOpacity = useRef(0.95);
  const currentWireOpacity = useRef(0.55);
  const currentNodeMult = useRef(1.0);
  const tiltX = useRef(0);
  const tiltY = useRef(0);

  useFrame((state, delta) => {
    if (!groupRef.current) return;

    // 1. Slow, steady continuous ambient rotation
    if (!reduceMotion) {
      groupRef.current.rotation.x += delta * 0.04;
      groupRef.current.rotation.y += delta * 0.05;
    }

    // 2. Subtle mouse tilt interaction
    if (!reduceMotion) {
      const targetTiltX = mousePos.current.y * 0.05;
      const targetTiltY = mousePos.current.x * 0.05;
      tiltX.current = THREE.MathUtils.lerp(tiltX.current, targetTiltX, 0.03);
      tiltY.current = THREE.MathUtils.lerp(tiltY.current, targetTiltY, 0.03);
    }

    // 3. Document scroll progress calculation (0.0 to 1.0)
    const scrollY = window.scrollY || document.documentElement.scrollTop;
    const maxScroll = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
    const p = Math.min(1, Math.max(0, scrollY / maxScroll));

    // 4. Section-based positioning
    let targetX = 2.2, targetY = 0.2, targetZ = 0, targetScale = 1.8;
    let targetOpacity = 0.95, targetWireOpacity = 0.55, targetNodeMult = 1.0;

    if (p < 0.18) {
      targetX = 2.2; targetY = 0.2; targetZ = 0; targetScale = 1.8;
      targetOpacity = 0.95; targetWireOpacity = 0.55; targetNodeMult = 1.0;
    } else if (p < 0.38) {
      targetX = -2.2; targetY = 0.1; targetZ = -0.5; targetScale = 1.6;
      targetOpacity = 0.35; targetWireOpacity = 0.25; targetNodeMult = 0.45;
    } else if (p < 0.62) {
      targetX = 0; targetY = -0.4; targetZ = -2.5; targetScale = 1.2;
      targetOpacity = 0.14; targetWireOpacity = 0.10; targetNodeMult = 0.20;
    } else if (p < 0.80) {
      targetX = 2.4; targetY = -0.2; targetZ = -0.8; targetScale = 1.5;
      targetOpacity = 0.28; targetWireOpacity = 0.20; targetNodeMult = 0.35;
    } else if (p < 0.90) {
      targetX = -2.2; targetY = 0.3; targetZ = -1.0; targetScale = 1.4;
      targetOpacity = 0.25; targetWireOpacity = 0.18; targetNodeMult = 0.30;
    } else {
      targetX = 0; targetY = 0.1; targetZ = -0.8; targetScale = 1.7;
      targetOpacity = 0.35; targetWireOpacity = 0.25; targetNodeMult = 0.40;
    }

    if (window.innerWidth < 768) {
      targetX = 0; targetZ = -1.5; targetScale *= 0.65; targetOpacity *= 0.7;
    }
    if (reduceMotion) { targetOpacity = 0.4; targetNodeMult = 0.3; }

    // 5. Smooth lerped transforms
    groupRef.current.position.x = THREE.MathUtils.lerp(groupRef.current.position.x, targetX, 0.05);
    groupRef.current.position.y = THREE.MathUtils.lerp(groupRef.current.position.y, targetY, 0.05);
    groupRef.current.position.z = THREE.MathUtils.lerp(groupRef.current.position.z, targetZ, 0.05);
    const newS = THREE.MathUtils.lerp(groupRef.current.scale.x, targetScale, 0.05);
    groupRef.current.scale.set(newS, newS, newS);
    groupRef.current.rotation.z = tiltY.current;

    // 6. Lerp material opacity
    currentOpacity.current = THREE.MathUtils.lerp(currentOpacity.current, targetOpacity, 0.05);
    currentWireOpacity.current = THREE.MathUtils.lerp(currentWireOpacity.current, targetWireOpacity, 0.05);
    currentNodeMult.current = THREE.MathUtils.lerp(currentNodeMult.current, targetNodeMult, 0.05);

    if (wireMaterialRef.current) {
      wireMaterialRef.current.opacity = currentWireOpacity.current * currentOpacity.current;
    }

    // 7. Pulse node dots
    const t = state.clock.elapsedTime;
    nodeRefs.current.forEach((mesh, i) => {
      if (!mesh) return;
      const basePulse = reduceMotion ? 0.5 : 0.6 + Math.sin(t * 1.6 + i * 0.9) * 0.35 + 0.35;
      mesh.scale.setScalar(Math.max(0.2, basePulse * currentNodeMult.current));
      if (nodeMaterialsRef.current[i]) {
        nodeMaterialsRef.current[i].opacity = Math.min(1, currentOpacity.current * (currentNodeMult.current * 0.8 + 0.2));
      }
    });
  });

  return (
    <group ref={groupRef} position={[2.2, 0.2, 0]} scale={1.8}>
      {/* Primary wireframe — Violet edges (Void Neon) */}
      <lineSegments>
        <edgesGeometry args={[new THREE.IcosahedronGeometry(1, 1)]} />
        <lineBasicMaterial ref={wireMaterialRef} color="#A855F7" transparent opacity={0.55} />
      </lineSegments>

      {/* Cyan node markers */}
      {NODE_VERTICES.map(([x, y, z], i) => (
        <mesh key={i} position={[x, y, z]} ref={(el) => (nodeRefs.current[i] = el)}>
          <sphereGeometry args={[0.045, 10, 10]} />
          <meshBasicMaterial
            ref={(el) => (nodeMaterialsRef.current[i] = el)}
            color="#22D3EE"
            transparent
            opacity={0.95}
          />
        </mesh>
      ))}
    </group>
  );
}

export default function ThreeBackground() {
  const [reduceMotion, setReduceMotion] = useState(false);
  const mousePos = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduceMotion(mq.matches);
    const onChange = () => setReduceMotion(mq.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  useEffect(() => {
    const handleMouseMove = (e) => {
      mousePos.current = {
        x: (e.clientX / window.innerWidth) * 2 - 1,
        y: (e.clientY / window.innerHeight) * 2 - 1,
      };
    };
    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-0">
      <Canvas camera={{ position: [0, 0, 5], fov: 45 }} dpr={[1, 1.25]}>
        <Suspense fallback={null}>
          <NodeGraph reduceMotion={reduceMotion} mousePos={mousePos} />
          {!reduceMotion && (
            <Sparkles count={16} scale={8} size={1.1} speed={0.2} opacity={0.2} color="#A855F7" />
          )}
        </Suspense>
      </Canvas>
    </div>
  );
}
