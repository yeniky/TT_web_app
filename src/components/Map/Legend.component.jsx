import React from "react";

import { Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/styles";

import blueMarker from "assets/images/blueMarker.png";
import redMarker from "assets/images/redMarker.png";
import yellowMarker from "assets/images/yellowMarker.png";

const LegendMap = () => {
  const classes = useStyles();
  return (
    <section className={classes.legendContainer}>
      <div className={classes.legendItem}>
        <img
          className={classes.legendIcon}
          src={blueMarker}
          alt="icono marcador azul"
        />
        <Typography
          className={classes.legendText}
          variant="body1"
          color="textPrimary"
        >
          TAG Asociado
        </Typography>
      </div>
      <div className={classes.legendItem}>
        <img
          className={classes.legendIcon}
          src={redMarker}
          alt="icono marcador rojo"
        />
        <Typography
          className={classes.legendText}
          variant="subtitle1"
          color="textPrimary"
        >
          TAG Asociado con Alarma Activa
        </Typography>
      </div>
      <div className={classes.legendItem}>
        <img
          className={classes.legendIcon}
          src={yellowMarker}
          alt="icono marcador amarillo"
        />
        <Typography
          className={classes.legendText}
          variant="subtitle1"
          color="textPrimary"
        >
          TAG Sin Elemento Asociado
        </Typography>
      </div>
    </section>
  );
};

const useStyles = makeStyles((theme) => ({
  legendContainer: {
    display: "flex",
    justifyContent: "flex-end",
    height: "4rem",
    paddingRight: "2rem",
  },
  legendItem: {
    display: "flex",
    alignItems: "center",
    marginLeft: "2rem",
  },
  legendIcon: {
    width: "1.5rem",
  },
  legendText: {
    fontSize: "1.2rem",
    fontWeight: "normal",
    marginLeft: "0.7rem",
  },
}));

export default LegendMap;
