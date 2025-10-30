import { Navigation } from "@/components/Navigation";
import { Hero } from "@/components/Hero";
import { Features } from "@/components/Features";
import { CarShowcase } from "@/components/CarShowcase";
import { TemplatePreview } from "@/components/TemplatePreview";
import { WhatsIncluded } from "@/components/WhatsIncluded";
import { TechnicalSpecs } from "@/components/TechnicalSpecs";
import { FinalCTA } from "@/components/FinalCTA";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { CoinsPreview } from "@/components/CoinsPreview";
import { FloatingBuyCoins } from "@/components/FloatingBuyCoins";

const Index = () => {
  const [balance, setBalance] = useState<number | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    let mounted = true;
    fetch("/api/wallet", { credentials: "include" })
      .then(async (r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (!mounted) return;
        if (data && typeof data.balance === "number") setBalance(data.balance);
      })
      .catch(() => {})
      .finally(() => {
        if (mounted) setLoading(false);
      });
    return () => {
      mounted = false;
    };
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navigation />
      <FloatingBuyCoins />
      {/* Wallet summary banner */}
      <div className="container mx-auto px-4 pt-24">
        <div className="flex items-center justify-between rounded-xl border border-border bg-card p-4">
          <div>
            <p className="text-sm text-muted-foreground">Your balance</p>
            <p className="text-2xl font-semibold">
              {loading ? "—" : balance === null ? "Sign in to view" : `${balance} Coins`}
            </p>
          </div>
          <div>
            <Link to="/dashboard" className="inline-block">
              <span className="inline-flex items-center rounded-md bg-primary px-4 py-2 text-primary-foreground hover:opacity-90">Go to Dashboard</span>
            </Link>
          </div>
        </div>
      </div>
      <Hero />
      <Features />
      <CarShowcase />
      <TemplatePreview />
      <CoinsPreview />
      <WhatsIncluded />
      <TechnicalSpecs />
      <FinalCTA />
      
      {/* Footer */}
      <footer className="py-8 border-t border-border bg-carbon-fiber">
        <div className="container mx-auto px-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-muted-foreground">
            <p className="text-sm">© 2025 F1 Design System. All rights reserved.</p>
            <div className="flex items-center gap-4">
              <Link to="/login" className="text-sm underline">Login</Link>
              <Link to="/signup" className="text-sm underline">Sign Up</Link>
              <Link to="/dashboard" className="text-sm underline">Dashboard</Link>
              <Link to="/transactions" className="text-sm underline">Transactions</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
