import React, { useEffect, useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import './Blog.Style.css';
import { apiURL } from '../../apiURL';
import { CardCategories } from '../../components/CardCategories/CardCategories.component';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import { Button } from '../../components/Button/Button.component';
// eslint-disable-next-line import/no-extraneous-dependencies
import Markdown from 'markdown-to-jsx';
import { getDateFromTimestamp } from '../../utils/getDateFromTimestamp';

export const Blog = () => {
  const [searchTerms, setSearchTerms] = useState();
  const [resultsHome, setResultsHome] = useState([]);
  const [blogs, setBlogs] = useState([]);
  const [showAppsBy, setShowAppsBy] = useState('alphabet');

  useEffect(() => {
    async function fetchBlogs() {
      const response = await fetch(`${apiURL()}/blogs/`);
      const data = await response.json();
      setBlogs(data);
    }
    fetchBlogs();
  }, []);

  // const filteredApps = useMemo(() => {
  //   // if (showAppsBy === 'topics') {
  //   //   const topicsAndApps = apps.reduce((acc, d) => {
  //   //     const found = acc.find((a) => a.topicId === d.topic_id);
  //   //     /* const value = { name: d.name, val: d.value }; */
  //   //     const value = {
  //   //       id: d.id,
  //   //       title: d.title,
  //   //     }; // the element in data property
  //   //     if (!found) {
  //   //       /* acc.push(...value); */
  //   //       acc.push({
  //   //         topicId: d.topic_id,
  //   //         topicTitle: d.topicTitle,
  //   //         apps: [value],
  //   //       }); // not found, so need to add data property
  //   //     } else {
  //   //       /* acc.push({ name: d.name, data: [{ value: d.value }, { count: d.count }] }); */
  //   //       found.apps.push(value); // if found, that means data property exists, so just push new element to found.data.
  //   //     }
  //   //     return acc;
  //   //   }, []);
  //   //   return topicsAndApps
  //   //     .map((item) => {
  //   //       return {
  //   //         ...item,
  //   //         apps: item.apps.sort((a, b) => a.title.localeCompare(b.title)),
  //   //       };
  //   //     })
  //   //     .sort((a, b) => a.topicTitle.localeCompare(b.topicTitle));
  //   // }
  //   const obj = authors
  //     ?.sort((a, b) => a.fullName?.localeCompare(b.fullName))
  //     .reduce((acc, c) => {
  //       const letter = c?.fullName[0];
  //       acc[letter] = (acc[letter] || []).concat({
  //         id: c.id,
  //         title: c.fullName,
  //       });
  //       return acc;
  //     }, {});

  //   return Object.entries(obj).map(([letter, appTitles]) => {
  //     return { letter, appTitles };
  //   });
  // }, [authors]);

  const cardItems = blogs.map((blog) => (
    <Link to={`../blogs/${blog.slug}`} className="card-blog">
      <h2>{blog.title}</h2>
      <div className="blog-preview">{`${blog.content.slice(0, 200)}...`}</div>
      <div className="date">{getDateFromTimestamp(blog.created_at)}</div>
    </Link>
  ));

  return (
    <main>
      <Helmet>
        <title>Blog - motivately</title>
        <meta name="description" content="motivately blog" />
      </Helmet>
      {/* <div className="hero"></div> */}
      <div className="hero">
        <h1 className="hero-header">Blog</h1>
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
      <section className="container-cards-blog">{cardItems}</section>
    </main>
  );
};
