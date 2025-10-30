import React, { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Html, useProgress, Environment } from "@react-three/drei";
import { useLoader } from "@react-three/fiber";
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader";
import * as THREE from "three";

// Loader component shows progress
function Loader() {
  const { progress } = useProgress();
  return (
    <Html center style={{ color: "white", fontSize: "1.2rem" }}>
      {progress.toFixed(1)} % loaded
    </Html>
  );
}

// Model component loads and renders the .obj
const Model: React.FC<{ path: string }> = ({ path }) => {
  const obj = useLoader(OBJLoader, path);
  // Optional: center and scale the model
  obj.traverse((child) => {
    if ((child as THREE.Mesh).isMesh) {
      const mesh = child as THREE.Mesh;
      mesh.material = new THREE.MeshStandardMaterial({
        color: 0xffffff,
        metalness: 1,
        roughness: 0.2,
      });
      mesh.castShadow = true;
      mesh.receiveShadow = true;
    }
  });

  return <primitive object={obj} scale={1} position={[0, 0, 0]} />;
};

const ObjViewer: React.FC<{ modelPath?: string }> = ({ modelPath = "text_a_red_f1_racing_car_0.obj" }) => {
  return (
    <div style={{ width: "100vw", height: "100vh", backgroundColor: "#111" }}>
      <Canvas camera={{ position: [2, 2, 3], fov: 50 }} shadows>
        <ambientLight intensity={0.6} />
        <directionalLight position={[10, 10, 10]} intensity={1} castShadow />
        <Suspense fallback={<Loader />}>
          <Model path={modelPath} />
          {/* Adds a realistic reflection and lighting environment */}
          <Environment preset="city" />
        </Suspense>
        <OrbitControls enableDamping dampingFactor={0.1} />
      </Canvas>
    </div>
  );
};

export default ObjViewer;
