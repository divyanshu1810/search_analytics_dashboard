import { Calendar } from "lucide-react";
import "./DateRangePicker.css";

export const DateRangePicker: React.FC<{
  startDate: string;
  endDate: string;
  onDateChange: (start: string, end: string) => void;
}> = ({ startDate, endDate, onDateChange }) => {
  return (
    <div className="date-range-picker-container">
      <div className="date-input-group">
        <Calendar className="calendar-icon" />
        <label className="date-label">Start Date:</label>
        <input
          type="date"
          value={startDate}
          onChange={(e) => onDateChange(e.target.value, endDate)}
          className="date-input"
        />
      </div>
      <div className="date-input-group">
        <Calendar className="calendar-icon" />
        <label className="date-label">End Date:</label>
        <input
          type="date"
          value={endDate}
          onChange={(e) => onDateChange(startDate, e.target.value)}
          className="date-input"
        />
      </div>
    </div>
  );
};