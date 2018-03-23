import React from 'react';
import {
  withScriptjs,
  withGoogleMap,
  GoogleMap
} from 'react-google-maps';

const Map = withScriptjs(withGoogleMap(props =>
  <GoogleMap
    defaultZoom={8}
    defaultCenter={{ lat: -34.397, lng: 150.644 }}

    {...props}
  >
    {props.children}
  </GoogleMap>
));

export default Map;