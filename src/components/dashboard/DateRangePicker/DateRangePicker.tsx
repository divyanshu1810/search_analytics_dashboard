import { Calendar, Download } from "lucide-react";
import "./DateRangePicker.css";
import toast, { Toaster } from "react-hot-toast";
import { SearchAnalyticsData } from "../../../types";

interface DateRangePickerProps {
  startDate: string;
  endDate: string;
  onDateChange: (start: string, end: string) => void;
  data: SearchAnalyticsData;
}

export const DateRangePicker: React.FC<DateRangePickerProps> = ({ 
  startDate, 
  endDate, 
  onDateChange,
  data,
}) => {
  const handleDownload = () => {
    if (!data || !data.topQueries) {
      console.warn('No data available for download');
      return;
    }

    try {
      const csvContent = convertToCSV(data.topQueries);
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      
      link.setAttribute('href', url);
      link.setAttribute('download', `search-analytics-${startDate}-to-${endDate}.csv`);
      link.style.visibility = 'hidden';
      
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      toast.success('CSV downloaded successfully!');
    } catch (error) {
      toast.error('Error downloading CSV:' + (error instanceof Error ? error.message : 'Unknown error'));
    }
  };

  const convertToCSV = (queries: any[]) => {
    if (!queries || queries.length === 0) {
      return 'No data available';
    }
    const headers = Object.keys(queries[0]);
    const csvHeaders = headers.join(',');
    const csvRows = queries.map(query => {
      return headers.map(header => {
        const value = query[header];
        if (typeof value === 'string' && (value.includes(',') || value.includes('"'))) {
          return `"${value.replace(/"/g, '""')}"`;
        }
        return value;
      }).join(',');
    });
    return [csvHeaders, ...csvRows].join('\n');
  };

  return (
    <div className="date-range-picker-container">
      <Toaster position="top-right" />
      <div className="date-range-inputs">
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
      
      <div className="download-section">
        <button
          onClick={handleDownload}
          disabled={!data || !data.topQueries || data.topQueries.length === 0}
          className="download-button"
          title="Download data as CSV"
        >
          <Download className="download-icon" />
          Download CSV
        </button>
      </div>
    </div>
  );
};