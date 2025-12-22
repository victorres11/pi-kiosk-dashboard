import { useState, useEffect, useCallback, useRef } from 'react';
import type { WidgetState } from '../types';

interface UseDataFetcherOptions<T> {
  fetchFn: () => Promise<T>;
  refreshInterval: number;
  enabled?: boolean;
}

export function useDataFetcher<T>({
  fetchFn,
  refreshInterval,
  enabled = true,
}: UseDataFetcherOptions<T>): WidgetState<T> & { refetch: () => void } {
  const [state, setState] = useState<WidgetState<T>>({
    data: null,
    loading: true,
    error: null,
    lastUpdated: null,
  });

  const lastGoodDataRef = useRef<T | null>(null);

  const fetchData = useCallback(async () => {
    if (!enabled) return;

    setState((prev) => ({ ...prev, loading: true }));

    try {
      const data = await fetchFn();
      lastGoodDataRef.current = data;
      setState({
        data,
        loading: false,
        error: null,
        lastUpdated: new Date(),
      });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch data';
      setState((prev) => ({
        // Keep last good data if available
        data: lastGoodDataRef.current || prev.data,
        loading: false,
        error: errorMessage,
        lastUpdated: prev.lastUpdated,
      }));
    }
  }, [fetchFn, enabled]);

  // Initial fetch
  useEffect(() => {
    if (enabled) {
      fetchData();
    }
  }, [enabled]); // Only run on mount and when enabled changes

  // Set up refresh interval
  useEffect(() => {
    if (!enabled || refreshInterval <= 0) return;

    const intervalId = setInterval(fetchData, refreshInterval);
    return () => clearInterval(intervalId);
  }, [fetchData, refreshInterval, enabled]);

  return { ...state, refetch: fetchData };
}
