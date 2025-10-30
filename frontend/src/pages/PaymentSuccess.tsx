import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { confirmCheckoutSuccess } from "@/lib/wallet";

export default function PaymentSuccess() {
  const [status, setStatus] = useState<string>("Verifying payment...");
  const [search] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    const sessionId = search.get("session_id");
    if (!sessionId) {
      setStatus("Missing session id");
      const t = setTimeout(() => navigate("/dashboard"), 1200);
      return () => clearTimeout(t);
    }
    (async () => {
      try {
        await confirmCheckoutSuccess(sessionId);
        setStatus("Payment confirmed! Updating your balance...");
        setTimeout(() => navigate("/dashboard"), 800);
      } catch (_e) {
        setStatus("Could not verify payment.");
        setTimeout(() => navigate("/dashboard"), 1200);
      }
    })();
  }, [navigate, search]);

  return <div className="p-6">{status}</div>;
}


