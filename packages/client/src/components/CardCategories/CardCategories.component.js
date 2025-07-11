import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { Button } from '../Button/Button.component';

import './CardCategories.styles.css';

export const CardCategories = ({ title, topics, slug, itemKey }) => {
  return (
    <div className="card-category-new">
      <h2>{title}</h2>

      <div className="topics-div">
        {topics.map((topic) => (
          <Link to={`/quotes/${slug}/${topic[itemKey]}`}>
            <Button secondary label={topic.title} />
          </Link>
        ))}
      </div>
    </div>
  );
};

CardCategories.propTypes = {
  title: PropTypes.string,
  itemKey: PropTypes.string,
  slug: PropTypes.string,
  topics: PropTypes.shape,
};

CardCategories.defaultProps = {
  title: null,
  itemKey: null,
  slug: null,
  topics: null,
};
