import React, { useState } from 'react';
import Button from 'components/Button.component';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import { CircularProgress } from '@material-ui/core';

export default function DeleteUserModal({
  open,
  user,
  handleClose,
  handleSubmit,
}) {
  const [isLoading, setIsLoading] = useState(false);

  return (
    <div>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="form-dialog-title"
      >
        <DialogTitle id="form-dialog-title">ELIMINAR USUARIO</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Desea eliminar al usuario{' '}
            <strong>{user.username ? user.username : user.email}</strong>?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          {isLoading ? (
            <CircularProgress />
          ) : (
            <>
              <Button onClick={handleClose} color="gray">
                Cancel
              </Button>
              <Button
                onClick={() => {
                  setIsLoading(true);
                  handleSubmit(user.id).then(() => {
                    setIsLoading(false);
                  });
                }}
                color="red"
              >
                Eliminar
              </Button>
            </>
          )}
        </DialogActions>
      </Dialog>
    </div>
  );
}
