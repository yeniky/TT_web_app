import React from "react";
import { Route, Redirect } from "react-router-dom";
import { connect } from "react-redux";
import { selectUser } from "redux/user/user.selectors";

const ProtectedRoute = ({ component: Component, user, ...rest }) => (
  <Route
    {...rest}
    render={(props) => {
      if (user?.isLogguedIn) {
        // if (user?.role === "admin")
        return <Component {...props} />;
        // else
        //   return (
        // <Redirect
        //   to={{ pathname: "/", state: { from: props.location } }}
        // />
        //   );
      } else {
        return (
          <Redirect to={{ pathname: "/", state: { from: props.location } }} />
        );
      }
    }}
  />
);

const mapStateToProps = (state) => ({
  user: selectUser(state),
});

export default connect(mapStateToProps)(ProtectedRoute);
