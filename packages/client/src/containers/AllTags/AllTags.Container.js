import React, { useEffect, useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import './AllTags.Style.css';
import { apiURL } from '../../apiURL';
import { CardCategories } from '../../components/CardCategories/CardCategories.component';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import { Button } from '../../components/Button/Button.component';
import { fetchTags } from '../../utils/http';
import { useFetch } from '../../utils/hooks/useFetch';
import { LoadingContainer } from '../LoadingContainer/LoadingContainer.Container';
import { ErrorContainer } from '../ErrorContainer/ErrorContainer.Container';

export const AllTags = () => {
  const [searchTerms, setSearchTerms] = useState();
  const [resultsHome, setResultsHome] = useState([]);
  const [showAppsBy, setShowAppsBy] = useState('alphabet');
  const {
    isFetching: loading,
    fetchedData: tags,
    error,
  } = useFetch(fetchTags, []);

  const filteredTags = useMemo(() => {
    const obj = tags
      ?.sort((a, b) => a.title?.localeCompare(b.title))
      .reduce((acc, c) => {
        const letter = c?.title[0];
        acc[letter] = (acc[letter] || []).concat({
          id: c.id,
          title: c.title,
          slug: c.slug,
        });
        return acc;
      }, {});

    return Object.entries(obj).map(([letter, appTitles]) => {
      return { letter, appTitles };
    });
  }, [tags]);

  const cardItems = filteredTags.map((item) => {
    if (Object.keys(item).includes('letter'))
      return (
        <CardCategories
          title={item.letter}
          topics={item.appTitles}
          itemKey="slug"
          slug="tag"
        />
      );
    return <CardCategories title={item.title} topics={item.apps} slug="tag" />;
  });

  if (loading) {
    return <LoadingContainer />;
  }

  if (error) {
    return <ErrorContainer error={error} />;
  }

  return (
    <main>
      <Helmet>
        <title>Find quotes by tags - motivately</title>
        <meta name="description" content="Find best quotes" />
      </Helmet>
      {/* <div className="hero"></div> */}
      <div className="hero">
        <h1 className="hero-header">All tags</h1>
      </div>
      <section className="container-cards">{cardItems}</section>
    </main>
  );
};
