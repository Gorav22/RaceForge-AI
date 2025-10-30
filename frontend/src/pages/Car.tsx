// CarViewer.tsx
import React, { useRef, useEffect, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, useGLTF } from '@react-three/drei';
import { io } from 'socket.io-client';

interface CarModelProps {
  modelPath: string; // Path to the generated 3D model (e.g., GLTF/GLB)
}

function CarModel({ modelPath }: CarModelProps) {
  // Load the GLTF model
  const gltf = useGLTF(modelPath);
  
  return <primitive object={gltf.scene} scale={0.5} />; // Adjust scale as needed
}

interface CarViewerProps {
  // This could be used if you want to pass initial data or a socket instance
}

const CarViewer: React.FC<CarViewerProps> = () => {
  const [carModelPath, setCarModelPath] = useState('default_car.glb'); // Default model
  const [description, setDescription] = useState('');
  const socketRef = useRef<any>(null);

  useEffect(() => {
    // Initialize Socket.IO connection
    socketRef.current = io('http://localhost:5000'); // Your Python backend URL

    socketRef.current.on('connect', () => {
      console.log('Connected to backend');
    });

    socketRef.current.on('new_car_model', (data: { model_path: string }) => {
      console.log('Received new model path:', data.model_path);
      setCarModelPath(data.model_path);
    });

    socketRef.current.on('disconnect', () => {
      console.log('Disconnected from backend');
    });

    return () => {
      socketRef.current.disconnect();
    };
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (socketRef.current) {
      socketRef.current.emit('generate_car', { description });
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
      <form onSubmit={handleSubmit} style={{ padding: '10px', background: '#333', color: 'white' }}>
        <input
          type="text"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Describe your car (e.g., 'red sports car, sleek design')"
          style={{ width: '80%', padding: '8px', marginRight: '10px' }}
        />
        <button type="submit" style={{ padding: '8px 15px' }}>Generate</button>
      </form>
      <div style={{ flex: 1, background: '#1a1a1a' }}>
        <Canvas camera={{ position: [5, 5, 5], fov: 75 }}>
          <ambientLight intensity={0.5} />
          <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} />
          <pointLight position={[-10, -10, -10]} />
          
          {/* Render the car model if carModelPath is available and valid */}
          {carModelPath && <CarModel modelPath={carModelPath} />}

          <OrbitControls /> {/* Allows user to rotate/zoom the model */}
          <gridHelper args={[10, 10]} /> {/* Optional grid for context */}
        </Canvas>
      </div>
      <div style={{ flex: 1, background: '#1a1a1a' }}>
        <Canvas camera={{ position: [5, 5, 5], fov: 75 }}>
          <ambientLight intensity={0.5} />
          <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} />
          <pointLight position={[-10, -10, -10]} />
          
          {/* Render the car model if carModelPath is available and valid */}
          {carModelPath && <CarModel modelPath='car_d776dd5060094cdbb688219d734ad500.glb' />}

          <OrbitControls /> {/* Allows user to rotate/zoom the model */}
          <gridHelper args={[10, 10]} /> {/* Optional grid for context */}
        </Canvas>
      </div>
    </div>
  );
};

export default CarViewer;