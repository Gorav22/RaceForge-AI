import hudImg from "@/assets/ui-hud.jpg";
import menuImg from "@/assets/ui-menu.jpg";
import garageImg from "@/assets/ui-garage.jpg";
import leaderboardImg from "@/assets/ui-leaderboard.jpg";

const previews = [
  { name: "Race HUD", image: hudImg, className: "md:col-span-2 md:row-span-2" },
  { name: "Main Menu", image: menuImg, className: "md:col-span-1 md:row-span-1" },
  { name: "Garage", image: garageImg, className: "md:col-span-1 md:row-span-1" },
  { name: "Leaderboard", image: leaderboardImg, className: "md:col-span-2 md:row-span-1" },
];

export const TemplatePreview = () => {
  return (
    <section className="py-24 relative overflow-hidden bg-carbon-fiber">
      <div className="absolute inset-0 bg-gradient-to-b from-secondary/30 via-background to-secondary/30" />
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16 animate-fade-in-up">
          <h2 className="text-5xl md:text-6xl font-racing font-bold mb-4">
            <span className="text-electric">TEMPLATE</span>{" "}
            <span className="text-foreground">PREVIEW</span>
          </h2>
          <p className="text-xl text-muted-foreground">
            Professionally designed screens for every aspect of your game
          </p>
        </div>
        
        {/* Bento Grid */}
        <div className="grid md:grid-cols-3 gap-6 max-w-7xl mx-auto">
          {previews.map((preview, index) => (
            <div
              key={index}
              className={`group relative ${preview.className} animate-fade-in-up`}
              style={{ animationDelay: `${index * 0.15}s` }}
            >
              <div className="relative h-full min-h-[280px] backdrop-blur-md bg-card/40 border border-border rounded-2xl overflow-hidden transition-all duration-500 hover:border-accent hover:shadow-2xl hover:shadow-accent/20">
                {/* Preview Image */}
                <div className="relative h-full overflow-hidden">
                  <img 
                    src={preview.image} 
                    alt={preview.name}
                    className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                  />
                  
                  {/* Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/50 to-transparent opacity-80 group-hover:opacity-60 transition-opacity" />
                  
                  {/* Label */}
                  <div className="absolute bottom-6 left-6 right-6">
                    <h3 className="text-2xl font-racing font-bold text-foreground mb-2">
                      {preview.name}
                    </h3>
                    <div className="w-16 h-1 bg-gradient-red rounded-full" />
                  </div>
                </div>
                
                {/* Corner Accents */}
                <div className="absolute top-0 right-0 w-16 h-16 border-t-2 border-r-2 border-accent/30 rounded-tr-2xl group-hover:border-accent transition-colors" />
                <div className="absolute bottom-0 left-0 w-16 h-16 border-b-2 border-l-2 border-primary/30 rounded-bl-2xl group-hover:border-primary transition-colors" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
