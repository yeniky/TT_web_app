import React, { useEffect } from "react";

//router
import { useHistory, useLocation, Link } from "react-router-dom";

//redux
import { connect } from "react-redux";
import { createStructuredSelector } from "reselect";
import { setAppInfo } from "redux/appInfo/appInfo.actions";

import {
  selectDisplayZone,
  selectDisplayAlertsModal,
} from "redux/ui/ui.selectors";

import { countAlerts } from "redux/alerts/alerts.selectors";

import { setDisplayZones, setDisplayAlertsModal } from "redux/ui/ui.actions";

//styles components
import { makeStyles } from "@material-ui/styles";
import { AppBar, Toolbar, Typography } from "@material-ui/core";
import { Warning, Person, Settings } from "@material-ui/icons";
import { ReactComponent as Logo } from "assets/LogoH.svg";

//components
import Button from "components/Button.component";

import Sound from "react-sound";
import notificationSound from "assets/sounds/notification.mp3";
import ModalAlerts from "components/Alerts/AlertsModal.container";

//hooks
import useAlertNotification from "hooks/useAlertNotification";
import { selectUser } from "redux/user/user.selectors";

import API from "utils/api";
import { selectAppInfo } from "redux/appInfo/appInfo.selector";

const Header = ({
  countAlerts,
  isDisplayingAlertsModal,
  showAlertsModal,
  isDisplayingZones,
  showZones,
  user,
  setAppInfo,
  appInfo,
}) => {
  const classes = useStyles();

  const history = useHistory();
  const location = useLocation();

  useEffect(() => {
    API.getAppInfo()
      .then((data) => {
        setAppInfo(data.client, data.place);
      })
      .catch((err) => {
        setAppInfo("Error", "Error");
      });
  }, [setAppInfo]);

  const {
    active,
    color,
    soundStatus,

    onFinish,
  } = useAlertNotification(countAlerts);

  return location.pathname !== "/" &&
    !location.pathname.startsWith("/account/activate") ? (
    <>
      <AppBar className={classes.header} position="fixed">
        <Toolbar>
          <div
            className={classes.logoContainer}
            onClick={() => {
              history.push("/dashboard");
              showZones(false);
            }}
          >
            <Logo className={classes.logo} />
            <div className={classes.userContainer}>
              <Typography
                className={classes.userDisplay}
                variant="h6"
                color="textPrimary"
              >
                {appInfo?.client || ""}
              </Typography>
              <Typography
                className={classes.userDisplay}
                variant="h6"
                color="textPrimary"
              >
                {appInfo?.place || ""}
              </Typography>
              <Typography
                className={classes.userDisplay}
                variant="subtitle1"
                color="textPrimary"
              >
                {`Bienvenido, ${user.username || ""}`}
              </Typography>
            </div>
          </div>
          <div className={classes.buttonsContainer}>
            {/*             <button style={{ marginRight: 5 }} onClick={handleAlert}>
              {active ? "Parar alerta" : "Crear Alerta"}
            </button> */}
            <Button
              className={classes.headerButton}
              color="blue"
              onClick={() => {
                history.push("/dashboard");
                showZones(false);
              }}
              active={location.pathname === "/dashboard" && !isDisplayingZones}
            >
              {"mapa"}
            </Button>
            <Button
              className={classes.headerButton}
              color="blue"
              onClick={() =>
                location.pathname === "/dashboard"
                  ? showZones(!isDisplayingZones)
                  : (history.push("/dashboard"), showZones(true))
              }
              active={isDisplayingZones}
            >
              {"zonas"}
            </Button>
            <Button
              className={classes.headerButton}
              color="blue"
              component={Link}
              to="/tags"
              active={location.pathname === "/tags"}
            >
              {"tags"}
            </Button>
            {active ? (
              <Button
                className={classes.headerButtonAlert}
                color={color}
                onClick={() => showAlertsModal(true)}
              >
                <Sound
                  url={notificationSound}
                  playStatus={soundStatus}
                  onFinishedPlaying={onFinish}
                />
                <div className={classes.notifyButton}>
                  <Warning className={classes.notifyIcon} />
                  <Typography className={classes.notifyText}>
                    {`${countAlerts} alertas`}
                  </Typography>
                </div>
              </Button>
            ) : (
              <Button
                className={classes.headerButton}
                color="blue"
                onClick={() => showAlertsModal(true)}
                active={
                  isDisplayingAlertsModal ||
                  location.pathname === "/alertHistory"
                }
              >
                {"Alertas"}
              </Button>
            )}

            <Button
              className={classes.userButton}
              color="blue"
              component={Link}
              to="/account"
              active={location.pathname === "/account"}
            >
              <Person className={classes.userIcon} />
            </Button>
            {user?.role === "Admin" ? (
              <Button
                className={classes.userButton}
                color="blue"
                component={Link}
                to="/admin"
                active={location.pathname === "/admin"}
              >
                <Settings className={classes.userIcon} />
              </Button>
            ) : undefined}
          </div>
        </Toolbar>
      </AppBar>
      <div className={classes.toolbarMargin} />
      <ModalAlerts />
    </>
  ) : null;
};

const useStyles = makeStyles((theme) => ({
  toolbarMargin: { height: "9vh" },
  header: {
    backgroundColor: "white",
    width: "100%",
    height: "9vh",
  },
  logoContainer: {
    display: "flex",
    alignItems: "center",
  },
  logo: {
    width: "15rem",
    height: "5rem",
    margin: "1.7rem 0 1.7rem 1.5rem",
    cursor: "pointer",
  },
  userContainer: {
    marginLeft: "4rem",
    //marginBottom: "2.5rem",
  },
  userDisplay: {
    marginTop: -8,
    //fontWeight: "normal",
  },
  buttonsContainer: {
    marginLeft: "auto",
  },
  userIcon: {
    width: "3rem",
    height: "3rem",
    color: theme.palette.common.white,
  },
  notifyIcon: {
    width: "2.5rem",
    height: "2.5rem",
    color: "white",
  },
  notifyButton: {
    display: "flex",
    width: "100%",
    alignItems: "center",
    justifyContent: "space-evenly",
  },
  notifyText: {
    fontSize: "1.2rem",
    fontWeight: "bold",
    whiteSpace: "nowrap",
  },
  headerButton: {
    fontSize: "1.5rem",
    height: "3.5rem",
    padding: "1rem 2.5rem",
    marginLeft: "0.5rem",
    width: "11rem",
  },
  userButton: {
    height: "3.5rem",
    width: "2rem",
    marginLeft: "0.5rem",
  },
  headerButtonAlert: {
    fontSize: "1.5rem",
    height: "3.5rem",
    padding: "1rem 1.25rem",
    marginLeft: "0.5rem",
    width: "11rem",
  },
}));

const mapStateToProps = createStructuredSelector({
  isDisplayingZones: selectDisplayZone,
  isDisplayingAlertsModal: selectDisplayAlertsModal,
  countAlerts: countAlerts,
  user: selectUser,
  appInfo: selectAppInfo,
});

const mapDispatchToProps = (dispatch) => ({
  showZones: (value) => dispatch(setDisplayZones(value)),
  showAlertsModal: (value) => dispatch(setDisplayAlertsModal(value)),
  setAppInfo: (client, place) => dispatch(setAppInfo(client, place)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Header);
