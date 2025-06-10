import { renderHook, waitFor } from '@testing-library/react';
import { useSearchAnalytics } from '../../hooks/useSearchAnalytics';

jest.mock('../../types', () => ({
}));

describe('useSearchAnalytics Hook', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });

  test('returns initial loading state', () => {
    const { result } = renderHook(() => 
      useSearchAnalytics('2024-01-01', '2024-01-31', '')
    );
    expect(result.current.loading).toBe(true);
    expect(result.current.data).toBe(null);
    expect(result.current.error).toBe(null);
  });

  test('loads data successfully and updates state', async () => {
    const { result } = renderHook(() => 
      useSearchAnalytics('2024-01-01', '2024-01-31', '')
    );
    jest.advanceTimersByTime(1000);
    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });
    expect(result.current.data).not.toBe(null);
    expect(result.current.error).toBe(null);
    expect(result.current.data?.topQueries).toHaveLength(20);
    expect(result.current.data?.timeSeries).toBeDefined();
  });

  test('returns correct data structure', async () => {
    const { result } = renderHook(() => 
      useSearchAnalytics('2024-01-01', '2024-01-31', '')
    );
    jest.advanceTimersByTime(1000);
    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });
    const data = result.current.data;
    expect(data).toHaveProperty('topQueries');
    expect(data).toHaveProperty('timeSeries');
    const firstQuery = data?.topQueries[0];
    expect(firstQuery).toHaveProperty('query');
    expect(firstQuery).toHaveProperty('clicks');
    expect(firstQuery).toHaveProperty('impressions');
    expect(firstQuery).toHaveProperty('ctr');
    expect(firstQuery).toHaveProperty('position');
    const firstTimePoint = data?.timeSeries[0];
    expect(firstTimePoint).toHaveProperty('date');
    expect(firstTimePoint).toHaveProperty('clicks');
    expect(firstTimePoint).toHaveProperty('impressions');
  });

  test('filters queries based on queryFilter parameter', async () => {
    const { result } = renderHook(() => 
      useSearchAnalytics('2024-01-01', '2024-01-31', 'react')
    );
    jest.advanceTimersByTime(1000);
    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });
    const data = result.current.data;
    expect(data?.topQueries.length).toBeGreaterThan(0);
    data?.topQueries.forEach(query => {
      expect(query.query.toLowerCase()).toContain('react');
    });
  });

  test('returns empty results when no queries match filter', async () => {
    const { result } = renderHook(() => 
      useSearchAnalytics('2024-01-01', '2024-01-31', 'nonexistentquery')
    );
    jest.advanceTimersByTime(1000);
    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });
    const data = result.current.data;
    expect(data?.topQueries).toHaveLength(0);
  });

  test('generates correct number of time series data points', async () => {
    const startDate = '2024-01-01';
    const endDate = '2024-01-05';
    const { result } = renderHook(() => 
      useSearchAnalytics(startDate, endDate, '')
    );
    jest.advanceTimersByTime(1000);
    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });
    const data = result.current.data;
    expect(data?.timeSeries).toHaveLength(5);
  });

  test('refetches data when parameters change', async () => {
    const { result, rerender } = renderHook(
      ({ startDate, endDate, queryFilter }) => 
        useSearchAnalytics(startDate, endDate, queryFilter),
      {
        initialProps: {
          startDate: '2024-01-01',
          endDate: '2024-01-31',
          queryFilter: ''
        }
      }
    );
    jest.advanceTimersByTime(1000);
    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });
    const initialData = result.current.data;
    rerender({
      startDate: '2024-01-01',
      endDate: '2024-01-31',
      queryFilter: 'react'
    });
    expect(result.current.loading).toBe(true);
    jest.advanceTimersByTime(1000);
    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });
    const newData = result.current.data;
    expect(newData).not.toEqual(initialData);
    expect(newData?.topQueries.length).toBeLessThan(initialData?.topQueries.length || 0);
  });

  test('handles date range changes correctly', async () => {
    const { result, rerender } = renderHook(
      ({ startDate, endDate }) => 
        useSearchAnalytics(startDate, endDate, ''),
      {
        initialProps: {
          startDate: '2024-01-01',
          endDate: '2024-01-02'
        }
      }
    );
    jest.advanceTimersByTime(1000);
    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });
    const shortRangeData = result.current.data;
    expect(shortRangeData?.timeSeries).toHaveLength(2); // 2 days
    rerender({
      startDate: '2024-01-01',
      endDate: '2024-01-10'
    });
    jest.advanceTimersByTime(1000);
    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });
    const longRangeData = result.current.data;
    expect(longRangeData?.timeSeries).toHaveLength(10); // 10 days
  });

  test('time series data has valid date format', async () => {
    const { result } = renderHook(() => 
      useSearchAnalytics('2024-01-01', '2024-01-03', '')
    );
    jest.advanceTimersByTime(1000);
    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });
    const data = result.current.data;
    data?.timeSeries.forEach(point => {
      expect(point.date).toMatch(/^\d{4}-\d{2}-\d{2}$/);
      const date = new Date(point.date);
      expect(date.toString()).not.toBe('Invalid Date');
      expect(typeof point.clicks).toBe('number');
      expect(typeof point.impressions).toBe('number');
      expect(point.clicks).toBeGreaterThanOrEqual(0);
      expect(point.impressions).toBeGreaterThanOrEqual(0);
    });
  });

  test('query data has valid numeric values', async () => {
    const { result } = renderHook(() => 
      useSearchAnalytics('2024-01-01', '2024-01-31', '')
    );
    jest.advanceTimersByTime(1000);
    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });
    const data = result.current.data;
    data?.topQueries.forEach(query => {
      expect(typeof query.clicks).toBe('number');
      expect(typeof query.impressions).toBe('number');
      expect(typeof query.ctr).toBe('number');
      expect(typeof query.position).toBe('number');
      expect(query.clicks).toBeGreaterThanOrEqual(0);
      expect(query.impressions).toBeGreaterThanOrEqual(0);
      expect(query.ctr).toBeGreaterThanOrEqual(0);
      expect(query.position).toBeGreaterThan(0);
      expect(typeof query.query).toBe('string');
      expect(query.query.length).toBeGreaterThan(0);
    });
  });
});