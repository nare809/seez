import React, { Component, Suspense, lazy } from "react";
import PropTypes from "prop-types";
import { withRouter, Switch, Route, Redirect } from "react-router-dom";
import { ToastContainer, Slide, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.min.css";
import "./App.scss";
import { watchStates } from "../Firebase/lists";
import { UserProvider } from "../Firebase/UserContext";
import ScrollToTop from "../components/Scroll/ScrollToTop";
import Sidebar from "../components/Sidebar/Sidebar";
import DynamicHeader from "./DynamicHeader";
import { createDebouncedFunc } from "../utils";
import NotFoundPage from "../components/404/404";
import NotificationPopup from "../components/NotificationPopup/NotificationPopup";

// Use React.lazy for code splitting
const HomepageContainer = lazy(() => import("./HomepageContainer"));
const SearchpageContainer = lazy(() => import("./SearchpageContainer"));
const DetailspageContainer = lazy(() => import("./DetailspageContainer"));
const ActorPageContainer = lazy(() => import("./ActorPageContainer"));
const UserList = lazy(() => import("./UserList"));
const BrowseMoviesContainer = lazy(() => import("./BrowseMoviesContainer"));
const BrowseTvContainer = lazy(() => import("./BrowseTvContainer"));
const EpisodeContainer = lazy(() => import("./EpisodeContainer"));
const NewPassword = lazy(() => import("../components/NewPassword/NewPassword"));
const SignUpPage = lazy(() => import("../components/Login/SignUpPage"));
const LogInPage = lazy(() => import("../components/Login/LogInPage"));
const Questions = lazy(() => import("../components/Questions/Questions"));
const Discord = lazy(() => import("../components/Questions/Discord"));
const Settings = lazy(() => import("../components/Settings/Settings"));
const LanguageSelection = lazy(() => import("../components/Language/LanguageSelection"));

const SEARCH_DEBOUNCE_TIME = 800;

// Loading component for suspense fallback
function Loading() {
  return (
    <div className="page-loading">
      <div className="loading-spinner" />
    </div>
  );
}

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      sidebarIsOpen: false,
      searchWords: "",
      side: true,
      nowPlayingMovies: [],
      nowAiringTVShows: [],
      nowHorrorMovies: [],
      nowScifiMovies: [],
      nowKidsMovies: [],
      nowThrillerMovies: [],
      nowDocumentaries: [],
      networks: [],
      currentMovie: {},
      currentActor: {},
      searchResults: {
        results: [],
        currentPage: null,
        totalResults: null,
        totalPages: null,
      },
      location: props.location,
    };
  }

  componentDidMount() {
    // Always start with sidebar expanded
    localStorage.setItem('sidebar-status', 0);
    this.setState({ side: true });
    
    // Check for language notification
    const languageNotification = localStorage.getItem('language_notification');
    if (languageNotification) {
      const notificationType = localStorage.getItem('language_notification_type') || 'info';
      
      // Show notification to user
      toast[notificationType](languageNotification, {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      
      // Clear notification from localStorage so it doesn't show again on refresh
      localStorage.removeItem('language_notification');
      localStorage.removeItem('language_notification_type');
    }
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    if (prevState.location !== nextProps.location) {
      return {
        sidebarIsOpen: false,
        location: nextProps.location,
      };
    }
    return { location: nextProps.location };
  }

  setNowDocumentaries = nowDocumentaries => {
    this.setState({ nowDocumentaries });
  }

  setNowScifiMovies = nowScifiMovies => {
    this.setState({ nowScifiMovies });
  }

  setCurrentActor = currentActor => {
    this.setState({ currentActor });
  };

  setCurrentMovie = currentMovie => {
    this.setState({ currentMovie });
  };

  setNowKidsMovies = nowKidsMovies => {
    this.setState({ nowKidsMovies });
  }

  setNowThrillerMovies = nowThrillerMovies => {
    this.setState({ nowThrillerMovies });
  };

  setNowHorrorMovies = nowHorrorMovies => {
    this.setState({ nowHorrorMovies });
  };

  setNowPlayingMovies = nowPlayingMovies => {
    this.setState({ nowPlayingMovies });
  };

  setNowAiringTVShows = nowAiringTVShows => {
    this.setState({ nowAiringTVShows });
  };

  setSearchResults = searchResults => {
    this.setState({ searchResults });
  };

  setNetworks = networks => {
    this.setState({ networks });
  };

  closeSidebar = () => {
    this.setState({ sidebarIsOpen: false });
  };

  lessSidebar = () => {
    this.setState({ side: false });
  }

  expandSidebar = () => {
    this.setState({ side: true });
  }

  toggleSidebar = () => {
    this.setState(prevState => ({ 
      sidebarIsOpen: !prevState.sidebarIsOpen 
    }));
  };

  searchHandler = query => {
    this.setSearchbarValue(query);
    this.search(query);
  };

  search = createDebouncedFunc(query => {
    // don't need to search if the user just clears the search bar
    if (query === "") return;
    const { history } = this.props;
    history.push(`/search?query=${query}`);
  }, SEARCH_DEBOUNCE_TIME);

  setSearchbarValue = searchWords => {
    this.setState({ searchWords });
  };

  render() {
    const {
      sidebarIsOpen,
      nowPlayingMovies,
      nowHorrorMovies,
      nowKidsMovies,
      nowScifiMovies,
      nowAiringTVShows,
      nowThrillerMovies,
      nowDocumentaries,
      networks,
      searchResults,
      currentMovie,
      currentActor,
      side,
      searchWords
    } = this.state;

    const {expandSidebar, lessSidebar} = this;

    const sidebarOverlay = (
      <div
        id="overlay"
        className={sidebarIsOpen ? "open" : "closed"}
        onClick={this.closeSidebar}
        role="presentation"
      />
    );

    const listNames = Object.values(watchStates).join("|");

    return (
      <UserProvider>
        <ScrollToTop>
          {sidebarOverlay}
          <NotificationPopup />
          <ToastContainer
            className="toast-container"
            toastClassName="toast"
            hideProgressBar
            closeButton={false}
            position="bottom-left"
            transition={Slide}
            autoClose={3000}
          />
          <Sidebar 
            handleChange={lessSidebar} 
            handleExpand={expandSidebar} 
            isOpen={sidebarIsOpen} 
            closeSidebar={this.closeSidebar}
          >
            asdad
          </Sidebar>
          <div id={side ? "main-container" : "less-container"}>
            <DynamicHeader
              toggleSidebar={this.toggleSidebar}
              searchHandler={this.searchHandler}
              setSearchbarValue={this.setSearchbarValue}
              searchbarValue={searchWords}
            />
            <Suspense fallback={<Loading />}>
              <Switch>
                <Route
                  exact
                  path="/"
                  render={() => (
                    <HomepageContainer
                      movies={nowPlayingMovies}
                      series={nowAiringTVShows}
                      horror={nowHorrorMovies}
                      kids={nowKidsMovies}
                      scifi={nowScifiMovies}
                      thriller={nowThrillerMovies}
                      documentary={nowDocumentaries}
                      networks={networks}
                      setNowScifiMovies={this.setNowScifiMovies}
                      setNowKidsMovies={this.setNowKidsMovies}
                      setNowThrillerMovies={this.setNowThrillerMovies}
                      setNowHorrorMovies={this.setNowHorrorMovies}
                      setNowPlayingMovies={this.setNowPlayingMovies}
                      setNowAiringTVShows={this.setNowAiringTVShows}
                      setNowDocumentaries={this.setNowDocumentaries}
                      setNetworks={this.setNetworks}
                    />
                  )}
                />
                <Route
                  exact
                  path="/shows"
                  render={() => <Redirect to="/shows/popular" />}
                />
                <Route
                  path="/shows/:filter/:id?"
                  render={routeProps => <BrowseTvContainer 
                    id={routeProps.match.params.id}
                    filter={routeProps.match.params.filter}
                    location={routeProps.location}
                    history={routeProps.history}
                    match={routeProps.match}
                  />}
                />
                <Route
                  exact
                  path="/movies"
                  render={() => <Redirect to="/movies/popular" />}
                />
                <Route
                  path="/movies/:filter/:id?"
                  render={routeProps => <BrowseMoviesContainer 
                    id={routeProps.match.params.id}
                    filter={routeProps.match.params.filter}
                    location={routeProps.location}
                    history={routeProps.history}
                    match={routeProps.match}
                  />}
                />
                <Route
                  exact
                  path="/:mediaType(movie|tv)/:id"
                  render={routeProps => (
                    <DetailspageContainer
                      id={routeProps.match.params.id}
                      mediaType={routeProps.match.params.mediaType}
                      location={routeProps.location}
                      history={routeProps.history}
                      match={routeProps.match}
                      currentMovie={currentMovie}
                      setCurrentMovie={this.setCurrentMovie}
                    />
                  )}
                />
                <Route
                  exact
                  path="/person/:id"
                  render={routeProps => (
                    <ActorPageContainer
                      id={routeProps.match.params.id}
                      location={routeProps.location}
                      history={routeProps.history}
                      match={routeProps.match}
                      currentActor={currentActor}
                      setCurrentActor={this.setCurrentActor}
                    />
                  )}
                />
                <Route
                  exact
                  path="/tv/:id/episodes"
                  render={() => <Redirect to="1" />}
                />
                <Route
                  exact
                  path="/tv/:id/episodes/:seasonNumber"
                  render={routeProps => (
                    <EpisodeContainer 
                      id={routeProps.match.params.id}
                      seasonNumber={routeProps.match.params.seasonNumber}
                      location={routeProps.location}
                      history={routeProps.history}
                      match={routeProps.match}
                      currentMovie={currentMovie} 
                    />
                  )}
                />
                <Route
                  path="/search"
                  render={() => (
                    <SearchpageContainer
                      searchResults={searchResults}
                      setSearchResults={this.setSearchResults}
                    />
                  )}
                />
                <Route
                  exact
                  path="/user/:userId/:listName/"
                  render={() => <Redirect to="all" />}
                />
                <Route
                  path={`/user/:userId/:listName(${listNames})/:mediaType(all|movie|tv)`}
                  component={UserList}
                />
                <Route exact path="/forgot_password" component={NewPassword} />
                <Route path="/login" component={LogInPage} />
                <Route path="/signup" component={SignUpPage} />
                <Route path="/help" component={Questions} />
                <Route path="/settings" component={Settings} />
                <Route path="/discord" component={Discord} />
                <Route path="/language" component={LanguageSelection} />
                <Route component={NotFoundPage} />
              </Switch>
            </Suspense>
          </div>
        </ScrollToTop>
      </UserProvider>
    );
  }
}

App.propTypes = {
  history: PropTypes.object.isRequired,
  location: PropTypes.object.isRequired,
};

// DragDropContext enables react-dnd to work in our app
// withRouter gives App access to history, location, match
export default withRouter(App);
