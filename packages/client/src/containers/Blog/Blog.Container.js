/* eslint-disable import/no-extraneous-dependencies */
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

  const cardItems = blogs.map((blog) => {
    return (
      <Link to={`../blog/${blog.slug}`} className="card-blog">
        <h2>{blog.title}</h2>
        {blog.summary && (
          <div className="blog-preview">{`${blog.summary}`}</div>
        )}
        <div className="date">{getDateFromTimestamp(blog.created_at)}</div>
      </Link>
    );
  });

  return (
    <>
      <Helmet>
        <title>Blog - motivately</title>
        <meta name="description" content="motivately blog" />
      </Helmet>
      {/* <div className="hero"></div> */}
      <div className="container-blog">
        <header>
          <h1>Blog</h1>
        </header>
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
        <section className="container-cards container-cards-blog">
          {cardItems}
        </section>
      </div>
    </>
  );
};
