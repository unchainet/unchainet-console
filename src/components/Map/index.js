import React from 'react';
import {
  withGoogleMap,
  GoogleMap
} from 'react-google-maps';

const mapStyles = require('../../mapStyles.json');

const Map = withGoogleMap(props =>
  <GoogleMap
    defaultZoom={8}
    defaultCenter={{ lat: -34.397, lng: 150.644 }}
    defaultOptions={{
      styles: mapStyles
    }}
    {...props}
  >
    {props.children}
  </GoogleMap>
);

export default Map;