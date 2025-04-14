import React, { Component } from "react";
import "./Settings.scss";
import axios from "axios";
import { SignedIn, SignedOut } from "../UserState/UserState";
import { AVAILABLE_LANGUAGES, getCurrentLanguage, setLanguage, getLanguageName, getLanguageFlag } from "../../utils/language";

class Settings extends Component {
  state = {
    openMovie: false,
    openSeries: false,
    openLanguages: false,
    languageOpen: false,
    languagedata: "",
    movie: "",
    series: "",
    selectedLanguage: null,
  };

  componentDidMount() {
    // Load stored preferences
    const movie_name = localStorage.getItem('server_movie');
    const series_name = localStorage.getItem('server_series');
    
    // Load current language
    const currentLang = getCurrentLanguage();
    this.setState({ selectedLanguage: currentLang });
    
    // Set movie server name
    if(movie_name == 1) {
      this.setState({ movie: "VidCloud [No ADS, CC]" });
    } else if(movie_name == 2) {
      this.setState({ movie: "2embed" });
    } else if(movie_name == 3) {
      this.setState({ movie: "iBomma [No ADS]" });
    } else if(movie_name == 4) {
      this.setState({ movie: "VidSrc PRO" });
    }
    
    // Set series server name
    if(series_name == 1) {
      this.setState({ series: "VidCloud [Multi Quality, No ADS, CC]" });
    } else if(series_name == 2) {
      this.setState({ series: "iBomma [No ADS]" });
    } else if(series_name == 3) {
      this.setState({ series: "2embed [No ADS]" });
    }
  }

  // Toggle dropdowns
  openServers = () => {
    this.setState({ openMovie: true });
  };

  closeServers = () => {
    this.setState({ openMovie: false });
  }

  openSeries = () => {
    this.setState({ openSeries: true });
  };

  closeSeries = () => {
    this.setState({ openSeries: false });
  }

  openLanguages = () => {
    this.setState({ openLanguages: true });
  }

  closeLanguage = () => {
    this.setState({ openLanguages: false });
  }

  // Add toggle method for new language dropdown
  toggleLanguage = () => {
    this.setState(prevState => ({ 
      languageOpen: !prevState.languageOpen 
    }));
  }

  // Movie server selection handlers
  chooseServer1 = () => {
    this.setState({ movie: "VidCloud [No ADS, CC]" });
    localStorage.setItem('server_movie', 1);
    this.setState({ openMovie: false});
  }

  chooseServer2 = () => {
    this.setState({ movie: "2embed [Ads, CC]" });
    localStorage.setItem('server_movie', 2);
    this.setState({ openMovie: false});
  }

  chooseServer3 = () => {
    this.setState({ movie: "iBomma [NO Ads, CC]" });
    localStorage.setItem('server_movie', 3);
    this.setState({ openMovie: false});
  }

  chooseServer4 = () => {
    this.setState({ movie: "VidSrc PRO [Less Ads, CC]" });
    localStorage.setItem('server_movie', 4);
    this.setState({ openMovie: false});
  }

  // Series server selection handlers
  chooseServerSeries1 = () => {
    this.setState({ series: "VidCloud [No ADS, CC]" });
    localStorage.setItem('server_series', 1);
    this.setState({ openSeries: false});
  }

  chooseServerSeries2 = () => {
    this.setState({ series: "iBomma [No ADS]" });
    localStorage.setItem('server_series', 2);
    this.setState({ openSeries: false});
  }
  
  chooseServerSeries3 = () => {
    this.setState({ series: "2embed [No ADS]" });
    localStorage.setItem('server_series', 3);
    this.setState({ openSeries: false});
  }
  
  // Language selection handler
  handleLanguageChange = (languageCode) => {
    // Set the language in the app
    setLanguage(languageCode);
    
    // Update state
    this.setState({ 
      selectedLanguage: languageCode,
      openLanguages: false
    });
    
    // For Telugu and other Indian languages, show a special notification
    if (['te', 'hi', 'ta', 'ml', 'kn', 'bn', 'mr', 'gu'].includes(languageCode)) {
      // Store a notification message in localStorage to display after reload
      localStorage.setItem('language_notification', `Content will now be shown in ${getLanguageName(languageCode)} where available`);
      localStorage.setItem('language_notification_type', 'success');
      
      // For Telugu specifically, add extra info
      if (languageCode === 'te') {
        localStorage.setItem('language_notification', `తెలుగు సినిమాలు మరియు TV షోలు ఇప్పుడు చూపబడతాయి (Telugu movies and TV shows will now be shown)`);
      }
    } else {
      // Clear any existing notification
      localStorage.removeItem('language_notification');
      localStorage.removeItem('language_notification_type');
    }
    
    // Reload to apply changes
    window.location.reload();
  }

