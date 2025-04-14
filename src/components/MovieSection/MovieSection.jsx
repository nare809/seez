import React from 'react';
import PropTypes from 'prop-types';
import Scroll from '../Scroll/Scroll';
import PosterCard from '../PosterCard/PosterCard';
import { getYearFromDate } from '../../api/tmdb';
import './MovieSection.scss';

function MovieSection({ title, movies, type = 'movie' }) {
  const getYear = (movie) => {
    if (movie.release_date) {
      return getYearFromDate(movie.release_date);
    } 
    if (movie.first_air_date) {
      return getYearFromDate(movie.first_air_date);
    }
    return "2023";
  };

  return (
    <div className="movie-section">
      <h2 className="section-title">{title}</h2>
      <Scroll arrayLength={movies.length}>
        {movies.map((movie) => (
          <PosterCard
            key={movie.id}
            id={movie.id}
            title={movie.title || movie.name}
            posterPath={movie.poster_path}
            rating={movie.vote_average}
            linkTo={`/${type}/${movie.id}`}
            type={type}
            releaseYear={getYear(movie)}
          />
        ))}
      </Scroll>
    </div>
  );
}

MovieSection.propTypes = {
  title: PropTypes.string.isRequired,
  movies: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      title: PropTypes.string,
      name: PropTypes.string,
      poster_path: PropTypes.string,
      vote_average: PropTypes.number,
      release_date: PropTypes.string,
      first_air_date: PropTypes.string,
    })
  ).isRequired,
  type: PropTypes.oneOf(['movie', 'tv']),
};

MovieSection.defaultProps = {
  type: 'movie'
};

export default MovieSection; 