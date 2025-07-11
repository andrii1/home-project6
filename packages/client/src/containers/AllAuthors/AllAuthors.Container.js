import React, { useEffect, useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import './AllAuthors.Style.css';
import { apiURL } from '../../apiURL';
import { CardCategories } from '../../components/CardCategories/CardCategories.component';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import { Button } from '../../components/Button/Button.component';
import { fetchAuthors } from '../../utils/http';
import { useFetch } from '../../utils/hooks/useFetch';
import { LoadingContainer } from '../LoadingContainer/LoadingContainer.Container';
import { ErrorContainer } from '../ErrorContainer/ErrorContainer.Container';

export const AllAuthors = () => {
  const [searchTerms, setSearchTerms] = useState();
  const [resultsHome, setResultsHome] = useState([]);
  const [showAppsBy, setShowAppsBy] = useState('alphabet');
  const {
    isFetching: loading,
    fetchedData: authors,
    error,
  } = useFetch(fetchAuthors, []);

  const filteredApps = useMemo(() => {
    // if (showAppsBy === 'topics') {
    //   const topicsAndApps = apps.reduce((acc, d) => {
    //     const found = acc.find((a) => a.topicId === d.topic_id);
    //     /* const value = { name: d.name, val: d.value }; */
    //     const value = {
    //       id: d.id,
    //       title: d.title,
    //     }; // the element in data property
    //     if (!found) {
    //       /* acc.push(...value); */
    //       acc.push({
    //         topicId: d.topic_id,
    //         topicTitle: d.topicTitle,
    //         apps: [value],
    //       }); // not found, so need to add data property
    //     } else {
    //       /* acc.push({ name: d.name, data: [{ value: d.value }, { count: d.count }] }); */
    //       found.apps.push(value); // if found, that means data property exists, so just push new element to found.data.
    //     }
    //     return acc;
    //   }, []);
    //   return topicsAndApps
    //     .map((item) => {
    //       return {
    //         ...item,
    //         apps: item.apps.sort((a, b) => a.title.localeCompare(b.title)),
    //       };
    //     })
    //     .sort((a, b) => a.topicTitle.localeCompare(b.topicTitle));
    // }
    const obj = authors
      ?.sort((a, b) => a.fullName?.localeCompare(b.fullName))
      .reduce((acc, c) => {
        const letter = c?.fullName[0]?.toUpperCase();
        acc[letter] = (acc[letter] || []).concat({
          id: c.id,
          title: c.fullName,
        });
        return acc;
      }, {});

    return Object.entries(obj).map(([letter, appTitles]) => {
      return { letter, appTitles };
    });
  }, [authors]);

  const cardItems = filteredApps.map((item) => {
    if (Object.keys(item).includes('letter'))
      return (
        <CardCategories
          title={item.letter}
          topics={item.appTitles}
          slug="author"
          itemKey="id"
        />
      );
    return (
      <CardCategories title={item.fullName} topics={item.apps} slug="author" />
    );
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
        <title>Find quotes by authors - motivately</title>
        <meta name="description" content="Find best quotes" />
      </Helmet>
      {/* <div className="hero"></div> */}
      <div className="hero">
        <h1 className="hero-header">All authors</h1>
      </div>
      {/* <div className="container-apps-sort">
        <Link
          className={showAppsBy === 'alphabet' ? '' : 'apps-sort-underline'}
          onClick={() => setShowAppsBy('alphabet')}
        >
          By alphabet
        </Link>
        <Link
          className={showAppsBy === 'topics' ? '' : 'apps-sort-underline'}
          onClick={() => setShowAppsBy('topics')}
        >
          By topics
        </Link>
      </div> */}
      <section className="container-cards">{cardItems}</section>
    </main>
  );
};
