import React from "react";

//styles components
import { Dialog, Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/styles";
import Button from "components/Button.component";

const ConfirmDelete = ({ open, onResponse }) => {
  const classes = useStyles();
  return (
    <Dialog open={open} maxWidth={false}>
      <div className={classes.container}>
        <Typography variant="h4">{"¿Desea borrar esta zona?"}</Typography>
        <div className={classes.buttonContainer}>
          <Button
            className={classes.button}
            color="green"
            onClick={() => onResponse(true)}
          >
            {"aceptar"}
          </Button>
          <Button
            className={classes.button}
            color="red"
            onClick={() => onResponse(false)}
          >
            {"cancelar"}
          </Button>
        </div>
      </div>
    </Dialog>
  );
};

const useStyles = makeStyles((theme) => ({
  container: {
    padding: "1rem 2rem",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  buttonContainer: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-evenly",
    width: "90%",
    marginTop: "2rem",
  },
}));

export default ConfirmDelete;
