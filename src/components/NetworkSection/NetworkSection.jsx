import React from 'react';
import PropTypes from 'prop-types';
import Scroll from '../Scroll/Scroll';
import PosterCard from '../PosterCard/PosterCard';
import './NetworkSection.scss';

function NetworkSection({ title, networks }) {
  return (
    <div className="network-section">
      <h2 className="section-title">{title}</h2>
      <Scroll arrayLength={networks.length}>
        {networks.map((network) => (
          <PosterCard
            key={network.id}
            id={network.id}
            title={network.name}
            posterPath={network.logo_path}
            rating={network.rating}
            linkTo={`/network/${network.id}`}
            type="network"
          />
        ))}
      </Scroll>
    </div>
  );
}

NetworkSection.propTypes = {
  title: PropTypes.string.isRequired,
  networks: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      name: PropTypes.string.isRequired,
      logo_path: PropTypes.string,
      rating: PropTypes.number,
    })
  ).isRequired,
};

export default NetworkSection; 