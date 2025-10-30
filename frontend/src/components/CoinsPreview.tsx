import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

const PACKAGES = [
  { key: "starter", name: "Starter", coins: 100, price: "$4.99" },
  { key: "popular", name: "Popular", coins: 500, price: "$19.99", badge: "MOST POPULAR" },
  { key: "premium", name: "Premium", coins: 1000, price: "$34.99", badge: "BEST VALUE" },
  { key: "ultimate", name: "Ultimate", coins: 2500, price: "$79.99" },
];

export function CoinsPreview() {
  const navigate = useNavigate();
  const [isAuthed, setIsAuthed] = useState<boolean>(false);

  useEffect(() => {
    fetch("/api/auth/me", { credentials: "include" })
      .then((r) => setIsAuthed(r.ok))
      .catch(() => setIsAuthed(false));
  }, []);

  const onPurchase = (key: string) => {
    if (!isAuthed) {
      navigate("/login", { state: { from: "/buy-coins" } });
      return;
    }
    navigate("/buy-coins", { state: { packageKey: key } });
  };

  return (
    <section id="pricing" className="container mx-auto px-4 py-16">
      <h2 className="text-3xl font-bold mb-6">Choose Your Package</h2>
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        {PACKAGES.map((p) => (
          <div key={p.key} className={`rounded-xl border border-border bg-card/70 backdrop-blur p-4 hover:shadow-xl transition ${p.badge ? "ring-1 ring-yellow-400" : ""}`}>
            {p.badge && <div className="text-xs font-semibold text-yellow-600">{p.badge}</div>}
            <div className="mt-2 text-lg font-semibold">{p.name}</div>
            <div className="text-3xl font-bold mt-2">{p.coins} Coins</div>
            <div className="text-muted-foreground mt-1">{p.price}</div>
            <ul className="mt-3 text-sm text-muted-foreground list-disc list-inside">
              <li>Instant delivery after payment</li>
              <li>Secure checkout</li>
              <li>Use coins across all features</li>
            </ul>
            <button onClick={() => onPurchase(p.key)} className="mt-4 w-full bg-primary text-primary-foreground rounded-md py-2">Purchase Now</button>
          </div>
        ))}
      </div>
    </section>
  );
}


