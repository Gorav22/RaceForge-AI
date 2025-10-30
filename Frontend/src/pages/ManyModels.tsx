import { useState } from "react";
import { CarModel } from "@/components/CarModel";
import { CarModell } from "@/components/CarModel2";
import { CarModelll } from "@/components/CarModel3";
import { CarModellll} from "@/components/CarModel4";

import { Canvas } from "@react-three/fiber";
import { Environment, OrbitControls } from "@react-three/drei";
import { Suspense, ReactNode } from "react";

// PlusIcon Component
const PlusIcon = () => (
  <svg
    className="w-16 h-16 text-red-500"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M12 4v16m8-8H4"
    />
  </svg>
);

// CarCard Component
interface CarCardProps {
  model: string;
  description: string;
  image?: string;
  // description: string;
  modelComponent?: ReactNode;
}

const CarCard = ({ model, description, image, modelComponent}: CarCardProps) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className="bg-gray-800 rounded-lg overflow-hidden transition-all duration-300 hover:scale-[1.02]"
      style={{
        border: isHovered ? "2px solid #ef4444" : "2px solid transparent",
        boxShadow: isHovered ? "0 0 30px rgba(239, 68, 68, 0.3)" : "0 10px 30px -10px rgba(0, 0, 0, 0.5)",
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative h-80 w-full">
        {modelComponent ? (
          modelComponent
        ) : (
          <img
            src={image}
            alt={model}
            className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
          />
        )}
      </div>
      <div className="p-6">
        <h3 className="text-2xl font-bold text-white mb-2">{model}</h3>
        <p className="text-gray-300 text-sm">{description}</p>
        <button className="mt-4 bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-6 rounded-lg transition-all duration-300 hover:shadow-lg hover:shadow-red-500/50">
          Explore Model
        </button>
      </div>
    </div>
  );
};

// Main ManyModels Component
const ManyModels = () => {
  const carModels = [
    {
      model: "Phantom X-1",
      description: "The pinnacle of aerodynamic design with cutting-edge autonomous features.",
      modelComponent: (
        <Canvas camera={{ position: [8, 1.5, 4], fov: 50 }}>
          <ambientLight intensity={1.2} />
          <directionalLight position={[5, 5, 5]} />
          <Environment preset="city" />
          <OrbitControls enableZoom={false} autoRotate autoRotateSpeed={2} />
          <Suspense fallback={null}>
            <CarModel />
          </Suspense>
        </Canvas>
      ),
    },
    {
      model: "Velocity GT",
      description: "Pure performance meets luxury in this track-ready masterpiece.",
      modelComponent: (
        <Canvas camera={{ position: [10, 0.005, 1], fov: 50 }}>
          <ambientLight intensity={7} />
          <directionalLight position={[5, 5, 5]} />
          <Environment preset="city" />
          <OrbitControls enableZoom={false} autoRotate autoRotateSpeed={2} />
          <Suspense fallback={null}>
            <CarModell />
          </Suspense>
        </Canvas>
      ),
    },
    {
      model: "Nova Concept",
      description: "Revolutionary electric powertrain with zero emissions, infinite possibilities.",
      modelComponent: (
        <Canvas camera={{ position: [2, 4, 2], fov: 50 }}>
          <ambientLight intensity={1.2} />
          <directionalLight position={[5, 5, 5]} />
          <Environment preset="city" />
          <OrbitControls enableZoom={false} autoRotate autoRotateSpeed={2} />
          <Suspense fallback={null}>
            <CarModelll />
          </Suspense>
        </Canvas>
      ),
    },
    {
      model: "Apex R",
      description: "Racing heritage refined for the streets. Precision engineering at its finest.",
      modelComponent: (
        <Canvas camera={{ position: [10, 20, 12], fov: 50 }}>
          <ambientLight intensity={1.2} />
          <directionalLight position={[5, 5, 5]} />
          <Environment preset="city" />
          <OrbitControls enableZoom={false} autoRotate autoRotateSpeed={2} />
          <Suspense fallback={null}>
            <CarModellll />
          </Suspense>
        </Canvas>
      ),
    },
  ];

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Header */}
      <header className="py-16 text-center border-b border-gray-800">
        <div className="max-w-6xl mx-auto px-4">
          <h1 className="text-6xl font-bold text-white mb-4 tracking-tight">
            Future-Gen <span className="text-red-500">Automotive</span>
          </h1>
          <p className="text-gray-400 text-lg">Where Innovation Meets Performance</p>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 py-16">
        {/* Car Models Grid */}
        <section className="mb-20">
          <h2 className="text-4xl font-bold text-white mb-10 text-center">
            Our <span className="text-red-500">Collection</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {carModels.map((car, index) => (
              <CarCard key={index} {...car} />
            ))}
          </div>
        </section>



        {/* Custom Creator CTA */}
        <section className="text-center">
          <div className="bg-gray-800 rounded-lg p-12 border-2 border-gray-700 hover:border-red-500 transition-all duration-300 hover:scale-105 cursor-pointer hover:shadow-2xl hover:shadow-red-500/30">
            <div className="flex justify-center mb-6">
              <PlusIcon />
            </div>
            <h3 className="text-3xl font-bold text-red-500 mb-4">
              Create Your Dream Machine
            </h3>
            <p className="text-gray-300 text-lg mb-6">
              You can custom create your car here
            </p>
            <button className="bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-8 rounded-lg transition-all duration-300 hover:shadow-lg hover:shadow-red-500/50 text-lg">
              Start Customizing
            </button>
          </div>
        </section>
      </main>





      {/* Footer */}
      <footer className="border-t border-gray-800 py-8 mt-20">
        <div className="max-w-6xl mx-auto px-4 text-center text-gray-500">
          <p>© 2025 Future-Gen Automotive. Redefining the Road Ahead.</p>
        </div>
      </footer>
    </div>
  );
};

export default ManyModels;
