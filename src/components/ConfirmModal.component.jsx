import React from "react";

//styles components
import { Dialog, Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/styles";

//components
import Button from "components/Button.component";

const ConfirmModal = ({ open, title, onConfirm, onCancel }) => {
  const classes = useStyles();
  return (
    <Dialog open={open} maxWidth={false}>
      <div className={classes.container}>
        <Typography variant="h4">{title}</Typography>
        <div className={classes.buttonContainer}>
          <Button className={classes.button} color="green" onClick={onConfirm}>
            {"aceptar"}
          </Button>
          <Button className={classes.button} color="red" onClick={onCancel}>
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
  button: {
    width: "10rem",
  },
}));

export default ConfirmModal;
