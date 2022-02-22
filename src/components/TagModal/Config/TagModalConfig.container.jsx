import React, { useState, useEffect } from 'react';

//redux
import { connect, shallowEqual } from 'react-redux';

import { selectedTagConfig, selectTagErrors } from 'redux/tag/tag.selector';
import { selectZones } from 'redux/zone/zone.selectors';

import { clearTagConfig, setConfig } from 'redux/tag/tag.actions';

//styles components
import { Dialog, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import selectedTagIcon from 'assets/images/selectedMarker.png';

//components
import Button from 'components/Button.component';

import InfoTag from './InfoTag.component';
import ConfigForm from './ConfigForm.component';
import RuleList from './RuleList.component';
import AddRule from './AddRule.component';

import { getMinutesDifference, tagRuleEquals } from 'utils';

//TODO: change handlers to local reducer
const ModalTag = ({ Tag, closeModal, saveConfig, zonesList, formErrors }) => {
  const classes = useStyles();

  const [editedTag, setEditedTag] = useState();
  useEffect(() => {
    if (Tag) {
      if (Tag.config) {
        setEditedTag(Tag);
      } else {
        setEditedTag({
          ...Tag,
          config: { alerts: [], alias: '', type: '', description: '' },
        });
      }
    }
  }, [Tag]);

  useEffect(() => {
    return () => closeModal();
  }, [closeModal]);

  const addRuleHandler = (newRule) => {
    if (!editedTag.config.alerts.find((rule) => tagRuleEquals(rule, newRule))) {
      setEditedTag({
        ...editedTag,
        config: {
          ...editedTag.config,
          alerts: [...editedTag.config.alerts, newRule],
        },
      });
      return true;
    } else {
      return false;
    }
  };
  const handleFormChange = (event) => {
    const { value, name } = event.target;
    const { config } = editedTag;
    setEditedTag({ ...editedTag, config: { ...config, [name]: value } });
  };
  const deleteRuleHandler = (index) => {
    const {
      config: { alerts },
      config,
    } = editedTag;
    const newAlerts = alerts.map((alert, ruleIndex) => ({
      ...alert,
      ...(ruleIndex === index && { active: false }),
    }));
    setEditedTag({
      ...editedTag,
      config: {
        ...config,
        alerts: newAlerts,
      },
    });
  };

  return (
    <Dialog open={!!Tag} maxWidth={false}>
      {editedTag && (
        <div className={classes.container}>
          <Typography className={classes.title} component="h1">
            <img
              className={classes.selectedTagIcon}
              src={selectedTagIcon}
              alt="icono tag seleccionado"
            />
            {`CONFIGURACIÓN TAG ${editedTag.address}`}
          </Typography>
          <div className={classes.configurationContainer}>
            <InfoTag
              address={editedTag.address}
              zone={editedTag.zone ? editedTag.zone.alias : '-'}
              signal={editedTag.signal}
              time={
                editedTag.last_timestamp
                  ? getMinutesDifference(editedTag.last_timestamp)
                  : false
              }
            />
            <ConfigForm
              tag={editedTag.config}
              formErrors={formErrors}
              onChangeHandler={handleFormChange}
            />
          </div>
          <div className={classes.alertContainer}>
            <Typography className={classes.subtitle} component="h2">
              {'ALERTAS'}
            </Typography>
            <RuleList
              ruleList={editedTag.config ? editedTag.config.alerts : []}
              onDeleteRule={deleteRuleHandler}
            />
            <AddRule zonesList={zonesList} onAddRule={addRuleHandler} />
          </div>
          <div className={classes.buttons}>
            <Button
              className={classes.button}
              color="red"
              onClick={() => closeModal()}
            >
              {'Cancelar'}
            </Button>
            <Button
              className={classes.button}
              color="green"
              onClick={() => saveConfig(editedTag.id, editedTag.config)}
            >
              {'ACEPTAR'}
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
  configurationContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginTop: '1rem',
  },
  buttons: {
    display: 'flex',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    margin: 'auto',
    marginTop: '2rem',
    width: '50%',
  },
  addButton: {
    marginTop: '0.5rem',
  },
  title: {
    fontSize: '1.7rem',
    color: theme.palette.common.green,
    textTransform: 'uppercase',
    fontWeight: 800,
    display: 'flex',
    alignItems: 'center',
  },
  subtitle: {
    fontSize: '1.5rem',
    color: theme.palette.common.green,
    textTransform: 'uppercase',
    marginTop: '1rem',
  },
  selectedTagIcon: {
    width: '2.7rem',
    marginRight: 7,
  },
  button: {
    width: '10rem',
  },
}));

const mapStateToProps = (state) => ({
  Tag: selectedTagConfig(state),
  zonesList: selectZones(state),
  formErrors: selectTagErrors(state),
});

const mapDispatchToProps = (dispatch) => ({
  closeModal: () => dispatch(clearTagConfig()),
  saveConfig: (id, config) => dispatch(setConfig(id, config)),
});

export default connect(mapStateToProps, mapDispatchToProps)(ModalTag);
