// import React from 'react';
// import PropTypes from 'prop-types';
// import './FavoritesBar.styles.css';

// /**
//  * Primary UI component for user interaction
//  */
// export const FavoritesBar = ({
//   user,
//   quoteId,
//   addRating,
//   deleteRating,
//   addFavorite,
//   handleDeleteBookmarks,
//   primary,
//   secondary,
//   lighterBg,
//   className,
//   backgroundColor,
//   color,
//   size,
//   label,
//   icon,
//   type = 'button',
//   children,
//   ...props
// }) => {
//   let mode;
//   if (primary) {
//     mode = 'storybook-button--primary';
//   } else if (lighterBg) {
//     mode = 'storybook-button--lighterBg';
//   } else if (secondary) {
//     mode = 'storybook-button--secondary';
//   } else {
//     mode = 'storybook-button--tertiary';
//   }
//   return (
//     <div className="container-bookmark">
//       <div className="container-rating">
//         Rating
//         {user && ratings.some((rating) => rating.id === quote.id) ? (
//           <button
//             type="button"
//             className="button-rating"
//             onClick={(event) => deleteRating(quote.id)}
//           >
//             <FontAwesomeIcon icon={faCaretUp} />
//             {allRatings.filter((rating) => rating.quote_id === quote.id).length}
//           </button>
//         ) : user ? (
//           <button
//             type="button"
//             className="button-rating"
//             onClick={(event) => addRating(quote.id)}
//           >
//             <FontAwesomeIcon icon={faCaretUp} />
//             {allRatings.filter((rating) => rating.quote_id === quote.id).length}
//           </button>
//         ) : (
//           <button
//             type="button"
//             className="button-rating"
//             onClick={() => {
//               setOpenModal(true);
//               setModalTitle('Sign up to vote');
//             }}
//           >
//             <FontAwesomeIcon icon={faCaretUp} />
//             {allRatings.filter((rating) => rating.quote_id === quote.id).length}
//           </button>
//         )}
//       </div>
//       <div>
//         {user && favorites.some((x) => x.id === quote.id) ? (
//           <button
//             type="button"
//             onClick={() => handleDeleteBookmarks(quote.id)}
//             onKeyDown={() => handleDeleteBookmarks(quote.id)}
//             className="button-bookmark"
//           >
//             Remove from saved <FontAwesomeIcon icon={faHeartSolid} size="lg" />
//           </button>
//         ) : user ? (
//           <button
//             type="button"
//             onClick={() => addFavorite(quote.id)}
//             onKeyDown={() => addFavorite(quote.id)}
//             className="button-bookmark"
//           >
//             Save <FontAwesomeIcon icon={faHeart} size="lg" />
//           </button>
//         ) : (
//           <button
//             type="button"
//             onClick={() => {
//               setOpenModal(true);
//               setModalTitle('Sign up to add bookmarks');
//             }}
//             onKeyDown={() => addFavorite(quote.id)}
//             className="button-bookmark"
//           >
//             Save <FontAwesomeIcon icon={faHeart} size="lg" />
//           </button>
//         )}
//       </div>
//     </div>
//   );
// };

// FavoritesBar.propTypes = {
//   /**
//    * Is this the principal call to action on the page?
//    */
//   primary: PropTypes.bool,
//   lighterBg: PropTypes.bool,
//   secondary: PropTypes.bool,
//   icon: PropTypes.element,
//   children: PropTypes.element,

//   /**
//    * What background color to use
//    */
//   backgroundColor: PropTypes.string,
//   className: PropTypes.string,
//   /**
//    * How large should the button be?
//    */
//   color: PropTypes.string,
//   type: PropTypes.string,
//   /**
//    * How large should the button be?
//    */
//   size: PropTypes.oneOf(['small', 'medium', 'large']),
//   /**
//    * Button contents
//    */
//   label: PropTypes.string.isRequired,
//   /**
//    * Optional click handler
//    */
//   onClick: PropTypes.func,
// };

// FavoritesBar.defaultProps = {
//   backgroundColor: null,
//   className: null,
//   color: null,
//   primary: false,
//   lighterBg: false,
//   secondary: false,
//   size: 'medium',
//   onClick: undefined,
//   type: 'button',
//   icon: null,
//   children: null,
// };
