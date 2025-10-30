import { Button } from "@/components/ui/button";
import { Zap, Gauge, Trophy } from "lucide-react";
import heroCar from "@/assets/f1-hero-car.jpg";
import { Canvas } from "@react-three/fiber";
import { Environment, OrbitControls } from "@react-three/drei";
import { Suspense, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { CarModel } from "@/components/CarModel";

export const Hero = () => {
  const navigate = useNavigate();
  const [isAuthed, setIsAuthed] = useState<boolean>(false);
  useEffect(() => {
    fetch("/api/auth/me", { credentials: "include" })
      .then((r) => setIsAuthed(r.ok))
      .catch(() => setIsAuthed(false));
  }, []);

  const onGetStarted = () => navigate("/signup");
  const onBuyCoins = () => navigate(isAuthed ? "/buy-coins" : "/login");

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-racing bg-carbon-fiber">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 bg-gradient-glow opacity-50" />
      
      {/* Speed Lines Animation */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            className="absolute h-px bg-gradient-to-r from-transparent via-primary to-transparent animate-speed-lines"
            style={{
              top: `${20 + i * 15}%`,
              animationDelay: `${i * 0.3}s`,
              width: "200%",
            }}
          />
        ))}
      </div>

      {/* Floating UI Elements */}
      <div className="absolute top-20 right-10 animate-float opacity-20">
        <div className="backdrop-blur-md bg-card/10 border border-border rounded-lg p-4">
          <Gauge className="w-12 h-12 text-accent" />
        </div>
      </div>
      
      <div className="absolute bottom-32 left-10 animate-float opacity-20" style={{ animationDelay: "1s" }}>
        <div className="backdrop-blur-md bg-card/10 border border-border rounded-lg p-4">
          <Trophy className="w-12 h-12 text-electric" />
        </div>
      </div>

      <div className="container mx-auto px-4 z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <div className="text-center lg:text-left space-y-8 animate-fade-in-up">
            <div className="inline-block">
              <span className="text-accent text-sm font-bold uppercase tracking-wider backdrop-blur-sm bg-accent/10 px-4 py-2 rounded-full border border-accent/20">
                Professional Racing Design
              </span>
            </div>
            
            <h1 className="text-6xl md:text-7xl lg:text-8xl font-racing font-bold leading-none tracking-tight">
              <span className="text-foreground">PREMIUM F1</span>
              <br />
              <span className="text-primary italic">GAME DESIGN</span>
              <br />
              <span className="bg-gradient-red bg-clip-text text-transparent">SYSTEM</span>
            </h1>
            
            <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl">
              Professional Figma Template for <span className="text-accent font-bold">Next-Gen Racing Games</span>
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Button variant="racing" size="lg" className="group" onClick={onGetStarted}>
                <Zap className="mr-2 h-5 w-5 group-hover:rotate-12 transition-transform" />
                Get Started Free
              </Button>
              <Button variant="outline" size="lg" className="backdrop-blur-sm" onClick={onBuyCoins}>
                Buy Coins Now →
              </Button>
            </div>
            <p className="text-sm text-muted-foreground">
              Already have an account? <button className="underline" onClick={() => navigate("/login")}>Login</button>
            </p>
            
            {/* Stats */}
            <div className="flex flex-wrap gap-8 justify-center lg:justify-start pt-4">
              <div className="text-center lg:text-left">
                <div className="text-4xl font-racing text-accent">200+</div>
                <div className="text-sm text-muted-foreground">Components</div>
              </div>
              <div className="text-center lg:text-left">
                <div className="text-4xl font-racing text-electric">50+</div>
                <div className="text-sm text-muted-foreground">Screens</div>
              </div>
              <div className="text-center lg:text-left">
                <div className="text-4xl font-racing text-primary">100%</div>
                <div className="text-sm text-muted-foreground">Customizable</div>
              </div>
            </div>
          </div>
          
          {/* Car Image with Effects */}
          {/* <div className="relative animate-zoom-in">
            <div className="absolute inset-0 bg-primary/30 blur-3xl rounded-full animate-glow-pulse" />
            <img 
              src={heroCar} 
              alt="F1 Racing Car" 
              className="relative w-full h-auto drop-shadow-2xl transform hover:scale-105 transition-transform duration-500"
            />
          </div> */}
          {/* 3D Car Model */}
          <div className="relative w-full h-[500px] animate-zoom-in">
            <div className="absolute inset-0 bg-primary/30 blur-3xl rounded-full animate-glow-pulse" />
            <div className="relative w-full h-full rounded-2xl overflow-hidden drop-shadow-2xl ">
              <Canvas camera={{ position: [8, 1.5, 4], fov: 50 }}>
                <ambientLight intensity={1.2} />
                <directionalLight position={[5, 5, 5]} />
                <Environment preset="city" />
                <OrbitControls enableZoom={false} autoRotate autoRotateSpeed={2} />
                <Suspense fallback={null}>
                  <CarModel />
                </Suspense>
              </Canvas>
            </div>
          </div>


        </div>
      </div>

      {/* Bottom Gradient Fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent" />
    </section>
  );
};
