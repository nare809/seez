import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { getFullImgPath } from '../../api/tmdb';
import './PosterCard.scss';

function PosterCard({ id, title, posterPath, rating, linkTo, type, releaseYear }) {
  const imgUrl = posterPath ? getFullImgPath(posterPath) : '/placeholder.png';
  
  // Get the type label
  const getTypeLabel = () => {
    if (type === 'tv') return 'TV-show';
    return 'Movie';
  };
  
  return (
    <Link to={linkTo} className="poster-card">
      <div className="poster-image">
        <img src={imgUrl} alt={title} />
        {rating && (
          <div className="poster-rating">
            <span className="rating-icon">★</span>
            <span className="rating-value">{rating.toFixed(1)}</span>
          </div>
        )}
      </div>
      <div className="poster-info">
        <h3 className="poster-title">{title}</h3>
        <div className="poster-metadata">
          <span className="type-tag">{getTypeLabel()}</span>
          <span className="release-year">{releaseYear || "2023"}</span>
        </div>
      </div>
    </Link>
  );
}

PosterCard.propTypes = {
  id: PropTypes.number.isRequired,
  title: PropTypes.string.isRequired,
  posterPath: PropTypes.string,
  rating: PropTypes.number,
  linkTo: PropTypes.string.isRequired,
  type: PropTypes.oneOf(['movie', 'tv', 'network']).isRequired,
  releaseYear: PropTypes.string,
};

PosterCard.defaultProps = {
  posterPath: null,
  rating: null,
  releaseYear: "2023"
};

export default PosterCard;
