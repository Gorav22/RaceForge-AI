import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Coins, Check, Loader2 } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useNavigate, useSearchParams } from "react-router-dom";
import { paymentAPI } from "@/services/api";
import { toast } from "sonner";
import { Navigation } from "@/components/Navigation";

const PACKAGES = [
  {
    id: 'starter',
    name: 'Starter',
    coins: 100,
    price: 4.99,
    description: 'Great for beginners',
    features: ['100 Virtual Coins', 'Basic Access', 'Email Support']
  },
  {
    id: 'popular',
    name: 'Popular',
    coins: 500,
    price: 19.99,
    description: 'Most popular choice',
    features: ['500 Virtual Coins', 'Full Access', 'Priority Support', 'Bonus Content'],
    popular: true
  },
  {
    id: 'premium',
    name: 'Premium',
    coins: 1000,
    price: 34.99,
    description: 'For power users',
    features: ['1000 Virtual Coins', 'Premium Features', '24/7 Support', 'Exclusive Content']
  },
  {
    id: 'ultimate',
    name: 'Ultimate',
    coins: 2500,
    price: 79.99,
    description: 'Maximum savings',
    features: ['2500 Virtual Coins', 'All Features', 'VIP Support', 'Lifetime Updates']
  }
];

export default function BuyCoins() {
  const { user, isAuthenticated, refreshUser } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [selectedPackage, setSelectedPackage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/");
      toast.error("Please login to purchase coins");
    }
    
    // Check if package is preselected from URL
    const packageParam = searchParams.get("package");
    if (packageParam && PACKAGES.find(p => p.id === packageParam)) {
      setSelectedPackage(packageParam);
    }
  }, [isAuthenticated, navigate, searchParams]);

  const handlePurchase = async (packageId: string) => {
    if (!isAuthenticated) {
      toast.error("Please login first");
      return;
    }

    setIsLoading(true);
    
    try {
      const response = await paymentAPI.createCheckoutSession(packageId);
      
      if (response.success && response.data.url) {
        // Redirect to Stripe checkout
        window.location.href = response.data.url;
      } else {
        toast.error("Failed to create checkout session");
      }
    } catch (error: any) {
      const message = error.response?.data?.message || "Payment processing failed";
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navigation />
      <div className="pt-32 pb-16 container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-5xl font-racing font-bold mb-4">
              Buy <span className="text-primary">Virtual Coins</span>
            </h1>
            <p className="text-xl text-muted-foreground mb-6">
              Choose a package and purchase with secure Stripe checkout
            </p>
            <div className="inline-flex items-center gap-2 px-6 py-3 bg-accent/20 border border-accent/30 rounded-full">
              <Coins className="w-5 h-5 text-accent" />
              <span className="font-bold text-lg">Current Balance: {user.coinBalance} Coins</span>
            </div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {PACKAGES.map((pkg) => (
              <Card
                key={pkg.id}
                className={`relative overflow-hidden transition-all duration-300 hover:scale-105 ${
                  pkg.popular ? 'border-2 border-primary shadow-lg scale-105' : ''
                } ${selectedPackage === pkg.id ? 'ring-2 ring-primary' : ''}`}
              >
                {pkg.popular && (
                  <div className="absolute top-0 right-0 bg-primary text-foreground px-3 py-1 text-xs font-bold">
                    BEST VALUE
                  </div>
                )}
                <CardHeader className="pb-4">
                  <CardTitle className="text-2xl font-racing flex items-center gap-2">
                    <Coins className="w-6 h-6 text-accent" />
                    {pkg.name}
                  </CardTitle>
                  <p className="text-sm text-muted-foreground">{pkg.description}</p>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="text-center">
                    <div className="text-4xl font-racing text-primary mb-2">
                      ${pkg.price.toFixed(2)}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {pkg.coins} Virtual Coins
                    </div>
                  </div>

                  <ul className="space-y-2">
                    {pkg.features.map((feature, index) => (
                      <li key={index} className="flex items-center gap-2 text-sm">
                        <Check className="w-4 h-4 text-primary flex-shrink-0" />
                        {feature}
                      </li>
                    ))}
                  </ul>

                  <Button
                    className="w-full"
                    variant={pkg.popular ? "racing" : "outline"}
                    onClick={() => handlePurchase(pkg.id)}
                    disabled={isLoading}
                  >
                    {isLoading && selectedPackage === pkg.id ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      'Purchase Now'
                    )}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="mt-12 text-center text-muted-foreground">
            <p className="text-sm">
              💳 Secure payment powered by Stripe | 🔒 Your data is safe
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

