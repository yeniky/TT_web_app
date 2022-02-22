import React, { useState, useEffect } from 'react';

//redux
import { connect } from 'react-redux';

import {
  selectedZoneConfig,
  selectZoneErrors,
} from 'redux/zone/zone.selectors';

import {
  clearSelectedZoneConfig,
  addNewZone,
  editZone,
  setCreatingZone,
} from 'redux/zone/zone.actions';

//styles components
import { makeStyles } from '@material-ui/styles';
import { Dialog, Typography } from '@material-ui/core';
import { CropFree } from '@material-ui/icons';

//components
import Form from './Form.component';
import RuleList from './RuleList.component';
import AddRule from './AddRule.component';

import Button from 'components/Button.component';
import ModalTitle from 'components/ui/ModalTitle.component';

import { zoneRuleEquals } from 'utils';

//TODO: change handlers to local reducer
const ZoneConfig = ({
  Zone,
  closeModal,
  onNewZone,
  onEditZone,
  formErrors,
  setCreatingZoneMode,
}) => {
  const classes = useStyles();

  const [editedZone, setEditedZone] = useState();
  useEffect(() => {
    if (Zone) {
      setEditedZone(Zone);
    }
  }, [Zone]);

  useEffect(() => {
    return () => closeModal();
  }, [closeModal]);

  const handleFormChange = (event) => {
    const { name, value } = event.target;
    setEditedZone({ ...editedZone, [name]: value });
  };

  const addRuleHandler = (newRule) => {
    if (!editedZone.alerts.find((rule) => zoneRuleEquals(rule, newRule))) {
      setEditedZone({
        ...editedZone,
        alerts: [...editedZone.alerts, newRule],
      });
      return true;
    } else {
      return false;
    }
  };

  const deleteRuleHandler = (index) => {
    const { alerts } = editedZone;
    setEditedZone({
      ...editedZone,
      alerts: alerts.filter((_, ruleIndex) => ruleIndex !== index),
    });
  };

  return (
    <Dialog open={!!Zone} maxWidth={false}>
      {editedZone && (
        <div className={classes.container}>
          <ModalTitle title={`ZONA ${editedZone.alias}`} Icon={CropFree} />
          <Form
            zone={editedZone}
            handleFormChange={handleFormChange}
            formErrors={formErrors}
          />
          <div>
            <Typography className={classes.subtitle} component="h2">
              {'ALERTAS'}
            </Typography>
            <RuleList
              ruleList={editedZone.alerts || []}
              onDeleteRule={deleteRuleHandler}
            />
            <AddRule onAddRule={addRuleHandler} />
          </div>
          <div className={classes.buttonContainer}>
            <Button
              className={classes.buttonItem}
              color="red"
              onClick={() => {
                setCreatingZoneMode(false);
                return closeModal();
              }}
            >
              {'Cancelar'}
            </Button>
            <Button
              className={classes.buttonItem}
              color="green"
              onClick={() => {
                setCreatingZoneMode(false);
                return editedZone.id
                  ? onEditZone(editedZone)
                  : onNewZone(editedZone);
              }}
            >
              {'aceptar'}
            </Button>
          </div>
        </div>
      )}
    </Dialog>
  );
};

const useStyles = makeStyles((theme) => ({
  container: {
    padding: '1rem',
    width: '47rem',
  },
  buttonContainer: {
    display: 'flex',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    margin: 'auto',
    marginTop: '2rem',
    width: '50%',
  },
  subtitle: {
    fontSize: '1.5rem',
    color: theme.palette.common.green,
    textTransform: 'uppercase',
    marginTop: '1rem',
  },
  buttonItem: {
    width: '10rem',
  },
}));

const mapStateToProps = (state) => ({
  Zone: selectedZoneConfig(state),
  formErrors: selectZoneErrors(state),
});

const mapDispatchToProps = (dispatch) => ({
  closeModal: () => dispatch(clearSelectedZoneConfig()),
  onNewZone: (zone) => dispatch(addNewZone(zone)),
  onEditZone: (zone) => dispatch(editZone(zone)),
  setCreatingZoneMode: (status) => dispatch(setCreatingZone(status)),
});

export default connect(mapStateToProps, mapDispatchToProps)(ZoneConfig);
