/* eslint-disable no-nested-ternary */
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import './FavoritesBar.styles.css';
import { useRatings } from '../../utils/hooks/useRatings';
import { useFavorites } from '../../utils/hooks/useFavorites';
import { ArrowBigUp } from 'lucide-react';
import Modal from '../Modal/Modal.Component';
import { Button } from '../Button/Button.component';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart } from '@fortawesome/free-regular-svg-icons';
import { faHeart as faHeartSolid } from '@fortawesome/free-solid-svg-icons';
import { useUserContext } from '../../userContext';

/**
 * Primary UI component for user interaction
 */
export const FavoritesBar = ({ quoteId, className }) => {
  const [openModal, setOpenModal] = useState(false);
  const [modalTitle, setModalTitle] = useState('');
  const { user } = useUserContext();
  const { ratings, allRatings, addRating, deleteRating } = useRatings(user);
  const { favorites, addFavorite, handleDeleteBookmarks } = useFavorites(user);

  const toggleModal = () => {
    setOpenModal(false);
    document.body.style.overflow = 'visible';
  };
  console.log(user, 'c');

  return (
    <>
      <div className="container-bookmark">
        <div className="container-rating">
          {user && ratings.some((rating) => rating.id === quoteId) ? (
            <button
              type="button"
              className="button-rating-new"
              onClick={(event) => deleteRating(quoteId)}
            >
              Rating
              <ArrowBigUp />
              {
                allRatings.filter((rating) => rating.quote_id === quoteId)
                  .length
              }
            </button>
          ) : user ? (
            <button
              type="button"
              className="button-rating-new"
              onClick={(event) => addRating(quoteId)}
            >
              Rating
              <ArrowBigUp />
              {
                allRatings.filter((rating) => rating.quote_id === quoteId)
                  .length
              }
            </button>
          ) : (
            <button
              type="button"
              className="button-rating-new"
              onClick={() => {
                setOpenModal(true);
                setModalTitle('Sign up to vote');
              }}
            >
              Rating
              <ArrowBigUp />
              {
                allRatings.filter((rating) => rating.quote_id === quoteId)
                  .length
              }
            </button>
          )}
        </div>
        <div>
          {user && favorites.some((x) => x.id === quoteId) ? (
            <button
              type="button"
              onClick={() => handleDeleteBookmarks(quoteId)}
              onKeyDown={() => handleDeleteBookmarks(quoteId)}
              className="button-bookmark"
            >
              Remove from saved{' '}
              <FontAwesomeIcon icon={faHeartSolid} size="lg" />
            </button>
          ) : user ? (
            <button
              type="button"
              onClick={() => addFavorite(quoteId)}
              onKeyDown={() => addFavorite(quoteId)}
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
              onKeyDown={() => addFavorite(quoteId)}
              className="button-bookmark"
            >
              Save <FontAwesomeIcon icon={faHeart} size="lg" />
            </button>
          )}
        </div>
      </div>
      <Modal title={modalTitle} open={openModal} toggle={toggleModal}>
        <Link to="/signup">
          <Button primary label="Create an account" />
        </Link>
        or
        <Link to="/login">
          <Button secondary label="Log in" />
        </Link>
      </Modal>
    </>
  );
};

FavoritesBar.propTypes = {
  quoteId: PropTypes.string,
  className: PropTypes.string,
};

FavoritesBar.defaultProps = {
  className: null,
  quoteId: null,
};
