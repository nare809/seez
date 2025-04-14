import React, { Component } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import PropTypes from 'prop-types';
import Download from "../Torrents/DownloadItem";
import ServerSelection from "./ServerSelection";
import {
  updateLink,
} from "../../Firebase/lists";

class MovieServers extends Component {
  constructor(props) {
    super(props);
    this.state = {
      links: false,
      movieLink: "",
      addedmsg: false,
      errormsg: false,
      showServerSelection: true,
      selectedServer: null,
      extractedMovieId: null,
      // Define available servers - comment out servers you don't want to use
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
    const { imdb, movieId } = this.props;
    const savedServer = localStorage.getItem('server_movie');
    
    this.extractMovieIdFromUrl();
    
    // If there's only one server available, select it automatically
    if (availableServers.length === 1) {
      this.setState({ 
        showServerSelection: false,
        selectedServer: availableServers[0]
      });
      
      if (!savedServer) {
        localStorage.setItem('server_movie', availableServers[0].toString());
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
        localStorage.setItem('server_movie', availableServers[0].toString());
      }
    }
    
    if(savedServer === "2" && availableServers.includes(2)) {
      axios.get(`https://yts.mx/api/v2/list_movies.json?query_term=${imdb}&with_images=true&with_cast=true`)
        .then((response) => {
          if (response.data?.data?.movies) {
            const { movies } = response.data.data;
            movies.forEach((movie) => {
              if (movie.torrents) {
                movie.torrents.forEach((torrent) => {
                  if(torrent.quality === "1080p") {
                    // We can handle 1080p torrents here if needed
                  }
                });
              }
            });
          }
        }).catch(err => {
          // Handle error appropriately
          console.error("Error fetching movie data:", err);
        });
    }
  }

  extractMovieIdFromUrl = () => {
    const pathParts = window.location.pathname.split('/');
    if (pathParts.length > 2 && pathParts[1] === 'movie') {
      const id = pathParts[2];
      if (id && !Number.isNaN(Number(id))) {
        this.setState({ extractedMovieId: id });
        console.log('Extracted TMDB movie ID from URL:', id);
      }
    }
  }

  cancelModal = () => {
    const { hideFunc } = this.props;
    hideFunc();
    // Don't reset showServerSelection to true here, as we want to remember the user's choice
  };

  openLinks = () => {
    this.setState({ links: true });
  };

  closeLinks = () => {
    this.setState({ links: false });
  }

  submitLink = event => {
    const { id } = this.props;
    const { movieLink } = this.state;
    
    event.preventDefault();
    if(movieLink) {
      updateLink(id, movieLink);
      this.setState({ addedmsg: true, errormsg: false });
      setTimeout(() => window.location.reload(false), 3000);
    } else {
      this.setState({ errormsg: true, addedmsg: false });
    }
  }

  handleChange = event => {
    event.preventDefault();
    if (event.target.type === "text") {
      this.setState({ movieLink: event.target.value });
    }
  }

  handleServerSelection = (serverId) => {
    this.setState({
      selectedServer: serverId,
      showServerSelection: false
    });
    localStorage.setItem('server_movie', serverId);
  }

  cancelServerSelection = () => {
    const { hideFunc } = this.props;
    hideFunc();
  }

  render() {
    const { isOpen, imdb, movieId, url } = this.props;
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
      movieLink, 
      addedmsg, 
      errormsg,
      availableServers,
      extractedMovieId
    } = this.state;
    
    const effectiveMovieId = extractedMovieId || movieId;
    
    // If server selection is showing, render the server selection component
    if (showServerSelection && isOpen) {
      return (
        <ServerSelection 
          mediaType="movie"
          imdb={imdb}
          onServerSelected={handleServerSelection}
          onCancel={cancelServerSelection}
          availableServers={availableServers}
        />
      );
    }

    const isVideoOpen = isOpen ? "is-modal-active" : "";
    let player;
    const server = selectedServer || localStorage.getItem("server_movie");
    
    if (server === "1" || server === 1) {
      // Server 1 uses TMDB ID
      const link = `https://play.vidplay.watch/movie/${effectiveMovieId}`;
      player = (
        <Download
          handleChange={cancelModal}
          url={url}
          isOpen={isOpen}
          link={link}
        />
      );
    } else if (server === "2" || server === 2) {
      // Server 2 uses IMDB ID
      const link = `//www.2embed.cc/embedtv/${imdb}`;
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
      const link = `//vidsrc.xyz/embed/movie/${effectiveMovieId}`;
      player = (
        <Download
          handleChange={cancelModal}
          url={url}
          isOpen={isOpen}
          link={link}
        />
      );
    } else if (server === "4" || server === 4) {
      // Server 4 uses TMDB ID
      const link = `//v2.vidsrc.me/embed/${effectiveMovieId}`;
      player = (
        <>
          <div
            id="open-modal"
            className="modal-window"
            style={{ display: links ? "block" : "none" }}
          >
            <div>
              <button type="button" onClick={this.closeLinks} title="Close" className="modal-close">
                Close
              </button>
              <h1>Voilà!</h1>
              <div>
                <input className="google-drive-text" type="text" value={movieLink} onChange={this.handleChange} placeholder="Enter your Google Drive ID" />
              </div>
              <button type="button" className="gdrive-btn" onClick={this.submitLink}>Add</button>
              <div className="notification-dgrive" style={{ display: addedmsg ? "block" : "none" }}>Successfully Added! 🌟</div>
              <div className="notification-dgrive-error" style={{ display: errormsg ? "block" : "none" }}>Error: Please Add Link 👍</div>
              <div>
                <small>Check out</small>
              </div>
              <button 
                type="button"
                className="link-style-button"
                onClick={() => window.open('https://drive.google.com', '_blank')}
              >
                👉 Shoow: Google Drive Player
              </button>
            </div>
          </div>
          <Download
            handleChange={cancelModal}
            url={url}
            isOpen={isOpen}
            link={link}
          />
        </>
      );
    } else {
      // Default to the first available server if the selected server is not available
      const defaultServer = availableServers[0] || 1;
      const link = `//vidsrc.xyz/embed/movie/${effectiveMovieId}`;
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

MovieServers.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  imdb: PropTypes.string.isRequired,
  movieId: PropTypes.string,
  url: PropTypes.string.isRequired,
  id: PropTypes.string,
  hideFunc: PropTypes.func.isRequired
};

MovieServers.defaultProps = {
  id: "",
  movieId: "",
};

export default MovieServers;