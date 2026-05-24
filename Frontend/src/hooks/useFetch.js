import { useState, useEffect, useCallback } from 'react';
import { getErrorMessage } from '../utils/helpers';

export default function useFetch(apiFn, deps = []) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async (...args) => {
    try {
      setLoading(true);
      setError(null);
      const res = await apiFn(...args);
      setData(res.data);
      return res.data;
    } catch (err) {
      const msg = getErrorMessage(err);
      setError(msg);
      return null;
    } finally {
      setLoading(false);
    }
  }, [apiFn]);

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  return { data, loading, error, refetch: fetchData };
}
