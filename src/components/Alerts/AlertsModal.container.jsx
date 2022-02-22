import React, { useState, useEffect } from "react";

import { Link } from "react-router-dom";

//redux
import { connect } from "react-redux";

import { selectDisplayAlertsModal } from "redux/ui/ui.selectors";
import { alertsSelector } from "redux/alerts/alerts.selectors";

import { setDisplayAlertsModal } from "redux/ui/ui.actions";
import { closeAlert } from "redux/alerts/alerts.actions";

//styles components
import { Dialog, Typography } from "@material-ui/core";
import { Error } from "@material-ui/icons";
import { makeStyles } from "@material-ui/styles";

//components
import IconButton from "components/IconButton.component";
import Button from "components/Button.component";

import AlertItem from "./AlertItem.component";
import SaveAlert from "./CloseAlert.component";

const AlertsModal = ({ open, closeModal, Alerts, onCloseAlert }) => {
  const classes = useStyles();
  const [alerts, setAlerts] = useState([]);
  const [alertToClose, setAlertToClose] = useState(null);
  useEffect(() => {
    setAlerts(Alerts);
  }, [Alerts]);
  return (
    <Dialog open={open} maxWidth={false}>
      <section className={classes.container}>
        <div className={classes.headerContainer}>
          <div className={classes.header}>
            <Error className={classes.errorLogo} />
            <Typography className={classes.headerTitle} variant="h5">
              {"ALERTAS ACTIVAS"}
            </Typography>
          </div>
          <IconButton close onClick={closeModal} />
        </div>
        <div className={classes.body}>
          {alerts.map((alert, index) => (
            <AlertItem
              key={index}
              alertInfo={alert}
              closeAlert={(id) => setAlertToClose(id)}
            />
          ))}
        </div>
        <Button
          className={classes.historyButton}
          color="darkGrey"
          component={Link}
          to="/alertHistory"
          onClick={() => closeModal()}
        >
          {"HISTORIAL DE ALERTAS"}
        </Button>
        <SaveAlert
          open={!!alertToClose}
          close={() => setAlertToClose(null)}
          confirm={() => {
            onCloseAlert(alertToClose);
            setAlertToClose(null);
          }}
        />
      </section>
    </Dialog>
  );
};

const useStyles = makeStyles((theme) => ({
  container: {
    padding: "2rem",
    display: "flex",
    flexDirection: "column",
  },
  headerContainer: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: "2rem",
  },
  header: {
    display: "flex",
    alignItems: "center",
  },
  errorLogo: {
    width: "3.5rem",
    height: "3.5rem",
    color: theme.palette.common.red,
    marginRight: "1rem",
  },
  headerTitle: {
    color: theme.palette.common.red,
    fontWeight: 600,
  },
  body: {
    width: "40vw",
    height: "40vh",
    overflowY: "auto",
  },
  historyButton: {
    marginTop: "2rem",
    alignSelf: "center",
    fontSize: "1.2rem",
  },
}));

const mapStateToProps = (state) => ({
  open: selectDisplayAlertsModal(state),
  Alerts: alertsSelector(state),
});

const mapDispatchToProps = (dispatch) => ({
  closeModal: () => dispatch(setDisplayAlertsModal(false)),
  onCloseAlert: (idAlert) => dispatch(closeAlert(idAlert)),
});

export default connect(mapStateToProps, mapDispatchToProps)(AlertsModal);
