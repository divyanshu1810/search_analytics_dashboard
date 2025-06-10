import { Bar, BarChart, CartesianGrid, Cell, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import "./OverViewCharts.css";
import { SearchQuery } from "../../../../types";

export const OverviewCharts: React.FC<{ data: SearchQuery[] }> = ({ data }) => {
  const topQueries = data.slice(0, 8);
  const pieData = topQueries.map((query, index) => ({
    name: query.query.length > 20 ? query.query.substring(0, 20) + '...' : query.query,
    value: query.clicks,
    color: `hsl(${index * 45}, 70%, 60%)`
  }));

  return (
    <div className="overview-charts-grid">
      <div className="chart-container">
        <h3 className="chart-title">Top Queries by Clicks</h3>
        <div className="chart-wrapper">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={topQueries}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis 
                dataKey="query" 
                tick={{ fontSize: 10, fill: '#9CA3AF' }}
                angle={-45}
                textAnchor="end"
                height={100}
                interval={0}
                axisLine={{ stroke: '#4B5563' }}
              />
              <YAxis tick={{ fill: '#9CA3AF' }} axisLine={{ stroke: '#4B5563' }} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#1F2937', 
                  border: '1px solid #374151',
                  borderRadius: '6px',
                  color: '#F3F4F6'
                }}
              />
              <Bar dataKey="clicks" fill="#3B82F6" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="chart-container">
        <h3 className="chart-title">Clicks Distribution</h3>
        <div className="chart-wrapper">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                outerRadius={80}
                dataKey="value"
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#1F2937', 
                  border: '1px solid #374151',
                  borderRadius: '6px',
                  color: '#F3F4F6'
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};