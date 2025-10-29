import { Gamepad2, BarChart3, Trophy, Palette, Car, Zap } from "lucide-react";

const features = [
  {
    icon: Gamepad2,
    title: "200+ UI Components",
    description: "Complete library of racing game interface elements ready to use",
  },
  {
    icon: BarChart3,
    title: "Complete Dashboard Layouts",
    description: "Pre-built analytics and performance tracking screens",
  },
  {
    icon: Trophy,
    title: "Leaderboard Designs",
    description: "Multiple leaderboard variations with rankings and stats",
  },
  {
    icon: Palette,
    title: "Racing HUD Elements",
    description: "Speedometers, lap timers, position indicators, and more",
  },
  {
    icon: Car,
    title: "Car Selection Interfaces",
    description: "Garage and vehicle customization screen templates",
  },
  {
    icon: Zap,
    title: "Animated Speed Effects",
    description: "Motion blur, particles, and dynamic visual elements",
  },
];

export const Features = () => {
  return (
    <section className="py-24 relative overflow-hidden bg-carbon-fiber">
      <div className="absolute inset-0 bg-gradient-to-b from-background via-secondary/30 to-background" />
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16 animate-fade-in-up">
          <h2 className="text-5xl md:text-6xl font-racing font-bold mb-4">
            <span className="text-primary">PACKED WITH</span>{" "}
            <span className="text-foreground">FEATURES</span>
          </h2>
          <p className="text-xl text-muted-foreground">
            Everything you need to build a professional racing game
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <div
              key={index}
              className="group relative animate-fade-in-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {/* Glass Card */}
              <div className="relative backdrop-blur-md bg-card/40 border border-border rounded-xl p-8 h-full transition-all duration-300 hover:border-primary hover:bg-card/60 hover:-translate-y-2 hover:shadow-2xl hover:shadow-primary/20">
                {/* Glow Effect on Hover */}
                <div className="absolute inset-0 bg-gradient-glow opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl" />
                
                <div className="relative z-10">
                  <div className="mb-6 inline-flex p-4 rounded-lg bg-primary/10 border border-primary/20 group-hover:bg-primary/20 transition-colors">
                    <feature.icon className="w-8 h-8 text-primary" />
                  </div>
                  
                  <h3 className="text-2xl font-racing font-bold mb-3 text-foreground group-hover:text-primary transition-colors">
                    {feature.title}
                  </h3>
                  
                  <p className="text-muted-foreground leading-relaxed">
                    {feature.description}
                  </p>
                </div>
                
                {/* Corner Accent */}
                <div className="absolute top-0 right-0 w-20 h-20 border-t-2 border-r-2 border-accent/20 rounded-tr-xl group-hover:border-accent transition-colors" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
