import React from "react";

//styles components
import { makeStyles } from "@material-ui/styles";
import { CircularProgress } from "@material-ui/core";

const Loading = (WrappedComponent) => ({ isLoading, ...otherProps }) => {
  return isLoading ? (
    <LoadingComponent />
  ) : (
    <WrappedComponent {...otherProps} />
  );
};

const LoadingComponent = () => {
  const classes = useStyles();

  return (
    <div className={classes.loadingContainer}>
      <CircularProgress className={classes.loading} />
    </div>
  );
};

const useStyles = makeStyles((theme) => ({
  loadingContainer: {
    height: "20%",
    width: "100%",
    display: "flex",
    justifyContent: "center",
  },
}));

export default Loading;
