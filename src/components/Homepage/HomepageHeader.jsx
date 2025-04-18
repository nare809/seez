import React from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { getCurrentLanguage, getLanguageFlag } from "../../utils/language";
import "./HomepageHeader.scss";

const HomepageHeader = ({ title }) => {
  const currentLanguage = getCurrentLanguage();
  const languageFlag = getLanguageFlag(currentLanguage);

  return (
    <div className="homepage-header">
      <h1 className="homepage-title">{title}</h1>
      <div className="homepage-actions">
        <Link to="/language" className="language-selector-button">
          <span className="language-flag">{languageFlag}</span>
          <span className="language-label">Language</span>
        </Link>
      </div>
    </div>
  );
};

HomepageHeader.propTypes = {
  title: PropTypes.string.isRequired,
};

export default HomepageHeader; 