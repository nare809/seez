import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import PropTypes from "prop-types";
import { Desktop, Mobile } from "../Responsive";
import DesktopHeader from "./DesktopHeader";
import MobileHeader from "./MobileHeader";
import "./Header.scss";

/**
 * The header, which includes search bar and user info
 */
class Header extends Component {
  componentDidMount() {
    const { location, setSearchbarValue } = this.props;
    const url = new URLSearchParams(location.search);
    const query = url.get("query") || "";
    setSearchbarValue(query);
  }

  render() {
    const { location, toggleSidebar, searchbarValue, searchHandler, setSearchbarValue } = this.props;
    
    return (
      <>
        <Desktop>
          <DesktopHeader 
            location={location}
            toggleSidebar={toggleSidebar}
            searchbarValue={searchbarValue}
            searchHandler={searchHandler}
            setSearchbarValue={setSearchbarValue}
          />
        </Desktop>
        <Mobile>
          <MobileHeader 
            location={location}
            toggleSidebar={toggleSidebar}
            searchbarValue={searchbarValue}
            searchHandler={searchHandler}
            setSearchbarValue={setSearchbarValue}
          />
        </Mobile>
      </>
    );
  }
}

Header.propTypes = {
  location: PropTypes.object.isRequired, // from react-router
  toggleSidebar: PropTypes.func.isRequired,
  searchbarValue: PropTypes.string.isRequired,
  searchHandler: PropTypes.func.isRequired,
  setSearchbarValue: PropTypes.func.isRequired,
};

export default withRouter(Header);
