import React, { Component, createContext } from "react";
import PropTypes from "prop-types";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./firebase";

const { Provider, Consumer: UserConsumer } = createContext();

/**
 * This component allows you to *magically* access the current logged in user
 * without having to pass down any props.
 * The Provider component sends the user value down, and the consumer allows
 * you to actually use it.
 *
 * The user object will have status "loading", "signedIn" or "signedOut"
 * depending on its state.
 */

export class UserProvider extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user: {
        status: "loading",
        onChange: callback => onAuthStateChanged(auth, callback),
      },
    };
    this.unsubscribe = null;
  }

  componentDidMount() {
    try {
      this.unsubscribe = onAuthStateChanged(
        auth, 
        user => {
          const status = user ? "signedIn" : "signedOut";
          const userObj = { ...user, status };
          this.setState(prevState => ({
            user: {
              ...prevState.user,
              ...userObj,
            },
          }));
        },
        error => {
          console.error("Authentication state change error:", error);
          this.setState(prevState => ({
            user: {
              ...prevState.user,
              status: "signedOut",
              error: error.message,
            },
          }));
        }
      );
    } catch (error) {
      console.error("Error setting up auth state listener:", error);
      this.setState(prevState => ({
        user: {
          ...prevState.user,
          status: "error",
          error: error.message,
        },
      }));
    }
  }

  componentWillUnmount() {
    if (this.unsubscribe) {
      this.unsubscribe();
    }
  }

  render() {
    const { children } = this.props;
    const { user } = this.state;
    return <Provider value={user}>{children}</Provider>;
  }
}

UserProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

/**
 * Wrap your component with this function to get the current user
 * as a prop in the component.
 *
 * Usage:
 * export default withUser(YourComponent);
 */
export function withUser(Comp) {
  function ComponentWithUser(props) {
    return (
      <UserConsumer>
        {/* eslint-disable-next-line react/jsx-props-no-spreading */}
        {user => <Comp user={user} {...props} />}
      </UserConsumer>
    );
  }
  
  ComponentWithUser.displayName = `WithUser(${Comp.displayName || Comp.name || 'Component'})`;
  return ComponentWithUser;
}
