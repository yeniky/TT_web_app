import React, { useState } from 'react';

//styles components
import { makeStyles } from '@material-ui/styles';
import { Typography, ButtonBase, CircularProgress } from '@material-ui/core';
import { ArrowBackIos, VpnKey } from '@material-ui/icons';

//components
import Button from 'components/Button.component';
import Label from 'components/ui/Label.component';
import Input from 'components/Input.component';

//utils
import API from 'utils/api';

const PasswordConfig = ({ goBack }) => {
  const classes = useStyles();

  const [visibility, setVisibility] = useState(false);
  const [form, setForm] = useState({
    oldPassword: '',
    newPassword: '',
    confirmation: '',
  });

  const { oldPassword, newPassword, confirmation } = form;

  const [errors, setErrors] = useState({});
  const [isChanging, setIsChanging] = useState(false);

  const toggleVisibility = () => {
    setVisibility(!visibility);
  };

  const handleChange = (event) => {
    const { value, name } = event.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = () => {
    const errors = {};

    if (newPassword.length < 8 || newPassword.length > 20) {
      errors.newPassword =
        'La contraseña debe tener una longitud entre 8 y 20 caracteres.';
    }
    if (confirmation.length < 8 || confirmation.length > 20) {
      errors.confirmation =
        'La contraseña debe tener una longitud entre 8 y 20 caracteres.';
    }
    if (
      !errors.newPassword &&
      !errors.confirmation &&
      newPassword !== confirmation
    ) {
      errors.newPassword = 'Las contraseñas no coinciden.';
      errors.confirmation = 'Las contraseñas no coinciden.';
    }
    setErrors(errors);

    if (!errors.oldPassword && !errors.newPassword && !errors.confirmation) {
      setIsChanging(true);
      API.changePassword(oldPassword, newPassword)
        .then((res) => {
          goBack();
        })
        .catch((error) => {
          console.error(error);
          setErrors((currentErrors) => ({
            ...currentErrors,
            oldPassword: error.message,
          }));
          setIsChanging(false);
        });
    }
  };

  return (
    <div className={classes.container}>
      <div className={classes.headerContainer}>
        <ButtonBase className={classes.backButton} onClick={goBack}>
          <ArrowBackIos className={classes.backLogo} />
        </ButtonBase>
        <VpnKey className={classes.headerLogo} />
        <Typography className={classes.headerTitle} component="h1">
          {'CONFIGURACIÓN DE CUENTA'}
        </Typography>
      </div>
      <form className={classes.formContainer}>
        <div className={classes.formItem}>
          <Label textLabel="Contraseña Actual:" />
          <Input
            className={classes.formInput}
            onChange={handleChange}
            name="oldPassword"
            type={visibility ? 'text' : 'password'}
            error={errors.oldPassword}
          />
        </div>
        <div className={classes.formItem}>
          <Label textLabel="Contraseña Nueva:" />
          <Input
            className={classes.formInput}
            onChange={handleChange}
            name="newPassword"
            type={visibility ? 'text' : 'password'}
            error={errors.newPassword}
          />
        </div>
        <div className={classes.formItem}>
          <Label textLabel="Repita Contraseña Nueva:" />
          <Input
            className={classes.formInput}
            onChange={handleChange}
            name="confirmation"
            type={visibility ? 'text' : 'password'}
            error={errors.confirmation}
          />
        </div>
      </form>
      <div className={classes.buttonsContainer}>
        {isChanging ? (
          <CircularProgress />
        ) : (
          <Button
            className={classes.saveButton}
            color="green"
            onClick={handleSubmit}
          >
            {'Guardar'}
          </Button>
        )}
        <Button onClick={toggleVisibility} className={classes.toggleButton}>
          {!visibility ? `Mostrar` : 'Ocultar'}
        </Button>
      </div>
    </div>
  );
};

const useStyles = makeStyles((theme) => ({
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

export default PasswordConfig;
