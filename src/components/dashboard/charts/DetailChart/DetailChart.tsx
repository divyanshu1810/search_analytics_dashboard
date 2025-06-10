import { CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { SearchQuery, TimeSeriesData } from "../../../../types";
import "./DetailChart.css";

export const DetailChart: React.FC<{
  data: TimeSeriesData[];
  selectedQuery: SearchQuery;
}> = ({ data, selectedQuery }) => {
  return (
    <div className="detail-chart-container">
      <h3 className="detail-chart-title">
        Performance for "{selectedQuery.query}"
      </h3>
      <div className="chart-wrapper">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis 
              dataKey="date" 
              tick={{ fontSize: 12, fill: '#9CA3AF' }}
              angle={-45}
              textAnchor="end"
              height={60}
              axisLine={{ stroke: '#4B5563' }}
            />
            <YAxis tick={{ fontSize: 12, fill: '#9CA3AF' }} axisLine={{ stroke: '#4B5563' }} />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: '#1F2937', 
                border: '1px solid #374151',
                borderRadius: '6px',
                color: '#F3F4F6'
              }}
            />
            <Legend />
            <Line 
              type="monotone" 
              dataKey="clicks" 
              stroke="#3B82F6" 
              strokeWidth={2}
              dot={{ r: 4, fill: '#3B82F6' }}
            />
            <Line 
              type="monotone" 
              dataKey="impressions" 
              stroke="#10B981" 
              strokeWidth={2}
              dot={{ r: 4, fill: '#10B981' }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};