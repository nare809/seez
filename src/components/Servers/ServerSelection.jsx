import React, { Component } from "react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import "./Server.scss";

class ServerSelection extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedServer: null,
    };
  }

  componentDidMount() {
    const { mediaType } = this.props;
    const storageKey = mediaType === 'movie' ? 'server_movie' : 'server_series';
    const savedServer = localStorage.getItem(storageKey);
    if (savedServer) {
      this.setState({ selectedServer: parseInt(savedServer, 10) });
    }
  }

  selectServer = (serverId) => {
    const { mediaType } = this.props;
    this.setState({ selectedServer: serverId });
    const storageKey = mediaType === 'movie' ? 'server_movie' : 'server_series';
    localStorage.setItem(storageKey, serverId);
  };

  continueToPlay = () => {
    const { selectedServer } = this.state;
    const { onServerSelected } = this.props;
    if (selectedServer) {
      onServerSelected(selectedServer);
    }
  };

  handleKeyDown = (serverId, e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      this.selectServer(serverId);
    }
  };

  render() {
    const { mediaType, onCancel } = this.props;
    const { selectedServer } = this.state;
    const isMovie = mediaType === 'movie';

    return (
      <div className="fullscreen-popup">
        <div className="fullscreen-popup-content">
          <div className="fullscreen-popup-header">
            <h2>Select Server</h2>
            <button type="button" className="close-button" onClick={onCancel}>×</button>
          </div>
          
          <div className="server-selection-description">
            Choose the server, which is working for you according to your need.
          </div>
          
          <div className="server-grid">
            <div 
              className={`server-card ${selectedServer === 1 ? 'selected' : ''}`}
              onClick={() => this.selectServer(1)}
              onKeyDown={(e) => this.handleKeyDown(1, e)}
              role="button"
              tabIndex={0}
              aria-pressed={selectedServer === 1}
            >
              <div className="server-card-content">
                <div className="check-mark">✓</div>
                <h3>VidCloud</h3>
              </div>
            </div>
            
            <div 
              className={`server-card ${selectedServer === 2 ? 'selected' : ''}`}
              onClick={() => this.selectServer(2)}
              onKeyDown={(e) => this.handleKeyDown(2, e)}
              role="button"
              tabIndex={0}
              aria-pressed={selectedServer === 2}
            >
              <div className="server-card-content">
                <div className="check-mark">✓</div>
                <h3>2embed</h3>
              </div>
            </div>
            
            <div 
              className={`server-card ${selectedServer === 3 ? 'selected' : ''}`}
              onClick={() => this.selectServer(3)}
              onKeyDown={(e) => this.handleKeyDown(3, e)}
              role="button"
              tabIndex={0}
              aria-pressed={selectedServer === 3}
            >
              <div className="server-card-content">
                <div className="check-mark">✓</div>
                <h3>iBomma</h3>
              </div>
            </div>
            
            {isMovie && (
              <div 
                className={`server-card ${selectedServer === 4 ? 'selected' : ''}`}
                onClick={() => this.selectServer(4)}
                onKeyDown={(e) => this.handleKeyDown(4, e)}
                role="button"
                tabIndex={0}
                aria-pressed={selectedServer === 4}
              >
                <div className="server-card-content">
                  <div className="check-mark">✓</div>
                  <h3>VidSrc PRO</h3>
                </div>
              </div>
            )}
          </div>
          
          <div className="fullscreen-popup-footer">
            <button 
              type="button"
              className="cancel-button" 
              onClick={onCancel}
            >
              Cancel
            </button>
            <button 
              type="button"
              className="play-button" 
              onClick={this.continueToPlay}
              disabled={!selectedServer}
            >
              {selectedServer ? "Play Now" : "Select a Server"}
              {selectedServer && (
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="16" height="16" style={{marginLeft: '8px'}}>
                  <path fillRule="evenodd" d="M4.5 5.653c0-1.426 1.529-2.33 2.779-1.643l11.54 6.348c1.295.712 1.295 2.573 0 3.285L7.28 19.991c-1.25.687-2.779-.217-2.779-1.643V5.653z" clipRule="evenodd" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>
    );
  }
}

ServerSelection.propTypes = {
  mediaType: PropTypes.oneOf(['movie', 'series']).isRequired,
  onCancel: PropTypes.func.isRequired,
  onServerSelected: PropTypes.func.isRequired
};

export default ServerSelection; 