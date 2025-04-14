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
import { extractMeaningfulWords } from '../../utils/extractMeaningfulWords';

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

const defaultColors = [
  '#252525',
  '#8acf00',
  '#3498db',
  '#e74c3c',
  '#f39c12',
  '#9b59b6',
];

const defaultFontColors = ['#ffffff', '#cccccc', '#000000'];
export const BlogView = () => {
  const { user } = useUserContext();
  const { slug } = useParams();
  const [blog, setBlog] = useState({});
  useEffect(() => {
    async function fetchSingleBlog(blogId) {
      const response = await fetch(`${apiURL()}/blogs/${blogId}`);
      const data = await response.json();
      setBlog(data);
    }

    fetchSingleBlog(slug);
  }, [slug]);

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
