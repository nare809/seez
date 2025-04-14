import React from "react";
import PropTypes from "prop-types";
import { useFocusable, FocusContext } from '@noriginmedia/norigin-spatial-navigation';
import PosterCard from "../PosterCard/PosterCard";
import Scroll from "../Scroll/Scroll";
import { normalizeMovie } from "../../api/tmdb";
import "./PosterGrid.scss";

/**
 * A responsive grid of PosterCards
 * 
 * <div className="poster-grid">
      {movies.map(mov => {
        const movie = normalizeMovie(mov);
        return (
          <PosterCard
            key={movie.id}
            id={movie.id}
            linkTo={`/${movie.media_type}/${movie.id}`}
            title={movie.title}
            posterPath={movie.poster_path}
            releaseDate={movie.release_date}
            mediaType={movie.media_type}
            voteAverage={movie.vote_average}
            notHD="false"
          />
        );
      })}
    </div>
 */

function PosterGrid({ movies, view, type = 'movie' }) {
  let posterContent;

  if(view) {
    posterContent = (
      <Scroll arrayLength={movies.length}>
        {movies.map(mov => {
          const movie = normalizeMovie(mov);
          return (
            <PosterCard
              key={movie.id}
              id={movie.id}
              linkTo={`/${movie.media_type}/${movie.id}`}
              title={movie.title}
              posterPath={movie.poster_path}
              rating={movie.vote_average}
              type={movie.media_type || type}
              releaseYear={movie.release_year}
            />
          );
        })}
      </Scroll>
    );
  } else {
    posterContent = (
      <div className="poster-grid">
        {movies.map(mov => {
          const movie = normalizeMovie(mov);
          return (
            <PosterCard
              key={movie.id}
              id={movie.id}
              linkTo={`/${movie.media_type}/${movie.id}`}
              title={movie.title}
              posterPath={movie.poster_path}
              rating={movie.vote_average}
              type={movie.media_type || type}
              releaseYear={movie.release_year}
            />
          );
        })}
      </div>
    );
  }
  
  return posterContent;
}

PosterGrid.propTypes = {
  movies: PropTypes.arrayOf(PropTypes.object).isRequired,
  view: PropTypes.string,
  type: PropTypes.oneOf(['movie', 'tv', 'network'])
};

PosterGrid.defaultProps = {
  type: 'movie',
  view: null
};

export default PosterGrid;
