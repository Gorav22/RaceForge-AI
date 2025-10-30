type Transaction = { id: string; user_id: number; type: string; amount: number; method?: string | null; created_at: string };

async function api<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(path, {
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    ...options,
  });
  if (!res.ok) {
    let message = "Request failed";
    try {
      const body = await res.json();
      message = (body as any)?.error || message;
    } catch {}
    throw new Error(message);
  }
  return res.json();
}

export async function getWallet() {
  return api<{ balance: number }>("/api/wallet");
}

export async function getTransactions() {
  return api<{ transactions: Transaction[] }>("/api/transactions");
}

export async function createCheckoutSession(amount: number) {
  return api<{ id: string; url?: string }>("/api/payment/create-checkout-session", {
    method: "POST",
    body: JSON.stringify({ amount }),
  });
}

export async function confirmCheckoutSuccess(sessionId: string) {
  return api<{ ok: boolean; balance: number; transactionId: string }>(`/api/payment/success?session_id=${encodeURIComponent(sessionId)}`);
}


