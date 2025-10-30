import { Navigation } from "@/components/Navigation";
import { Hero } from "@/components/Hero";
import { Features } from "@/components/Features";
import { CarShowcase } from "@/components/CarShowcase";
import { TemplatePreview } from "@/components/TemplatePreview";
import { WhatsIncluded } from "@/components/WhatsIncluded";
import { TechnicalSpecs } from "@/components/TechnicalSpecs";
import { FinalCTA } from "@/components/FinalCTA";
import { CoinPackages } from "@/components/Pricing/CoinPackages";

const Index = () => {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navigation />
      <Hero />
      <Features />
      <CoinPackages />
      <CarShowcase />
      <TemplatePreview />
      <WhatsIncluded />
      <TechnicalSpecs />
      <FinalCTA />
      
      {/* Footer */}
      <footer className="py-8 border-t border-border bg-carbon-fiber">
        <div className="container mx-auto px-4">
          <div className="text-center text-muted-foreground">
            <p className="text-sm">
              © 2025 F1 Design System. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
