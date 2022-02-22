import React from 'react';

//styles components
import { makeStyles } from '@material-ui/styles';

//components
import Label from 'components/ui/Label.component';
import IconButton from 'components/IconButton.component';

const RuleList = ({ ruleList, onDeleteRule }) => {
  const classes = useStyles();
  return (
    <div className={classes.container}>
      {ruleList.map(
        (rule, index) =>
          rule.active !== false && (
            <div
              className={classes.ruleItemContainer}
              key={`${rule.alert_type}_${index}`}
            >
              {rule.alert_type === 'Entry' && (
                <Label
                  className={classes.ruleItem}
                  textLabel={`Ingreso a Zona ${rule.zone.alias}.`}
                />
              )}
              {rule.alert_type === 'Permanence' && (
                <Label
                  className={classes.ruleItem}
                  textLabel={`Permanencia en Zona ${rule.zone.alias} por ${rule.time} minutos.`}
                />
              )}
              {rule.alert_type === 'Exit' && (
                <Label
                  className={classes.ruleItem}
                  textLabel={`Egreso de Zona ${rule.zone.alias}.`}
                />
              )}
              <IconButton
                className={classes.deleteRule}
                cancel
                onClick={() => onDeleteRule(index)}
              />
            </div>
          )
      )}
    </div>
  );
};

const useStyles = makeStyles((theme) => ({
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    maxHeight: '10rem',
    overflowY: 'auto',
    margin: '0.5rem 0',
  },
  ruleItem: {
    border: 'solid 0.5px black',
    width: '100%',
    padding: '3px 5px',
    backgroundColor: theme.palette.common.lightGrey,
    marginRight: 0,
  },
  deleteRule: {
    marginLeft: '0.5rem',
  },
  ruleItemContainer: {
    display: 'flex',
    marginBottom: '0.5rem',
    alignItems: 'center',
    width: '100%',
  },
}));

export default RuleList;
