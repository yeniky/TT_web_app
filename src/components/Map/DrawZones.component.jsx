import React, { useState, useEffect } from 'react';

//redux
import { connect } from 'react-redux';

import {
  selectedZoneConfig,
  creatingZoneSelector,
} from 'redux/zone/zone.selectors';

import { selectZoneToConfig, setCreatingZone } from 'redux/zone/zone.actions';

//styles
import { makeStyles } from '@material-ui/styles';

//leaflet
import { FeatureGroup } from 'react-leaflet';
import { EditControl } from 'react-leaflet-draw';
import 'leaflet-draw/dist/leaflet.draw.css';
import { AddBox } from '@material-ui/icons';
import { Divider, Grid, Typography } from '@material-ui/core';
// import { SettingsInputHdmiTwoTone } from "@material-ui/icons";

const DrawZones = ({ onNewZone, onCloseModal, setCreatingZoneMode }) => {
  const classes = useStyles();
  const [editedLayer, setEditedLayer] = useState();
  const [newArea, setNewArea] = useState();
  const [creatingZone, setCreatingZone] = useState(false);

  const handleCreate = (event) => {
    const drawnAreas = editedLayer.leafletElement._layers;
    if (Object.keys(drawnAreas).length > 1) {
      Object.keys(drawnAreas).forEach((layerid, index) => {
        if (index > 0) return;
        const layer = drawnAreas[layerid];
        editedLayer.leafletElement.removeLayer(layer);
      });
    }
    // setCreatingZoneMode(false);
    setCreatingZone(false);
    onNewZone(event.layer._bounds);
    setNewArea(event.layer);
  };

  const handleClickCreateZone = () => {
    setCreatingZone((creatingZone) => {
      if (!creatingZone) {
        const createReactangleElement = document.getElementsByClassName(
          'leaflet-draw-draw-rectangle'
        );
        createReactangleElement[0].click();
        setCreatingZoneMode(true);
        return true;
      } else {
        const cancelCreateReactangleElement = document.getElementsByClassName(
          'leaflet-draw-actions'
        );
        cancelCreateReactangleElement[0].firstElementChild.firstElementChild.click();
        setCreatingZoneMode(false);
        return false;
      }
    });
  };

  useEffect(() => {
    if (editedLayer) {
      if (
        !onCloseModal &&
        Object.keys(editedLayer.leafletElement._layers).length > 0
      ) {
        editedLayer.leafletElement.removeLayer(newArea);
      }
    }
  }, [editedLayer, onCloseModal, newArea]);

  useEffect(() => {
    const myDiv = document.getElementById('clickCapture');
    myDiv.addEventListener('click', handleClickCreateZone, { capture: true });
  }, []);

  return (
    <FeatureGroup ref={(layerRef) => setEditedLayer(layerRef)}>
      <EditControl
        onCreated={handleCreate}
        draw={{
          polyline: false,
          polygon: false,
          circle: false,
          marker: false,
          circlemarker: false,
          rectangle: {
            shapeOptions: { color: 'red' },
          },
        }}
        edit={{ remove: false, edit: false }}
      />
      <Grid
        id="clickCapture"
        className={`leaflet-top leaflet-left ${classes.createZoneLabel}`}
      >
        <AddBox />
        <Divider orientation="vertical" flexItem />
        <Typography> {creatingZone ? 'Cancelar' : 'Crear Zona'} </Typography>
      </Grid>
    </FeatureGroup>
  );
};

// Firefox 1.0+
const isFirefox = typeof InstallTrigger !== 'undefined';

const useStyles = makeStyles((theme) => ({
  createZoneLabel: {
    marginTop: isFirefox ? 84 : 70,
    marginLeft: 10,
    display: 'flex',
    alignItems: 'center',
    alignContent: 'center',
    justifyContent: 'space-between',
    borderRadius: '4px',
    backgroundColor: '#fff',
    padding: isFirefox ? '4px' : '3px',
    boxShadow: '0 1px 5px rgba(0,0,0,0.65)',
    cursor: 'pointer',
    pointerEvents: 'auto',
    // zIndex: 1000,
  },
}));

const mapStateToProps = (state) => ({
  onCloseModal: selectedZoneConfig(state),
});

const mapDispatchToProps = (dispatch) => ({
  onNewZone: (newZone) => dispatch(selectZoneToConfig(true, newZone)),
  setCreatingZoneMode: (status) => dispatch(setCreatingZone(status)),
});

export default connect(mapStateToProps, mapDispatchToProps)(DrawZones);
