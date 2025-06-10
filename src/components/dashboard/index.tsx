import { useState } from "react";
import { SearchQuery } from "../../types";
import { useSearchAnalytics } from "../../hooks/useSearchAnalytics";
import { DateRangePicker } from "./DateRangePicker/DateRangePicker";
import { MetricCards } from "./MetricCards/MetricCards";
import { SearchFilter } from "./SearchFilter/SearchFilter";
import { SortableTable } from "./SortableTable/SortableTable";
import { DetailChart } from "./charts/DetailChart/DetailChart";
import { Activity, BarChart3, Filter, TrendingUp } from "lucide-react";
import "./index.css";

export const SearchAnalyticsDashboard: React.FC = () => {
  const [startDate, setStartDate] = useState(() => {
    const date = new Date();
    date.setDate(date.getDate() - 30);
    return date.toISOString().split('T')[0];
  });
  
  const [endDate, setEndDate] = useState(() => {
    return new Date().toISOString().split('T')[0];
  });
  
  const [queryFilter, setQueryFilter] = useState('');
  const [selectedQuery, setSelectedQuery] = useState<SearchQuery | undefined>();
  const [activeTab, setActiveTab] = useState<'overview' | 'table' | 'details'>('overview');

  const { data, loading, error } = useSearchAnalytics(startDate, endDate, queryFilter);

  const handleDateChange = (start: string, end: string) => {
    setStartDate(start);
    setEndDate(end);
    setSelectedQuery(undefined);
  };

  const handleRowClick = (query: SearchQuery) => {
    setSelectedQuery(query);
    setActiveTab('details');
  };

  if (loading) {
    return (
      <div className="dashboard-container">
        <div className="loading-state">
          <Activity className="loading-spinner" />
          <span className="loading-text">Loading analytics...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="dashboard-container">
        <div className="error-state">
          <div className="error-message">{error}</div>
          <button 
            onClick={() => window.location.reload()}
            className="retry-button"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      <div className="main-content">
        <div className="header-section">
          <h1 className="main-title">Search Analytics Dashboard</h1>
          <p className="subtitle">Monitor and analyze your search performance metrics</p>
        </div>

        <div className="date-picker-section">
          <DateRangePicker
            startDate={startDate}
            endDate={endDate}
            onDateChange={handleDateChange}
          />
        </div>

        {data && (
          <div className="metrics-section">
            <MetricCards data={data.topQueries} />
          </div>
        )}

        <div className="tabs-section">
          <div className="tabs-container">
            <nav className="tabs-nav">
              {[
                { key: 'overview', label: 'Overview', icon: BarChart3 },
                { key: 'table', label: 'Query Table', icon: Filter },
                { key: 'details', label: 'Query Details', icon: TrendingUp }
              ].map(({ key, label, icon: Icon }) => (
                <button
                  key={key}
                  onClick={() => setActiveTab(key as any)}
                  className={`tab-button ${activeTab === key ? 'active' : ''}`}
                >
                  <Icon className="tab-icon" />
                  {label}
                </button>
              ))}
            </nav>
          </div>
        </div>

        {data && (
          <div className="content-section">
            

            {activeTab === 'table' && (
              <>
                <div className="search-filter-wrapper">
                  <SearchFilter value={queryFilter} onChange={setQueryFilter} />
                </div>
                <SortableTable
                  data={data.topQueries}
                  onRowClick={handleRowClick}
                  selectedQuery={selectedQuery}
                />
              </>
            )}

            {activeTab === 'details' && selectedQuery && (
              <DetailChart
                data={data.timeSeries}
                selectedQuery={selectedQuery}
              />
            )}

            {activeTab === 'details' && !selectedQuery && (
              <div className="empty-state">
                <TrendingUp className="empty-state-icon" />
                <h3 className="empty-state-title">No Query Selected</h3>
                <p className="empty-state-description">Select a query from the table to view detailed performance metrics.</p>
                <button
                  onClick={() => setActiveTab('table')}
                  className="empty-state-button"
                >
                  Go to Query Table
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};