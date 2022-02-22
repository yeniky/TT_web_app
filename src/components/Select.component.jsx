import React from "react";

import { Select, MenuItem, FormHelperText } from "@material-ui/core";
import { makeStyles } from "@material-ui/styles";
import { ExpandMore } from "@material-ui/icons";

import Input from "components/Input.component";

const CustomSelect = ({
  placeholder,
  options,
  value,
  handleChange,
  className,
  error,
  containerStyles,
  ...otherProps
}) => {
  const classes = useStyles({
    color: value === "" ? "placeholder" : "darkGrey",
  });

  return (
    <div className={classes.container} style={containerStyles}>
      <Select
        className={`${classes.selectContainer} ${className} ${
          error ? classes.errorInput : undefined
        }`}
        value={value}
        onChange={handleChange}
        displayEmpty
        error={!!error}
        {...otherProps}
        IconComponent={ExpandMore}
        input={<Input containerStyles={{ width: "100%" }} />}
        disableUnderline
      >
        {placeholder && <MenuItem value={""}>{placeholder}</MenuItem>}
        {options &&
          options.map((option) => (
            <MenuItem value={option.value} key={option.value}>
              {option.label}
            </MenuItem>
          ))}
      </Select>
      {!!error && (
        <FormHelperText className={classes.formError} error>
          <span>{error}</span>
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
  selectContainer: {
    "& .MuiSelect-icon": {
      color: theme.palette.common.blue,
    },
    paddingLeft: "0.5rem",
    border: `solid 2px ${theme.palette.common.blue}`,
    borderRadius: 5,
    width: "10rem",
    height: "2.5rem",
    color: (props) => theme.palette.common[props.color],
  },
  formError: {
    position: "absolute",
    bottom: "-1rem",
    right: 5,
    "& span": {
      fontSize: "0.7rem",
    },
  },
  errorInput: {
    borderColor: theme.palette.common.red,
  },
}));

export default CustomSelect;
