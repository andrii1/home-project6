import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import './DayQuote.Style.css';
import { apiURL } from '../../apiURL';

export const QuoteOfTheDay = () => {
  const [quote, setQuote] = useState({});

  useEffect(() => {
    async function fetchRandomQuote() {
      const response = await fetch(`${apiURL()}/quotes/day-quote`);
      const data = await response.json();
      setQuote(data);
    }

    fetchRandomQuote();
  }, []);
  return (
    <>
      <Helmet>
        <title>Quote of the day - motivately</title>
      </Helmet>
      <main className="container-standard">
        <header>
          <h1>Quote of the day</h1>
        </header>

        <h2>
          {quote.title} - {quote.authorFullName}
        </h2>
      </main>
    </>
  );
};
