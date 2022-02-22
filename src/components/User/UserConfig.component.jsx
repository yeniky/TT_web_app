import React, { useState } from "react";

import { createStructuredSelector } from "reselect";

//redux
import { connect } from "react-redux";
import { setUser } from "redux/user/user.actions";
import { setUsername } from "redux/user/user.actions";

//styles components
import { makeStyles } from "@material-ui/styles";
import { Typography } from "@material-ui/core";
import { Person } from "@material-ui/icons";

//components
import Label from "components/ui/Label.component";
import Input from "components/Input.component";
import Button from "components/Button.component";
import { selectUser } from "redux/user/user.selectors";

//utils
import API from "utils/api";

const UserConfig = ({ changePassword, logout, user, setUsername }) => {
  const classes = useStyles();

  const [name, setName] = useState(user.username);

  const [errors, setErrors] = useState({});

  const handleChangeUsername = () => {
    if (!name) {
      setErrors({ username: "Introduzca un nombre de usuario." });
    } else {
      API.changeUsername(user.id, name, user.email)
        .then((res) => {
          setErrors({});
          setUsername(res.username);
        })
        .catch((error) => {
          console.error(error);
          setErrors({ error: "Ha ocurrido un error." });
        });
    }
  };

  const handleChange = (event) => {
    setName(event.target.value);
  };

  const handleLogout = () => {
    logout();
  };

  return (
    <div className={classes.container}>
      <div className={classes.headerContainer}>
        <Person className={classes.headerLogo} />
        <Typography className={classes.headerTitle} component="h1">
          {"CONFIGURACIÓN DE CUENTA"}
        </Typography>
      </div>
      <form className={classes.formContainer}>
        <div className={classes.formItem}>
          <Label textLabel="Email:" />
          <Input
            className={classes.formInput}
            // placeholder={`ejemplo@email.com`}
            value={user.email || ""}
            disabled
          />
        </div>
        <div className={classes.formItem}>
          <Label textLabel="Nombre:" />
          <Input
            className={classes.formInput}
            placeholder="Ingrese su Nombre"
            onChange={handleChange}
            value={name || ""}
            error={errors.username || errors.error}
          />
        </div>
        {/* <div className={classes.formItem}>
          <Label textLabel="Zona Horaria:" />
          <Select
            className={classes.formInput}
            placeholder="Seleccione Zona Horaria"
            value=""
          />
        </div> */}
      </form>
      <div className={classes.buttonsContainer}>
        <div className={classes.buttonsContainer_2}>
          <Button
            className={classes.saveButton}
            color="green"
            onClick={handleChangeUsername}
          >
            {"Guardar"}
          </Button>
          <Button
            className={classes.changeButton}
            color="darkGrey"
            onClick={changePassword}
          >
            {"Cambiar contraseña"}
          </Button>
        </div>
        <Button
          className={classes.logoutButton}
          color="darkGrey"
          onClick={handleLogout}
        >
          {"Cerrar sesion"}
        </Button>
      </div>
    </div>
  );
};

const useStyles = makeStyles((theme) => ({
  container: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
  },
  headerContainer: {
    display: "flex",
    alignItems: "center",
  },
  headerLogo: {
    backgroundColor: theme.palette.common.blue,
    color: "white",
    width: "3rem",
    height: "3rem",
    borderRadius: "50%",
    padding: 2,
    marginRight: "1rem",
  },
  headerTitle: {
    fontSize: "1.5rem",
    color: theme.palette.common.blue,
    fontWeight: 800,
  },
  formItem: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: "2rem",
  },
  formInput: {
    width: "18rem",
    marginLeft: "3rem",
  },
  formContainer: {
    margin: "2rem 0",
  },
  buttonsContainer: {
    width: "100%",
  },
  buttonsContainer_2: {
    display: "flex",
    justifyContent: "space-between",
  },
  logoutButton: {
    width: "100%",
    marginTop: "0.5rem",
  },
  changeButton: {
    width: "59%",
  },
  saveButton: {
    width: "39%",
  },
}));

const mapStateToProps = createStructuredSelector({
  user: selectUser,
});

const mapDispatchToProps = (dispatch) => ({
  logout: () =>
    dispatch(
      setUser({
        isLogguedIn: false,
        // email: "",
        // token: "",
        // username: "",
        // role: "",
        // id: 0,
      })
    ),
  setUsername: (username) => dispatch(setUsername(username)),
});

export default connect(mapStateToProps, mapDispatchToProps)(UserConfig);
