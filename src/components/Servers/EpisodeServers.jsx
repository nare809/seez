import React, { Component } from "react";
import PropTypes from 'prop-types';
import { Link } from "react-router-dom";
import Download from "../Torrents/DownloadItem";
import ServerSelection from "./ServerSelection";

class EpisodeServers extends Component {
  constructor(props) {
    super(props);
    this.state = {
      links: false,
      showServerSelection: true,
      selectedServer: null,
      availableServers: [
        1, // VidCloud
        // 2, // 2embed
        // 3, // iBomma
        // 4, // VidSrc PRO
      ],
    };
  }

  componentDidMount() {
    const { availableServers } = this.state;
    const savedServer = localStorage.getItem('server_series');
    
    // If there's only one server available, select it automatically
    if (availableServers.length === 1) {
      this.setState({ 
        showServerSelection: false,
        selectedServer: availableServers[0]
      });
      
      if (!savedServer) {
        localStorage.setItem('server_series', availableServers[0].toString());
      }
    } else if (savedServer) {
      // Check if the saved server is still available
      if (availableServers.includes(parseInt(savedServer, 10))) {
        this.setState({ 
          selectedServer: parseInt(savedServer, 10),
          showServerSelection: false // Don't show server selection if we already have a saved server
        });
      } else {
        // If saved server is no longer available, select the first available one
        this.setState({ 
          selectedServer: availableServers[0],
          showServerSelection: false // Don't show server selection if we're auto-selecting
        });
        localStorage.setItem('server_series', availableServers[0].toString());
      }
    }
  }

  cancelModal = () => {
    const { hideFunc } = this.props;
    hideFunc();
  };

  openLinks = () => {
    this.setState({ links: true });
  };

  closeLinks = () => {
    this.setState({ links: false });
  }

  handleServerSelection = (serverId) => {
    this.setState({
      selectedServer: serverId,
      showServerSelection: false
    });
    localStorage.setItem('server_series', serverId);
  }

  cancelServerSelection = () => {
    const { hideFunc } = this.props;
    hideFunc();
  }

  render() {
    const { isOpen, showId, imdbId, url, seasonNumber, episodeNumber } = this.props;
    const { 
      cancelModal, 
      openLinks, 
      handleServerSelection, 
      cancelServerSelection
    } = this;
    const { 
      showServerSelection, 
      selectedServer, 
      links,
      availableServers
    } = this.state;
    
    // If server selection is showing, render the server selection component
    if (showServerSelection && isOpen) {
      return (
        <ServerSelection 
          mediaType="tv"
          imdb={imdbId}
          onServerSelected={handleServerSelection}
          onCancel={cancelServerSelection}
          availableServers={availableServers}
        />
      );
    }

    const isVideoOpen = isOpen ? "is-modal-active" : "";
    let player;
    const server = selectedServer || localStorage.getItem("server_series");
    
    if (server === "1" || server === 1) {
      // Server 1 uses TMDB ID
      const link = `https://play.vidplay.watch/tv/${showId}/${seasonNumber}/${episodeNumber}`;
      player = (
        <Download
          handleChange={cancelModal}
          url={url}
          isOpen={isOpen}
          link={link}
        />
      );
    } else if (server === "2" || server === 2) {
      // Server 2 uses TMDB ID
      const link = `//vidsrc.xyz/embed/tv/${showId}/${seasonNumber}-${episodeNumber}`;
      player = (
        <Download
          handleChange={cancelModal}
          url={url}
          isOpen={isOpen}
          link={link}
        />
      );
    } else if (server === "3" || server === 3) {
      // Server 3 uses TMDB ID
      const link = `//www.2embed.to/embed/tmdb/tv?id=${showId}&s=${seasonNumber}&e=${episodeNumber}`;
      player = (
        <Download
          handleChange={cancelModal}
          url={url}
          isOpen={isOpen}
          link={link}
        />
      );
    } else {
      // Default option - use the first available server
      const defaultServer = availableServers[0] || 1;
      const link = `//vidsrc.xyz/embed/tv/${showId}/${seasonNumber}-${episodeNumber}`;
      player = (
        <Download
          handleChange={cancelModal}
          url={url}
          isOpen={isOpen}
          link={link}
        />
      );
    }
    
    return (
      <div className={`modal modal--fullscreen ${isVideoOpen}`}>
        <div className="modal__dialog">
          <div className="modal__content">
            {/* <button 
              type="button"
              className="change_link_icon" 
              onClick={openLinks}
              aria-label="Change link"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="#fff"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path d="M6.188 8.719c.439-.439.926-.801 1.444-1.087 2.887-1.591 6.589-.745 8.445 2.069l-2.246 2.245c-.644-1.469-2.243-2.305-3.834-1.949-.599.134-1.168.433-1.633.898l-4.304 4.306c-1.307 1.307-1.307 3.433 0 4.74 1.307 1.307 3.433 1.307 4.74 0l1.327-1.327c1.207.479 2.501.67 3.779.575l-2.929 2.929c-2.511 2.511-6.582 2.511-9.093 0s-2.511-6.582 0-9.093l4.304-4.306zm6.836-6.836l-2.929 2.929c1.277-.096 2.572.096 3.779.574l1.326-1.326c1.307-1.307 3.433-1.307 4.74 0 1.307 1.307 1.307 3.433 0 4.74l-4.305 4.305c-1.311 1.311-3.44 1.3-4.74 0-.303-.303-.564-.68-.727-1.051l-2.246 2.245c.236.358.481.667.796.982.812.812 1.846 1.417 3.036 1.704 1.542.371 3.194.166 4.613-.617.518-.286 1.005-.648 1.444-1.087l4.304-4.305c2.512-2.511 2.512-6.582.001-9.093-2.511-2.51-6.581-2.51-9.092 0z" />
              </svg>
              <span className="sr-only">Change link</span>
            </button> */}
            <div
              id="open-modal"
              className="modal-window"
              style={{ display: links ? "block" : "none" }}
            >
              <div>
                <button 
                  type="button"
                  onClick={this.closeLinks} 
                  title="Close" 
                  className="modal-close"
                >
                  Close
                </button>
                <h1>Not Working!</h1>
                <Link to="/settings">
                  <button type="button" className="gdrive-btn">Change Server</button>
                </Link>
                <div>
                  <small>VidCloud, 2embed, iBomma</small>
                </div>
                <button 
                  type="button"
                  className="link-style-button" 
                  onClick={() => window.open('https://vidcloud.com', '_blank')}
                >
                  👉 Recommended Alternative!
                </button>
              </div>
            </div> 
            {player}
          </div>
        </div>
      </div>
    );
  }
}

EpisodeServers.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  showId: PropTypes.string.isRequired,
  imdbId: PropTypes.string.isRequired,
  url: PropTypes.string.isRequired,
  seasonNumber: PropTypes.string.isRequired,
  episodeNumber: PropTypes.string.isRequired,
  hideFunc: PropTypes.func.isRequired
};

export default EpisodeServers;
