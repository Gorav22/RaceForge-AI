import { Gauge, Zap, Target } from "lucide-react";
import car1 from "@/assets/car-1.jpg";
import car2 from "@/assets/car-2.jpg";
import car3 from "@/assets/car-3.jpg";

const cars = [
  {
    name: "VELOCITY RACER",
    image: car1,
    color: "Racing Red",
    stats: { speed: 98, acceleration: 95, handling: 92 },
  },
  {
    name: "STORM BREAKER",
    image: car2,
    color: "Electric Blue",
    stats: { speed: 94, acceleration: 98, handling: 96 },
  },
  {
    name: "THUNDER BOLT",
    image: car3,
    color: "Neon Yellow",
    stats: { speed: 96, acceleration: 93, handling: 97 },
  },
];

export const CarShowcase = () => {
  return (
    <section className="py-24 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-background to-secondary/20" />
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16 animate-fade-in-up">
          <h2 className="text-5xl md:text-6xl font-racing font-bold mb-4">
            <span className="text-accent">SHOWCASE</span>{" "}
            <span className="text-foreground">YOUR FLEET</span>
          </h2>
          <p className="text-xl text-muted-foreground">
            Premium car presentation templates with stunning visuals
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {cars.map((car, index) => (
            <div
              key={index}
              className="group animate-fade-in-up"
              style={{ animationDelay: `${index * 0.2}s` }}
            >
              <div className="relative backdrop-blur-md bg-card/40 border border-border rounded-2xl overflow-hidden transition-all duration-500 hover:border-primary hover:-translate-y-4 hover:shadow-2xl hover:shadow-primary/30">
                {/* Car Image */}
                <div className="relative h-80 overflow-hidden bg-gradient-to-b from-secondary to-background">
                  <div className="absolute inset-0 bg-gradient-glow opacity-50" />
                  <img 
                    src={car.image} 
                    alt={car.name}
                    className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                  />
                </div>
                
                {/* Car Info */}
                <div className="p-6 space-y-4">
                  <div>
                    <h3 className="text-3xl font-racing font-bold text-foreground mb-1">
                      {car.name}
                    </h3>
                    <p className="text-sm text-muted-foreground">{car.color}</p>
                  </div>
                  
                  {/* Stats */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Zap className="w-4 h-4 text-primary" />
                        <span className="text-sm text-muted-foreground">Speed</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-32 h-2 bg-muted rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-gradient-red rounded-full transition-all duration-1000 group-hover:animate-pulse"
                            style={{ width: `${car.stats.speed}%` }}
                          />
                        </div>
                        <span className="text-sm font-bold text-foreground w-8 text-right">{car.stats.speed}</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Gauge className="w-4 h-4 text-accent" />
                        <span className="text-sm text-muted-foreground">Acceleration</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-32 h-2 bg-muted rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-accent rounded-full transition-all duration-1000 group-hover:animate-pulse"
                            style={{ width: `${car.stats.acceleration}%` }}
                          />
                        </div>
                        <span className="text-sm font-bold text-foreground w-8 text-right">{car.stats.acceleration}</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Target className="w-4 h-4 text-electric" />
                        <span className="text-sm text-muted-foreground">Handling</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-32 h-2 bg-muted rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-electric rounded-full transition-all duration-1000 group-hover:animate-pulse"
                            style={{ width: `${car.stats.handling}%` }}
                          />
                        </div>
                        <span className="text-sm font-bold text-foreground w-8 text-right">{car.stats.handling}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
