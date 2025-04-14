import React from 'react';
import MovieSection from '../MovieSection/MovieSection';
import Banners from './Banners';

function HomeContainer() {
  return (
    <div className="container">
      <Banners />
      
      {/* Other movie sections would be here */}
      <MovieSection
        title="Popular Movies"
        type="movie"
        mediaType="popular"
      />
      
      <MovieSection
        title="Top Rated Movies"
        type="movie"
        mediaType="top_rated"
      />
      
      <MovieSection
        title="Popular TV Shows"
        type="tv"
        mediaType="popular"
      />
    </div>
  );
}

export default HomeContainer; 