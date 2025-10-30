import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Coins, CreditCard, TrendingUp, ArrowRight } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useNavigate } from "react-router-dom";
import { Navigation } from "@/components/Navigation";

export default function Dashboard() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate("/");
    }
  }, [isAuthenticated, isLoading, navigate]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navigation />
      <div className="pt-32 pb-16 container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          {/* Welcome Section */}
          <div className="mb-12">
            <h1 className="text-5xl font-racing font-bold mb-4">
              Welcome back, <span className="text-primary">{user.username}</span>
            </h1>
            <p className="text-xl text-muted-foreground">
              Manage your coins and transactions
            </p>
          </div>

          {/* Coin Balance Card */}
          <Card className="mb-8 bg-gradient-racing border-primary">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-2">Total Balance</p>
                  <div className="flex items-center gap-3">
                    <div className="p-3 bg-accent/20 rounded-full">
                      <Coins className="w-8 h-8 text-accent" />
                    </div>
                    <div>
                      <h2 className="text-5xl font-racing text-4xl text-foreground">
                        {user.coinBalance}
                      </h2>
                      <p className="text-sm text-muted-foreground">Virtual Coins</p>
                    </div>
                  </div>
                </div>
                <Button 
                  size="lg" 
                  variant="racing"
                  onClick={() => navigate("/buy-coins")}
                >
                  <CreditCard className="w-5 h-5 mr-2" />
                  Buy Coins
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <div className="grid md:grid-cols-3 gap-6 mb-12">
            <Card className="hover:border-primary transition-colors cursor-pointer" onClick={() => navigate("/buy-coins")}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="w-5 h-5 text-primary" />
                  Purchase Coins
                </CardTitle>
                <CardDescription>Add more coins to your wallet</CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="ghost" className="w-full">
                  View Packages <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </CardContent>
            </Card>

            <Card className="hover:border-primary transition-colors cursor-pointer" onClick={() => navigate("/transactions")}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-primary" />
                  Transactions
                </CardTitle>
                <CardDescription>View your purchase history</CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="ghost" className="w-full">
                  View History <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </CardContent>
            </Card>

            <Card className="hover:border-primary transition-colors cursor-pointer">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Coins className="w-5 h-5 text-primary" />
                  Coin Usage
                </CardTitle>
                <CardDescription>Coming soon...</CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="ghost" className="w-full" disabled>
                  Coming Soon
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Account Info */}
          <Card>
            <CardHeader>
              <CardTitle>Account Information</CardTitle>
              <CardDescription>Your account details</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center py-2 border-b">
                  <span className="text-muted-foreground">Username</span>
                  <span className="font-bold">{user.username}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b">
                  <span className="text-muted-foreground">Email</span>
                  <span className="font-bold">{user.email}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b">
                  <span className="text-muted-foreground">Account Type</span>
                  <span className="font-bold capitalize">{user.role}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

