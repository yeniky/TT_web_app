import React from "react";

import { makeStyles } from "@material-ui/styles";
import { Input } from "@material-ui/core";
import { Search } from "@material-ui/icons";

import Button from "components/Button.component";

const SearchAndDownload = ({ searchQuery, changeHandler, buttons }) => {
  const classes = useStyles();

  return (
    <div className={classes.buttonsAndSearch}>
      <Input
        className={classes.inputSearch}
        placeholder="Buscar"
        inputProps={{ className: classes.inputSearchProps }}
        endAdornment={<Search className={classes.searchIcon} />}
        disableUnderline
        value={searchQuery}
        onChange={changeHandler}
      />
      <div>
        {buttons &&
          buttons.map((buttonItem) => (
            <Button
              className={classes.buttonProps}
              key={buttonItem.label}
              color="green"
              onClick={buttonItem.handleClick}
            >
              {buttonItem.label}
            </Button>
          ))}
      </div>
    </div>
  );
};

const useStyles = makeStyles((theme) => ({
  searchIcon: {
    width: "2rem",
    height: "2rem",
    color: theme.palette.common.blue,
  },
  buttonsAndSearch: {
    display: "flex",
    justifyContent: "space-between",
    margin: "1rem 0",
  },
  inputSearchProps: {
    fontSize: "1.5rem",
    "&::placeholder": {
      color: theme.palette.common.blue,
    },
  },
  inputSearch: {
    border: `1px solid ${theme.palette.common.blue}`,
    padding: "0 0.5rem",
    borderRadius: 5,
    height: "2.5rem",
  },
  buttonProps: {
    marginLeft: "1rem",
    //height: "2.5rem",
    fontSize: "1rem",
  },
}));

export default SearchAndDownload;
