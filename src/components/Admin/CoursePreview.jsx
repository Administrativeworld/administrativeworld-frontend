import PropTypes from 'prop-types';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BadgeCheck, Check } from "lucide-react";

const CoursePreview = ({
  thumbnail,
  courseName,
  courseDescription,
  price,
  category,
  whatYouWillLearn,
  tag,
  instructions,
  couponCode
}) => {
  // Parse price to number
  const numericPrice = parseFloat(price);

  // Split whatYouWillLearn string into array by commas
  const learningPoints = whatYouWillLearn.split(',').map(item => item.trim());

  // Ensure instructions is a string
  const instructionText = Array.isArray(instructions) ? instructions.join(", ") : instructions;

  // Ensure tags is an array
  const tags = Array.isArray(tag) ? tag : [tag];

  return (
    <Card className="w-full border-none shadow-none  transition-shadow duration-300">
      {/* Thumbnail */}
      <div className='text-center p-3 flex flex-row items-center justify-center gap-2'><BadgeCheck /><span className='text-2xl font-mediumb'> Your Course will look like this</span></div>
      <div className="relative w-full p-5 overflow-hidden">
        <img
          src={thumbnail}
          alt={courseName}
          className="w-full rounded-md h-full object-cover"
        />
        {tags.map((tagItem, index) => (
          <Badge key={index} className="absolute top-4 right-4">
            {tagItem}
          </Badge>
        ))}
      </div>

      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-xl font-bold line-clamp-2">
              {courseName}
            </CardTitle>
            <Badge variant="outline" className="mt-2">
              {category}
            </Badge>
          </div>
          <div className="text-right">
            <span className="text-2xl font-bold">
              ₹ {numericPrice.toFixed(2)}
            </span>
          </div>
        </div>
        <CardDescription className="mt-2 line-clamp-2">
          {courseDescription}
        </CardDescription>
      </CardHeader>

      <CardContent>
        <div className="space-y-4">
          <div>
            <h4 className="font-semibold mb-2">What you&apos;ll learn:</h4>
            <ul className="space-y-2">
              {learningPoints.map((item, index) => (
                <li key={index} className="flex items-start">
                  <Check className="h-5 w-5 mr-2 text-green-500 flex-shrink-0" />
                  <span className="text-sm">{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-2">Instructions:</h4>
            <p className="text-sm text-gray-600">
              {instructionText}
            </p>
          </div>
        </div>
      </CardContent>

      {couponCode && (
        <CardFooter>
          <div className="w-full">
            <p className="text-sm font-medium">Coupon Code:</p>
            <code className="block w-full p-2 mt-1 border rounded text-center">
              {couponCode}
            </code>
          </div>
        </CardFooter>
      )}
    </Card>
  );
};

// Updated PropTypes
CoursePreview.propTypes = {
  thumbnail: PropTypes.string.isRequired,
  courseName: PropTypes.string.isRequired,
  courseDescription: PropTypes.string.isRequired,
  price: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  category: PropTypes.string.isRequired,
  whatYouWillLearn: PropTypes.string.isRequired,
  tag: PropTypes.oneOfType([PropTypes.string, PropTypes.array]).isRequired,
  instructions: PropTypes.oneOfType([PropTypes.string, PropTypes.array]).isRequired,
  couponCode: PropTypes.string
};

export default CoursePreview;
