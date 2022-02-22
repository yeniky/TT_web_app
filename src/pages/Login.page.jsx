import React, { useState } from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";

//redux
import { setUser } from "redux/user/user.actions";

//api
import API from "utils/api";

import { makeStyles } from "@material-ui/styles";

import Button from "components/Button.component";
import Input from "components/Input.component";

import { ReactComponent as Logo } from "assets/Logo.svg";

// import { mockLogin } from "utils";

const Login = ({ history, setUser }) => {
  const classes = useStyles();
  const [userCredentials, setCredentials] = useState({
    // email: "test@trackandtrace.cl",
    // password: "password1234",
    email: "admin@mail.com",
    password: "password",
  });
  const [errors, setErrors] = useState({});

  const { email, password } = userCredentials;

  const handleChange = (event) => {
    const { value, name } = event.target;
    setCredentials({ ...userCredentials, [name]: value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    await handleLogin();
    return false;
  };

  const handleLogin = async () => {
    // const response = mockLogin(email, password);
    try {
      const user = await API.login(email, password);
      if (user) {
        const credential = await API.getToken(email, password);
        setUser({ ...user, token: credential.token, isLogguedIn: true });
        history.push("/dashboard");
      }
    } catch (error) {
      // setErrors(error.response);
      // TODO: set errors
      console.error(error);
      setErrors({ credentials: "Credenciales incorrectas" });
      // setErrors(response.errors);
    }
  };

  return (
    <div className={classes.loginContainer}>
      <Logo className={classes.logo} />
      <form className={classes.formContainer} onSubmit={handleSubmit}>
        <div className={classes.formItem}>
          <Input
            className={classes.formInput}
            name="email"
            type="email"
            handleChange={handleChange}
            value={email}
            placeholder="Correo"
            error={errors.email || errors.credentials}
          />
        </div>
        <div className={classes.formItem}>
          <Input
            className={classes.formInput}
            name="password"
            type="password"
            value={password}
            handleChange={handleChange}
            placeholder="Contraseña"
            error={errors.password || errors.credentials}
          />
        </div>
        <Button className={classes.formButton} color="green" type="submit">
          {"INGRESAR"}
        </Button>
      </form>
    </div>
  );
};

const useStyles = makeStyles((theme) => ({
  loginContainer: {
    height: "100%",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
  },
  logo: {
    width: "9rem",
    height: "9rem",
    marginTop: "5rem",
  },
  formContainer: {
    marginTop: "3rem",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    position: "relative",
  },
  formInput: {
    width: "18rem",
    height: "3rem",
  },
  formItem: {
    marginBottom: "1rem",
  },
  formButton: {
    marginTop: "1rem",
    width: "15rem",
    fontSize: "1.2rem",
  },
}));

const mapDispatchToProps = (dispatch) => ({
  setUser: (user) => dispatch(setUser(user)),
});

export default connect(undefined, mapDispatchToProps)(withRouter(Login));
