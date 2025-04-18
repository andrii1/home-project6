import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import './SimpleToggle.styles.css';
// eslint-disable-next-line import/no-extraneous-dependencies
import { Sun, Moon } from 'lucide-react';
import { Button } from '../Button/Button.component';

/**
 * Primary UI component for user interaction
 */

export const SimpleToggle = ({ className = '', toggle, theme }) => {
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  return (
    <Button
      secondary
      onClick={toggle}
      backgroundColor="#ffe5d9"
      aria-label="Toggle dark/light mode"
      className={`theme-toggle-btn ${className}`}
    >
      {theme === 'dark' ? (
        <Sun className="icon sun" />
      ) : (
        <Moon className="icon moon" />
      )}
    </Button>
  );
};

SimpleToggle.propTypes = {
  toggle: PropTypes.func.isRequired,
  className: PropTypes.string,
  theme: PropTypes.oneOf(['light', 'dark']),
};

SimpleToggle.defaultProps = {
  theme: 'dark',
  className: null,
};
