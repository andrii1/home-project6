/* eslint-disable no-nested-ternary */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */

import React, { useState, useEffect } from 'react';
import './Navigation.Style.css';
import { apiURL } from '../../apiURL';
import { NavLink, Link } from 'react-router-dom';
import { useUserContext } from '../../userContext';
import { Button } from '../Button/Button.component';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import logo from '../../assets/images/logo.png';
import {
  faRightFromBracket,
  faSearch,
  faBars,
  faXmark,
} from '@fortawesome/free-solid-svg-icons';
import { House } from 'lucide-react';
import Modal from '../Modal/Modal.Component';
import { ProfileImage } from '../ProfileImage/ProfileImage.Component';
import { fetchQuotes, fetchAuthors, fetchBlogs } from '../../utils/http';
import { useFetch } from '../../utils/hooks/useFetch';
import { Loading } from '../Loading/Loading.Component';

export const Navigation = () => {
  const { user, name, logout } = useUserContext();
  const [openModal, setOpenModal] = useState(false);
  const [hamburgerOpen, setHamburgerOpen] = useState(false);
  const [hamburgerUserOpen, setHamburgerUserOpen] = useState(false);
  const [openSearchModal, setOpenSearchModal] = useState(false);
  const [modalTitle, setModalTitle] = useState('');
  const [searchTerms, setSearchTerms] = useState();
  const [resultsHome, setResultsHome] = useState([]);
  // const [resultsHomeApps, setResultsHomeApps] = useState([]);
  const {
    isFetching: loadingQuotes,
    fetchedData: quotes,
    error: errorQuotes,
  } = useFetch(fetchQuotes, []);
  const {
    isFetching: loadingAuthors,
    fetchedData: authors,
    error: errorAuthors,
  } = useFetch(fetchAuthors, []);
  const {
    isFetching: loadingBlogs,
    fetchedData: blogs,
    error: errorBlogs,
  } = useFetch(fetchBlogs, []);

  const toggleModal = () => {
    setOpenModal(false);
    document.body.style.overflow = 'visible';
  };
  const toggleSearchModal = () => {
    setOpenSearchModal(false);
    document.body.style.overflow = 'visible';
  };

  const loading = loadingQuotes || loadingAuthors;
  const error = errorQuotes || errorAuthors;
  React.useEffect(() => {
    const down = (e) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpenSearchModal((modal) => !modal);
      }
    };

    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, []);

  const filterQuotesBySearch = (search) => {
    if (search) {
      return quotes.filter(
        (item) =>
          item.title.toLowerCase().includes(searchTerms.toLowerCase()) ||
          item.description?.toLowerCase().includes(searchTerms.toLowerCase()) ||
          item.authorFullName.toLowerCase().includes(searchTerms.toLowerCase()),
      );
    }
    return quotes;
  };

  const filterAuthorsBySearch = (search) => {
    if (search) {
      return authors.filter((item) =>
        item.fullName.toLowerCase().includes(searchTerms.toLowerCase()),
      );
    }
    return authors;
  };

  const filterBlogsBySearch = (search) => {
    if (search) {
      return blogs.filter((item) =>
        item.content.toLowerCase().includes(searchTerms.toLowerCase()),
      );
    }
    return authors;
  };

  const resultsHomeQuotes = filterQuotesBySearch(searchTerms);
  const resultsHomeAuthors = filterAuthorsBySearch(searchTerms);
  const resultsHomeBlogs = filterBlogsBySearch(searchTerms);

  const handleSearch = (event) => {
    setSearchTerms(event.target.value);
  };

  const toggleHamburger = () => {
    setHamburgerOpen(!hamburgerOpen);
  };

  const toggleHamburgerUser = () => {
    setHamburgerUserOpen(!hamburgerUserOpen);
  };

  useEffect(() => {
    // Applying on mount
    if (hamburgerOpen || hamburgerUserOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'visible';
    }
  }, [hamburgerOpen, hamburgerUserOpen]);

  const dropDownResultsAuthors = resultsHomeAuthors.map((result) => (
    <Link
      to={`/quotes/author/${result.id}`}
      onClick={() => toggleSearchModal()}
    >
      <li key={result.id}>{result.fullName}</li>
    </Link>
  ));
  const dropDownResultsQuotes = resultsHomeQuotes?.map((result) => (
    <Link
      to={`/quotes/${result.id}`}
      /* state={{ frontPageItem: relatedTopics }} */
      onClick={() => toggleSearchModal()}
    >
      <li key={result.id}>{result.title}</li>
    </Link>
  ));
  const dropDownResultsBlogs = resultsHomeBlogs?.map((result) => (
    <Link
      to={`/blog/${result.slug}`}
      /* state={{ frontPageItem: relatedTopics }} */
      onClick={() => toggleSearchModal()}
    >
      <li key={result.id}>{result.title}</li>
    </Link>
  ));
  return (
    <>
      <div className="navigation-mobile">
        <div className="menu">
          <ul>
            <div className="container-mobile-menu-search">
              <li>
                <Button
                  secondary
                  className="hamburger-menu-button no-border"
                  onClick={toggleHamburger}
                >
                  <FontAwesomeIcon
                    onClick={toggleHamburger}
                    icon={hamburgerOpen ? faXmark : faBars}
                  />
                </Button>
                <ul
                  className={`hamburger-menu ${
                    hamburgerOpen ? 'menu-open' : 'menu-closed'
                  }`}
                >
                  <li>
                    <NavLink
                      to="/authors"
                      onClick={toggleHamburger}
                      className="nav-link"
                    >
                      Authors
                    </NavLink>
                  </li>
                  <li>
                    <NavLink
                      to="/tags"
                      onClick={toggleHamburger}
                      className="nav-link"
                    >
                      Tags
                    </NavLink>
                  </li>
                  <li>
                    <NavLink
                      to="/blog"
                      onClick={toggleHamburger}
                      className="nav-link"
                    >
                      Blog
                    </NavLink>
                  </li>
                  <li>
                    <NavLink
                      to="/ai-quote-generator"
                      onClick={toggleHamburger}
                      className="nav-link"
                    >
                      AI quote generator
                    </NavLink>
                  </li>
                  <li>
                    <NavLink
                      to="/top"
                      onClick={toggleHamburger}
                      className="nav-link"
                    >
                      Top 10 quotes
                    </NavLink>
                  </li>
                  <li>
                    <NavLink
                      to="/random"
                      onClick={toggleHamburger}
                      className="nav-link"
                    >
                      Random quote
                    </NavLink>
                  </li>
                  <li>
                    <NavLink
                      to="/day"
                      onClick={toggleHamburger}
                      className="nav-link"
                    >
                      Quote of the day
                    </NavLink>
                  </li>
                  {/* <li>
                    <NavLink
                      to="/tags"
                      onClick={toggleHamburger}
                      className="nav-link"
                    >
                      Tags
                    </NavLink>
                  </li> */}
                  {/* <li>
                    {!user && (
                      <NavLink
                        onClick={() => {
                          setOpenModal(true);
                          setModalTitle('Sign up');
                        }}
                        className="login submit nav-link"
                      >
                        Add your referral code
                      </NavLink>
                    )}
                  </li> */}
                </ul>
              </li>
              {/* <li>
              <FontAwesomeIcon className="search-icon" icon={faSearch} />
            </li> */}
              <li>
                <Link to="../../">
                  <House size={32} />
                </Link>
              </li>
              <li>
                <form className="search-form-mobile">
                  <label>
                    <FontAwesomeIcon
                      className="search-icon mobile"
                      icon={faSearch}
                      onClick={() => {
                        setOpenSearchModal(true);
                        setHamburgerOpen(false);
                        setHamburgerUserOpen(false);
                      }}
                    />
                  </label>
                </form>
              </li>
            </div>
            {/* <li>
              <NavLink
                to="/"
                className="nav-link"
                onClick={() => {
                  setHamburgerOpen(false);
                  setHamburgerUserOpen(false);
                }}
              >
                <img src={logo} alt="logo" className="img-logo" />
              </NavLink>
            </li> */}
            <li>
              {user ? (
                <div className="container-logged-in">
                  {hamburgerUserOpen && (
                    <Button
                      className="hamburger-menu-button-circle"
                      onClick={toggleHamburgerUser}
                      primary
                    >
                      <FontAwesomeIcon icon={faXmark} />
                    </Button>
                  )}
                  {!hamburgerUserOpen && (
                    <ProfileImage name={name} onClick={toggleHamburgerUser} />
                  )}

                  <div
                    className={`menu-user ${
                      hamburgerUserOpen ? 'menu-open' : 'menu-closed'
                    }`}
                  >
                    Hi, {name}
                    <NavLink
                      onClick={toggleHamburgerUser}
                      to="/bookmarks"
                      className="login nav-link"
                    >
                      Bookmarks
                    </NavLink>
                    <NavLink
                      onClick={toggleHamburgerUser}
                      to="/codes/new"
                      className="login nav-link"
                    >
                      Add referral code
                    </NavLink>
                    <FontAwesomeIcon
                      onClick={logout}
                      className="share-icon logout-icon"
                      icon={faRightFromBracket}
                    />
                  </div>
                </div>
              ) : (
                <div className="container-logged-out">
                  <NavLink to="/login" className="login">
                    Log in
                  </NavLink>

                  <Link to="/signup" className="signup">
                    <Button primary label="Sign up" />
                  </Link>
                </div>
              )}
            </li>
          </ul>
        </div>
      </div>
      <div className="navigation desktop">
        <div className="menu desktop">
          <ul>
            <li>
              <NavLink to="/" className="nav-link logo-link">
                <img src={logo} alt="logo" className="img-logo" />
              </NavLink>
            </li>
            <li className="navigation-search">
              <form>
                <label>
                  <FontAwesomeIcon className="search-icon" icon={faSearch} />
                  <input
                    type="text"
                    className="input-search-navigation"
                    onFocus={() => setOpenSearchModal((modal) => !modal)}
                    placeholder="Search ( ⌘ + k )"
                  />
                </label>
              </form>
            </li>
            <li className="hide-on-tablet">
              <NavLink to="/authors" className="nav-link">
                Authors
              </NavLink>
            </li>
            <li className="hide-on-tablet">
              <NavLink to="/tags" className="nav-link">
                Tags
              </NavLink>
            </li>
            <li>
              <NavLink to="/blog" className="nav-link">
                Blog
              </NavLink>
            </li>
            {/* <li className="hide-on-tablet">
              <NavLink to="/tags" className="nav-link">
                Tags
              </NavLink>
            </li> */}
          </ul>
        </div>
        <div className="nav-buttons">
          <ul className="nav-buttons-login">
            {/* <li>
              {user ? (
                <NavLink to="/apps/new" className="login submit">
                  Submit
                </NavLink>
              ) : (
                <NavLink
                  onClick={() => {
                    setOpenModal(true);
                    setModalTitle('Do you want to add your referral codes?');
                  }}
                  className="login submit"
                >
                  Submit
                </NavLink>
              )}
            </li> */}
            {user ? (
              <div className="container-logged-in">
                <ProfileImage name={name} />
                <div className="dropdown-content">
                  <NavLink to="/bookmarks" className="login">
                    Bookmarks
                  </NavLink>
                  {/* <NavLink to="/codes/new">Add your referral code</NavLink> */}
                  <div className="div-logout" onClick={logout}>
                    Logout
                  </div>
                </div>
              </div>
            ) : (
              <>
                <li>
                  <NavLink to="/login" className="login">
                    Log in
                  </NavLink>
                </li>
                <li>
                  <Link to="/signup" className="signup">
                    <Button primary label="Sign up" />
                  </Link>
                </li>
              </>
            )}
          </ul>
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
      <Modal
        open={openSearchModal}
        toggle={toggleSearchModal}
        overlayClass="overlay-navigation overlay-search"
      >
        <form>
          <label className="modal-label">
            <FontAwesomeIcon className="search-icon" icon={faSearch} />
            <input
              // eslint-disable-next-line jsx-a11y/no-autofocus
              autoFocus
              type="text"
              className="input-search-modal mobile"
              onChange={handleSearch}
              /* onFocus={handleClick} */
              placeholder="Search"
            />
          </label>
        </form>
        {searchTerms &&
          (loading ? (
            <Loading />
          ) : error ? (
            <p>Something went wrong</p>
          ) : (
            <div className="dropdown-search-modal">
              <h3>Quotes</h3>
              <ul>
                {dropDownResultsQuotes.length > 0 ? (
                  dropDownResultsQuotes
                ) : (
                  <li>No quotes found :(</li>
                )}
              </ul>
              <h3>Authors</h3>
              <ul>
                {dropDownResultsAuthors.length > 0 ? (
                  dropDownResultsAuthors
                ) : (
                  <li>No authors found :(</li>
                )}
              </ul>
              <h3>Blogs</h3>
              <ul>
                {dropDownResultsBlogs.length > 0 ? (
                  dropDownResultsBlogs
                ) : (
                  <li>No blogs found :(</li>
                )}
              </ul>
            </div>
          ))}
      </Modal>
    </>
  );
};
