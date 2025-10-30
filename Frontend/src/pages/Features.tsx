import { Navigation } from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Play, BookOpen } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Features = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navigation />

      <main className="pt-28 pb-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-10">
            <h1 className="text-4xl md:text-5xl font-racing font-bold mb-3">Choose how you want to explore</h1>
            <p className="text-muted-foreground">Pick an option below to either jump straight into the game or learn how it works.</p>
          </div>

          <div className="max-w-4xl mx-auto grid gap-6 md:grid-cols-2">
            <Card className="p-6 flex flex-col items-start justify-between">
              <CardHeader className="p-0 mb-4">
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-md bg-accent/10">
                    <Play className="w-6 h-6 text-primary" />
                  </div>
                  <CardTitle className="text-2xl">Play Game</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <p className="text-muted-foreground mb-6">Jump straight into the game and experience the racing template in action.</p>
                <div className="flex items-center gap-3">
                 <a href="http://localhost:5173/"><Button variant="racing">Play Now</Button></a>
                  <Button variant="outline" onClick={() => navigate('/')}>Back Home</Button>
                </div>
              </CardContent>
            </Card>

            <Card className="p-6 flex flex-col items-start justify-between">
              <CardHeader className="p-0 mb-4">
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-md bg-accent/10">
                    <BookOpen className="w-6 h-6 text-primary" />
                  </div>
                  <CardTitle className="text-2xl">Learning</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <p className="text-muted-foreground mb-6">Read guides and tutorials to learn how to customize and extend the template.</p>
                <div className="flex items-center gap-3">
                  <Button variant="racing" onClick={() => navigate('/learn')}>Start Learning</Button>
                  <Button variant="outline" onClick={() => navigate('/')}>Back Home</Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Features;
