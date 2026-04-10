import { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { MotionValue } from "framer-motion";
import * as THREE from "three";

interface DustProps {
  scrollProgress: MotionValue<number>;
}

const Particles = ({ scrollProgress }: DustProps) => {
  const meshRef = useRef<THREE.Points>(null);
  const count = 1500;

  const [positions, speeds] = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const spd = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 20;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 14;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 10;
      spd[i] = 0.2 + Math.random() * 0.8;
    }
    return [pos, spd];
  }, []);

  const initialPositions = useMemo(() => new Float32Array(positions), [positions]);

  useFrame((_, delta) => {
    if (!meshRef.current) return;
    const geo = meshRef.current.geometry;
    const posAttr = geo.attributes.position as THREE.BufferAttribute;
    const arr = posAttr.array as Float32Array;
    const progress = scrollProgress.get();
    const isGateBeat = progress > 0.55;
    const gateStrength = Math.max(0, (progress - 0.55) / 0.45);

    for (let i = 0; i < count; i++) {
      const ix = i * 3;
      const iy = i * 3 + 1;

      // Upward drift when scrolling
      arr[iy] += delta * speeds[i] * 0.3;

      // Gate clustering: pull toward center
      if (isGateBeat) {
        arr[ix] += (0 - arr[ix]) * gateStrength * delta * 0.4;
        arr[iy] += (2 - arr[iy]) * gateStrength * delta * 0.3;
        arr[i * 3 + 2] += (0 - arr[i * 3 + 2]) * gateStrength * delta * 0.3;
      }

      // Wrap around
      if (arr[iy] > 7) {
        arr[ix] = initialPositions[ix];
        arr[iy] = -7;
        arr[i * 3 + 2] = initialPositions[i * 3 + 2];
      }
    }
    posAttr.needsUpdate = true;
  });

  return (
    <points ref={meshRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
          count={count}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.03}
        color="#D4AF37"
        transparent
        opacity={0.5}
        sizeAttenuation
        depthWrite={false}
      />
    </points>
  );
};

const GoldenDust = ({ scrollProgress }: DustProps) => {
  return (
    <div
      className="absolute inset-0 pointer-events-none"
      style={{ zIndex: 10 }}
    >
      <Canvas
        camera={{ position: [0, 0, 5], fov: 60 }}
        style={{ background: "transparent" }}
        gl={{ alpha: true, antialias: false }}
      >
        <Particles scrollProgress={scrollProgress} />
      </Canvas>
    </div>
  );
};

export default GoldenDust;
