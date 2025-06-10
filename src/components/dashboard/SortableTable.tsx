import { useState } from "react";
import { SearchQuery, SortDirection, SortField } from "../../types";
import "./SortableTable.css";

export const SortableTable: React.FC<{
  data: SearchQuery[];
  onRowClick: (query: SearchQuery) => void;
  selectedQuery?: SearchQuery;
}> = ({ data, onRowClick, selectedQuery }) => {
  const [sortField, setSortField] = useState<SortField>('clicks');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');

  const sortedData = [...data].sort((a, b) => {
    const aValue = a[sortField];
    const bValue = b[sortField];
    
    if (typeof aValue === 'string' && typeof bValue === 'string') {
      return sortDirection === 'asc' 
        ? aValue.localeCompare(bValue)
        : bValue.localeCompare(aValue);
    }
    
    return sortDirection === 'asc' 
      ? (aValue as number) - (bValue as number)
      : (bValue as number) - (aValue as number);
  });

  const handleSort = (field: SortField) => {
    if (field === sortField) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  const getSortIcon = (field: SortField) => {
    if (field !== sortField) return '↕️';
    return sortDirection === 'asc' ? '↑' : '↓';
  };

  return (
    <div className="table-container">
      <div className="table-wrapper">
        <table className="sortable-table">
          <thead className="table-header">
            <tr>
              {[
                { key: 'query' as SortField, label: 'Query' },
                { key: 'clicks' as SortField, label: 'Clicks' },
                { key: 'impressions' as SortField, label: 'Impressions' },
                { key: 'ctr' as SortField, label: 'CTR (%)' },
                { key: 'position' as SortField, label: 'Position' }
              ].map(({ key, label }) => (
                <th
                  key={key}
                  onClick={() => handleSort(key)}
                  className="table-header-cell"
                >
                  <div className="header-content">
                    {label}
                    <span className="sort-icon">{getSortIcon(key)}</span>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="table-body">
            {sortedData.map((query, index) => (
              <tr
                key={index}
                onClick={() => onRowClick(query)}
                className={`table-row ${
                  selectedQuery?.query === query.query ? 'selected' : ''
                }`}
              >
                <td className="table-cell query-cell">
                  {query.query}
                </td>
                <td className="table-cell">
                  {query.clicks.toLocaleString()}
                </td>
                <td className="table-cell">
                  {query.impressions.toLocaleString()}
                </td>
                <td className="table-cell">
                  {query.ctr.toFixed(1)}%
                </td>
                <td className="table-cell">
                  {query.position.toFixed(1)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};