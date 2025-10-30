import { useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";

export default function ProtectedRoute({ children }: { children: JSX.Element }) {
  const [authorized, setAuthorized] = useState<boolean | null>(null);
  const location = useLocation();

  useEffect(() => {
    let mounted = true;
    fetch("/api/auth/me", { credentials: "include" })
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then(() => mounted && setAuthorized(true))
      .catch(() => mounted && setAuthorized(false));
    return () => {
      mounted = false;
    };
  }, []);

  if (authorized === null) return <div className="p-6">Loading...</div>;
  if (!authorized) return <Navigate to="/login" state={{ from: location }} replace />;
  return children;
}


