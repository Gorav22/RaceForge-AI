import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { CheckCircle, Coins, ArrowRight } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { Navigation } from "@/components/Navigation";
import { toast } from "sonner";

export default function PaymentSuccess() {
  const navigate = useNavigate();
  const { refreshUser } = useAuth();
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get("session_id");

  useEffect(() => {
    // Refresh user data to get updated coin balance
    if (sessionId) {
      setTimeout(() => {
        refreshUser();
        toast.success("Coins added to your account!");
      }, 1000);
    }
  }, [sessionId, refreshUser]);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navigation />
      <div className="pt-32 pb-16 container mx-auto px-4">
        <div className="max-w-2xl mx-auto text-center">
          <div className="flex justify-center mb-8">
            <div className="p-6 bg-green-500/20 rounded-full">
              <CheckCircle className="w-20 h-20 text-green-500" />
            </div>
          </div>
          
          <h1 className="text-5xl font-racing font-bold mb-4">
            Payment <span className="text-primary">Successful!</span>
          </h1>
          <p className="text-xl text-muted-foreground mb-8">
            Your virtual coins have been added to your account
          </p>

          <div className="bg-accent/10 border border-accent/30 rounded-lg p-6 mb-8">
            <div className="flex items-center justify-center gap-3 mb-4">
              <Coins className="w-8 h-8 text-accent" />
              <span className="text-2xl font-bold">Coins Purchased!</span>
            </div>
            <p className="text-muted-foreground">
              Your transaction has been processed and your coins should appear in your account shortly.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              variant="racing"
              size="lg"
              onClick={() => navigate("/dashboard")}
            >
              Go to Dashboard
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
            <Button
              variant="outline"
              size="lg"
              onClick={() => navigate("/transactions")}
            >
              View Transactions
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

