import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Coins, Badge } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";

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
    badge: 'BEST VALUE'
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

export const CoinPackages = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const handlePurchase = (packageId: string) => {
    if (!isAuthenticated) {
      toast.error('Please login to purchase coins');
      return;
    }
    navigate(`/buy-coins?package=${packageId}`);
  };

  return (
    <section id="pricing" className="py-24 bg-carbon-fiber">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-5xl md:text-6xl font-racing font-bold mb-4">
            Choose Your <span className="text-primary">Package</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Get virtual coins and unlock premium features
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {PACKAGES.map((pkg) => (
            <Card
              key={pkg.id}
              className={`relative overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-2xl ${
                pkg.badge ? 'border-2 border-primary shadow-lg' : ''
              }`}
            >
              {pkg.badge && (
                <div className="absolute top-0 right-0 bg-primary text-foreground px-3 py-1 text-xs font-bold">
                  {pkg.badge}
                </div>
              )}
              <CardHeader className="pb-4">
                <CardTitle className="text-2xl font-racing flex items-center gap-2">
                  <Coins className="w-6 h-6 text-accent" />
                  {pkg.name}
                </CardTitle>
                <CardDescription>{pkg.description}</CardDescription>
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
                      <Badge className="w-4 h-4 fill-primary text-primary" />
                      {feature}
                    </li>
                  ))}
                </ul>

                <Button
                  className="w-full"
                  variant={pkg.badge ? "racing" : "outline"}
                  onClick={() => handlePurchase(pkg.id)}
                >
                  Purchase Now
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center mt-12 text-muted-foreground">
          <p className="text-sm">
            All packages include instant coin delivery and secure payment via Stripe
          </p>
        </div>
      </div>
    </section>
  );
};

