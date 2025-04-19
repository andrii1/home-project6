/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable no-nested-ternary */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { Button } from '../Button/Button.component';
import { Badge } from '../Badge/Badge.component';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faArrowUpRightFromSquare,
  faHeart as faHeartSolid,
} from '@fortawesome/free-solid-svg-icons';
import { faHeart } from '@fortawesome/free-regular-svg-icons';
import { ArrowBigUp } from 'lucide-react';
import appImage from '../../assets/images/app-placeholder.svg';
// import appImage from '../../../public/assets/images/small-screenshot.png';
import { useUserContext } from '../../userContext';

import './Card.styles.css';

export const Card = ({
  title,
  description,
  author,
  authorId,
  pricingType,
  url,
  urlImage,
  id,
  className,
  smallCard = true,
  listCard = false,
  isFavorite,
  addFavorite,
  deleteBookmark,
  bookmarkOnClick,
  isRatingAuthor,
  addRating,
  deleteRating,
  ratingOnClick,
  ratingNumber,
  theme,
}) => {
  const { user } = useUserContext();
  if (smallCard) {
    return (
      <Link
        className="card-category--small card-image--small"
        // style={{

        //   // backgroundImage: `url(http://res.cloudinary.com/dgarvanzw/image/upload/w_500,q_auto,f_auto/apps_ai/${urlImage}.png )`,
        //   // backgroundRepeat: 'no-repeat',
        //   // backgroundSize: 'cover',
        // }}
      >
        <div className="card-header">
          <Link to={`/apps/${id}`} target="_blank">
            <h2>{title}</h2>
          </Link>
        </div>
        {/* <div className="topics-bookmark--small">
          {authorId !== 1 && <Badge label={author} size="small" />}
          {/* <Badge label={pricingType} size="small" />
        </div> */}
      </Link>
    );
  }

  return (
    <div
      key={id}
      className={`${
        listCard ? 'card-list' : 'card-category'
      } ${theme} ${className}`}
    >
      {/* <Link
        to={`/apps/${id}`}
        target="_blank"
        className={`card-image ${listCard ? 'list' : ''}`}
        style={{
          backgroundImage: `url(http://res.cloudinary.com/dgarvanzw/image/upload/w_${
            listCard ? '500' : '700'
          },q_auto,f_auto/apps_ai/${urlImage}.png )`,
          backgroundRepeat: 'no-repeat',
          backgroundSize: 'cover',
        }}
      /> */}
      {/* <div className={`card-body ${listCard ? 'list' : ''}`}> */}
      <div className="card-header">
        <Link to={`/quotes/${id}`} target="_blank">
          <h2>
            {title}
            {/* <FontAwesomeIcon
              className="icon-card"
              icon={faArrowUpRightFromSquare}
              style={{ color: '#e5989b' }}
              size="sm"
            /> */}
          </h2>
        </Link>
      </div>
      <div className="topics-bookmark">
        <div className="container-rating">
          {user && isRatingAuthor ? (
            <button
              type="button"
              className="button-rating-new"
              onClick={deleteRating}
            >
              <ArrowBigUp color={theme === 'dark' ? '#b5838d' : '#333'} />
              <span
                className={theme === 'dark' ? 'rating-dark' : 'rating-white'}
              >
                {ratingNumber}
              </span>
            </button>
          ) : user ? (
            <button
              type="button"
              className="button-rating-new"
              onClick={addRating}
            >
              <ArrowBigUp color={theme === 'dark' ? '#b5838d' : '#333'} />

              <span
                className={theme === 'dark' ? 'rating-dark' : 'rating-white'}
              >
                {ratingNumber}
              </span>
            </button>
          ) : (
            <button
              type="button"
              className="button-rating-new"
              onClick={ratingOnClick}
            >
              <ArrowBigUp color={theme === 'dark' ? '#b5838d' : '#333'} />
              <span
                className={theme === 'dark' ? 'rating-dark' : 'rating-white'}
              >
                {ratingNumber}
              </span>
            </button>
          )}
        </div>
        {user && isFavorite ? (
          <button
            type="button"
            onClick={deleteBookmark}
            onKeyDown={deleteBookmark}
            className="button-bookmark"
          >
            <FontAwesomeIcon
              color={theme === 'dark' && '#b5838d'}
              icon={faHeartSolid}
              size="lg"
            />
          </button>
        ) : user ? (
          <button
            type="button"
            onClick={addFavorite}
            onKeyDown={addFavorite}
            className="button-bookmark"
          >
            <FontAwesomeIcon
              color={theme === 'dark' && '#b5838d'}
              icon={faHeart}
              size="lg"
            />
          </button>
        ) : (
          <button
            type="button"
            onClick={bookmarkOnClick}
            onKeyDown={addFavorite}
            className="button-bookmark"
          >
            <FontAwesomeIcon
              color={theme === 'dark' && '#b5838d'}
              icon={faHeart}
              size="lg"
            />
          </button>
        )}
        {authorId !== 1 && (
          <Link to={`/quotes/author/${authorId}`}>
            <Button
              className={theme === 'dark' && 'dark'}
              secondary
              label={author}
              size="small"
            />
          </Link>
        )}
      </div>
      {/* </div> */}
    </div>
  );

  //   return (
  //     <div className="card-list">
  //       <Link
  //         to={`/apps/${id}`}
  //         target="_blank"
  //         className="card-image list"
  //         style={{
  //           backgroundImage: `url(/assets/images/finalscout-sm.png)`,
  //           backgroundRepeat: 'no-repeat',
  //           backgroundSize: 'cover',
  //         }}
  //       />
  //       <div className="card-body list">
  //         <div className="card-header">
  //           <div className="card-title">
  //             <Link to={`/apps/${id}`} target="_blank">
  //               <h2>{title}</h2>
  //             </Link>
  //             <Link to={`/apps/${id}`} target="_blank">
  //               <FontAwesomeIcon
  //                 className="icon-card"
  //                 icon={faArrowUpRightFromSquare}
  //                 style={{ color: '#e5989b' }}
  //                 size="lg"
  //               />
  //             </Link>
  //           </div>
  //           <Badge label={pricingType} size="small" />
  //         </div>
  //         <div className="card-description">
  //           {`${description.split(' ').slice(0, 35).join(' ')}...`}
  //         </div>
  //         <div className="topics-bookmark">
  //           <Link to={`/apps/topic/${topicId}`}>
  //             <Button label={topic} size="small" />
  //           </Link>
  //           <FontAwesomeIcon icon={faHeart} size="lg" />
  //         </div>
  //       </div>
  //     </div>
  //   );
};

