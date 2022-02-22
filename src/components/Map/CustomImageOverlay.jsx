import React from 'react';
import { ImageOverlay } from 'react-leaflet';

// ! Modify map url here
import mapUrl from 'assets/images/map.jpg';

const CustomImageOverlay = ({ bounds }) => (
  <ImageOverlay zIndex={-1} url={mapUrl} bounds={bounds} />
);

export default CustomImageOverlay;
