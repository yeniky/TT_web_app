import React, { useEffect } from "react";

//redux
import { connect } from "react-redux";

import { setDisplayZones } from "redux/ui/ui.actions";

//styles components
import { makeStyles } from "@material-ui/styles";

//components
import Map from "components/Map/Map.container";
import Legend from "components/Map/Legend.component";

import TagInfo from "components/TagModal/Info/TagInfo.container";
import ZoneInfoModal from "components/ZoneModal/ZoneInfo/ZoneInfo.container";
import TagConfig from "components/TagModal/Config/TagModalConfig.container";
import ZoneConfigModal from "components/ZoneModal/ZoneConfig/ZoneConfig.container";

const Dashboard = ({ showZones }) => {
  const classes = useStyles();

  useEffect(() => {
    return () => showZones(false);
  }, [showZones]);

  return (
    <div className={classes.map}>
      <Map />
      <Legend />
      <TagConfig />
      <TagInfo />
      <ZoneInfoModal />
      <ZoneConfigModal />
    </div>
  );
};

const useStyles = makeStyles((theme) => ({
  map: {
    width: "100%",
    height: "85vh",
  },
}));

const mapDispatchToProps = (dispatch) => ({
  showZones: (value) => dispatch(setDisplayZones(value)),
});

export default connect(null, mapDispatchToProps)(Dashboard);
