import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export function FloatingBuyCoins() {
  const [isAuthed, setIsAuthed] = useState(false);
  const [balance, setBalance] = useState<number>(0);
  const navigate = useNavigate();

  useEffect(() => {
    let mounted = true;
    fetch("/api/auth/me", { credentials: "include" })
      .then((r) => r.ok ? r.json() : Promise.reject())
      .then(() => mounted && setIsAuthed(true))
      .catch(() => setIsAuthed(false));
    return () => { mounted = false; };
  }, []);

  useEffect(() => {
    if (!isAuthed) return;
    let mounted = true;
    fetch("/api/wallet", { credentials: "include" })
      .then((r) => r.ok ? r.json() : { balance: 0 })
      .then((d) => mounted && setBalance(d.balance || 0))
      .catch(() => {});
    return () => { mounted = false; };
  }, [isAuthed]);

  if (!isAuthed) return null;

  return (
    <button
      onClick={() => navigate("/buy-coins")}
      className="fixed bottom-6 right-6 z-40 rounded-full bg-primary text-primary-foreground shadow-lg px-4 py-3 flex items-center gap-2 hover:opacity-90"
    >
      <span>💰 {balance}</span>
      <span className="hidden sm:inline">Buy Coins</span>
    </button>
  );
}


