import { Card, CardContent, } from "../ui/card";
import { Button } from "../ui/button";
import { adminCourseCardData } from "@/configs/Site";
import { useNavigate } from "react-router-dom";

function CoursesList() {
  const navigate = useNavigate();
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-wrap justify-center gap-4">
        {adminCourseCardData.map((card, index) => (
          <Card key={index} className="flex flex-col items-center p-4 shadow-lg w-full sm:w-1/2 md:w-1/3 lg:w-1/4">
            <CardContent className="flex flex-col items-center gap-3">
              <img src={card.imgSrc} alt={card.altText} className="w-36 object-cover" />
              <Button className="w-full mt-4" onClick={() => navigate(card.path)}>
                {card.buttonText} {card.icon}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

export default CoursesList;