  render() {
    const { 
      openMovie, 
      openSeries, 
      openLanguages, 
      movie, 
      series, 
      selectedLanguage 
    } = this.state;
    
    // Get current language name
    const currentLanguageName = getLanguageName(selectedLanguage);
    
    return (
      <div className="container settings">
        {/* Language Settings Section */}
        <div className="settings-section compact-section">
          <header className="settings-header">
            <div className="settings-title">
              <div className="settings-title-text">Language Settings</div>
            </div>
          </header>
          <hr className="settings-divider" />
          <div className="settings-content">
            {this.renderLanguageDropdown()}
            <div className="settings-description">
              Change the default language for movie and TV show content.
            </div>
          </div>
        </div>

        {/* Movie Server Settings Section */}
        <div className="settings-section">
          <header className="settings-header">
            <div className="settings-title">
              <div className="settings-title-text">Movie Server Settings</div>
            </div>
          </header>
          <hr className="settings-divider" />
          <div className="settings-content">
            <div className="dropdown-container">
              <div className="dropdown-wrapper">
                <div className="dropdown-display" onClick={this.openServers}>
                  <div className="dropdown-value">{movie || "Select Server"}</div>
                </div>
                <div className="dropdown-arrow">
                  <svg 
                    onClick={this.closeServers} 
                    width="20" 
                    height="20" 
                    viewBox="0 0 24 24" 
                    fill="none" 
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M17 9.5l-5 5-5-5" stroke="#9B9D9F" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path>
                  </svg>
                  <ul 
                    className="dropdown-options" 
                    style={{display: openMovie ? "block" : "none"}}
                  >
                    <li className="dropdown-option" onClick={this.chooseServer1}>VidCloud [NO ADS, CC]</li>
                    <li className="dropdown-option" onClick={this.chooseServer2}>2embed [Ads, CC]</li>
                    <li className="dropdown-option" onClick={this.chooseServer3}>iBomma [NO Ads, CC]</li>
                    <li className="dropdown-option" onClick={this.chooseServer4}>VidSrc PRO [Less Ads, CC]</li>
                  </ul>
                </div>
              </div>
            </div>
            <div className="settings-description">
              Change the default Movie Source. This will be used when playing movies.
            </div>
          </div>
        </div>
        
        {/* TV Series Server Settings Section */}
        <div className="settings-section">
          <header className="settings-header">
            <div className="settings-title">
              <div className="settings-title-text">TV Shows Server Settings</div>
            </div>
          </header>
          <hr className="settings-divider" />
          <div className="settings-content">
            <div className="dropdown-container">
              <div className="dropdown-wrapper">
                <div className="dropdown-display" onClick={this.openSeries}>
                  <div className="dropdown-value">{series || "Select Server"}</div>
                </div>
                <div className="dropdown-arrow">
                  <svg 
                    onClick={this.closeSeries} 
                    width="20" 
                    height="20" 
                    viewBox="0 0 24 24" 
                    fill="none" 
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M17 9.5l-5 5-5-5" stroke="#9B9D9F" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path>
                  </svg>
                  <ul 
                    className="dropdown-options" 
                    style={{display: openSeries ? "block" : "none"}}
                  >
                    <li className="dropdown-option" onClick={this.chooseServerSeries1}>VidCloud [NO ADS, CC]</li>
                    <li className="dropdown-option" onClick={this.chooseServerSeries2}>iBomma [No ADS, CC]</li>
                    <li className="dropdown-option" onClick={this.chooseServerSeries3}>2embed [NO ADS]</li>
                  </ul>
                </div>
              </div>
            </div>
            <div className="settings-description">
              Change the default TV Shows Source. This will be used when playing episodes.
            </div>
          </div>
        </div>
      </div>
    );
  }

  renderLanguageDropdown() {
    const { selectedLanguage, languageOpen } = this.state;

    return (
      <div className="dropdown-container compact-dropdown">
        <div className="dropdown-wrapper">
          <div className="dropdown-display" onClick={this.toggleLanguage}>
            <div className="dropdown-value">
              <span className="language-flag">{getLanguageFlag(selectedLanguage)}</span> {getLanguageName(selectedLanguage)}
            </div>
          </div>
          <div className="dropdown-arrow">
            <svg 
              onClick={this.toggleLanguage} 
              width="16" 
              height="16" 
              viewBox="0 0 24 24" 
              fill="none" 
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M17 9.5l-5 5-5-5" stroke="#9B9D9F" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path>
            </svg>
            <ul 
              className="dropdown-options" 
              style={{display: languageOpen ? "block" : "none"}}
            >
              {Object.keys(AVAILABLE_LANGUAGES).map(langCode => (
                <li 
                  key={langCode}
                  className={`dropdown-option ${selectedLanguage === langCode ? 'selected' : ''}`}
                  onClick={() => this.handleLanguageChange(langCode)}
                >
                  <span className="language-flag">{getLanguageFlag(langCode)}</span> {AVAILABLE_LANGUAGES[langCode].nativeName}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    );
  }
}

export default Settings;
