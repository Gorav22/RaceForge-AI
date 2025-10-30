import { useGLTF } from "@react-three/drei";

export function CarModelll() {
  const { scene } = useGLTF("/models/formula_3_car.glb");
  return <primitive object={scene} scale={0.89} position={[0, -1, 0]} />;
}