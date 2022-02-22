import React from "react";

import { connect } from "react-redux";

import { tagHasAlerts } from "redux/alerts/alerts.selectors";

import { setTag } from "redux/tag/tag.actions";

import { Marker, Tooltip } from "react-leaflet";
import Leaflet from "leaflet";

import { Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/styles";

import redMarker from "assets/images/redMarker.png";
import blueMarker from "assets/images/blueMarker.png";
import yellowMarker from "assets/images/yellowMarker.png";

const MarkerMap = ({ tag, onSelect, hasAlerts }) => {
  const classes = useStyles();
  const { address, id, config } = tag;

  const tagIcon = new Leaflet.Icon({
    iconUrl: hasAlerts ? redMarker : config ? blueMarker : yellowMarker,
    iconSize: [25, 35],
  });

  return (
    <Marker
      position={[Number(tag.last_y), Number(tag.last_x)]}
      icon={tagIcon}
      key={id}
      onClick={() => onSelect(tag)}
    >
      <Tooltip
        className={classes.toolTip}
        direction="bottom"
        offset={[0, 15]}
        opacity={0.8}
      >
        <Typography className={classes.markerToolTip} component="p">
          {address}
        </Typography>
      </Tooltip>
    </Marker>
  );
};

const useStyles = makeStyles((theme) => ({
  toolTip: {
    fontSize: "0.7rem",
    height: "1.7rem",
  },
  markerToolTip: {
    fontSize: "0.7rem",
    margin: 0,
  },
}));

const mapStateToProps = (state, props) => ({
  hasAlerts: tagHasAlerts(state, props),
});

const mapDispatchToProps = (dispatch) => ({
  onSelect: (tag) => dispatch(setTag(tag)),
});

export default connect(mapStateToProps, mapDispatchToProps)(MarkerMap);
