import React from "react";

//styles components
import { makeStyles } from "@material-ui/styles";

//components
import Label from "components/ui/Label.component";
import Input from "components/Input.component";
import Select from "components/Select.component";

const ConfigForm = ({ tag, onChangeHandler, formErrors }) => {
  const classes = useStyles();

  const tagOptions = [
    { label: "Persona", value: "Person" },
    { label: "Objeto", value: "Object" },
    { label: "Vehiculo", value: "Vehicle" },
  ];

  return (
    <div className={classes.container}>
      <div className={classes.formItem}>
        <Label textLabel="Alias:" />
        <Input
          className={classes.formInput}
          value={tag.alias}
          handleChange={onChangeHandler}
          name="alias"
          maxLength={20}
          error={formErrors.alias}
          placeholder="Ingrese ID"
        />
      </div>
      <div className={classes.formItem}>
        <Label textLabel="Tipo:" />
        <Select
          className={classes.formInput}
          value={tag.type}
          options={tagOptions}
          handleChange={onChangeHandler}
          name="type"
          placeholder="Seleccione Tipo"
          error={formErrors.type}
        />
      </div>
      <div className={classes.formItem} style={{ alignItems: "flex-start" }}>
        <Label textLabel="Descripción:" />
        <Input
          className={classes.formInput}
          value={tag.description}
          handleChange={onChangeHandler}
          name="description"
          multiline
          rows={3}
          maxLength={50}
          placeholder="Ingrese Descripción"
        />
      </div>
    </div>
  );
};

const useStyles = makeStyles((theme) => ({
  container: {
    marginLeft: "2rem",
  },
  formItem: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "1rem",
  },
  formInput: {
    width: "15rem",
  },
}));

export default ConfigForm;
