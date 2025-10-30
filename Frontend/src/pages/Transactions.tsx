import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { useNavigate } from "react-router-dom";
import { paymentAPI } from "@/services/api";
import { toast } from "sonner";
import { Navigation } from "@/components/Navigation";
import { Loader2, Coins, CheckCircle, XCircle, Clock } from "lucide-react";

interface Transaction {
  _id: string;
  type: string;
  amount: number;
  coins: number;
  status: string;
  packageName?: string;
  createdAt: string;
}

export default function Transactions() {
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      navigate("/");
    }
  }, [isAuthenticated, authLoading, navigate]);

  useEffect(() => {
    if (isAuthenticated) {
      fetchTransactions();
    }
  }, [isAuthenticated]);

  const fetchTransactions = async () => {
    setIsLoading(true);
    try {
      const response = await paymentAPI.getTransactions();
      if (response.success) {
        setTransactions(response.data.transactions);
      }
    } catch (error: any) {
      toast.error("Failed to load transactions");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'failed':
        return <XCircle className="w-5 h-5 text-red-500" />;
      case 'pending':
        return <Clock className="w-5 h-5 text-yellow-500" />;
      default:
        return <Clock className="w-5 h-5 text-gray-500" />;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (isLoading || authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navigation />
      <div className="pt-32 pb-16 container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-5xl font-racing font-bold mb-4">
              Transaction <span className="text-primary">History</span>
            </h1>
            <p className="text-xl text-muted-foreground">
              View all your coin purchases and transactions
            </p>
          </div>

          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Coins className="w-5 h-5" />
                  Your Transactions
                </CardTitle>
                <Button variant="racing" onClick={() => navigate("/buy-coins")}>Buy Coins</Button>
              </div>
            </CardHeader>
            <CardContent>
              {transactions.length === 0 ? (
                <div className="text-center py-12">
                  <Coins className="w-16 h-16 text-muted-foreground mx-auto mb-4 opacity-50" />
                  <p className="text-muted-foreground">No transactions yet</p>
                  <p className="text-sm text-muted-foreground mt-2">
                    Your purchase history will appear here
                  </p>
                  <div className="mt-6">
                    <Button variant="racing" onClick={() => navigate("/buy-coins")}>Buy Coins</Button>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  {transactions.map((transaction) => (
                    <div
                      key={transaction._id}
                      className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent/10 transition-colors"
                    >
                      <div className="flex items-center gap-4">
                        {getStatusIcon(transaction.status)}
                        <div>
                          <div className="font-semibold">
                            {transaction.packageName || 'Coin Purchase'}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {formatDate(transaction.createdAt)}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-accent">
                          +{transaction.coins} Coins
                        </div>
                        <div className="text-sm text-muted-foreground">
                          ${transaction.amount.toFixed(2)}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

