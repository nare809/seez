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
    this.gridRef = React.createRef();
  }

  componentDidMount() {
    const savedLanguage = getCurrentLanguage();
    this.setState({ selectedLanguage: savedLanguage }, () => {
      // Scroll to the selected language card
      this.scrollToSelectedLanguage();
    });
    
    // Add keyboard navigation event listeners
    document.addEventListener('keydown', this.handleKeyboardNavigation);
  }
  
  componentWillUnmount() {
    // Remove keyboard event listeners
    document.removeEventListener('keydown', this.handleKeyboardNavigation);
  }
  
  // Scroll to the currently selected language
  scrollToSelectedLanguage = () => {
    const { selectedLanguage } = this.state;
    if (selectedLanguage && this.gridRef.current) {
      const selectedCard = this.gridRef.current.querySelector(`.language-card.selected`);
      if (selectedCard) {
        selectedCard.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
    }
  };
  
  // Handle keyboard navigation through the grid
  handleKeyboardNavigation = (event) => {
    const { key } = event;
    if (['Escape', 'Esc'].includes(key)) {
      // Close the modal on escape
      const { history } = this.props;
      history.push('/');
      return;
    }
    
    if (!this.gridRef.current) return;
    
    const languageCards = Array.from(this.gridRef.current.querySelectorAll('.language-card'));
    if (!languageCards.length) return;
    
    const { selectedLanguage } = this.state;
    const currentIndex = languageCards.findIndex(card => 
      card.classList.contains('selected')
    );
    
    // If no language is selected, select the first one when arrow keys are pressed
    if (currentIndex === -1 && ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(key)) {
      const firstLanguageCode = Object.keys(AVAILABLE_LANGUAGES)[0];
      this.selectLanguage(firstLanguageCode);
      return;
    }
    
    const languageEntries = Object.entries(AVAILABLE_LANGUAGES);
    const columnsPerRow = window.innerWidth <= 480 ? 2 : window.innerWidth <= 768 ? 2 : window.innerWidth <= 900 ? 3 : 4;
    
    let newIndex = currentIndex;
    
    switch (key) {
      case 'ArrowUp':
        newIndex = Math.max(0, currentIndex - columnsPerRow);
        break;
      case 'ArrowDown':
        newIndex = Math.min(languageCards.length - 1, currentIndex + columnsPerRow);
        break;
      case 'ArrowLeft':
        newIndex = Math.max(0, currentIndex - 1);
        break;
      case 'ArrowRight':
        newIndex = Math.min(languageCards.length - 1, currentIndex + 1);
        break;
      default:
        return;
    }
    
    if (newIndex !== currentIndex && newIndex >= 0 && newIndex < languageEntries.length) {
      const newLanguageCode = languageEntries[newIndex][0];
      this.selectLanguage(newLanguageCode);
      
      // Ensure the newly selected card is visible
      languageCards[newIndex].scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  };

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
      
      // Store notification in localStorage for App.jsx to show on redirect
      const languageName = AVAILABLE_LANGUAGES[selectedLanguage].nativeName;
      localStorage.setItem('language_notification', `Language changed to ${languageName}`);
      localStorage.setItem('language_notification_type', 'success');
      
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
      <div className="language-container" role="dialog" aria-modal="true" aria-labelledby="language-title">
        <div className="language-content">
          <div className="language-header">
            <h2 id="language-title">Select Language</h2>
            <Link to="/" className="close-button" aria-label="Close language selection">×</Link>
          </div>
          
          <div className="language-description">
            Choose your preferred language for the interface.
          </div>
          
          <div 
            className="language-grid" 
            ref={this.gridRef}
            role="listbox"
            aria-label="Available languages"
          >
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
                  <span className="language-flag" aria-hidden="true">{language.flag}</span>
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