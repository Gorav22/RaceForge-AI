import { useEffect, useState } from "react";
import { getTransactions, getWallet, createCheckoutSession } from "@/lib/wallet";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const [balance, setBalance] = useState(0);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [buying, setBuying] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    async function load() {
      try {
        const w = await getWallet();
        setBalance(w.balance);
        const tx = await getTransactions();
        setTransactions(tx.transactions || []);
      } catch (_e) {
        // if unauthorized, redirect to login
        navigate("/login");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [navigate]);

  const handleBuyCoins = async (amount) => {
    setBuying(true);
    try {
      const session = await createCheckoutSession(amount);
      if (session && session.url) {
        window.location.href = session.url;
      } else if (session && session.id) {
        // fallback older style
        window.location.href = `https://checkout.stripe.com/pay/${session.id}`;
      }
    } catch (_e) {
      setBuying(false);
    }
  };

  if (loading) return <div className="p-6">Loading...</div>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">Dashboard</h1>
      <p className="mt-2">Your Balance: {balance} Coins</p>
      <div className="mt-4 flex gap-2">
        <button disabled={buying} onClick={() => handleBuyCoins(100)} className="bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50">Buy 100 Coins</button>
        <button disabled={buying} onClick={() => handleBuyCoins(500)} className="bg-indigo-600 text-white px-4 py-2 rounded disabled:opacity-50">Buy 500 Coins</button>
      </div>
      <h2 className="mt-6 text-xl font-semibold">Transaction History</h2>
      <div className="mt-2 overflow-x-auto">
        <table className="w-full border">
          <thead>
            <tr><th className="text-left p-2">Date</th><th className="text-left p-2">Type</th><th className="text-left p-2">Amount</th></tr>
          </thead>
          <tbody>
            {transactions.map((tx) => (
              <tr key={tx.id} className="border-t">
                <td className="p-2">{new Date(tx.created_at).toLocaleString()}</td>
                <td className="p-2">{tx.type}</td>
                <td className="p-2">{tx.amount}</td>
              </tr>
            ))}
            {transactions.length === 0 && (
              <tr><td className="p-2" colSpan={3}>No transactions yet.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}


