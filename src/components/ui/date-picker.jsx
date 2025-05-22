import PropTypes from "prop-types";
import { Input } from "@/components/ui/input";
import { Calendar } from "lucide-react"; // Optional, if you want a calendar icon

// A reusable DatePicker component
const DatePicker = ({ value, onChange, placeholder, className }) => {
  const handleDateChange = (e) => {
    const dateValue = e.target.value;
    const formattedDate = formatDate(dateValue); // Convert to DD.MM.YYYY format
    onChange(formattedDate); // Pass the selected date to the parent component
  };

  const formatDate = (date) => {
    const [year, month, day] = date.split("-");
    return `${day}.${month}.${year}`; // Converts YYYY-MM-DD to DD.MM.YYYY
  };

  return (
    <div className="relative">
      <Input
        type="date"
        value={value}
        onChange={handleDateChange}
        placeholder={placeholder}
        className={`w-full ${className}`} // You can extend styles with className prop
      />
      {/* Optional Calendar icon */}
      <span className="absolute top-1/2 right-2 transform -translate-y-1/2 text-gray-400">
        <Calendar className="w-4 h-4" />
      </span>
    </div>
  );
};

// Prop validation for DatePicker
DatePicker.propTypes = {
  value: PropTypes.string.isRequired, // Expecting the value to be in the 'DD.MM.YYYY' format
  onChange: PropTypes.func.isRequired, // Expecting a function to handle date changes
  placeholder: PropTypes.string, // Optional placeholder text
  className: PropTypes.string, // Optional className for styling
};

export default DatePicker;
