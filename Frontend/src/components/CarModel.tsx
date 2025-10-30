import { useGLTF } from "@react-three/drei";

export function CarModel() {
  const { scene } = useGLTF("/models/mclaren_mp45__formula_1.glb");
  return <primitive object={scene} scale={1.2} position={[0, -1, 0]} />;
}