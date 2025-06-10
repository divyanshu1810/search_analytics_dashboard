export interface SearchQuery {
  query: string;
  clicks: number;
  impressions: number;
  ctr: number;
  position: number;
}

export interface TimeSeriesData {
  date: string;
  clicks: number;
  impressions: number;
}

export interface SearchAnalyticsData {
  topQueries: SearchQuery[];
  timeSeries: TimeSeriesData[];
}

export interface GraphQLResponse {
  data: {
    searchAnalytics: SearchAnalyticsData;
  };
}

export type SortField = 'query' | 'clicks' | 'impressions' | 'ctr' | 'position';
export type SortDirection = 'asc' | 'desc';