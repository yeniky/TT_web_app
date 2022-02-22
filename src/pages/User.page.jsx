import React, { useState } from "react";

//styles components
import { makeStyles } from "@material-ui/styles";

//components
import UserConfig from "components/User/UserConfig.component";
import PasswordConfig from "components/User/PasswordConfig.component";

const UserView = () => {
  const classes = useStyles();
  const [displayPasswordConfig, setDisplayPasswordConfig] = useState(false);
  return (
    <section className={classes.container}>
      <div className={classes.userConfigContainer}>
        {displayPasswordConfig ? (
          <PasswordConfig goBack={() => setDisplayPasswordConfig(false)} />
        ) : (
          <UserConfig changePassword={() => setDisplayPasswordConfig(true)} />
        )}
      </div>
    </section>
  );
};

const useStyles = makeStyles((theme) => ({
  container: {
    backgroundColor: theme.palette.common.lightGrey,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    height: "91vh",
  },
  userConfigContainer: {
    backgroundColor: "white",
    padding: "2rem 3rem",
    borderRadius: "1rem",
    width: "35rem",
    height: "30rem",
  },
}));

export default UserView;
