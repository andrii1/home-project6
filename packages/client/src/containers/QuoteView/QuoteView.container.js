/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable no-nested-ternary */
import React, { useEffect, useState, useCallback, useRef } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { Button } from '../../components/Button/Button.component';
import { Badge } from '../../components/Badge/Badge.component';
import { Card } from '../../components/Card/Card.component';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Modal from '../../components/Modal/Modal.Component';
import iconCopy from '../../assets/images/icons8-copy-24.png';
import Markdown from 'markdown-to-jsx';
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
import './QuoteView.styles.css';
import { useUserContext } from '../../userContext';

const searches = [
  { id: 1, title: 'ai tool' },
  { id: 2, title: 'avatar creator' },
  {
    id: 3,
    title: 'ai music',
  },
];

const alternativeApps = [
  {
    id: 1,
    title: '10web',
    description:
      'Create a website using AI Website Builder,\nhost it on 10Web Hosting, and optimize it with\nPageSpeed Booster.',
    rating: null,
    topic_id: 6,
    url: 'https://10web.io',
    pricing_type: 'Paid with free trial',
    url_x: 'https://twitter.com/10Web_io',
    url_discord: null,
    url_app_store: null,
    url_google_play_store: null,
    url_chrome_extension: null,
    url_small_screenshot: 'Free',
    url_large_screenshot: null,
    user_id: null,
    created_at: '2023-10-13T08:43:58.072Z',
    topicTitle: 'Website builders',
    category_id: 4,
    categoryTitle: 'Engineering & Development',
  },
  {
    id: 2,
    title: 'TLDV',
    description:
      'Short for "too long; didn\'t view."\n\nThis AI platform saves you time by taking meeting notes for you.\n\nSit back and relax as tl;dv transcribes and summarizes your calls automatically.',
    rating: null,
    topic_id: 17,
    url: 'https://tldv.io',
    pricing_type: 'Paid with free plan',
    url_x: 'https://twitter.com/tldview?lang=en',
    url_discord: null,
    url_app_store: null,
    url_google_play_store: null,
    url_chrome_extension:
      'https://chrome.google.com/webstore/detail/record-transcribe-chatgpt/lknmjhcajhfbbglglccadlfdjbaiifig',
    url_small_screenshot: 'Paid with a free plan',
    url_large_screenshot: null,
    user_id: null,
    created_at: '2023-10-13T08:43:58.083Z',
    topicTitle: 'Meetings',
    category_id: 1,
    categoryTitle: 'Work & Productivity',
  },
  {
    id: 3,
    title: 'Klap',
    description:
      'Turn videos into viral shorts\nGet ready-to-publish TikToks, Reels, Shorts from YouTube videos in a click',
    rating: null,
    topic_id: 7,
    url: 'https://klap.app',
    pricing_type: 'Paid',
    url_x: 'https://twitter.com/tldview?lang=en',
    url_discord: null,
    url_app_store: null,
    url_google_play_store: null,
    url_chrome_extension: null,
    url_small_screenshot: 'Paid with a free trial',
    url_large_screenshot: null,
    user_id: null,
    created_at: '2023-10-13T08:43:58.088Z',
    topicTitle: 'Video',
    category_id: 2,
    categoryTitle: 'Marketing & Sales',
  },
];

const defaultColors = [
  '#252525',
  '#8acf00',
  '#3498db',
  '#e74c3c',
  '#f39c12',
  '#9b59b6',
];

const defaultFontColors = ['#ffffff', '#cccccc'];

