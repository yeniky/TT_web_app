import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';

//redux
import { connect } from 'react-redux';

import {
  selectedZone,
  selectedZoneConfig,
  creatingZoneSelector,
} from 'redux/zone/zone.selectors';
import { alertsInZone } from 'redux/alerts/alerts.selectors';

import {
  clearSelectedZone,
  selectZoneToConfig,
  deleteZone,
} from 'redux/zone/zone.actions';

//styles components
import { makeStyles } from '@material-ui/styles';
import { CropFree } from '@material-ui/icons';
import { Typography, Popper, ClickAwayListener } from '@material-ui/core';

//components
import AlertList from 'components/Alerts/AlertList.component';
import IconButton from 'components/IconButton.component';
import Button from 'components/Button.component';
import ConfirmDelete from 'components/ZoneModal/ConfirmDelete.component';

const ZoneInfo = ({
  Zone,
  closeModal,
  onConfig,
  inConfig,
  alerts,
  onDeleteZone,
  creatingZone,
}) => {
  const classes = useStyles();
  const [open, setOpen] = useState(false);
  const [change, setChange] = useState(true);
  const [openConfirm, setOpenConfirm] = useState(false);
  const history = useHistory();

  useEffect(() => {
    setOpen(!!Zone);
    setChange(true);
  }, [Zone]);

  useEffect(() => {
    return () => closeModal();
  }, [closeModal]);
  const handleResponse = (response) => {
    if (response) {
      onDeleteZone(Zone.id);
    }
    setOpenConfirm(false);
  };

  return (
    <ClickAwayListener
      onClickAway={() =>
        !inConfig ? (change ? setChange(false) : closeModal()) : setChange(true)
      }
    >
      <Popper
        className={classes.modal}
        open={open}
        anchorEl={document.getElementById('map')}
        placement="right"
      >
        {Zone ? (
          <div className={classes.content}>
            <div className={classes.headerContainer}>
              <Typography className={classes.modalTitle}>
                <CropFree className={classes.icon} />
                {`ZONA ${Zone.alias}`}
              </Typography>
              <IconButton cancel onClick={() => closeModal()} />
            </div>
            <Typography className={classes.bodyText} component="p">
              {`Descripción: ${Zone.description}`}
            </Typography>
            <AlertList alerts={alerts} type="zone" />
            <div className={classes.buttonsContainers}>
              <div className={classes.buttons}>
                <Button
                  className={classes.button}
                  color="darkGrey"
                  onClick={() => history.push(`/zoneHistory/${Zone.alias}`)}
                >
                  {'historial'}
                </Button>
                <Button
                  className={classes.button}
                  color="green"
                  onClick={() => {
                    onConfig(Zone);
                    setChange(true);
                  }}
                >
                  {'configurar'}
                </Button>{' '}
              </div>

              <Button
                className={classes.eraseButton}
                color="red"
                onClick={() => setOpenConfirm(true)}
              >
                {'Borrar'}
              </Button>
              <ConfirmDelete open={openConfirm} onResponse={handleResponse} />
            </div>
          </div>
        ) : (
          <></>
        )}
      </Popper>
    </ClickAwayListener>
  );
};
const useStyles = makeStyles((theme) => ({
  modal: {
    zIndex: 1300,
  },
  content: {
    backgroundColor: 'white',
    padding: '0.4rem',
    border: 'solid black 2px',
    width: '20rem',
  },
  headerContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: '1rem',
  },
  modalTitle: {
    display: 'flex',
    fontSize: '1.3rem',
    fontWeight: 800,
    alignItems: 'center',
    color: theme.palette.common.green,
    marginRight: '1rem',
    textTransform: 'uppercase',
  },
  icon: {
    height: '2.2rem',
    width: '2.2rem',
    marginRight: 7,
    backgroundColor: theme.palette.common.blue,
    color: 'white',
    borderRadius: '50%',
    padding: '0.3rem',
  },
  bodyText: {
    lineHeigh: '0.3rem',
    maxWidth: '90%',
  },
  buttonsContainers: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    marginTop: '1rem',
    width: '100%',
  },
  buttons: {
    width: '100%',
    marginTop: '1rem',
    display: 'flex',
    justifyContent: 'space-between',
  },
  eraseButton: {
    width: '100%',
    marginTop: '0.5rem',
  },
  button: {
    width: '49%',
  },
}));

const mapStateToProps = (state) => ({
  Zone: selectedZone(state),
  inConfig: selectedZoneConfig(state),
  alerts: alertsInZone(state),
  creatingZone: creatingZoneSelector(state),
});

const mapDispatchToProps = (dispatch) => ({
  closeModal: () => dispatch(clearSelectedZone()),
  onConfig: (zone) => dispatch(selectZoneToConfig(false, zone)),
  onDeleteZone: (zoneId) => dispatch(deleteZone(zoneId)),
});

export default connect(mapStateToProps, mapDispatchToProps)(ZoneInfo);
