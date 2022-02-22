import React from "react";

import { Typography, Dialog } from "@material-ui/core";
import { makeStyles } from "@material-ui/styles";

import Button from "components/Button.component";
import IconButton from "components/IconButton.component";

const SaveAlertModal = ({ open, close, confirm }) => {
  const classes = useStyles();

  return (
    <Dialog open={open} maxWidth={false}>
      <div className={classes.container}>
        <div className={classes.headerContainer}>
          <Typography className={classes.header} variant="h5">
            {"¿Desea archivar la alerta?"}
          </Typography>
          <IconButton close onClick={close} />
        </div>
        <div className={classes.buttons}>
          <Button className={classes.button} color="green" onClick={confirm}>
            <Typography component="p">{"Aceptar"}</Typography>
          </Button>
          <Button className={classes.button} color="red" onClick={close}>
            <Typography component="p">{"Cancelar"}</Typography>
          </Button>
        </div>
      </div>
    </Dialog>
  );
};

const useStyles = makeStyles((theme) => ({
  container: {
    padding: "2rem",
  },
  headerContainer: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  buttons: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-evenly",
    marginTop: "2rem",
  },
  header: {
    marginRight: "0.5rem",
  },
  button: {
    padding: "0.2rem 0.5rem",
    width: "7rem",
  },
}));

export default SaveAlertModal;
