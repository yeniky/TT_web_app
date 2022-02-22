import React from 'react';

//redux
import { connect } from 'react-redux';

import { activeTagsSelector } from 'redux/tag/tag.selector';
import { selectZones, creatingZoneSelector } from 'redux/zone/zone.selectors';
import { selectDisplayZone } from 'redux/ui/ui.selectors';

import { setSelectedZone } from 'redux/zone/zone.actions';

//leaflet
import Leaflet from 'leaflet';
import { Map } from 'react-leaflet';
import MarkerClusterGroup from 'react-leaflet-markercluster';
import 'leaflet/dist/leaflet.css';
import 'react-leaflet-markercluster/dist/styles.min.css';

//components
import MapArea from './MapArea.component';
import MarkerMap from 'components/Map/Marker.component';
import DrawZones from 'components/Map/DrawZones.component';
import MapImageOverlay from 'components/Map/CustomImageOverlay';

//styles
import { makeStyles } from '@material-ui/styles';

const MapContainer = ({
  tags,
  zones,
  onSelectArea,
  displayZones,
  creatingZone,
}) => {
  const classes = useStyles();
  const bounds = [
    [-0.8, -2.65],
    [6.25, 6.5],
  ];

  return (
    <section className={classes.mapContainer}>
      <Map
        id="map"
        className={classes.leafletMap}
        center={[5.1, 0.2]}
        minZoom={5}
        zoom={7}
        maxZoom={11}
        maxBounds={bounds}
        crs={Leaflet.CRS.Simple}
        maxBoundsViscosity={0.8}
      >
        <MapImageOverlay bounds={bounds} />
        {tags && (
          <MarkerClusterGroup>
            {tags.map((tag) => (
              <MarkerMap tag={tag} key={tag.id} />
            ))}
          </MarkerClusterGroup>
        )}
        {displayZones && <DrawZones />}
        {displayZones &&
          zones &&
          zones.map((z) => (
            <MapArea
              zone={z}
              key={z.alias}
              clickHandler={(zone) => {
                if (!creatingZone) onSelectArea(zone);
              }}
            />
          ))}
      </Map>
    </section>
  );
};

const useStyles = makeStyles((theme) => ({
  mapContainer: {
    height: '99%',
    width: '100%',
    padding: 0,
    margin: 0,
    borderBottom: '1px solid black',
    boxShadow: '1px 2px 2px rgba(0, 0, 0, 0.3)',
    transition: 'all 0.2s ease-in-out',
  },
  leafletMap: {
    width: '100%',
    height: '100%',
    zIndex: '1',
    position: 'relative',
  },
}));

const mapStateToProps = (state) => ({
  tags: activeTagsSelector(state),
  zones: selectZones(state),
  displayZones: selectDisplayZone(state),
  creatingZone: creatingZoneSelector(state),
});

const mapDispatchToProps = (dispatch) => ({
  onSelectArea: (zone) => dispatch(setSelectedZone(zone)),
});

export default connect(mapStateToProps, mapDispatchToProps)(MapContainer);
