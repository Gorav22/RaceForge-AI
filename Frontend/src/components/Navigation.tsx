import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X, Zap, Coins, LogOut, User, CreditCard } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { LoginModal } from "@/components/Auth/LoginModal";
import { RegisterModal } from "@/components/Auth/RegisterModal";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

export const Navigation = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/");
    setIsMobileMenuOpen(false);
  };

  const navItems = ["Home", "Features", "Showcase", "Preview", "Pricing"];

  return (
    <>
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
                  href={item === "Home" ? "/" : item === "Features" ? "/features" : item === "Showcase" ? "/many-models" : item === "Preview" ? "/fedf" : `#${item.toLowerCase()}`}
                  onClick={(e) => {
                    if (item === "Features" || item === "Showcase" || item === "Preview") {
                      e.preventDefault();
                      navigate(item === "Features" ? "/features" : item === "Showcase" ? "/many-models" : "/fedf");
                    }
                  }}
                  className="text-muted-foreground hover:text-primary transition-colors font-medium"
                >
                  {item}
                </a>
              ))}
            </div>

            {/* Auth Section */}
            <div className="hidden md:flex items-center gap-4">
              {!isAuthenticated ? (
                <>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => setShowLoginModal(true)}
                  >
                    Login
                  </Button>
                  <Button 
                    variant="racing" 
                    size="sm"
                    onClick={() => setShowRegisterModal(true)}
                  >
                    Sign Up
                  </Button>
                </>
              ) : (
                <>
                  {/* Coin Balance */}
                  <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-accent/20 border border-accent/30">
                    <Coins className="w-4 h-4 text-accent" />
                    <span className="font-bold text-foreground">{user?.coinBalance || 0}</span>
                  </div>

                  {/* Buy Coins Button */}
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => navigate("/buy-coins")}
                  >
                    <CreditCard className="w-4 h-4 mr-2" />
                    Buy Coins
                  </Button>

                  {/* User Menu */}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <button className="flex items-center gap-2 hover:opacity-80 transition-opacity">
                        <Avatar className="w-8 h-8">
                          <AvatarFallback className="bg-gradient-red text-foreground">
                            {user?.username?.[0]?.toUpperCase() || "U"}
                          </AvatarFallback>
                        </Avatar>
                      </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-48">
                      <DropdownMenuItem onClick={() => navigate("/dashboard")}>
                        <User className="w-4 h-4 mr-2" />
                        Dashboard
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => navigate("/transactions")}>
                        <CreditCard className="w-4 h-4 mr-2" />
                        Transactions
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={handleLogout} className="text-red-600">
                        <LogOut className="w-4 h-4 mr-2" />
                        Logout
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </>
              )}
            </div>

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
                  <button
                    key={item}
                    onClick={() => {
                      if (item === "Features") {
                        navigate("/features");
                      } else if (item === "Showcase") {
                        navigate("/many-models");
                      } else if (item === "Preview") {
                        navigate("/fedf");
                      } else {
                        // navigate to hash on the index page
                        window.location.hash = item.toLowerCase();
                      }
                      setIsMobileMenuOpen(false);
                    }}
                    className="text-left text-muted-foreground hover:text-primary transition-colors font-medium py-2 w-full"
                  >
                    {item}
                  </button>
                ))}
                {!isAuthenticated ? (
                  <>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="w-full"
                      onClick={() => {
                        setShowLoginModal(true);
                        setIsMobileMenuOpen(false);
                      }}
                    >
                      Login
                    </Button>
                    <Button 
                      variant="racing" 
                      size="sm" 
                      className="w-full"
                      onClick={() => {
                        setShowRegisterModal(true);
                        setIsMobileMenuOpen(false);
                      }}
                    >
                      Sign Up
                    </Button>
                  </>
                ) : (
                  <>
                    <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-accent/20 border border-accent/30">
                      <Coins className="w-4 h-4 text-accent" />
                      <span className="font-bold text-foreground">{user?.coinBalance || 0} Coins</span>
                    </div>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="w-full"
                      onClick={() => {
                        navigate("/buy-coins");
                        setIsMobileMenuOpen(false);
                      }}
                    >
                      Buy Coins
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="w-full"
                      onClick={() => {
                        navigate("/dashboard");
                        setIsMobileMenuOpen(false);
                      }}
                    >
                      Dashboard
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="w-full"
                      onClick={() => {
                        navigate("/transactions");
                        setIsMobileMenuOpen(false);
                      }}
                    >
                      Transactions
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="w-full text-red-600"
                      onClick={handleLogout}
                    >
                      Logout
                    </Button>
                  </>
                )}
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Auth Modals */}
      <LoginModal 
        isOpen={showLoginModal} 
        onClose={() => setShowLoginModal(false)}
        onSwitchToRegister={() => {
          setShowLoginModal(false);
          setShowRegisterModal(true);
        }}
      />
      <RegisterModal 
        isOpen={showRegisterModal} 
        onClose={() => setShowRegisterModal(false)}
        onSwitchToLogin={() => {
          setShowRegisterModal(false);
          setShowLoginModal(true);
        }}
      />
    </>
  );
};
