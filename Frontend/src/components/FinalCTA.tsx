import { Button } from "@/components/ui/button";
import { Download, Sparkles } from "lucide-react";
import heroCar from "@/assets/f1-hero-car.jpg";

export const FinalCTA = () => {
  return (
    <section className="py-32 relative overflow-hidden">
      {/* Background with Car */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-b from-background via-background/95 to-background" />
        <img 
          src={heroCar} 
          alt="F1 Car Background"
          className="absolute inset-0 w-full h-full object-cover opacity-10"
        />
      </div>
      
      {/* Spotlight Effect */}
      <div className="absolute inset-0">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/20 blur-[120px] rounded-full animate-pulse" />
      </div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center space-y-8 animate-fade-in-up">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 backdrop-blur-md bg-accent/10 border border-accent/30 rounded-full px-6 py-3">
            <Sparkles className="w-4 h-4 text-accent" />
            <span className="text-accent font-bold uppercase tracking-wider text-sm">
              Limited Time Offer
            </span>
          </div>
          
          {/* Headline */}
          <h2 className="text-5xl md:text-7xl font-racing font-bold leading-tight">
            <span className="text-foreground">READY TO BUILD</span>
            <br />
            <span className="text-primary">YOUR RACING GAME?</span>
          </h2>
          
          {/* Description */}
          <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto">
            Get instant access to the complete F1 design system and start creating
            <span className="text-accent font-bold"> professional racing experiences</span> today
          </p>
          
          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-6 justify-center pt-8">
            <Button variant="racing" size="lg" className="group text-lg px-8 py-6">
              <Download className="mr-2 h-6 w-6 group-hover:animate-bounce" />
              Get Template Now
            </Button>
          </div>
          
          {/* Features */}
          <div className="flex flex-wrap justify-center gap-6 pt-8 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-accent" />
              <span>Instant download</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-electric" />
              <span>Lifetime updates</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-primary" />
              <span>Commercial license</span>
            </div>
          </div>
          
          {/* Price Badge */}
          <div className="inline-block backdrop-blur-md bg-gradient-red rounded-2xl p-8 animate-glow-pulse">
            <div className="text-2xl text-foreground/80 mb-2">Starting at</div>
            <div className="text-6xl font-racing font-bold text-foreground mb-2">FREE</div>
            <div className="text-lg text-foreground/80">Download & Start Building</div>
          </div>
        </div>
      </div>
    </section>
  );
};
