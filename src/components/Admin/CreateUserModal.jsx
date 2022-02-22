import React, { useState } from 'react';
// import Button from '@material-ui/core/Button';
import Button from 'components/Button.component';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import { CircularProgress } from '@material-ui/core';

export default function CreateUserModal({ open, handleClose, handleSubmit }) {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (event) => {
    setEmail(event.target.value);
  };

  return (
    <div>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="form-dialog-title"
      >
        <DialogTitle id="form-dialog-title">CREAR USUARIO</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Introduzca el correo del usuario.
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            id="name"
            label="Dirección de Correo"
            type="email"
            variant="outlined"
            fullWidth
            value={email}
            onChange={handleChange}
            disabled={isLoading}
          />
        </DialogContent>
        <DialogActions>
          {isLoading ? (
            <CircularProgress />
          ) : (
            <>
              <Button onClick={handleClose} color="primary">
                Cancel
              </Button>
              <Button
                onClick={() => {
                  setIsLoading(true);
                  handleSubmit(email).then(() => {
                    setEmail('');
                    setIsLoading(false);
                  });
                }}
                color="green"
              >
                Crear
              </Button>
            </>
          )}
        </DialogActions>
      </Dialog>
    </div>
  );
}
