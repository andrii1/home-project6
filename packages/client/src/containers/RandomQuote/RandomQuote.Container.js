import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import './RandomQuote.Style.css';
import { apiURL } from '../../apiURL';

export const RandomQuote = () => {
  const [quote, setQuote] = useState({});

  useEffect(() => {
    async function fetchRandomQuote() {
      const response = await fetch(`${apiURL()}/quotes/random`);
      const data = await response.json();
      setQuote(data);
    }

    fetchRandomQuote();
  }, []);
  return (
    <>
      <Helmet>
        <title>Random quote - motivately</title>
      </Helmet>
      <main className="container-standard">
        <header>
          <h1>Random quote</h1>
        </header>

        <h2>
          {quote.title} - {quote.authorFullName}
        </h2>
      </main>
    </>
  );
};
