import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { XCircle, ArrowLeft } from "lucide-react";
import { Navigation } from "@/components/Navigation";

export default function PaymentCancel() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navigation />
      <div className="pt-32 pb-16 container mx-auto px-4">
        <div className="max-w-2xl mx-auto text-center">
          <div className="flex justify-center mb-8">
            <div className="p-6 bg-red-500/20 rounded-full">
              <XCircle className="w-20 h-20 text-red-500" />
            </div>
          </div>
          
          <h1 className="text-5xl font-racing font-bold mb-4">
            Payment <span className="text-red-500">Cancelled</span>
          </h1>
          <p className="text-xl text-muted-foreground mb-8">
            Your payment was cancelled. No charges were made.
          </p>

          <div className="bg-accent/10 border border-accent/30 rounded-lg p-6 mb-8">
            <p className="text-muted-foreground">
              You can try again anytime or browse our packages to find the perfect option for you.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              variant="racing"
              size="lg"
              onClick={() => navigate("/buy-coins")}
            >
              Try Again
            </Button>
            <Button
              variant="outline"
              size="lg"
              onClick={() => navigate("/dashboard")}
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Back to Dashboard
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

