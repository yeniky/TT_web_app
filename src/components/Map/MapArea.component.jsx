import React from "react";

//redux
import { connect } from "react-redux";

import { zoneHasAlerts } from "redux/alerts/alerts.selectors";

//leaflet
import { Rectangle, Tooltip } from "react-leaflet";

//style components
import { makeStyles } from "@material-ui/styles";

const MapArea = ({ zone, clickHandler, hasActiveAlerts }) => {
  let coords = [[...zone.area[0]], [...zone.area[1]]]; // this way due to shallow copy references
  // https://stackoverflow.com/questions/7486085/copy-array-by-value
  let fixedCords = [coords[0].reverse(), coords[1].reverse()];

  const classes = useStyles({ color: hasActiveAlerts ? "red" : "darkGrey" });

  return (
    <Rectangle
      className={classes.area}
      bounds={fixedCords}
      onclick={() => clickHandler(zone)}
    >
      <Tooltip>
        <h2>Area {zone.alias}</h2>
      </Tooltip>
    </Rectangle>
  );
};

const useStyles = makeStyles((theme) => ({
  area: {
    fill: (props) => theme.palette.common[props.color],
    stroke: (props) => theme.palette.common[props.color],
    cursor: "pointer",
  },
}));

const mapStateToProps = (state, props) => ({
  hasActiveAlerts: zoneHasAlerts(state, props),
});

export default connect(mapStateToProps)(MapArea);