export const QuoteView = () => {
  const { id } = useParams();
  const [openModal, setOpenModal] = useState(false);
  const [modalTitle, setModalTitle] = useState('');
  const [favorites, setFavorites] = useState([]);
  const navigate = useNavigate();
  const [quote, setQuote] = useState({});
  const [similarApps, setSimilarApps] = useState([]);
  const [comments, setComments] = useState([]);
  const [error, setError] = useState('');
  const { user } = useUserContext();
  const [validForm, setValidForm] = useState(false);
  const [invalidForm, setInvalidForm] = useState(false);
  const [comment, setComment] = useState('');
  const [allRatings, setAllRatings] = useState([]);
  const [ratings, setRatings] = useState([]);
  const [openConfirmationModal, setOpenConfirmationModal] = useState(false);
  const [color, setColor] = useState('#252525');
  const [colorPickerSelected, setColorPickerSelected] = useState(false);
  const [fontColor, setFontColor] = useState('#ffffff');
  const [fontColorPickerSelected, setFontColorPickerSelected] = useState(false);
  const [imageDataUrl, setImageDataUrl] = useState('');
  const [images, setImages] = useState([]);
  const [selectedImage, setSelectedImage] = useState('');
  const canvasRef = useRef(null);
  useEffect(() => {
    async function fetchSingleQuote(quoteId) {
      const response = await fetch(`${apiURL()}/quotes/${quoteId}`);
      const appResponse = await response.json();
      setQuote(appResponse[0]);
    }

    fetchSingleQuote(id);
  }, [id]);

  useEffect(() => {
    async function fetchSimilarApps() {
      const response = await fetch(
        `${apiURL()}/quotes?page=0&column=id&direction=desc&filteredTopics=${
          quote.topic_id
        }`,
      );
      const appsResponse = await response.json();
      const similarAppsArray = appsResponse.data.filter(
        (item) => item.id !== quote.id,
      );
      setSimilarApps(similarAppsArray);
    }

    fetchSimilarApps();
  }, [quote.topic_id, quote.id]);

  const fetchCommentsByAppId = useCallback(async (quoteId) => {
    const response = await fetch(`${apiURL()}/comments?quoteId=${quoteId}`);
    const commentResponse = await response.json();
    setComments(commentResponse);
  }, []);

  useEffect(() => {
    fetchCommentsByAppId(id);
  }, [fetchCommentsByAppId, id]);

  const navigateBack = () => {
    navigate(-1);
  };

  const addComment = async (commentContent) => {
    const response = await fetch(`${apiURL()}/comments`, {
      method: 'POST',
      headers: {
        token: `token ${user?.uid}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        content: commentContent,
        app_id: id,
      }),
    });
    if (response.ok) {
      fetchCommentsByAppId(id);
    }
  };

  const commentHandler = (event) => {
    setComment(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!comment) {
      setError('Comment is required!');
      setInvalidForm(true);
      setValidForm(false);
      return;
    }
    if (comment.trim().length < 5) {
      setError('Comment must be more than five characters!');
      setInvalidForm(true);
      setValidForm(false);
      return;
    }

    setInvalidForm(false);
    setValidForm(true);
    addComment(comment);
    setOpenConfirmationModal(true);
    setComment('');
  };
  const getOnlyYearMonthDay = (dateString) => {
    const date = new Date(dateString);
    return date.toISOString().split('T')[0];
  };

  const cardItems = similarApps.map((item) => {
    // const relatedTopics = topics
    //   .filter((topic) => topic.categoryId === category.id)
    //   .map((item) => item.id);
    return (
      <Card
        id={item.id}
        title={item.title}
        description={item.description}
        url={item.url}
        urlImage={item.url_image}
        topic={item.topicTitle}
        pricingType={item.pricing_type}
        smallCard
      />
    );
  });

  const fetchFavorites = useCallback(async () => {
    const url = `${apiURL()}/favorites`;
    const response = await fetch(url, {
      headers: {
        token: `token ${user?.uid}`,
      },
    });
    const favoritesData = await response.json();

    if (Array.isArray(favoritesData)) {
      setFavorites(favoritesData);
    } else {
      setFavorites([]);
    }
  }, [user]);

  useEffect(() => {
    fetchFavorites();
  }, [fetchFavorites]);

  const addFavorite = async (quoteId) => {
    const response = await fetch(`${apiURL()}/favorites`, {
      method: 'POST',
      headers: {
        token: `token ${user?.uid}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        quote_id: quoteId,
      }),
    });
    if (response.ok) {
      fetchFavorites();
    }
  };

  const handleDeleteBookmarks = (favoritesId) => {
    const deleteFavorites = async () => {
      const response = await fetch(`${apiURL()}/favorites/${favoritesId} `, {
        method: 'DELETE',
        headers: {
          token: `token ${user?.uid}`,
        },
      });

      if (response.ok) {
        fetchFavorites();
      }
    };

    deleteFavorites();
  };

  const toggleModal = () => {
    setOpenModal(false);
    document.body.style.overflow = 'visible';
  };

  const fetchAllRatings = useCallback(async () => {
    const url = `${apiURL()}/ratings`;
    const response = await fetch(url);
    const ratingsData = await response.json();
    setAllRatings(ratingsData);
  }, []);

  useEffect(() => {
    fetchAllRatings();
  }, [fetchAllRatings]);

  const fetchRatings = useCallback(async () => {
    const url = `${apiURL()}/ratings`;
    const response = await fetch(url, {
      headers: {
        token: `token ${user?.uid}`,
      },
    });
    const ratingsData = await response.json();

    if (Array.isArray(ratingsData)) {
      setRatings(ratingsData);
    } else {
      setRatings([]);
    }
  }, [user]);

  useEffect(() => {
    fetchRatings();
  }, [fetchRatings]);

  const addRating = async (quoteId) => {
    const response = await fetch(`${apiURL()}/ratings`, {
      method: 'POST',
      headers: {
        token: `token ${user?.uid}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        quote_id: quoteId,
      }),
    });
    if (response.ok) {
      fetchRatings();
      fetchAllRatings();
    }
  };

  const deleteRating = async (quoteId) => {
    const response = await fetch(`${apiURL()}/ratings/${quoteId}`, {
      method: 'DELETE',
      headers: {
        token: `token ${user?.uid}`,
        'Content-Type': 'application/json',
      },
    });
    if (response.ok) {
      fetchRatings();
      fetchAllRatings();
    }
  };
  const handleChangeColor = (colorParam) => {
    setSelectedImage('');
    setColorPickerSelected(false);
    setColor(colorParam);
  };

  const handleChangeFontColor = (colorParam) => {
    setSelectedImage('');
    setFontColorPickerSelected(false);
    setFontColor(colorParam);
  };

  const width = 500;
  const height = 350;
  const lineHeight = 38;

  useEffect(() => {
    const fetchImage = async () => {
      let count = 0;
      const fetchedImages = [];

      while (count < 5) {
        const randomNumber = Math.floor(Math.random() * 1000); // Random number for seed
        const url = `https://picsum.photos/id/${randomNumber}/130/100`;

        try {
          // eslint-disable-next-line no-await-in-loop
          const response = await fetch(url);

          if (response.ok) {
            fetchedImages.push(randomNumber); // Add the image URL if response is OK
            count += 1; // Increment count when image is successfully added
          }
        } catch (e) {
          return;
        }
      }

      setImages(fetchedImages); // Update state with 5 valid images
      // setLoading(false); // Set loading to false once 5 images are fetched
    };

    fetchImage();
  }, []);

  const getQuoteWithoutAuthor = (quoteParam) => {
    const match = quoteParam?.match(/^(.*?)[\s"”]?[–—-]\s*([\w\s.]+)$/);
    if (match) {
      return match[1].trim();
    }
    return quoteParam;
  };

  useEffect(() => {
    if (Object.keys(quote).length === 0) return;

    document.fonts.load('28px Norwester').then(() => {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');

      const drawText = () => {
        ctx.fillStyle = fontColor;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'top';
        ctx.font = 'bold 28px Norwester';

        // Redraw background before drawing centered text
        if (!selectedImage) {
          ctx.fillStyle = color;
          ctx.fillRect(0, 0, width, height);
        }

        const canvas2 = canvasRef.current;
        const ctx2 = canvas2.getContext('2d');

        ctx2.fillStyle = fontColor;
        ctx2.font = 'bold 28px Norwester';

        wrapText(ctx2, quoteText, width / 2, centerY, width * 0.9);
        if (quote.authorFullName !== 'Unknown') {
          ctx2.font = 'bold 14px Norwester';
          ctx2.fillText(
            `– ${quote.authorFullName.toUpperCase()}`,
            width / 2,
            height - 40,
          );
        }

        ctx2.font = 'normal 10px Norwester';
        ctx2.fillText(`motivately.co`, width - 40, height - 15);

        const dataUrl = canvas2.toDataURL('image/png');
        setImageDataUrl(dataUrl);
      };

      const wrapText = (ctxParam, text, x, y, maxWidth) => {
        const words = text?.split(' ');
        let line = '';
        const lines = [];

        for (let i = 0; i < words.length; i += 1) {
          const testLine = `${line + words[i]} `;
          const metrics = ctxParam.measureText(testLine);
          const testWidth = metrics.width;

          if (testWidth > maxWidth && i > 0) {
            lines.push(line);
            line = `${words[i]} `;
          } else {
            line = testLine;
          }
        }
        lines.push(line);

        lines.forEach((lineParam, index) => {
          ctx.fillText(lineParam.trim(), x, y + index * lineHeight);
        });

        return lines.length;
      };

      const quoteText = getQuoteWithoutAuthor(quote.title).toUpperCase();

      const linesCount = wrapText(
        ctx,
        quoteText,
        width / 2,
        height * 0.2,
        width * 0.9,
      );
      const textHeight = linesCount * lineHeight;
      const centerY = (height - textHeight) / 2;

      // ctx.clearRect(0, 0, width, height);
      if (selectedImage) {
        const image = new Image();
        image.crossOrigin = 'anonymous'; // Important if image is from another domain
        image.onload = () => {
          ctx.clearRect(0, 0, width, height);
          ctx.drawImage(image, 0, 0, width, height);
          ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
          ctx.fillRect(0, 0, width, height);
          drawText();
        };
        image.src = `https://picsum.photos/id/${selectedImage}/1000/700`;
      } else {
        ctx.clearRect(0, 0, width, height);
        ctx.fillStyle = color;
        ctx.fillRect(0, 0, width, height);
        drawText();
      }
    });
  }, [quote, color, fontColor, selectedImage]);

  const handleDownload = () => {
    const canvas = canvasRef.current;
    const link = document.createElement('a');
    link.download = 'quote.png';
    link.href = canvas.toDataURL('image/png');
    link.click();
  };

  console.log(ratings, 'ratings', allRatings, 'allratings');

  return (
    <>
      <Helmet>
        <title>{`${String(quote.title).substring(0, 50)} - motivately`}</title>
        <meta name="description" content="Best quotes - motivately" />
      </Helmet>
      <main>
        <section className="container-quoteview">
          <div className="container-quoteview-main">
            <div className="container-quote">
              {/* <canvas
                ref={canvasRef}
                style={{
                  width: '100%', // makes it fill the container width
                  height: 'auto', // maintain aspect ratio
                  display: 'block',
                }}
              /> */}
              <canvas
                ref={canvasRef}
                width={500}
                height={350}
                style={{ display: 'none' }}
              />
              {imageDataUrl && (
                <img
                  src={imageDataUrl}
                  alt="Quote"
                  style={{ width: '100%', height: 'auto' }}
                />
              )}
              <div className="container-color-group">
                <div className="images-group">
                  {images.map((image) => (
                    <div
                      onClick={() => setSelectedImage(image)}
                      className={`quote-image-input ${
                        image === selectedImage && 'selected'
                      }`}
                      style={{
                        backgroundImage: `url(https://picsum.photos/id/${image}/130/100)`,
                        backgroundRepeat: 'no-repeat',
                        backgroundSize: 'cover',
                        height: '100px',
                        // border: '1px',
                        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)', // Optional styling for shadow
                      }}
                    />
                  ))}
                </div>
                <div className="color-group">
                  <p className="color-group-tab-1">Background</p>
                  <div className="color-group-tab-2">
                    {defaultColors.map((item) => (
                      // eslint-disable-next-line jsx-a11y/control-has-associated-label
                      <button
                        type="button"
                        className={`color-input ${
                          item === color && 'selected'
                        }`}
                        style={{ backgroundColor: item }}
                        onClick={() => {
                          handleChangeColor(item);
                        }}
                      />
                    ))}
                  </div>
                  <div className="color-group-tab-3">
                    <p>Custom</p>
                    <input
                      type="color"
                      className={`color-picker ${
                        colorPickerSelected && 'selected'
                      }`}
                      onChange={(event) => {
                        setSelectedImage('');
                        setColor(event.target.value);
                        setColorPickerSelected(true);
                      }}
                    />
                  </div>
                </div>
                <div className="color-group font">
                  <p className="color-group-tab-1">Font</p>
                  <div className="color-group-tab-2">
                    {defaultFontColors.map((item) => (
                      // eslint-disable-next-line jsx-a11y/control-has-associated-label
                      <button
                        type="button"
                        className={`color-input ${
                          item === fontColor && 'selected'
                        }`}
                        style={{ backgroundColor: item }}
                        onClick={() => {
                          handleChangeFontColor(item);
                        }}
                      />
                    ))}
                  </div>
                  <div className="color-group-tab-3">
                    <p>Custom</p>
                    <input
                      type="color"
                      className={`color-picker ${
                        fontColorPickerSelected && 'selected'
                      }`}
                      onChange={(event) => {
                        setSelectedImage('');
                        setFontColor(event.target.value);
                        setFontColorPickerSelected(true);
                      }}
                    />
                  </div>
                </div>
              </div>
              <div>
                <Button onClick={handleDownload} primary label="Download" />
              </div>
              <div className="icons-apps-page">
                <span>Share it: </span>
                <button
                  type="button"
                  className="button-copy"
                  onClick={() => {
                    navigator.clipboard.writeText(quote.title);
                  }}
                >
                  <img src={iconCopy} alt="copy" className="icon-copy" />
                </button>
                <FontAwesomeIcon
                  icon={faLink}
                  className="button-copy"
                  onClick={() => {
                    navigator.clipboard.writeText(
                      `https://www.motivately.co/quotes/${quote.id}`,
                    );
                  }}
                />
                <FacebookShareButton url={`/Apps/${quote.id}`}>
                  <FontAwesomeIcon className="share-icon" icon={faFacebookF} />
                </FacebookShareButton>
                <TwitterShareButton
                  url={`https://www.motivately.co/quotes/${quote.id}`}
                  title={`'${quote.title}'`}
                  hashtags={['quotes', 'inspirational']}
                >
                  <FontAwesomeIcon className="share-icon" icon={faTwitter} />
                </TwitterShareButton>
                <LinkedinShareButton
                  url={`https://www.motivately.co/quotes/${quote.id}`}
                >
                  <FontAwesomeIcon className="share-icon" icon={faLinkedinIn} />
                </LinkedinShareButton>
                <EmailShareButton
                  subject="Check out this quote!"
                  body={`This quote is awesome: '${quote.title}'`}
                  url={`https://www.motivately.co/quotes/${quote.id}`}
                >
                  <FontAwesomeIcon icon={faEnvelope} />
                </EmailShareButton>
              </div>
            </div>
            <div className="container-quote-info">
              <h1 className="hero-header">{`"${getQuoteWithoutAuthor(
                quote?.title,
              )}"`}</h1>
              <div className="container-bookmark">
                <div className="container-rating">
                  Rating
                  {user && ratings.some((rating) => rating.id === quote.id) ? (
                    <button
                      type="button"
                      className="button-rating"
                      onClick={(event) => deleteRating(quote.id)}
                    >
                      <FontAwesomeIcon icon={faCaretUp} />
                      {
                        allRatings.filter(
                          (rating) => rating.quote_id === quote.id,
                        ).length
                      }
                    </button>
                  ) : user ? (
                    <button
                      type="button"
                      className="button-rating"
                      onClick={(event) => addRating(quote.id)}
                    >
                      <FontAwesomeIcon icon={faCaretUp} />
                      {
                        allRatings.filter(
                          (rating) => rating.quote_id === quote.id,
                        ).length
                      }
                    </button>
                  ) : (
                    <button
                      type="button"
                      className="button-rating"
                      onClick={() => {
                        setOpenModal(true);
                        setModalTitle('Sign up to vote');
                      }}
                    >
                      <FontAwesomeIcon icon={faCaretUp} />
                      {
                        allRatings.filter(
                          (rating) => rating.quote_id === quote.id,
                        ).length
                      }
                    </button>
                  )}
                  {/* <button type="button" className="button-rating">
                  <FontAwesomeIcon icon={faCaretUp} />
                  10
                </button> */}
                </div>
                <div>
                  {user && favorites.some((x) => x.id === quote.id) ? (
                    <button
                      type="button"
                      onClick={() => handleDeleteBookmarks(quote.id)}
                      onKeyDown={() => handleDeleteBookmarks(quote.id)}
                      className="button-bookmark"
                    >
                      Remove from saved{' '}
                      <FontAwesomeIcon icon={faHeartSolid} size="lg" />
                    </button>
                  ) : user ? (
                    <button
                      type="button"
                      onClick={() => addFavorite(quote.id)}
                      onKeyDown={() => addFavorite(quote.id)}
                      className="button-bookmark"
                    >
                      Save <FontAwesomeIcon icon={faHeart} size="lg" />
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => {
                        setOpenModal(true);
                        setModalTitle('Sign up to add bookmarks');
                      }}
                      onKeyDown={() => addFavorite(quote.id)}
                      className="button-bookmark"
                    >
                      Save <FontAwesomeIcon icon={faHeart} size="lg" />
                    </button>
                  )}
                </div>
              </div>
              {quote.description && (
                <div className="container-description">
                  <p>{quote.description}</p>
                </div>
              )}
              {quote.authorFullName && (
                <div className="container-description">
                  <strong>Author:</strong>
                  <Link
                    className="underline"
                    to={`/quotes/author/${quote.authorId}`}
                  >
                    <p>{quote.authorFullName}</p>
                  </Link>
                  <strong>Bio:</strong>
                  {quote.authorDescription && (
                    <Markdown>{quote.authorDescription}</Markdown>
                  )}
                  <strong>Info:</strong>
                </div>
              )}
              <div className="container-details">
                <div className="container-tags">
                  <div className="badges">
                    <p>Tagged: </p>
                    <div>
                      <Badge secondary label={quote.topicTitle} size="small" />
                    </div>
                  </div>
                  {/* <div className="badges">
                    <p>Category: </p>
                    <div>
                      <Badge
                        secondary
                        label={quote.categoryTitle}
                        size="small"
                      />
                    </div>
                  </div> */}
                </div>
              </div>
              <div className="container-comments">
                {comments.length === 0 && (
                  <div>
                    <i>No comments for this quote. </i>
                    {user && <i>Add a first one below.</i>}
                  </div>
                )}
                {comments.length > 0 &&
                  comments.map((item) => (
                    <div className="form-container">
                      <div className="comment-box submit-box">
                        <div>{item.content}</div>
                        <div className="comment-author-date">{`by ${
                          item.full_name
                        } on ${getOnlyYearMonthDay(item.created_at)}`}</div>
                      </div>
                    </div>
                  ))}
                {!user && (
                  <div>
                    <i>
                      <br />
                      <Link to="/signup" className="simple-link">
                        Sign up
                      </Link>{' '}
                      or{' '}
                      <Link to="/login" className="simple-link">
                        log in
                      </Link>{' '}
                      to add comments
                    </i>
                  </div>
                )}
                {user && (
                  <div className="form-container">
                    <div className="comment-box submit-box">
                      <form onSubmit={handleSubmit}>
                        <textarea
                          className="form-input"
                          value={comment}
                          placeholder="Your comment"
                          onChange={commentHandler}
                        />

                        <Button
                          primary
                          className="btn-add-prompt"
                          type="submit"
                          label="Add comment"
                        />
                        {validForm && (
                          <Modal
                            title="Your comment has been submitted!"
                            open={openConfirmationModal}
                            toggle={() => setOpenConfirmationModal(false)}
                          />
                        )}
                        {invalidForm && (
                          <p className="error-message">{error}</p>
                        )}
                      </form>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
          {/* <img
            className="appview-image"
            alt={`${quote.title} screenshot`}
            src={`http://res.cloudinary.com/dgarvanzw/image/upload/q_auto,f_auto/apps_ai/${quote.url_image}.png`}
          /> */}

          {/* <div className="container-related-searches">
            <h3>Related searches</h3>
            <div className="topics-div searches">
              {searches.map((search) => (
                <Link to={`/apps/search/${search.id}`} target="_blank">
                  <Button secondary label={search.title} />
                </Link>
              ))}
            </div>
          </div> */}

          {!user && (
            <div className="container-details cta">
              <div>
                <h2>🔥 Create a free account</h2>
                <p>Bookmark you favorite AI apps</p>
              </div>
              <div>
                <Link to="/signup">
                  <Button primary label="Create my account 👌" />
                </Link>
              </div>
            </div>
          )}
          {similarApps.length > 0 && (
            <div className="container-alternatives">
              <h3>🔎 Similar to {quote.title}</h3>
              <div className="container-cards small-cards">{cardItems}</div>
            </div>
          )}
        </section>
        <Modal title={modalTitle} open={openModal} toggle={toggleModal}>
          <Link to="/signup">
            <Button primary label="Create an account" />
          </Link>
          or
          <Link to="/login">
            <Button secondary label="Log in" />
          </Link>
        </Modal>
      </main>
    </>
  );
};
