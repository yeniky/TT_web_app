import React from "react";

import { Input, FormHelperText } from "@material-ui/core";
import { makeStyles } from "@material-ui/styles";

const CustomInput = ({
  className,
  placeholder,
  value,
  handleChange,
  maxLength,
  maxDate,
  multiline,
  disabled,
  error,
  containerStyles,
  ...otherProps
}) => {
  const classes = useStyles({
    height: multiline ? undefined : "2.5rem",
    padding: multiline ? "3px 5px" : "0 5px",
  });
  return (
    <div className={classes.container} style={containerStyles}>
      <Input
        className={`${classes.customInput} ${className} ${
          disabled ? classes.customInputDisabled : undefined
        } ${error ? classes.errorInput : undefined}`}
        placeholder={`${placeholder ? placeholder : ""}`}
        value={value}
        onChange={handleChange}
        multiline={multiline}
        inputProps={{
          className: classes.inputProps,
          maxLength: maxLength,
          max: maxDate,
        }}
        disabled={disabled}
        disableUnderline
        error={!!error}
        {...otherProps}
      />
      {!!error && (
        <FormHelperText className={classes.formError} error>
          <span>{error}</span>
        </FormHelperText>
      )}
      {maxLength && (
        <FormHelperText
          className={classes.formHelper}
          error={value.length === maxLength}
        >
          <span>{`${value.length}/${maxLength}`}</span>
        </FormHelperText>
      )}
    </div>
  );
};

const useStyles = makeStyles((theme) => ({
  container: {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-end",
    position: "relative",
  },
  customInput: {
    border: `solid 2px ${theme.palette.common.blue}`,
    padding: (props) => props.padding,
    borderRadius: 5,
    width: "10rem",
    height: (props) => props.height,
    fontWeight: 700,
  },
  inputProps: {
    "&::placeholder": {
      color: theme.palette.common.placeholder,
      fontWeight: 700,
      opacity: 1,
    },
  },
  customInputDisabled: {
    border: "none",
  },
  formError: {
    position: "absolute",
    bottom: "-1rem",
    right: 5,
    "& span": {
      fontSize: "0.7rem",
    },
  },
  formHelper: {
    position: "absolute",
    bottom: "-1rem",
    left: 5,
    "& span": {
      fontSize: "0.7rem",
    },
  },
  errorInput: {
    borderColor: theme.palette.common.red,
  },
}));

export default CustomInput;
