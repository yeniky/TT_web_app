import React from "react";

//styles components
import { makeStyles } from "@material-ui/styles";
import { Typography } from "@material-ui/core";

//components
import Button from "components/Button.component";

//utils
import { getMinutesDifference } from "utils";

const InfoTag = ({ tag, onEdit }) => {
  const classes = useStyles();
  return (
    <section>
      <div className={classes.headerContainer}>
        <Typography
          className={classes.header}
          variant="h4"
        >{`HISTORIAL ${tag.address}`}</Typography>
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
          >{`ID: ${tag.address}`}</Typography>
          <Typography className={classes.info}>{`Zona: ${
            tag.zone ? tag.zone.alias : "-"
          }`}</Typography>
          <Typography
            className={classes.info}
          >{`Intensidad: ${tag.signal}%`}</Typography>
          <Typography className={classes.info}>
            {`Ultima Actualización: hace ${
              tag.last_timestamp
                ? getMinutesDifference(tag.last_timestamp)
                : "-"
            } minutos`}
          </Typography>
        </div>
        <div>
          <Typography className={classes.info}>{`Alias: ${
            tag.config ? tag.config.alias : "-"
          }`}</Typography>
          <Typography className={classes.info}>{`Tipo: ${
            tag.config ? tag.config.type : "-"
          }`}</Typography>
          <Typography className={classes.info}>{`Descripción: ${
            tag.config ? tag.config.description : "-"
          }`}</Typography>
        </div>
      </div>
    </section>
  );
};

const useStyles = makeStyles((theme) => ({
  headerContainer: {
    width: "40%",
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

export default InfoTag;
