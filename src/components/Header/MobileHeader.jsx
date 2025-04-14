import React from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import Searchbar from "../Searchbar/Searchbar";
import "./Header.scss";

// Inline SVG components to replace missing imports
const BarsIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="3" y1="12" x2="21" y2="12"></line>
    <line x1="3" y1="6" x2="21" y2="6"></line>
    <line x1="3" y1="18" x2="21" y2="18"></line>
  </svg>
);

const TimesIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18"></line>
    <line x1="6" y1="6" x2="18" y2="18"></line>
  </svg>
);

/**
 * The header for mobile devices, which includes search and navigation
 */
class MobileHeader extends React.Component {
  static propTypes = {
    toggleSidebar: PropTypes.func.isRequired,
    searchbarValue: PropTypes.string.isRequired,
    searchHandler: PropTypes.func.isRequired,
    setSearchbarValue: PropTypes.func.isRequired,
    location: PropTypes.object.isRequired,
  };

  static getDerivedStateFromProps(props, state) {
    if (
      state.location !== props.location &&
      !props.location.pathname.includes("search")
    ) {
      return {
        showSearch: false,
        location: props.location,
      };
    }
    return { location: props.location };
  }

  constructor(props) {
    super(props);
    this.state = {
      showSearch: false,
    };
  }

  componentDidUpdate(prevProps) {
    if (this.state.showSearch) {
      // if the searchbar becomes visible, focus on the input
      this.searchbarRef.current.inputRef.current.focus();
    }
  }

  searchbarRef = React.createRef();

  searchModalToggler = () => {
    this.setState(({ showSearch }) => ({
      showSearch: !showSearch,
    }));
  };

  render() {
    const { showSearch } = this.state;
    const { toggleSidebar, searchbarValue, searchHandler, setSearchbarValue } = this.props;

    return (
      <header id="app-header-mobile" className="app-header">
        <div className="app-header__burger-icon" onClick={toggleSidebar}>
          <BarsIcon />
        </div>
        <div className="app-header__logo">
          <Link to="/">VidPlay</Link>
        </div>
        <div className="app-header__search-icon" onClick={this.searchModalToggler}>
          <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>

        <div
          id="search-modal"
          className={`search-modal ${showSearch ? "show-searchbar" : ""}`}
        >
          <div className="search-modal__top">
            <Searchbar
              ref={this.searchbarRef}
              value={searchbarValue}
              search={searchHandler}
              setSearchbarValue={setSearchbarValue}
            />
            <div
              className="search-modal__close-btn"
              onClick={this.searchModalToggler}
            >
              <TimesIcon />
            </div>
          </div>
        </div>
      </header>
    );
  }
}

export default MobileHeader;
