import { Check } from "lucide-react";

const numbers = [
  { value: "50+", label: "Screens" },
  { value: "200+", label: "Components" },
  { value: "100%", label: "Customizable" },
];

const features = [
  "Racing HUD components",
  "Menu & navigation systems", 
  "Car customization UI",
  "Championship layouts",
  "Responsive designs",
  "Figma auto-layout",
  "Design tokens",
  "Component variants",
];

export const WhatsIncluded = () => {
  return (
    <section className="py-24 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-background to-secondary/20" />
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16 animate-fade-in-up">
          <h2 className="text-5xl md:text-6xl font-racing font-bold mb-4">
            <span className="text-primary">WHAT'S</span>{" "}
            <span className="text-foreground">INCLUDED</span>
          </h2>
        </div>
        
        <div className="grid lg:grid-cols-2 gap-12 max-w-6xl mx-auto items-center">
          {/* Left: Numbers */}
          <div className="space-y-8 animate-fade-in-up">
            {numbers.map((item, index) => (
              <div 
                key={index}
                className="group relative backdrop-blur-md bg-card/40 border border-border rounded-xl p-8 transition-all duration-300 hover:border-primary hover:bg-card/60 hover:-translate-x-2"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="flex items-center gap-6">
                  <div className="text-7xl font-racing font-bold bg-gradient-red bg-clip-text text-transparent">
                    {item.value}
                  </div>
                  <div className="text-2xl font-racing text-muted-foreground">
                    {item.label}
                  </div>
                </div>
                
                {/* Glow Effect */}
                <div className="absolute inset-0 bg-gradient-glow opacity-0 group-hover:opacity-100 transition-opacity rounded-xl" />
              </div>
            ))}
            
            <div className="backdrop-blur-md bg-gradient-red rounded-xl p-8 animate-glow-pulse">
              <div className="text-center">
                <div className="text-5xl font-racing font-bold text-foreground mb-2">
                  COMPLETE DESIGN SYSTEM
                </div>
                <div className="text-lg text-foreground/80">
                  Everything organized and ready to use
                </div>
              </div>
            </div>
          </div>
          
          {/* Right: Feature List */}
          <div className="space-y-6 animate-fade-in-up" style={{ animationDelay: "0.3s" }}>
            <div className="backdrop-blur-md bg-card/40 border border-border rounded-xl p-8">
              <h3 className="text-3xl font-racing font-bold mb-6 text-foreground">
                FEATURES & COMPONENTS
              </h3>
              
              <div className="grid gap-4">
                {features.map((feature, index) => (
                  <div 
                    key={index}
                    className="flex items-center gap-4 group"
                  >
                    <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-accent/10 border border-accent/30 flex items-center justify-center group-hover:bg-accent/20 transition-colors">
                      <Check className="w-5 h-5 text-accent" />
                    </div>
                    <span className="text-lg text-muted-foreground group-hover:text-foreground transition-colors">
                      {feature}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
