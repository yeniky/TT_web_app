import React from "react";

//styles components
import { makeStyles } from "@material-ui/styles";
import { Typography } from "@material-ui/core";

const CustomLabel = ({ className, textLabel }) => {
  const classes = useStyles();
  return (
    <Typography
      className={`${classes.customLabel} ${className}`}
      component="label"
    >{`${textLabel}`}</Typography>
  );
};

const useStyles = makeStyles((theme) => ({
  customLabel: {
    fontSize: "1rem",
    color: "black",
    marginRight: "1.5rem",
  },
}));

export default CustomLabel;
