import React from 'react';

//styles components
import { makeStyles } from '@material-ui/styles';
import { Typography } from '@material-ui/core';

//components
import AlertItem from './ItemInModal.component';

const AlertList = ({ alerts, type }) => {
  const classes = useStyles();
  return (
    <div className={classes.container}>
      <Typography className={classes.header} component="h2">
        {'ALERTAS ACTIVAS'}
      </Typography>
      {alerts.length > 0 ? (
        <div className={classes.listContainer}>
          {alerts.map((alert) => (
            <AlertItem data={alert} key={alert.id} type={type} />
          ))}
        </div>
      ) : (
        <Typography className={classes.noAlerts}>
          {'No hay alertas activas'}
        </Typography>
      )}
    </div>
  );
};

const useStyles = makeStyles((theme) => ({
  container: {
    marginTop: '0.5rem',
    width: '100%',
  },
  header: {
    fontSize: '1.3rem',
    color: theme.palette.common.red,
    fontWeight: 800,
  },
  listContainer: {
    maxHeight: '7rem',
    overflowY: 'auto',
  },
}));

export default AlertList;
