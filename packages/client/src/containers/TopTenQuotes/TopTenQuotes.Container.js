import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import './TopTenQuotes.Style.css';
import { apiURL } from '../../apiURL';
import { LoadingContainer } from '../LoadingContainer/LoadingContainer.Container';
import { ErrorContainer } from '../ErrorContainer/ErrorContainer.Container';

export const TopTenQuotes = () => {
  const [topTenQuotes, setTopTenQuotes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState();

  useEffect(() => {
    async function fetchTopTenQuotes() {
      setLoading(true);
      try {
        const response = await fetch(`${apiURL()}/quotes`);
        const allQuotes = await response.json();
        const responseAnalytics = await fetch(`${apiURL()}/analytics`);
        const quotesAnalytics = await responseAnalytics.json();

        const quotesWithAnalytics = allQuotes
          .map((quote) => ({
            ...quote,
            activeUsers: quotesAnalytics?.some(
              (e) => e.quoteId.toString() === quote.id.toString(),
            )
              ? quotesAnalytics
                  .filter(
                    (item) => item.quoteId.toString() === quote.id.toString(),
                  )
                  .map((item) => item.activeUsers)
                  .toString()
              : null,
          }))
          .filter((item) => item.activeUsers)
          .sort((a, b) => {
            return b.activeUsers - a.activeUsers;
          });

        const slicedQuotes = quotesWithAnalytics.slice(0, 10);
        setTopTenQuotes(slicedQuotes);
        setError(null);
      } catch (e) {
        setError({ message: e.message || 'An error occured' });
      }
      setLoading(false);
    }

    fetchTopTenQuotes();
  }, []);

  const quotesList = topTenQuotes.map((quote) => (
    <Link to={`../quotes/${quote.id}`}>
      <li>
        {quote.title} - {quote.authorFullName}
      </li>
    </Link>
  ));

  if (loading) {
    return <LoadingContainer />;
  }

  if (error) {
    return <ErrorContainer error={error} />;
  }

  return (
    <>
      <Helmet>
        <title>Top 10 quotes by views - motivately</title>
      </Helmet>
      <main className="standard-container">
        <header>
          <h1>Top 10 quotes</h1>
        </header>

        <ol className="list-top10">{quotesList}</ol>
      </main>
    </>
  );
};
