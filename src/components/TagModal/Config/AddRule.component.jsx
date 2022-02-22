import React, { useState } from 'react';

//styles components
import { makeStyles } from '@material-ui/styles';

//components
import IconButton from 'components/IconButton.component';
import Input from 'components/Input.component';
import Select from 'components/Select.component';

const AddRule = ({ zonesList, onAddRule }) => {
  const classes = useStyles();

  const [showAdd, setShowAdd] = useState(false);
  const [ruleData, setRuleData] = useState({
    alert_type: '',
    zone: '',
    time: '',
  });
  const [errors, setErrors] = useState({});

  const { alert_type, zone, time } = ruleData;

  const alertOptions = [
    { value: 'Entry', label: 'Ingreso' },
    { value: 'Exit', label: 'Egreso' },
    { value: 'Permanence', label: 'Permanencia' },
  ];

  const zonesOptions = zonesList.map((zone) => ({
    label: zone.alias,
    value: zone.id,
  }));

  const handleRuleChange = (event) => {
    const { name, value } = event.target;

    const posNumRegEx = /^[1-9]\d*$/;
    const endsWithDigitRegEx = /\d$/;
    if (name === 'time' && value !== '' && !posNumRegEx.test(value)) {
      if (value.length > 1 && !endsWithDigitRegEx.test(value)) {
        // Don't show error if there is already a valid number
      } else {
        setErrors({ ...errors, time: 'Debe ingresar un número positivo' });
      }
    } else {
      setRuleData({ ...ruleData, [name]: value });
      setErrors({ ...errors, [name]: false });
    }
  };

  const handleAddRule = () => {
    const err = {};
    if (!zone) {
      err.zone = 'Debe seleccionar una zona';
    }
    if (!alert_type) {
      err.alert_type = 'Debe seleccionar un Tipo';
    }
    if (!time && alert_type === 'Permanence') {
      err.time = 'Debe ingresar un número positivo';
    }

    if (Object.keys(err).length === 0) {
      const zoneData = zonesList.find((zone) => zone.id === ruleData.zone);
      let success = true;
      if (alert_type === 'Permanence') {
        success = onAddRule({
          ...ruleData,
          zone: { id: zoneData.id, alias: zoneData.alias },
          time: parseInt(time),
        });
      } else {
        success = onAddRule({
          alert_type,
          zone: { id: zoneData.id, alias: zoneData.alias },
        });
      }
      if (success) {
        resetForm();
      } else {
        setErrors({
          zone: 'Una alerta con esta configuración ya existe.',
        });
      }
    } else {
      setErrors(err);
    }
  };

  const resetForm = () => {
    setRuleData({
      alert_type: '',
      zone: '',
      time: '',
    });
    setErrors({});
  };

  return (
    <div>
      {showAdd && (
        <div className={classes.addForm}>
          <Select
            className={classes.inputItem}
            name="alert_type"
            value={alert_type}
            placeholder="Tipo Alerta"
            options={alertOptions}
            handleChange={handleRuleChange}
            error={errors.alert_type}
          />
          <Select
            className={classes.inputItem}
            name="zone"
            value={zone}
            placeholder="Zona"
            options={zonesOptions}
            handleChange={handleRuleChange}
            error={errors.zone}
          />
          {alert_type === 'Permanence' && (
            <Input
              className={classes.inputItem}
              name="time"
              value={time}
              placeholder="Tiempo en minutos"
              handleChange={handleRuleChange}
              error={errors.time}
            />
          )}
          <div className={classes.controlButtons}>
            <IconButton accept onClick={handleAddRule} />
            <IconButton
              cancel
              onClick={() => {
                setShowAdd(false);
                resetForm();
              }}
            />
          </div>
        </div>
      )}
      <IconButton add onClick={() => setShowAdd(true)} />
    </div>
  );
};

const useStyles = makeStyles((theme) => ({
  addForm: {
    display: 'flex',
    alignItems: 'center',
    margin: '0.5rem 0',
  },
  inputItem: {
    marginRight: '0.5rem',
    width: '13.16rem',
  },
  controlButtons: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '4rem',
  },
}));

export default AddRule;
