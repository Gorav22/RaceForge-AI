import { Layers, Layout, Palette, Package } from "lucide-react";

const specs = [
  { icon: Layers, label: "Organized Layers" },
  { icon: Layout, label: "Auto-Layout" },
  { icon: Palette, label: "Design Tokens" },
  { icon: Package, label: "Component Library" },
];

export const TechnicalSpecs = () => {
  return (
    <section className="py-16 relative overflow-hidden bg-carbon-fiber">
      {/* Checkered Pattern Background */}
      <div 
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: `repeating-linear-gradient(
            45deg,
            hsl(var(--foreground)) 0px,
            hsl(var(--foreground)) 20px,
            transparent 20px,
            transparent 40px
          ), repeating-linear-gradient(
            -45deg,
            hsl(var(--foreground)) 0px,
            hsl(var(--foreground)) 20px,
            transparent 20px,
            transparent 40px
          )`,
        }}
      />
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16">
          {specs.map((spec, index) => (
            <div 
              key={index}
              className="flex items-center gap-4 animate-fade-in-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="w-12 h-12 rounded-lg bg-primary/10 border border-primary/30 flex items-center justify-center">
                <spec.icon className="w-6 h-6 text-primary" />
              </div>
              <span className="text-lg md:text-xl font-bold text-foreground whitespace-nowrap">
                {spec.label}
              </span>
              
              {/* Divider */}
              {index < specs.length - 1 && (
                <div className="hidden md:block w-px h-12 bg-border" />
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
