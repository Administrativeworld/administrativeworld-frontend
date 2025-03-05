import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle2 } from "lucide-react";

const features = [
  {
    item: "Easily Accessible",
    des: "Study at your own pace with easily accessible online materials."
  },
  {
    item: "Personalized Learning Plans",
    des: "Stay on track with customized plans designed for your success."
  },
  {
    item: "Expert Guidance",
    des: "Learn from top educators with years of experience."
  },
  {
    item: "Interactive Learning",
    des: "Engaging quizzes and discussions for deeper understanding."
  }
];

function SerivisesFeatures() {
  return (
    <section className="w-full py-10 px-6 md:px-12 lg:px-20 bg-background">
      <div className="text-center mb-8">
        <h2 className="text-3xl md:text-4xl font-bold text-primary">
          Premium UPSC Learning Experience
        </h2>
        <p className="text-muted-foreground mt-2 text-lg">
          Unlock a world of knowledge with our top-tier features.
        </p>
      </div>

      {/* Features Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6">
        {features.map((feature, index) => (
          <Card key={index} className="bg-secondary shadow-lg hover:shadow-xl transition-shadow duration-300">
            <CardContent className="p-5 flex items-start space-x-4">
              <CheckCircle2 className="text-primary w-8 h-8 flex-shrink-0" />
              <div>
                <h5 className="text-xl font-semibold text-foreground">{feature.item}</h5>
                <p className="text-muted-foreground text-sm">{feature.des}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}

export default SerivisesFeatures;
