import { useEffect, useState } from 'react';
import { portfolioApi } from '../api/client.js';

export function usePortfolioData() {
  const [data, setData] = useState({
    profile: null,
    projects: [],
    experience: [],
    stack: [],
    testimonials: [],
    metrics: [],
    now: [],
    ticker: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const [profile, projects, experience, stack, testimonials, metrics, now, ticker] =
          await Promise.all([
            portfolioApi.profile.get().catch(() => null),
            portfolioApi.projects.list().catch(() => []),
            portfolioApi.experience.list().catch(() => []),
            portfolioApi.stack.list().catch(() => []),
            portfolioApi.testimonials.list().catch(() => []),
            portfolioApi.metrics.list().catch(() => []),
            portfolioApi.now.list().catch(() => []),
            portfolioApi.ticker.list().catch(() => []),
          ]);
        if (cancelled) return;
        setData({ profile, projects, experience, stack, testimonials, metrics, now, ticker });
      } catch (e) {
        if (!cancelled) setError(e);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, []);

  return { data, loading, error };
}
