import React, { useEffect, useState, useCallback, useRef } from 'react';
import { Link, useParams, useLocation } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import './Quotes.Style.css';
import { apiURL } from '../../apiURL';
import { Card } from '../../components/Card/Card.component';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Button } from '../../components/Button/Button.component';
import { Loading } from '../../components/Loading/Loading.Component';
import DropDownView from '../../components/CategoriesListDropDown/CategoriesListDropDown.component';
// eslint-disable-next-line import/no-extraneous-dependencies
import InfiniteScroll from 'react-infinite-scroll-component';
import Modal from '../../components/Modal/Modal.Component';
import { useUserContext } from '../../userContext';
// eslint-disable-next-line import/no-extraneous-dependencies
import Masonry from 'react-masonry-css';
import { capitalize } from '../../utils/capitalize';
import { useRatings } from '../../utils/hooks/useRatings';
import { useFavorites } from '../../utils/hooks/useFavorites';
import { fetchAuthors, fetchTags } from '../../utils/http';
import { useFetch } from '../../utils/hooks/useFetch';

import {
  faFilter,
  faBookmark as faBookmarkSolid,
  faBookOpen,
} from '@fortawesome/free-solid-svg-icons';
import { SimpleToggle } from '../../components/SimpleToggle/SimpleToggle.component';

const tabs = ['Authors', 'Tags'];

