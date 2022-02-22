import React from "react";

//styles components
import { makeStyles } from "@material-ui/styles";

//components
import Label from "components/ui/Label.component";
import Input from "components/Input.component";

const ZoneForm = ({ zone, handleFormChange, formErrors }) => {
  const classes = useStyles();
  return (
    <form className={classes.formContainer}>
      <div className={classes.formItem}>
        <Label className={classes.label} textLabel="Alias:" />
        <Input
          className={classes.formInput}
          name="alias"
          placeholder="Ingrese Alias"
          value={zone.alias}
          handleChange={handleFormChange}
          maxLength={20}
          error={formErrors.alias}
        />
      </div>
      <div className={classes.formItem}>
        <Label className={classes.label} textLabel="Descripción:" />
        <Input
          className={`${classes.formInput} ${classes.formDesc}`}
          name="description"
          placeholder="Ingrese Descripción"
          value={zone.description}
          handleChange={handleFormChange}
          maxLength={50}
          multiline
          rows={3}
        />
      </div>
    </form>
  );
};

const useStyles = makeStyles((theme) => ({
  formContainer: {
    margin: "1rem 0",
    width: "20rem",
    display: "flex",
    alignItems: "flex-start",
    justifyContent: "flex-start",
  },
  formItem: {
    display: "flex",
    alignItems: "flex-start",
    justifyContent: "space-between",
    marginBottom: "1rem",

    marginRight: "1rem",
  },
  formInput: {
    width: "13rem",
  },
  label: {
    marginTop: "5px",
  },
  formDesc: {
    width: "20rem",
  },
}));

export default ZoneForm;
