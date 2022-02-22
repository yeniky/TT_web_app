import React, { useState, useEffect } from "react";

import { useParams, Link } from "react-router-dom";

//redux
import { connect } from "react-redux";
import { createStructuredSelector } from "reselect";

import {
  zoneListSelector,
  historyZoneSelector,
} from "redux/zone/zone.selectors";

import {
  getHistory,
  selectZoneToConfig,
  clearHistory,
} from "redux/zone/zone.actions";

import { setDisplayZones } from "redux/ui/ui.actions";

//styles
import { Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/styles";

//components
import InfoZone from "components/ZoneHistory/InfoZone.component";
import TagTable from "components/ZoneHistory/TagTable.component";
import AlertTable from "components/ZoneHistory/AlertTable.component";
import ZoneConfigModal from "components/ZoneModal/ZoneConfig/ZoneConfig.container";
import Button from "components/Button.component";

const HistoryZone = ({
  zoneList,
  getHistory,
  zoneHistory,
  editZone,
  clearHistory,
  setDisplayZones,
}) => {
  const classes = useStyles();
  const { alias } = useParams();
  const [zone, setZone] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (alias && zoneList.length > 0 && isLoading) {
      const zoneFound = zoneList.find((zone) => zone.alias === alias);
      if (zoneFound) {
        setZone(zoneFound);
        getHistory(zoneFound.id);
      } else {
        setZone(null);
      }
      setIsLoading(false);
    }
  }, [alias, getHistory, zoneList, isLoading]);

  useEffect(() => {
    return () => clearHistory();
  }, [clearHistory]);

  return zone ? (
    <section className={classes.container}>
      <InfoZone zone={zone} onEdit={() => editZone(zone)} />
      <TagTable
        isLoading={zoneHistory.isLoading}
        name={zone.alias}
        idZone={zone.id}
        // zoneHistory={zoneHistory.zoneTags}
      />
      <AlertTable
        isLoading={zoneHistory.isLoading}
        name={zone.alias}
        idZone={zone.id}
        // alertHistory={zoneHistory.zoneAlerts}
        zoneList={zoneList}
      />
      <ZoneConfigModal />
    </section>
  ) : (
    <div className={classes.loadingContainer}>
      {isLoading ? (
        <Typography className={classes.infoText}>{"CARGANDO"}</Typography>
      ) : !zone ? (
        <div className={classes.errorContainer}>
          <Typography
            className={classes.infoText}
          >{`No existe una Zona con el Alias "${alias}"`}</Typography>
          <Button
            className={classes.toZonesButton}
            color="green"
            component={Link}
            to="/dashboard"
            onClick={() => setDisplayZones()}
          >
            {"Ver Zonas"}
          </Button>
        </div>
      ) : (
        ""
      )}
    </div>
  );
};

const useStyles = makeStyles((theme) => ({
  container: {
    padding: "2rem",
  },
  loadingContainer: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    height: "90vh",
  },
  infoText: {
    fontSize: "2rem",
  },
  errorContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
  },
  toZonesButton: {
    fontSize: "1.5rem",
    marginTop: "1rem",
  },
}));

const mapStateToProps = createStructuredSelector({
  zoneList: zoneListSelector,
  zoneHistory: historyZoneSelector,
});

const mapDispatchToProps = (dispatch) => ({
  getHistory: (idZone) => dispatch(getHistory(idZone)),
  editZone: (zone) => dispatch(selectZoneToConfig(false, zone)),
  clearHistory: () => dispatch(clearHistory()),
  setDisplayZones: () => dispatch(setDisplayZones(true)),
});

export default connect(mapStateToProps, mapDispatchToProps)(HistoryZone);
