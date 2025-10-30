export type User = { id: number; email: string; name?: string };

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
      message = body?.error || message;
    } catch {}
    throw new Error(message);
  }
  return res.json();
}

export async function signup(data: { email: string; password: string; name?: string }) {
  return api<{ user: User }>("/api/auth/signup", { method: "POST", body: JSON.stringify(data) });
}

export async function login(data: { email: string; password: string }) {
  return api<{ user: User }>("/api/auth/login", { method: "POST", body: JSON.stringify(data) });
}

export async function me() {
  return api<{ user: User }>("/api/auth/me");
}

export async function logout() {
  return api<{ ok: boolean }>("/api/auth/logout", { method: "POST" });
}



