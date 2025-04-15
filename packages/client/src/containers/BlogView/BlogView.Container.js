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

  useEffect(() => {
    async function fetchSingleBlog(blogSlug) {
      const response = await fetch(`${apiURL()}/blogs/${blogSlug}`);
      const data = await response.json();
      setBlog(data[0]);
    }

    fetchSingleBlog(slugParam);
  }, [slugParam]);

  const readTime = getEstimatedReadTime(blog?.content);

  console.log(slugParam);
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
            <Markdown>{blog.content}</Markdown>
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
      </div>
    </>
  );
};
