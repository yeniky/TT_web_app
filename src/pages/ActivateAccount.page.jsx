import React, { useState } from 'react';

//styles components
import { makeStyles } from '@material-ui/styles';
import { Typography, CircularProgress } from '@material-ui/core';
import { VerifiedUser } from '@material-ui/icons';

//components
import Button from 'components/Button.component';
import Label from 'components/ui/Label.component';
import Input from 'components/Input.component';

// router
import { useHistory, useParams } from 'react-router-dom';

//utils
import API from 'utils/api';

import { ReactComponent as Logo } from 'assets/Logo.svg';

const ActivateAccount = ({ goBack }) => {
  const classes = useStyles();

  const history = useHistory();
  const params = useParams();

  const [visibility, setVisibility] = useState(false);
  const [form, setForm] = useState({
    username: '',
    password: '',
    confirmation: '',
  });

  const { username, password, confirmation } = form;

  const [errors, setErrors] = useState({});

  const [isActivating, setIsActivating] = useState(false);

  const toggleVisibility = () => {
    setVisibility(!visibility);
  };

  const handleChange = (event) => {
    const { value, name } = event.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = () => {
    const errors = {};
    if (!username) {
      errors.username = 'Introduzca un nombre de usuario.';
    }
    if (!password || !confirmation) {
      errors[!password ? 'password' : 'confirmation'] =
        'No se permite establecer contraseña vacía.';
    } else {
      if (password.length < 8 || password.length > 20) {
        errors.password =
          'La contraseña debe tener una longitud entre 8 y 20 caracteres.';
      }
      if (confirmation.length < 8 || confirmation.length > 20) {
        errors.confirmation =
          'La contraseña debe tener una longitud entre 8 y 20 caracteres.';
      }
    }
    if (!errors.password && !errors.confirmation && password !== confirmation) {
      errors.password = 'Las contraseñas no coinciden.';
      errors.confirmation = 'Las contraseñas no coinciden.';
    }
    setErrors(errors);
    if (!errors.confirmation && !errors.password && !errors.username) {
      setIsActivating(true);
      API.activateAccount(username, password, params.token)
        .then((res) => {
          history.push('/');
        })
        .catch((error) => {
          setErrors({ confirmation: error.message });
          setIsActivating(false);
        });
    }
  };

  return (
    <div className={classes.activateContainer}>
      <Logo className={classes.logo} />
      <div className={classes.container}>
        <div className={classes.headerContainer}>
          <VerifiedUser className={classes.headerLogo} />
          <Typography className={classes.headerTitle} component="h1">
            {'ACTIVACIÓN DE CUENTA'}
          </Typography>
        </div>
        <form className={classes.formContainer}>
          <div className={classes.formItem}>
            <Label textLabel="Nombre de Usuario:" />
            <Input
              className={classes.formInput}
              onChange={handleChange}
              name="username"
              type="text"
              error={errors.username}
              disabled={isActivating}
            />
          </div>
          <div className={classes.formItem}>
            <Label textLabel="Contraseña:" />
            <Input
              className={classes.formInput}
              onChange={handleChange}
              name="password"
              type={visibility ? 'text' : 'password'}
              error={errors.password}
              disabled={isActivating}
            />
          </div>
          <div className={classes.formItem}>
            <Label textLabel="Confirme Contraseña:" />
            <Input
              className={classes.formInput}
              onChange={handleChange}
              name="confirmation"
              type={visibility ? 'text' : 'password'}
              error={errors.confirmation}
              disabled={isActivating}
            />
          </div>
        </form>
        <div className={classes.buttonsContainer}>
          {isActivating ? (
            <CircularProgress />
          ) : (
            <Button
              className={classes.saveButton}
              color="green"
              onClick={handleSubmit}
              disabled={!Object.values(form).every(Boolean)}
            >
              {'Activar'}
            </Button>
          )}
          <Button onClick={toggleVisibility} className={classes.toggleButton}>
            {!visibility ? `Mostrar` : 'Ocultar'}
          </Button>
        </div>
      </div>
    </div>
  );
};

const useStyles = makeStyles((theme) => ({
  activateContainer: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    width: '9rem',
    height: '9rem',
    marginTop: '5rem',
  },
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerContainer: {
    display: 'flex',
    alignItems: 'center',
    position: 'relative',
  },
  headerLogo: {
    backgroundColor: theme.palette.common.blue,
    color: 'white',
    width: '3rem',
    height: '3rem',
    borderRadius: '50%',
    padding: 2,
    marginRight: '1rem',
  },
  headerTitle: {
    fontSize: '1.5rem',
    color: theme.palette.common.blue,
    fontWeight: 800,
  },
  backLogo: {
    width: '2.5rem',
    height: '2.5rem',
    color: theme.palette.common.blue,
  },
  formItem: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: '2rem',
  },
  formInput: {
    width: '18rem',
    marginLeft: '3rem',
  },
  formContainer: {
    margin: '2rem 0',
  },
  buttonsContainer: {
    width: '100%',
    display: 'flex',
    justifyContent: 'space-evenly',
    // marginTop: "1rem",
  },
  saveButton: {
    width: '69%',
  },
  toggleButton: {
    width: '29%',
  },
  backButton: {
    position: 'absolute',
    left: '-2rem',
  },
}));

export default ActivateAccount;
