import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

type Tx = { id: string; type: string; amount: number; created_at: string; method?: string | null };

export default function Transactions() {
  const [transactions, setTransactions] = useState<Tx[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const navigate = useNavigate();

  useEffect(() => {
    let mounted = true;
    fetch("/api/transactions", { credentials: "include" })
      .then(async (r) => (r.ok ? r.json() : Promise.reject()))
      .then((data) => {
        if (!mounted) return;
        setTransactions(data.transactions || []);
      })
      .catch(() => navigate("/login"))
      .finally(() => mounted && setLoading(false));
    return () => {
      mounted = false;
    };
  }, [navigate]);

  if (loading) return <div className="p-6">Loading...</div>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">Transactions</h1>
      <div className="mt-4 overflow-x-auto">
        <table className="w-full border">
          <thead>
            <tr><th className="text-left p-2">Date</th><th className="text-left p-2">Type</th><th className="text-left p-2">Amount</th><th className="text-left p-2">Method</th></tr>
          </thead>
          <tbody>
            {transactions.map((tx) => (
              <tr key={tx.id} className="border-t">
                <td className="p-2">{new Date(tx.created_at).toLocaleString()}</td>
                <td className="p-2">{tx.type}</td>
                <td className="p-2">{tx.amount}</td>
                <td className="p-2">{tx.method || ""}</td>
              </tr>
            ))}
            {transactions.length === 0 && (
              <tr><td className="p-2" colSpan={4}>No transactions yet.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}


