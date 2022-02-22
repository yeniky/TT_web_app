import React from "react";
import { makeStyles } from "@material-ui/styles";
import Label from "components/ui/Label.component";

const InfoTag = ({ address, zone, signal, time }) => {
  const classes = useStyles();
  return (
    <div className={classes.info}>
      <Label className={classes.text} textLabel={`ID: ${address}`} />
      <Label className={classes.text} textLabel={`Zona: ${zone}`} />
      <Label className={classes.text} textLabel={`Intensidad: ${signal}%`} />
      <Label
        className={classes.text}
        textLabel={`Ultima actualización: ${
          time >= 0 ? `hace ${time} minutos` : "-"
        }`}
      />
    </div>
  );
};

const useStyles = makeStyles((theme) => ({
  info: {
    display: "flex",
    flexDirection: "column",
  },
  text: {
    lineHeight: "2.5rem",
  },
}));

export default InfoTag;
