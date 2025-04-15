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

import { getDateFromTimestamp } from '../../utils/getDateFromTimestamp';

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
} from '@fortawesome/free-brands-svg-icons';
import {
  FacebookShareButton,
  TwitterShareButton,
  LinkedinShareButton,
  EmailShareButton,
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
            <Markdown>{blog.content}</Markdown>
            <footer>
              <p>
                Published{' '}
                <time dateTime={blog?.created_at}>
                  {getDateFromTimestamp(blog?.created_at)}
                </time>{' '}
                by <strong>{blog?.userFullName?.split(' ')[0]}</strong>
              </p>
            </footer>
          </article>
        </main>
      </div>
    </>
  );
};