export const Quotes = () => {
  const { user } = useUserContext();
  const location = useLocation();
  const { authorIdParam, tagSlugParam, searchParam } = useParams();
  const [searchTerms, setSearchTerms] = useState();
  const [search, setSearch] = useState('');
  const [sortOrder, setSortOrder] = useState('Recent');
  const [resultsHome, setResultsHome] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [modalTitle, setModalTitle] = useState('');
  const [categories, setCategories] = useState([]);
  const [filteredTopics, setFilteredTopics] = useState([]);
  const [filteredPricingPreview, setFilteredPricingPreview] = useState([]);
  const [filteredDetailsPreview, setFilteredDetailsPreview] = useState([]);
  const [filteredPricing, setFilteredPricing] = useState([]);
  const [filteredDetails, setFilteredDetails] = useState([]);
  const [filtersSubmitted, setFiltersSubmitted] = useState(false);
  const [showFiltersContainer, setShowFiltersContainer] = useState(false);
  const [showAuthorsContainer, setShowAuthorsContainer] = useState(false);
  const [showTagsContainer, setShowTagsContainer] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [listView, setListView] = useState(false);
  const [page, setPage] = useState(0);
  const [counter, setCounter] = useState(0);
  const [apps, setApps] = useState({});
  const [activeTab, setActiveTab] = useState('Authors');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [orderBy, setOrderBy] = useState({
    column: 'id',
    direction: 'desc',
  });
  const [pricingOptionsChecked, setPricingOptionsChecked] = useState([
    { title: 'Free', checked: false },
    { title: 'Paid with a free plan', checked: false },
    { title: 'Paid with a free trial', checked: false },
    { title: 'Paid', checked: false },
  ]);
  const [detailsOptionsChecked, setDetailsOptionsChecked] = useState([
    { title: 'Browser extension', checked: false },
    { title: 'iOS app available', checked: false },
    { title: 'Android app available', checked: false },
    { title: 'Social media contacts', checked: false },
  ]);
  const [quoteTheme, setQuoteTheme] = useState(() => {
    return localStorage.getItem('theme') || 'dark';
  });
  const { ratings, allRatings, addRating, deleteRating } = useRatings(user);
  const { favorites, addFavorite, handleDeleteBookmarks } = useFavorites(user);
  const { fetchedData: authors } = useFetch(fetchAuthors, []);
  const { fetchedData: tags } = useFetch(fetchTags, []);

  const toggleModal = () => {
    setOpenModal(false);
    document.body.style.overflow = 'visible';
  };

  const toggleTheme = () => {
    setQuoteTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  // first fetch
  useEffect(() => {
    setIsLoading(true);
    const url = `${apiURL()}/quotes?page=0&column=${orderBy.column}&direction=${
      orderBy.direction
    }${authorIdParam !== undefined ? `&filteredAuthors=${authorIdParam}` : ''}${
      tagSlugParam !== undefined ? `&tag=${tagSlugParam}` : ''
    }${searchParam !== undefined ? `&search=${searchParam}` : ''}${
      filtersSubmitted && filteredPricing.length > 0
        ? `&filteredPricing=${encodeURIComponent(filteredPricing)}`
        : ''
    }${
      filtersSubmitted && filteredDetails.length > 0
        ? `&filteredDetails=${encodeURIComponent(filteredDetails)}`
        : ''
    }`;

    // if (topicIdParam) {
    //   url = `${apiURL()}/apps?page=0&filteredTopics=${topicIdParam}&column=${
    //     orderBy.column
    //   }&direction=${orderBy.direction}`;
    // } else if (categoryIdParam) {
    //   url = `${apiURL()}/apps?page=0&filteredCategories=${categoryIdParam}&column=${
    //     orderBy.column
    //   }&direction=${orderBy.direction}`;
    // } else {
    //   url = `${apiURL()}/apps?page=0&column=${orderBy.column}&direction=${
    //     orderBy.direction
    //   }`;
    // }
    async function fetchData() {
      const response = await fetch(url);
      const json = await response.json();

      let hasMore = true;
      if (json.data.some((item) => item.id === json.lastItem.id)) {
        hasMore = false;
      }

      setApps({
        data: json.data,
        lastItem: json.lastItem,
        hasMore,
      });
      setPage((prevPage) => prevPage + 1);
      setIsLoading(false);
    }

    fetchData();
  }, [
    tagSlugParam,
    authorIdParam,
    orderBy.column,
    orderBy.direction,
    filteredDetails,
    filteredPricing,
    filtersSubmitted,
    searchParam,
  ]);

  const fetchApps = async () => {
    setIsLoading(true);
    setError(null);

    const url = `${apiURL()}/quotes?page=${page}&column=${
      orderBy.column
    }&direction=${orderBy.direction}${
      authorIdParam !== undefined ? `&filteredAuthors=${authorIdParam}` : ''
    }${tagSlugParam !== undefined ? `&tag=${tagSlugParam}` : ''}${
      searchParam !== undefined ? `&search=${searchParam}` : ''
    }${
      filtersSubmitted && filteredPricing.length > 0
        ? `&filteredPricing=${encodeURIComponent(filteredPricing)}`
        : ''
    }${
      filtersSubmitted && filteredDetails.length > 0
        ? `&filteredDetails=${encodeURIComponent(filteredDetails)}`
        : ''
    }`;

    // let url;
    // if (topicIdParam) {
    //   url = `${apiURL()}/apps?filteredTopics=${topicIdParam}&page=${page}&column=${
    //     orderBy.column
    //   }&direction=${orderBy.direction}`;
    // } else if (categoryIdParam) {
    //   url = `${apiURL()}/apps?filteredCategories=${categoryIdParam}&page=${page}&column=${
    //     orderBy.column
    //   }&direction=${orderBy.direction}`;
    // } else {
    //   url = `${apiURL()}/apps?page=${page}&column=${orderBy.column}&direction=${
    //     orderBy.direction
    //   }`;
    // }

    const response = await fetch(url);
    const json = await response.json();

    // setApps({ data: json.data, totalCount: json.totalCount, hasMore });

    let hasMore = true;

    if (json.data.some((item) => item.id === json.lastItem.id)) {
      hasMore = false;
    }

    setApps((prevItems) => {
      return {
        data: [...prevItems.data, ...json.data],
        lastItem: json.lastItem,
        hasMore,
      };
    });

    setPage((prev) => prev + 1);
  };

  // const fetchApps = useCallback(async () => {
  //   try {
  //     await setLoading(true);
  //     await setError(false);
  //     console.log('pagetest', page);
  //     let url;
  //     if (topicIdParam) {
  //       url = `${apiURL()}/apps?filteredTopics=${topicIdParam}&page=${page}`;
  //     } else if (categoryIdParam) {
  //       url = `${apiURL()}/apps?filteredCategories=${categoryIdParam}&page=${page}`;
  //     } else {
  //       url = `${apiURL()}/apps?page=${page}`;
  //     }
  //     const response = await fetch(url);
  //     const appsResponse = await response.json();

  //     console.log('appsResponse', appsResponse);
  //     setApps(appsResponse);

  //     console.log('apps', apps);

  //     //  else {
  //     //   setApps((prevItems) => [...prevItems, ...appsResponse]);
  //     // }

  //     // setApps((prevItems) => [...prevItems, ...appsResponse]);
  //     setLoading(false);
  //   } catch (err) {
  //     setError(err);
  //   }
  // }, [page, categoryIdParam, topicIdParam]);

  // useEffect(() => {
  //   fetchApps();
  // }, [fetchApps]);

  // useEffect(() => {
  //   setApps([]);
  // }, [location]);

  const setupUrlFilters = useCallback(async () => {
    let urlFilters = '';
    if (filteredTopics.length > 0) {
      urlFilters = `?filteredTopics=${filteredTopics}`;
    }
    return urlFilters;
  }, [filteredTopics]);

  useEffect(() => {
    async function fetchAppsSearch() {
      const responseApps = await fetch(`${apiURL()}/quotes/`);

      const responseAppsJson = await responseApps.json();

      if (searchTerms) {
        const filteredSearch = responseAppsJson.filter(
          (item) =>
            item.title.toLowerCase().includes(searchTerms.toLowerCase()) ||
            item.description
              .toLowerCase()
              .includes(searchTerms.toLowerCase()) ||
            item.topicTitle.toLowerCase().includes(searchTerms.toLowerCase()) ||
            item.categoryTitle
              .toLowerCase()
              .includes(searchTerms.toLowerCase()),
        );
        setResultsHome(filteredSearch);
      }
    }
    fetchAppsSearch();
  }, [searchTerms]);

  // const fetchApps = useCallback(async () => {
  //   // const urlFilters = await setupUrlFilters();
  //   let url;
  //   if (topicIdParam) {
  //     url = `${apiURL()}/apps/?filteredTopics=${topicIdParam}&page=${page}`;
  //   } else if (categoryIdParam) {
  //     url = `${apiURL()}/apps/?filteredCategories=${categoryIdParam}&page=${page}`;
  //   } else {
  //     url = `${apiURL()}/apps/?page=${page}`;
  //   }

  //   const response = await fetch(url);
  //   const appsResponse = await response.json();
  //   setApps((prevItems) => [...prevItems, ...appsResponse]);

  //   // setApps(appsResponse);

  //   // const promptsExportReady = promptsResponse.dataExport.map((prompt) => {
  //   //   return {
  //   //     id: prompt.id,
  //   //     prompt: prompt.title,
  //   //     category: prompt.categoryTitle,
  //   //     topic: prompt.topicTitle,
  //   //   };
  //   // });
  //   // setPromptsExport(promptsExportReady);
  //   setIsLoading(false);
  // }, [topicIdParam, categoryIdParam, page]);

  // useEffect(() => {
  //   setIsLoading(true);
  //   fetchApps();
  // }, [fetchApps]);

  useEffect(() => {
    setPage(0);
  }, [location]);

  useEffect(() => {
    setPage(0);
  }, [sortOrder]);

  useEffect(() => {
    setPage(0);
  }, [filteredPricing]);

  useEffect(() => {
    setPage(0);
  }, [filteredDetails]);

  // useEffect(() => {
  //   setCounter((prev) => prev + 1);
  // }, []);
  // console.log('counter', counter);

  // const handleObserver = useCallback((entries) => {
  //   const target = entries[0];

  //   console.log('test12');
  //   if (entries.length > 1) return;
  //   if (target.isIntersecting) {
  //     setPage((prev) => prev + 1);
  //   }
  // }, []);

  // useEffect(() => {
  //   const option = {
  //     root: null,
  //     rootMargin: '20px',
  //     threshold: 0,
  //   };
  //   const observer = new IntersectionObserver(handleObserver, option);
  //   if (loader.current) {
  //     observer.observe(loader.current);
  //   }
  // }, [handleObserver]);

  const handleSearch = (event) => {
    setSearchTerms(event.target.value);
  };

  const filterHandlerPricing = (event) => {
    if (event.target.checked) {
      setFilteredPricingPreview([
        ...filteredPricingPreview,
        event.target.value,
      ]);

      const newItems = pricingOptionsChecked.map((item) => {
        if (item.title === event.target.value) {
          return { ...item, checked: true };
        }
        return item;
      });
      setPricingOptionsChecked(newItems);
    } else {
      setFilteredPricingPreview(
        filteredPricingPreview.filter(
          (filterTopic) => filterTopic !== event.target.value,
        ),
      );
      const newItems = pricingOptionsChecked.map((item) => {
        if (item.title === event.target.value) {
          return { ...item, checked: false };
        }
        return item;
      });
      setPricingOptionsChecked(newItems);
    }
  };

  const filterHandlerDetails = (event) => {
    if (event.target.checked) {
      setFilteredDetailsPreview([
        ...filteredDetailsPreview,
        event.target.value,
      ]);
      const newItems = detailsOptionsChecked.map((item) => {
        if (item.title === event.target.value) {
          return { ...item, checked: true };
        }
        return item;
      });
      setDetailsOptionsChecked(newItems);
    } else {
      setFilteredDetailsPreview(
        filteredDetailsPreview.filter(
          (filterTopic) => filterTopic !== event.target.value,
        ),
      );
      const newItems = detailsOptionsChecked.map((item) => {
        if (item.title === event.target.value) {
          return { ...item, checked: false };
        }
        return item;
      });
      setDetailsOptionsChecked(newItems);
    }
  };

  const submitHandler = (event) => {
    event.preventDefault();
    setFiltersSubmitted(true);
    setFilteredPricing(filteredPricingPreview);
    setFilteredDetails(filteredDetailsPreview);
  };

  const clearFiltersHandler = (event) => {
    const newItemsDetails = detailsOptionsChecked.map((item) => {
      return { ...item, checked: false };
    });
    setDetailsOptionsChecked(newItemsDetails);

    const newItemsPricing = pricingOptionsChecked.map((item) => {
      return { ...item, checked: false };
    });
    setPricingOptionsChecked(newItemsPricing);
    setFilteredDetails([]);
    setFilteredPricing([]);
  };

  const dropdownList = resultsHome.map((app) => (
    <Link key={app.id} to={`/quotes/${app.id}`}>
      <li>{app.title}</li>
    </Link>
  ));

  const authorsList = authors.map((author) => {
    if (authorIdParam) {
      return (
        <Link to={`/quotes/author/${author.id}`}>
          <Button
            primary={author.id.toString() === authorIdParam.toString() && true}
            secondary={author.id !== authorIdParam && true}
            label={author.fullName}
          />
        </Link>
      );
    }

    return (
      <Link to={`/quotes/author/${author.id}`}>
        <Button secondary label={author.fullName} />
      </Link>
    );
  });

  const tagsList = tags.map((tag) => {
    if (tagSlugParam) {
      return (
        <Link to={`/quotes/tag/${tag.slug}`}>
          <Button
            primary={tag.slug.toString() === tagSlugParam.toString() && true}
            secondary={tag.slug !== tagSlugParam && true}
            label={capitalize(tag.title)}
          />
        </Link>
      );
    }
    return (
      <Link to={`/quotes/tag/${tag.slug}`}>
        <Button secondary label={capitalize(tag.title)} />
      </Link>
    );
  });

  // let sortOptions;
  // if (
  //   !appIdParam &&
  //   !categoryIdParam &&
  //   !searchTermIdParam &&
  //   !topicIdParam
  // ) {
  //   sortOptions = ['Recent', 'Trending', 'A-Z', 'Z-A'];
  // } else {
  //   sortOptions = ['Recent', 'A-Z', 'Z-A'];
  // }

  useEffect(() => {
    let column;
    let direction;
    if (sortOrder === 'A-Z') {
      column = 'title';
      direction = 'asc';
    } else if (sortOrder === 'Z-A') {
      column = 'title';
      direction = 'desc';
    } else {
      column = 'id';
      direction = 'desc';
    }

    setOrderBy({ column, direction });
  }, [sortOrder]);

  const getPageMeta = () => {
    if (authorIdParam) {
      const authorName = authors.find(
        (author) => author.id === parseInt(authorIdParam, 10),
      );
      const fullName = authorName?.fullName || 'Unknown author';
      return {
        pageTitle: `${fullName} quotes - motivately`,
        pageDescription: `Discover the best quotes by ${fullName} to inspire and motivate you.`,
        headerTitle: `${fullName} quotes`,
      };
    }

    if (tagSlugParam) {
      const tagTitle = tags.find((tag) => tag.slug === tagSlugParam);
      const title = tagTitle?.title || 'this topic';
      const capitalizedTitle = capitalize(title);
      return {
        pageTitle: `${capitalizedTitle} quotes - motivately`,
        pageDescription: `Explore inspirational quotes on ${title} and boost your day with positivity.`,
        headerTitle: `${capitalizedTitle} quotes`,
      };
    }

    if (searchParam) {
      const capitalizedSearch = capitalize(searchParam);
      return {
        pageTitle: `${capitalizedSearch} quotes - motivately`,
        pageDescription: `Search results for "${searchParam}" — powerful quotes to motivate and uplift.`,
        headerTitle: `${capitalizedSearch} quotes`,
      };
    }

    return {
      pageTitle: 'motivately - best quotes',
      pageDescription:
        'Motivately brings you the best motivational quotes to inspire greatness every day.',
      headerTitle: 'Browse best quotes',
    };
  };

  const { pageTitle, pageDescription, headerTitle } = getPageMeta();

  const sortOptions = ['Recent', 'A-Z', 'Z-A'];

  const pricingList = pricingOptionsChecked.map((item) => (
    <li key={item}>
      <input
        checked={item.checked}
        type="checkbox"
        value={item.title}
        onChange={filterHandlerPricing}
      />{' '}
      {item.title}
    </li>
  ));

  const detailsList = detailsOptionsChecked.map((item) => (
    <li key={item}>
      <input
        checked={item.checked}
        type="checkbox"
        value={item.title}
        onChange={filterHandlerDetails}
      />{' '}
      {item.title}
    </li>
  ));

  const breakpoints = {
    default: 3,
    1100: 3,
    700: 2,
    500: 1,
  };

  const tabsGroup = tabs.map((tab) => {
    return (
      <Button
        tertiary={activeTab === tab}
        secondary={activeTab !== tab}
        label={tab}
        className="tab"
        onClick={() => {
          setActiveTab(tab);
        }}
      />
    );
  });

  return (
    <main>
      <Helmet>
        <title>{pageTitle}</title>
        <meta name="description" content={pageDescription} />
      </Helmet>
      {/* <div className="hero"></div> */}
      <header>
        <h1>{headerTitle}</h1>
      </header>
      <div className="tabs-group">{tabsGroup}</div>
      {activeTab === 'Authors' && (
        <section className="container-topics-desktop">
          <Link to="/">
            <Button
              primary={!authorIdParam}
              secondary={authorIdParam}
              label="All authors"
            />
          </Link>
          {authorsList}
        </section>
      )}
      {activeTab === 'Tags' && (
        <section className="container-topics-desktop">
          <Link to="/">
            <Button
              primary={!tagSlugParam}
              secondary={tagSlugParam}
              label="All tags"
            />
          </Link>
          {tagsList}
        </section>
      )}
      <section className="container-filters">
        <Button
          secondary
          className="button-topics"
          onClick={(event) => {
            setShowAuthorsContainer(!showAuthorsContainer);
            setShowTagsContainer(false);
          }}
          backgroundColor="#ffe5d9"
          label="Authors"
        />
        <Button
          secondary
          className="button-topics"
          onClick={(event) => {
            setShowTagsContainer(!showTagsContainer);
            setShowAuthorsContainer(false);
          }}
          backgroundColor="#ffe5d9"
          label="Tags"
        />
        <DropDownView
          selectedOptionValue={sortOrder}
          className="no-line-height"
          options={sortOptions}
          onSelect={(option) => setSortOrder(option)}
          showFilterIcon={false}
        />

        {/* <Button
          secondary
          onClick={(event) => setShowFiltersContainer(!showFiltersContainer)}
          backgroundColor="#ffe5d9"
          label="Filters"
          icon={<FontAwesomeIcon className="filter-icon" icon={faFilter} />}
        /> */}
        <SimpleToggle toggle={toggleTheme} theme={quoteTheme} />
        {/* <Button
          secondary
          onClick={() => setListView(!listView)}
          backgroundColor="#ffe5d9"
        >
          <div className="filter-grid">
            <FontAwesomeIcon size="lg" icon={faGrip} />
            <FontAwesomeIcon icon={faList} />
          </div>
        </Button> */}
      </section>
      <section
        className={`container-topics-mobile ${showAuthorsContainer && 'show'}`}
      >
        <Link to="/">
          <Button
            primary={!authorIdParam}
            secondary={authorIdParam}
            label="All authors"
          />
        </Link>
        {authorsList}
      </section>
      <section
        className={`container-topics-mobile ${showTagsContainer && 'show'}`}
      >
        <Link to="/">
          <Button
            primary={!tagSlugParam}
            secondary={tagSlugParam}
            label="All tags"
          />
        </Link>
        {tagsList}
      </section>
      <section
        className={`container-details-section ${
          showFiltersContainer && 'show'
        }`}
      >
        <div className="container-details filters">
          <form onSubmit={submitHandler}>
            <div className="container-form">
              <div>
                <h3>Pricing</h3>
                <ul>{pricingList}</ul>
              </div>
              <div>
                <h3>Details</h3>
                <ul>{detailsList}</ul>
              </div>
            </div>
            <div className="container-buttons">
              <Button type="submit" primary label="Apply filters" />
              <Button
                type="button"
                onClick={clearFiltersHandler}
                secondary
                label="Clear"
              />
            </div>
          </form>
        </div>
      </section>
      {apps.data ? (
        <section className="container-scroll">
          <InfiniteScroll
            dataLength={apps.data.length}
            next={fetchApps}
            hasMore={apps.hasMore} // Replace with a condition based on your data source
            loader={<p>Loading...</p>}
            endMessage={<p>No more data to load.</p>}
            className={`container-cards ${listView ? 'list' : 'grid'}`}
          >
            <Masonry // Masonry layout
              breakpointCols={breakpoints}
              className="masonry-grid"
              columnClassName="masonry-column"
            >
              {apps.data.map((app) => {
                return (
                  <Card
                    className="masonry-item" // Masonry layout
                    listCard={listView}
                    id={app.id}
                    title={app.title}
                    description={app.description}
                    url={app.url}
                    urlImage={app.url_image}
                    author={app.authorFullName}
                    authorId={app.authorId}
                    pricingType={app.pricing_type}
                    isFavorite={favorites.some((x) => x.id === app.id)}
                    addFavorite={() => addFavorite(app.id)}
                    deleteBookmark={() => handleDeleteBookmarks(app.id)}
                    bookmarkOnClick={() => {
                      setOpenModal(true);
                      setModalTitle('Sign up to add bookmarks');
                    }}
                    isRatingAuthor={ratings.some(
                      (rating) => rating.id === app.id,
                    )}
                    addRating={() => addRating(app.id)}
                    deleteRating={() => deleteRating(app.id)}
                    ratingOnClick={() => {
                      setOpenModal(true);
                      setModalTitle('Sign up to add rating');
                    }}
                    ratingNumber={
                      allRatings.filter((rating) => rating.quote_id === app.id)
                        .length
                    }
                    theme={quoteTheme}
                  />
                );
              })}
              {/* Masonry layout */}
            </Masonry>
          </InfiniteScroll>
        </section>
      ) : (
        <Loading />
      )}
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
  );
};
