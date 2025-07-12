import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import './TopTenQuotes.Style.css';
import { apiURL } from '../../apiURL';

export const TopTenQuotes = () => {
  const [topTenQuotes, setTopTenQuotes] = useState([]);

  useEffect(() => {
    async function fetchTopTenQuotes() {
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
    }

    fetchTopTenQuotes();
  }, []);

  const quotesList = topTenQuotes.map((quote) => (
    <li>
      {quote.title} - {quote.authorFullName}
    </li>
  ));
  return (
    <>
      <Helmet>
        <title>Top 10 quotes by views - motivately</title>
      </Helmet>
      <main className="container-standard">
        <header>
          <h1>Top 10 quotes</h1>
        </header>

        <ol className="list-top10">{quotesList}</ol>
      </main>
    </>
  );
};
