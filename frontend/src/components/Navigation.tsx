import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";
import { useMemo } from "react";
import { Menu, X, Zap } from "lucide-react";

export const Navigation = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [balance, setBalance] = useState<number | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navItems = ["Features", "Showcase", "Preview", "Pricing"];
  const [user, setUser] = useState<{ email: string; name?: string } | null>(null);

  useEffect(() => {
    let mounted = true;
    fetch("/api/auth/me", { credentials: "include" })
      .then(async (r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (!mounted) return;
        setUser(data?.user || null);
      })
      .catch(() => {});
    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    if (!user) { setBalance(null); return; }
    let mounted = true;
    fetch("/api/wallet", { credentials: "include" })
      .then(async (r) => (r.ok ? r.json() : null))
      .then((data) => { if (mounted) setBalance(data?.balance ?? null); })
      .catch(() => {})
    return () => { mounted = false; };
  }, [user]);

  const onLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST", credentials: "include" });
    } finally {
      setUser(null);
      window.location.href = "/";
    }
  };

  const DashboardLink = useMemo(() => (
    user ? (
      <div className="flex items-center gap-4">
        <Link to="/dashboard" className="text-sm underline">Dashboard</Link>
        <Link to="/transactions" className="text-sm underline">Transactions</Link>
        <button onClick={() => navigate("/buy-coins")} className="text-sm bg-primary text-primary-foreground px-3 py-1 rounded-md">Buy Coins</button>
        <div className="text-sm bg-white/20 px-3 py-1 rounded-full">💰 {balance ?? 0}</div>
      </div>
    ) : null
  ), [user, balance, navigate]);

  return (
    <nav 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled 
          ? "backdrop-blur-lg bg-background/90 border-b border-border shadow-lg" 
          : "bg-transparent"
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-red flex items-center justify-center">
              <Zap className="w-6 h-6 text-foreground" />
            </div>
            <span className="text-2xl font-racing font-bold text-foreground">
              F1 <span className="text-primary">DESIGN</span>
            </span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {navItems.map((item) => (
              <a
                key={item}
                href={`#${item.toLowerCase()}`}
                className="text-muted-foreground hover:text-primary transition-colors font-medium"
              >
                {item}
              </a>
            ))}
            {DashboardLink}
            {user ? (
              <div className="flex items-center gap-3">
                <span className="text-sm text-muted-foreground">{user.name || user.email}</span>
                <Button variant="outline" size="sm" onClick={onLogout}>Logout</Button>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link to="/login" className="text-sm underline">Log in</Link>
                <Link to="/signup">
                  <Button variant="racing" size="sm">Sign up</Button>
                </Link>
          </div>
            )}
          </div>

          {/* CTA placeholder removed; auth controls are shown above */}

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 text-foreground"
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden py-4 backdrop-blur-lg bg-background/95 border-t border-border">
            <div className="flex flex-col gap-4">
              {navItems.map((item) => (
                <a
                  key={item}
                  href={`#${item.toLowerCase()}`}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="text-muted-foreground hover:text-primary transition-colors font-medium py-2"
                >
                  {item}
                </a>
              ))}
              {DashboardLink}
              {user ? (
                <Button variant="outline" size="sm" className="w-full" onClick={onLogout}>Logout</Button>
              ) : (
                <div className="flex gap-3">
                  <Link to="/login" className="flex-1">
                    <Button variant="outline" size="sm" className="w-full" onClick={() => setIsMobileMenuOpen(false)}>Log in</Button>
                  </Link>
                  <Link to="/signup" className="flex-1">
                    <Button variant="racing" size="sm" className="w-full" onClick={() => setIsMobileMenuOpen(false)}>Sign up</Button>
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};
