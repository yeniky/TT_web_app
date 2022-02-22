import React from "react";

import { Button } from "@material-ui/core";
import { makeStyles } from "@material-ui/styles";

const CustomButton = ({
  children,
  color,
  className,
  active,
  ...otherProps
}) => {
  const classes = useStyles({ color: color });
  return (
    <Button
      className={`${classes.buttonContainer} ${className} ${
        active ? classes.activeButton : undefined
      }`}
      variant="contained"
      disableRipple
      disableElevation
      {...otherProps}
    >
      {children}
    </Button>
  );
};

const useStyles = makeStyles((theme) => ({
  buttonContainer: {
    backgroundColor: (props) => theme.palette.common[props.color],
    color: "white",
    fontWeight: "800",
    "&:hover": {
      backgroundColor: (props) => theme.palette.common[props.color],
      opacity: 0.7,
    },
  },
  activeButton: {
    filter: "brightness(85%)",
  },
}));

export default CustomButton;
