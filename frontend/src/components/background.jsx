import { Canvas, useFrame } from "@react-three/fiber";
import { Points, PointMaterial } from "@react-three/drei";
import { useMemo, useRef } from "react";

function Stars() {
  const ref = useRef();

  const positions = useMemo(() => {
    const arr = [];

    for (let i = 0; i < 2000; i++) {
      arr.push((Math.random() - 0.5) * 35);
      arr.push((Math.random() - 0.5) * 35);
      arr.push((Math.random() - 0.5) * 35);
    }

    return new Float32Array(arr);
  }, []);

  useFrame(() => {
    if (ref.current) {
      ref.current.rotation.y += 0.00015;
      ref.current.rotation.x += 0.00004;
    }
  });

  return (
    <Points ref={ref} positions={positions} stride={3}>
      <PointMaterial
        transparent
        color="#ffffff"
        size={0.025}
        sizeAttenuation
        depthWrite={false}
        opacity={0.6}
      />
    </Points>
  );
}

export default function AnimatedBackground() {
  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 0,
        pointerEvents: "none",
        backgroundColor: "#030303",
        overflow: "hidden"
      }}
    >
      {/* Central light-grey glow behind the main title */}
      <div
        className="glow-glow"
        style={{
          position: "absolute",
          top: "40%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: "800px",
          height: "400px",
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0) 70%)",
        }}
      />

      {/* Top right cyan/teal glow */}
      <div
        className="glow-glow animate-pulse-glow"
        style={{
          position: "absolute",
          top: "10%",
          right: "-100px",
          width: "700px",
          height: "700px",
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(20,184,166,0.12) 0%, rgba(13,148,136,0.02) 50%, rgba(0,0,0,0) 80%)",
        }}
      />

      {/* Bottom left dark teal/grey glow */}
      <div
        className="glow-glow"
        style={{
          position: "absolute",
          bottom: "-100px",
          left: "-150px",
          width: "600px",
          height: "600px",
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(255,255,255,0.05) 0%, rgba(20,184,166,0.03) 40%, rgba(0,0,0,0) 70%)",
        }}
      />

      {/* Side Ambient Light - Left (Grey-White) */}
      <div
        className="glow-glow"
        style={{
          position: "absolute",
          top: "50%",
          left: "-200px",
          transform: "translateY(-50%)",
          width: "500px",
          height: "700px",
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0) 70%)",
        }}
      />

      {/* Side Ambient Light - Right (Teal-Green) */}
      <div
        className="glow-glow animate-pulse-glow"
        style={{
          position: "absolute",
          top: "50%",
          right: "-200px",
          transform: "translateY(-50%)",
          width: "500px",
          height: "700px",
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(45,212,191,0.08) 0%, rgba(0,0,0,0) 70%)",
        }}
      />

      {/* Canvas for the 3D particles */}
      <Canvas camera={{ position: [0, 0, 8], fov: 75 }}>
        <ambientLight intensity={0.3} />
        <Stars />
      </Canvas>
    </div>
  );
}
