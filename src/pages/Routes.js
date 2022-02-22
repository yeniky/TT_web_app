import React, { useEffect } from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';

import { ThemeProvider } from '@material-ui/styles';
import { CssBaseline } from '@material-ui/core';

import theme from 'components/ui/Theme';

import { connect } from 'react-redux';

import { startFetchs } from 'redux/fetch.actions';

import useWebSocket from 'hooks/useWebSocket';

import Navbar from 'components/ui/Header.component';

import Dashboard from 'pages/Dashboard.page';
import Login from 'pages/Login.page';
import HistoryAlert from 'pages/HistoryAlert.page';
import HistoryTag from 'pages/HistoryTag.page';
import HistoryZone from 'pages/HistoryZone.page';
import TagsView from 'pages/Tags.page';
import UserView from 'pages/User.page';
import ActivateAccount from 'pages/ActivateAccount.page';
import AdminPage from 'pages/Admin.page';

import { selectUser } from 'redux/user/user.selectors';
import PrivateRoute from 'routes/PrivateRoute';
import ProtectedRoute from 'routes/ProtectedRoute';

const Routes = ({ startFetchs }) => {
  useEffect(() => {
    startFetchs();
  }, [startFetchs]);

  // useWebSocket('http://165.227.91.98:5001');
  const webSocketUrl = process.env.REACT_APP_WEBSOCKET_URL;
  useWebSocket(webSocketUrl);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Navbar />
        <Switch>
          <Route exact path="/" component={Login} />
          <ProtectedRoute exact path="/dashboard" component={Dashboard} />
          <ProtectedRoute exact path="/alertHistory" component={HistoryAlert} />
          <ProtectedRoute path="/tagHistory/:address" component={HistoryTag} />
          <ProtectedRoute path="/zoneHistory/:alias" component={HistoryZone} />
          <ProtectedRoute exact path="/tags" component={TagsView} />
          <ProtectedRoute exact path="/account" component={UserView} />
          <Route
            exact
            path="/account/activate/:token"
            component={ActivateAccount}
          />
          <PrivateRoute exact path="/admin" component={AdminPage} />
        </Switch>
      </Router>
    </ThemeProvider>
  );
};

const mapStateToProps = (state) => ({
  user: selectUser(state),
});

const mapDispatchToProps = (dispatch) => ({
  startFetchs: () => dispatch(startFetchs()),
});

export default connect(mapStateToProps, mapDispatchToProps)(Routes);
