import { useCallback, useEffect, useState } from 'react';
import { apiURL } from '../../apiURL';

export const useRatings = (user) => {
  const [ratings, setRatings] = useState([]);
  const [allRatings, setAllRatings] = useState([]);

  const fetchAllRatings = useCallback(async () => {
    const url = `${apiURL()}/ratings`;
    const response = await fetch(url);
    const ratingsData = await response.json();
    setAllRatings(ratingsData);
  }, []);

  const fetchRatings = useCallback(async () => {
    if (!user?.uid) return;
    const url = `${apiURL()}/ratings`;
    const response = await fetch(url, {
      headers: {
        token: `token ${user.uid}`,
      },
    });
    const ratingsData = await response.json();
    setRatings(Array.isArray(ratingsData) ? ratingsData : []);
  }, [user]);

  useEffect(() => {
    fetchAllRatings();
  }, [fetchAllRatings]);

  useEffect(() => {
    fetchRatings();
  }, [fetchRatings]);

  const addRating = async (quoteId) => {
    const response = await fetch(`${apiURL()}/ratings`, {
      method: 'POST',
      headers: {
        token: `token ${user?.uid}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ quote_id: quoteId }),
    });
    if (response.ok) {
      fetchRatings();
      fetchAllRatings();
    }
  };

  const deleteRating = async (quoteId) => {
    const response = await fetch(`${apiURL()}/ratings/${quoteId}`, {
      method: 'DELETE',
      headers: {
        token: `token ${user?.uid}`,
        'Content-Type': 'application/json',
      },
    });
    if (response.ok) {
      fetchRatings();
      fetchAllRatings();
    }
  };

  return {
    ratings,
    allRatings,
    addRating,
    deleteRating,
  };
};
