import React, { Component } from "react";
import PropTypes from "prop-types";
import { smoothScrollTo } from "../../utils";
import "./Scroll.scss";

class Scroll extends Component {
  constructor(props) {
    super(props);
    this.state = {
      width: 0,
      hasScrolledToEnd: false,
      hasScrolledToStart: true,
    };
    this.scrollRef = React.createRef();
  }

  componentDidMount() {
    this.updateWindowDimensions();
    window.addEventListener("resize", this.updateWindowDimensions);
  }

  componentWillUnmount() {
    window.removeEventListener("resize", this.updateWindowDimensions);
  }

  updateWindowDimensions = () => {
    this.setState({ width: window.innerWidth });
    this.checkArrows(this.scrollRef.current);
  };

  checkArrows = elem => {
    const hasScrolledToEnd =
      elem.scrollLeft >= elem.scrollWidth - elem.offsetWidth;
    const hasScrolledToStart = elem.scrollLeft <= 0;
    this.setState({
      hasScrolledToEnd,
      hasScrolledToStart,
    });
  };

  onScroll = event => {
    this.checkArrows(event.target);
  };

  scrollRight = () => {
    const elem = this.scrollRef.current;
    const { offsetWidth, scrollLeft } = elem;
    const scrollDistance = offsetWidth * 0.66;
    smoothScrollTo(elem, scrollLeft + scrollDistance, 400);
  };

  scrollLeft = () => {
    const elem = this.scrollRef.current;
    const { offsetWidth, scrollLeft } = elem;
    const scrollDistance = offsetWidth * 0.66;
    smoothScrollTo(elem, scrollLeft - scrollDistance, 400);
  };

  render() {
    const { hasScrolledToEnd, hasScrolledToStart, width } = this.state;
    const { children, arrayLength } = this.props;
    // Fixed width of all postercard images such as cast and recommendations.
    const imageWidth = 170;
    // sidebar width is constant 250px.
    const sidebarWidth = 250;

    // is true if there are enough elements so that scroll is enabled
    const isOverFlow =
      arrayLength * imageWidth > width - sidebarWidth;

    // don't show arrows if scrolled to the end/beginning
    const showLeftArrow = !hasScrolledToStart && isOverFlow;
    const showRightArrow = !hasScrolledToEnd && isOverFlow;

    // add the "hidden" class if the arrows shouldn't be visible
    const leftArrowClasses = `leftbutton scroll-button ${
      !showLeftArrow ? "hidden" : ""
    }`;
    const rightArrowClasses = `rightbutton scroll-button ${
      !showRightArrow ? "hidden" : ""
    }`;

    return (
      <div className="outer-div">
        <button 
          type="button" 
          className={leftArrowClasses} 
          onClick={this.scrollLeft}
          aria-label="Scroll left"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M15 18l-6-6 6-6" />
          </svg>
        </button>
        <div
          className="scrolling-wrapper-flexbox"
          ref={this.scrollRef}
          onScroll={this.onScroll}
        >
          {children}
        </div>
        <button 
          type="button" 
          className={rightArrowClasses} 
          onClick={this.scrollRight}
          aria-label="Scroll right"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 18l6-6-6-6" />
          </svg>
        </button>
      </div>
    );
  }
}

Scroll.propTypes = {
  children: PropTypes.node.isRequired,
  arrayLength: PropTypes.number.isRequired,
};

export default Scroll;
