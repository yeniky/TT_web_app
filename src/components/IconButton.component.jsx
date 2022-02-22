import React from "react";
import { IconButton } from "@material-ui/core";
import { makeStyles } from "@material-ui/styles";
import {
  CheckCircle,
  Close,
  Warning,
  Archive,
  AddCircle,
  Cancel,
} from "@material-ui/icons";

//TODO: Refactor for optimization

const CustomIconButton = ({
  cancel,
  accept,
  close,
  warning,
  archive,
  add,
  className,
  ...otherProps
}) => {
  const classes = useStyles();
  return (
    <IconButton
      className={`${classes.iconButton} ${className}`}
      disableRipple
      {...otherProps}
    >
      {cancel && <Cancel className={classes.cancel} />}
      {accept && <CheckCircle className={classes.add} />}
      {close && <Close className={classes.close} />}
      {warning && <Warning className={classes.warning} />}
      {archive && <Archive className={classes.archive} />}
      {add && <AddCircle className={classes.add} />}
    </IconButton>
  );
};

const useStyles = makeStyles((theme) => ({
  iconButton: {
    border: "none",
    outline: "none",
    backgroundColor: "transparent",
    cursor: "pointer",
    padding: 0,
  },
  icon: {
    width: "1.7rem",
    height: "1.7rem",
    color: theme.palette.common.green,
  },
  close: {
    width: "2rem",
    height: "2rem",
    color: theme.palette.common.darkGrey,
  },
  warning: {
    width: "2rem",
    height: "2rem",
    color: "#ffa931",
  },
  archive: {
    width: "2rem",
    height: "2rem",
    color: theme.palette.common.darkGrey,
  },
  add: {
    width: "2rem",
    height: "2rem",
    color: theme.palette.common.green,
  },
  cancel: {
    width: "2rem",
    height: "2rem",
    color: theme.palette.common.red,
  },
}));

export default CustomIconButton;
