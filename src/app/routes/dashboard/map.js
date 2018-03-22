import React, {Component} from 'react';

import {GoogleMap, Marker, InfoWindow, withGoogleMap} from 'react-google-maps';
import MarkerClusterer from 'react-google-maps/lib/components/addons/MarkerClusterer';

const MarkerClustererMap = withGoogleMap(props => (
  <GoogleMap
    defaultZoom={2}
    defaultCenter={{lat: -21.0391667, lng: 140.525}}
    defaultOptions={{
      fullscreenControl: false,
      mapTypeControl: false,
      panControl: false,
      rotateControl: false,
      scaleControl: false,
      signInControl: false,
      streetViewControl: false,
      zoomControl: false
    }}
  >
    <MarkerClusterer
      averageCenter
      enableRetinaIcons
      gridSize={60}
    >
      {props.markers.map(marker => (
        <Marker
          position={{lat: marker.location.lat, lng: marker.location.lng}}
          key={marker.id}
          onClick={() => props.onMarkerClick(marker.id)}
        >
          {props.selected.indexOf(marker.id) > -1 && (
            <InfoWindow onCloseClick={() => props.onMarkerClose(marker.id)}>
            <div>{marker.infoContent}
            </div>
            </InfoWindow>
          )}
        </Marker>
        ))}
    </MarkerClusterer>
  </GoogleMap>
));

export default class MarkerClustererContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      markers: [],
    };
  }

  // Toggle to 'true' to show InfoWindow and re-renders simple
  handleMarkerClick(targetMarker) {
    this.setState({
      markers: this.state.markers.concat([targetMarker]),
    });
  }

  handleMarkerClose(targetMarker) {
    let markers = [];
    this.state.markers.forEach(row => {
      if (row !== targetMarker) {
        markers.push(row);
      }
    });
    this.setState({markers: markers});
  }

  render() {
    let markers = this.props.items || [];
    markers = markers.map(marker => {
      return {
        ...marker,
        showInfo: false,
        infoContent: (
          <div className="d-flex">
            <div className="ml-1">
              <p>id: {marker.id}</p>
              <p></p>
            </div>
          </div>
        )
      };
    });
    return (
      <MarkerClustererMap
        containerElement={
          <div className="embed-responsive embed-responsive-21by9"/>
        }
        mapElement={<div className="embed-responsive-item"/>}
        markers={markers}
        selected={this.state.markers}
        onMarkerClick={this.handleMarkerClick.bind(this)}
        onMarkerClose={this.handleMarkerClose.bind(this)}
      />
    );
  }
}