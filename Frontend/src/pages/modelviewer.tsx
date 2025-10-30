import React, { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Environment, useGLTF } from "@react-three/drei";

interface ModelProps {
  url: string;
}

const Model: React.FC<ModelProps> = ({ url }) => {
  const { scene } = useGLTF(url);
  return <primitive object={scene} scale={1.5} />;
};

const ModelViewer: React.FC<ModelProps> = ({ url }) => {
  return (
    <div style={{ width: "100%", height: "500px" }}>
      <Canvas camera={{ position: [0, 1, 3] }}>
        <Suspense fallback={null}>
          <ambientLight intensity={0.6} />
          <directionalLight position={[5, 5, 5]} />
          <Model url={url} />
          <Environment preset="sunset" />
        </Suspense>
        <OrbitControls enableZoom />
      </Canvas>
    </div>
  );
};

export default ModelViewer;
