import React from "react";

//styles components
import { makeStyles } from "@material-ui/styles";
import { Typography } from "@material-ui/core";

//components
import Button from "components/Button.component";

const InfoZone = ({ zone, onEdit }) => {
  const classes = useStyles();
  return (
    <section>
      <div className={classes.headerContainer}>
        <Typography
          className={classes.header}
          variant="h4"
        >{`HISTORIAL ${zone.alias}`}</Typography>
        <Button
          className={classes.editButton}
          color="green"
          onClick={() => onEdit()}
        >
          {"EDITAR"}
        </Button>
      </div>
      <div className={classes.infoContainer}>
        <div className={classes.infoColumn}>
          <Typography
            className={classes.info}
          >{`Alias: ${zone.alias}`}</Typography>
          <Typography
            className={classes.info}
          >{`Descripción: ${zone.description}`}</Typography>
        </div>
      </div>
    </section>
  );
};

const useStyles = makeStyles((theme) => ({
  headerContainer: {
    width: "45%",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  header: {
    color: theme.palette.common.green,
  },
  infoContainer: {
    display: "flex",
    alignItems: "flex-start",
    margin: "2rem 0",
  },
  infoColumn: {
    marginRight: "4rem",
  },
  info: {
    fontSize: "1.5rem",
  },
  editButton: {
    fontSize: "1.5rem",
    fontWeight: "normal",
    padding: "0 1.5rem",
  },
}));

export default InfoZone;
