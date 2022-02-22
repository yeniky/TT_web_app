import React, { useState } from "react";

//redux
import { connect } from "react-redux";

import { closeAlert } from "redux/alerts/alerts.actions";

//styles components
import { Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/styles";
import IconButton from "components/IconButton.component";

//components
import CloseAlert from "./CloseAlert.component";

//utils
import { formatDateString } from "utils";

const AlertItem = ({ data, onCloseAlert, type }) => {
  const classes = useStyles();
  const [open, setOpen] = useState(false);
  return (
    <div className={classes.container}>
      {type === "tag" && (
        <>
          {data.alert_type === "Entry" && (
            <Typography className={classes.alert} component="p">
              {`${formatDateString(data.timestamp)} Ingreso a Zona ${
                data.zone.alias
              }`}
            </Typography>
          )}
          {data.alert_type === "Exit" && (
            <Typography className={classes.alert} component="p">
              {`${formatDateString(data.timestamp)} Egreso de Zona ${
                data.zone.alias
              }`}
            </Typography>
          )}
          {data.alert_type === "Permanence" && (
            <Typography className={classes.alert} component="p">
              {`${formatDateString(data.timestamp)} Permanencia en Zona ${
                data.zone.alias
              } por ${data.time} minutos`}
            </Typography>
          )}
        </>
      )}
      {type === "zone" && (
        <>
          {data.alert_type === "Entry" && (
            <Typography className={classes.alert} component="p">
              {`${formatDateString(data.timestamp)} Ingreso de Tag ${
                data.tag.config.alias || data.tag.address
              }`}
            </Typography>
          )}
          {data.alert_type === "Exit" && (
            <Typography className={classes.alert} component="p">
              {`${formatDateString(data.timestamp)} Egreso de Tag ${
                data.tag.config.alias || data.tag.address
              }`}
            </Typography>
          )}
          {data.alert_type === "Permanence" && (
            <Typography className={classes.alert} component="p">
              {`${formatDateString(data.timestamp)} Permanencia de Tag ${
                data.tag.config.alias || data.tag.address
              } por ${data.time} minutos`}
            </Typography>
          )}
        </>
      )}
      <IconButton
        className={classes.button}
        cancel
        onClick={() => setOpen(true)}
      />
      <CloseAlert
        open={open}
        confirm={() => {
          onCloseAlert(data.id);
          setOpen(false);
        }}
        close={() => setOpen(false)}
      />
    </div>
  );
};

const useStyles = makeStyles((theme) => ({
  container: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: "1rem",
  },
  alert: {
    backgroundColor: theme.palette.common.red,
    color: "white",
    flexGrow: 2,
    padding: "0.5rem",
    borderRadius: 5,
    fontSize: "0.7rem",
  },
  button: {
    margin: "0 0.5rem",
  },
}));

const mapDispatchToProps = (disptach) => ({
  onCloseAlert: (idAlert) => disptach(closeAlert(idAlert)),
});

export default connect(null, mapDispatchToProps)(AlertItem);
