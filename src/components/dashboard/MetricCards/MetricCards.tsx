import { BarChart3, Eye, MousePointer, TrendingUp } from "lucide-react";
import { SearchQuery } from "../../../types";
import "./MetricCards.css";

export const MetricCards: React.FC<{ data: SearchQuery[] }> = ({ data }) => {
  const totalClicks = data.reduce((sum, query) => sum + query.clicks, 0);
  const totalImpressions = data.reduce((sum, query) => sum + query.impressions, 0);
  const avgCTR = data.length > 0 ? data.reduce((sum, query) => sum + query.ctr, 0) / data.length : 0;
  const avgPosition = data.length > 0 ? data.reduce((sum, query) => sum + query.position, 0) / data.length : 0;

  const metrics = [
    { title: 'Total Clicks', value: totalClicks.toLocaleString(), icon: MousePointer, color: 'blue' },
    { title: 'Total Impressions', value: totalImpressions.toLocaleString(), icon: Eye, color: 'emerald' },
    { title: 'Average CTR', value: `${avgCTR.toFixed(1)}%`, icon: TrendingUp, color: 'purple' },
    { title: 'Average Position', value: avgPosition.toFixed(1), icon: BarChart3, color: 'orange' }
  ];

  return (
    <div className="metrics-grid">
      {metrics.map((metric) => {
        return (
          <div key={metric.title} className="metric-card">
            <div className="metric-content">
              <div className="metric-text">
                <p className="metric-title">{metric.title}</p>
                <p className="metric-value">{metric.value}</p>
              </div>
              <div className={`metric-icon-container ${metric.color}`}>
                <metric.icon className="metric-icon" />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};