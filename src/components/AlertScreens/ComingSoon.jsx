import { Card, CardContent } from "@/components/ui/card";
import { Loader2 } from "lucide-react";

export default function ComingSoon() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-background text-foreground p-4">
      <Card className="w-full max-w-md text-center shadow-lg">
        <CardContent className="p-6">
          <div className="flex justify-center mb-4">
            {/* Placeholder for Logo */}
            <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center">
              <span className="text-lg font-bold">
                <img src="/android-chrome-192x192.png" alt="" />
              </span>
            </div>
          </div>
          <h1 className="text-2xl font-semibold">Administrative World</h1>
          <p className="text-muted-foreground mt-2">We're launching soon. Stay tuned!</p>
          <div className="mt-4 flex justify-center">
            {/* <Loader2 className="w-6 h-6 animate-spin text-primary" /> */}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
