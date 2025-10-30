import { useState } from "react";
import { Coins, Check, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const PACKAGES = [
  { key: "starter", name: "Starter", coins: 100, price: "$4.99", description: "Great for beginners", features: ["100 Coins", "Basic Access", "Email Support"] },
  { key: "popular", name: "Popular", coins: 500, price: "$19.99", description: "Most popular choice", features: ["500 Coins", "Full Access", "Priority Support", "Bonus Content"], badge: "Most Popular" },
  { key: "premium", name: "Premium", coins: 1000, price: "$34.99", description: "For power users", features: ["1000 Coins", "Premium Features", "24/7 Support", "Exclusive Content"], badge: "Best Value" },
  { key: "ultimate", name: "Ultimate", coins: 2500, price: "$79.99", description: "Maximum savings", features: ["2500 Coins", "All Features", "VIP Support", "Lifetime Updates"] },
];

export default function BuyCoins() {
  const [loadingKey, setLoadingKey] = useState<string | null>(null);

  const onBuy = async (key: string) => {
    setLoadingKey(key);
    try {
      const res = await fetch("/api/payment/create-checkout-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ packageKey: key }),
      });
      const data = await res.json();
      if (data?.url) window.location.href = data.url as string;
      else if (data?.id) window.location.href = `https://checkout.stripe.com/pay/${data.id}`;
    } finally {
      setLoadingKey(null);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="pt-24 pb-16 container mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-racing font-bold mb-4">
            Buy <span className="text-primary">Virtual Coins</span>
          </h1>
          <p className="text-xl text-muted-foreground mb-6">
            Choose your package and purchase securely with Stripe
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
          {PACKAGES.map((p) => (
            <Card
              key={p.key}
              className={`relative overflow-hidden transition-all duration-300 hover:scale-105 ${
                p.badge === "Best Value"
                  ? "border-2 border-primary shadow-lg scale-105"
                  : ""
              }`}
            >
              {p.badge && (
                <div
                  className={`absolute top-0 right-0 px-3 py-1 text-xs font-bold ${
                    p.badge === "Best Value"
                      ? "bg-primary text-foreground"
                      : "bg-yellow-500 text-black"
                  }`}
                >
                  {p.badge.toUpperCase()}
                </div>
              )}
              <CardHeader className="pb-4">
                <CardTitle className="text-2xl font-racing flex items-center gap-2">
                  <Coins className="w-6 h-6 text-accent" />
                  {p.name}
                </CardTitle>
                <p className="text-sm text-muted-foreground">{p.description}</p>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="text-center">
                  <div className="text-4xl font-racing text-primary mb-2">
                    {p.price}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {p.coins} Virtual Coins
                  </div>
                </div>

                <ul className="space-y-2">
                  {p.features.map((feature, index) => (
                    <li
                      key={index}
                      className="flex items-center gap-2 text-sm text-muted-foreground"
                    >
                      <Check className="w-4 h-4 text-primary flex-shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>

                <Button
                  className="w-full"
                  variant={p.badge === "Best Value" ? "racing" : "outline"}
                  disabled={loadingKey === p.key}
                  onClick={() => onBuy(p.key)}
                >
                  {loadingKey === p.key ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Redirecting...
                    </>
                  ) : (
                    "Purchase Now"
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
  );
}
