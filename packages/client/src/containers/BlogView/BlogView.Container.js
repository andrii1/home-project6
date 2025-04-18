/* eslint-disable no-await-in-loop */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable no-nested-ternary */
import React, { useEffect, useState, useCallback, useRef } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import './BlogView.Style.css';
import { Button } from '../../components/Button/Button.component';
import { Badge } from '../../components/Badge/Badge.component';
import { Card } from '../../components/Card/Card.component';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Modal from '../../components/Modal/Modal.Component';
import iconCopy from '../../assets/images/icons8-copy-24.png';
// eslint-disable-next-line import/no-extraneous-dependencies
import Markdown from 'markdown-to-jsx';
import logo from '../../assets/images/logo.png';

import { getDateFromTimestamp } from '../../utils/getDateFromTimestamp';
import { getEstimatedReadTime } from '../../utils/getEstimatedReadTime';

import {
  faEnvelope,
  faLink,
  faCaretUp,
  faArrowUpRightFromSquare,
  faHeart as faHeartSolid,
} from '@fortawesome/free-solid-svg-icons';
import {
  faFacebookF,
  faTwitter,
  faLinkedinIn,
  faPinterest,
} from '@fortawesome/free-brands-svg-icons';
import {
  PinterestShareButton,
  FacebookShareButton,
  TwitterShareButton,
  LinkedinShareButton,
  EmailShareButton,
  FacebookShareCount,
  PinterestShareCount,
} from 'react-share';
import appImage from '../../assets/images/app-placeholder.svg';
import { faHeart } from '@fortawesome/free-regular-svg-icons';

import { apiURL } from '../../apiURL';

import { useUserContext } from '../../userContext';

export const BlogView = () => {
  const { user } = useUserContext();
  const { slugParam } = useParams();
  const [blog, setBlog] = useState({});
  const [similarBlogs, setSimilarBlogs] = useState([]);

  useEffect(() => {
    async function fetchSingleBlog(blogSlug) {
      const response = await fetch(`${apiURL()}/blogs/${blogSlug}`);
      const data = await response.json();
      setBlog(data[0]);
    }

    fetchSingleBlog(slugParam);
  }, [slugParam]);

  const readTime = getEstimatedReadTime(blog?.content);

  const cardItems = similarBlogs.map((item) => (
    <Link to={`../blog/${item.slug}`} className="card-blog">
      <h2>{item.title}</h2>
      <div className="blog-preview">{`${item.content.slice(0, 200)}...`}</div>
      <div className="date">{getDateFromTimestamp(item.created_at)}</div>
    </Link>
  ));

  console.log(blog);

  return (
    <>
      <Helmet>
        <title>{blog.title}</title>
        <meta name="description" content="motivately blog" />
      </Helmet>
      <div className="container-single-blog">
        <header>
          <h1>{blog.title}</h1>
        </header>
        <main>
          <article>
            <p>{readTime} min read</p>
            <Markdown
              options={{
                overrides: {
                  img: {
                    props: {
                      className: 'image-single-blog',
                    },
                  },
                  a: {
                    props: {
                      target: '_blank',
                      rel: 'noopener noreferrer',
                    },
                  },
                  p: {
                    props: {
                      className: 'quote-title',
                    },
                  },
                },
              }}
            >
              {blog.content}
            </Markdown>

            <div className="images-blog-container">
              <div>
                <Link to={`../quotes/3`} target="_blank">
                  <img
                    src="https://motivately1.s3.amazonaws.com/quotes/3.png"
                    alt="text"
                    className="image-single-blog"
                  />
                </Link>
                <p>
                  "You just gotta keep going and fighting for everything, and
                  one day you'll get to where you want. - Naomi Osaka"
                </p>
              </div>
              <div>
                <Link to={`../quotes/3`} target="_blank">
                  <img
                    src="https://motivately1.s3.amazonaws.com/quotes/3.png"
                    alt="text"
                    className="image-single-blog"
                  />
                </Link>
                <p>
                  "You just gotta keep going and fighting for everything, and
                  one day you'll get to where you want. - Naomi Osaka"
                </p>
              </div>
            </div>
            <footer>
              <p>
                Published{' '}
                <time dateTime={blog?.created_at}>
                  {getDateFromTimestamp(blog?.created_at)}
                </time>{' '}
                by <strong>{blog?.userFullName?.split(' ')[0]}</strong>
              </p>
              <div className="icons-apps-page">
                <span>Share it: </span>
                <FontAwesomeIcon
                  icon={faLink}
                  className="button-copy"
                  onClick={() => {
                    navigator.clipboard.writeText(
                      `https://www.motivately.co/blog/${blog.slug}`,
                    );
                  }}
                />
                <PinterestShareButton
                  media={logo}
                  description={blog.meta_description || ''}
                >
                  <FontAwesomeIcon className="share-icon" icon={faPinterest} />
                </PinterestShareButton>
                <FacebookShareButton
                  url={`https://www.motivately.co/blog/${blog.slug}`}
                >
                  <FontAwesomeIcon className="share-icon" icon={faFacebookF} />
                </FacebookShareButton>
                <TwitterShareButton
                  url={`https://www.motivately.co/blog/${blog.slug}`}
                  title={`'${blog.title}'`}
                  hashtags={['quotes', 'inspirational']}
                >
                  <FontAwesomeIcon className="share-icon" icon={faTwitter} />
                </TwitterShareButton>
                <LinkedinShareButton
                  url={`https://www.motivately.co/blog/${blog.slug}`}
                >
                  <FontAwesomeIcon className="share-icon" icon={faLinkedinIn} />
                </LinkedinShareButton>
                <EmailShareButton
                  subject="Check out this blog!"
                  body={`It is so inspirational: '${blog.title}'`}
                  url={`https://www.motivately.co/blog/${blog.slug}`}
                >
                  <FontAwesomeIcon icon={faEnvelope} />
                </EmailShareButton>
              </div>
              <div>
                <FacebookShareCount
                  url={`https://www.motivately.co/blog/${blog.slug}`}
                >
                  {(shareCount) => (
                    <span className="myShareCountWrapper">{shareCount}</span>
                  )}
                </FacebookShareCount>
                <PinterestShareCount
                  url={`https://www.motivately.co/blog/${blog.slug}`}
                >
                  {(shareCount) =>
                    shareCount > 0 && (
                      <span className="myShareCountWrapper">{shareCount}</span>
                    )
                  }
                </PinterestShareCount>
              </div>
            </footer>
          </article>
        </main>
        {similarBlogs.length > 0 && (
          <div className="container-alternatives">
            <h3>🔎 Similar to {blog.title}</h3>
            <div className="container-cards small-cards">{cardItems}</div>
          </div>
        )}
      </div>
    </>
  );
};