Card.propTypes = {
  title: PropTypes.string,
  description: PropTypes.string,
  author: PropTypes.string,
  authorId: PropTypes.string,
  pricingType: PropTypes.string,
  id: PropTypes.string,
  url: PropTypes.shape,
  urlImage: PropTypes.string,
  smallCard: PropTypes.bool,
  listCard: PropTypes.bool,
  className: PropTypes.string,
  isFavorite: PropTypes.func,
  addFavorite: PropTypes.func,
  deleteBookmark: PropTypes.func,
  bookmarkOnClick: PropTypes.func,
  isRatingAuthor: PropTypes.func,
  addRating: PropTypes.func,
  deleteRating: PropTypes.func,
  ratingOnClick: PropTypes.func,
  ratingNumber: PropTypes.string,
  theme: PropTypes.oneOf(['light', 'dark']),
};

Card.defaultProps = {
  title: null,
  description: null,
  pricingType: null,
  authorId: null,
  author: null,
  url: null,
  urlImage: null,
  id: null,
  smallCard: false,
  listCard: false,
  className: null,
  isFavorite: undefined,
  addFavorite: undefined,
  deleteBookmark: undefined,
  bookmarkOnClick: undefined,
  isRatingAuthor: undefined,
  addRating: undefined,
  deleteRating: undefined,
  ratingOnClick: undefined,
  ratingNumber: null,
  theme: 'dark',
};
