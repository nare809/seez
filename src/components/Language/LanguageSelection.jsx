import React, { Component } from "react";
import PropTypes from 'prop-types';
import { Link, withRouter } from "react-router-dom";
import { AVAILABLE_LANGUAGES, getCurrentLanguage, setLanguage } from "../../utils/language";
import "./Language.scss";

class LanguageSelection extends Component {
  constructor(props) {
    super(props);
    const { history } = props;
    this.state = {
      selectedLanguage: null,
    };
  }

  componentDidMount() {
    const savedLanguage = getCurrentLanguage();
    this.setState({ selectedLanguage: savedLanguage });
  }

  selectLanguage = (languageCode) => {
    this.setState({ selectedLanguage: languageCode });
  };

  handleKeyPress = (event, languageCode) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      this.selectLanguage(languageCode);
    }
  };

  applyLanguage = () => {
    const { selectedLanguage } = this.state;
    const { history } = this.props;
    
    if (selectedLanguage) {
      setLanguage(selectedLanguage);
      
      // Redirect to home page and then refresh to apply changes
      history.push('/');
      
      // Give the router a moment to redirect before reloading
      setTimeout(() => {
        window.location.reload();
      }, 100);
    }
  };

  render() {
    const { selectedLanguage } = this.state;
    const languageEntries = Object.entries(AVAILABLE_LANGUAGES);

    return (
      <div className="language-container">
        <div className="language-content">
          <div className="language-header">
            <h2>Select Language</h2>
            <Link to="/" className="close-button">×</Link>
          </div>
          
          <div className="language-description">
            Choose your preferred language for the interface.
          </div>
          
          <div className="language-grid">
            {languageEntries.map(([code, language]) => (
              <button 
                key={code}
                className={`language-card ${selectedLanguage === code ? 'selected' : ''}`}
                onClick={() => this.selectLanguage(code)}
                onKeyPress={(e) => this.handleKeyPress(e, code)}
                type="button"
                tabIndex={0}
                role="option"
                aria-selected={selectedLanguage === code}
              >
                <div className="language-card-icon">
                  <div className="check-mark">✓</div>
                  <span className="language-flag">{language.flag}</span>
                </div>
                <div className="language-card-content">
                  <h3>{language.nativeName}</h3>
                  <p className="language-description">{language.name}</p>
                </div>
              </button>
            ))}
          </div>
          
          <div className="language-footer">
            <Link to="/" className="cancel-button">Cancel</Link>
            <button 
              type="button"
              className="apply-button" 
              onClick={this.applyLanguage}
              disabled={!selectedLanguage}
            >
              Apply
            </button>
          </div>
        </div>
      </div>
    );
  }
}

LanguageSelection.propTypes = {
  history: PropTypes.shape({
    push: PropTypes.func.isRequired
  }).isRequired
};

export default withRouter(LanguageSelection); 