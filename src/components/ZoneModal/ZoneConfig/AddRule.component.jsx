import React, { useState } from 'react';

//styles components
import { makeStyles } from '@material-ui/styles';

//components
import IconButton from 'components/IconButton.component';
import Input from 'components/Input.component';
import Select from 'components/Select.component';

//utils
//import * as yup from "yup";

const AddRule = ({ onAddRule }) => {
  const classes = useStyles();

  //TODO: por si se requiere en un futuro
  /*   const ruleSchema = yup.object({
    alert_type: yup
      .string()
      .when("$isRequired", (isRequired, schema) =>
        isRequired ? schema.required("Debe seleccionar un Tipo") : schema
      ),
    tag_type: yup
      .string()
      .when("$isRequired", (isRequired, schema) =>
        isRequired ? schema.required("Debe seleccionar un Tipo") : schema
      ),
    time: yup
      .mixed()
      .when("$validateTime", {
        is: true,
        then: yup
          .number()
          .positive("Debe ingresar un número positivo")
          .typeError("Debe ingresar un número positivo")
          .transform((value, originalValue) =>
            typeof originalValue === "string" && originalValue === ""
              ? null
              : value
          )
          .nullable(),
      })
      .when("$isRequired", (isRequired, schema) =>
        isRequired
          ? schema.required("Debe ingresar un número positivo")
          : schema
      ),
  }); */

  const [showAdd, setShowAdd] = useState(false);
  const [ruleData, setRuleData] = useState({
    alert_type: '',
    tag_type: '',
    time: '',
  });
  const [errors, setErrors] = useState({});

  const { alert_type, tag_type, time } = ruleData;

  const alertOptions = [
    { value: 'Entry', label: 'Ingreso' },
    { value: 'Exit', label: 'Egreso' },
    { value: 'Permanence', label: 'Permanencia' },
  ];

  const tagOptions = [
    { value: 'Object', label: 'Objeto' },
    { value: 'Vehicle', label: 'Vehículo' },
    { value: 'Person', label: 'Persona' },
  ];

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
    if (!tag_type) {
      err.tag_type = 'Debe seleccionar un Tipo';
    }
    if (!alert_type) {
      err.alert_type = 'Debe seleccionar un Tipo';
    }
    if (!time && alert_type === 'Permanence') {
      err.time = 'Debe ingresar un número positivo';
    }
    if (Object.keys(err).length === 0) {
      let success = true;
      if (alert_type === 'Permanence') {
        success = onAddRule({
          alert_type,
          tag_type,
          time: parseInt(time),
        });
      } else {
        success = onAddRule({
          alert_type,
          tag_type,
        });
      }
      if (success) {
        resetForm();
      } else {
        setErrors({
          tag_type: 'Una alerta con esta configuración ya existe.',
        });
      }
    } else {
      setErrors(err);
    }
  };

  const resetForm = () => {
    setRuleData({
      alert_type: '',
      tag_type: '',
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
            name="tag_type"
            value={tag_type}
            placeholder="Tipo Tag"
            options={tagOptions}
            handleChange={handleRuleChange}
            error={errors.tag_type}
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
