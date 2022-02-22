import React from "react";

import { Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/styles";
import IconButton from "components/IconButton.component";

//utils
import { formatDateString } from "utils";

const AlertItem = ({ alertInfo, closeAlert }) => {
  const classes = useStyles();
  return (
    <div className={classes.container}>
      {alertInfo.alert_type === "Entry" && (
        <Typography className={classes.alert} component="p">
          {`${formatDateString(alertInfo.timestamp)} Ingreso de Tag ${
            alertInfo.tag.config
              ? alertInfo.tag.config.alias
              : alertInfo.tag.address
          } a Zona ${alertInfo.zone ? alertInfo.zone.alias : "-"}`}
        </Typography>
      )}
      {alertInfo.alert_type === "Exit" && (
        <Typography className={classes.alert} component="p">
          {`${formatDateString(alertInfo.timestamp)} Egreso de Tag ${
            alertInfo.tag.config
              ? alertInfo.tag.config.alias
              : alertInfo.tag.address
          } de Zona ${alertInfo.zone ? alertInfo.zone.alias : "-"}`}
        </Typography>
      )}
      {alertInfo.alert_type === "Permanence" && (
        <Typography className={classes.alert} component="p">
          {`${formatDateString(alertInfo.timestamp)} Permanencia de Tag ${
            alertInfo.tag.config
              ? alertInfo.tag.config.alias
              : alertInfo.tag.address
          } en Zona ${alertInfo.zone ? alertInfo.zone.alias : "-"} por ${
            alertInfo.time
          } minutos`}
        </Typography>
      )}
      <IconButton
        className={classes.button}
        cancel
        onClick={() => closeAlert(alertInfo.id)}
      />
    </div>
  );
};

const useStyles = makeStyles((theme) => ({
  container: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
    marginBottom: "1rem",
  },
  alert: {
    backgroundColor: theme.palette.common.red,
    color: "white",
    flexGrow: 2,
    padding: "0.5rem",
    borderRadius: 5,
  },
  button: {
    margin: "0 0.5rem",
  },
}));

export default AlertItem;
