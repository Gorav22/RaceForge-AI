import { useGLTF } from "@react-three/drei";

export function CarModellll() {
  const { scene } = useGLTF("/models/formula_1__lotus_49c.glb");
  return <primitive object={scene} scale={1.2} position={[0, -1, 0]} />;
}