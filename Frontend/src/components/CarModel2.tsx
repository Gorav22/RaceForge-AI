import { useGLTF } from "@react-three/drei";

export function CarModell() {
  const { scene } = useGLTF("/models/formula_1_generico_2.glb");
  return <primitive object={scene} scale={4.5} position={[0, -1, 0]} />;
}