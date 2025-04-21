import { useState, useEffect } from 'react';

export const useFetch = (fetchFn, initialValue) => {
  const [isFetching, setIsFetching] = useState();
  const [error, setError] = useState();
  const [fetchedData, setFetchedData] = useState(initialValue);

  useEffect(() => {
    const fetchData = async () => {
      setIsFetching(true);
      try {
        const data = await fetchFn();
        setFetchedData(data);
      } catch (e) {
        setError({ message: e.message || 'Failed to fetch data.' });
      }
      setIsFetching(false);
    };
    fetchData();
  }, [fetchFn]);

  return { isFetching, fetchedData, error };
};
