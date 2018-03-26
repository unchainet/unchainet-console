import React, {Component} from 'react';

import {GoogleMap, Marker, InfoWindow, withGoogleMap} from 'react-google-maps';
import MarkerClusterer from 'react-google-maps/lib/components/addons/MarkerClusterer';

const MarkerClustererMap = withGoogleMap(props => (
  <GoogleMap
    defaultZoom={2}
    defaultCenter={{lat: 17, lng: 18}}
    onZoomChanged={props.onZoomChanged}
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
          defaultIcon={`https://raw.githubusercontent.com/googlemaps/v3-utility-library/master/markerclustererplus/images/m${marker.hasInstance ? 2 : 1}.png`}
          position={{lat: marker.location.geo[1], lng: marker.location.geo[0]}}
          key={marker._id}
          onClick={() => props.onMarkerClick(marker._id)}
        >
          {props.selected.indexOf(marker._id) > -1 && (
            <InfoWindow onCloseClick={() => props.onMarkerClose(marker._id)} options={{}}>
              {marker.infoContent}
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

  stylizePopups() {
    setTimeout(() => {
      let el = $('.unet-map-region-popup').parents('.gm-style-iw');
      el.parent().css({'background-color': '#425061', 'border-radius': '7px'});
      $(el.prev().children()[1]).css({'background-color': '#425061', 'border-radius': '7px'});
      $($(el.prev().children()[2]).children()[0]).children().css({'background-color': '#425061'});
      $($(el.prev().children()[2]).children()[1]).children().css({'background-color': '#425061'});
      $(el.prev().children()[3]).css({'background-color': '#425061', 'border-radius': '7px'});
      //remove close button
      el.next().remove();
    }, 50);
  }

  // Toggle to 'true' to show InfoWindow and re-renders simple
  handleMarkerClick(targetMarker) {
    if (this.state.markers.indexOf(targetMarker) > -1) {
      return this.handleMarkerClose(targetMarker);
    }
    this.setState({
      markers: [targetMarker],
    });
    this.stylizePopups();
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

  handleZoomChanged() {
    this.stylizePopups()
  }

  render() {
    let markers = this.props.items || [];
    markers = markers.map(marker => {
      return {
        ...marker,
        showInfo: false,
        infoContent: (
          <div className="unet-map-region-popup">
            <div className="name">{marker.name}</div>
            <div className="table">
              <div className="table-row">
                <div className="table-cell">Providers</div>
                <div className="table-cell">{marker.numProviders || 0}</div>
              </div>
              <div className="table-row">
                <div className="table-cell">vCPU</div>
                <div className="table-cell">{marker.numCPU || 0}</div>
              </div>
              <div className="table-row">
                <div className="table-cell">RAM</div>
                <div className="table-cell">{marker.memGB || 0} GB</div>
              </div>
              <div className="table-row">
                <div className="table-cell">STORAGE</div>
                <div className="table-cell">{marker.storageGB || 0} GB</div>
              </div>
            </div>
          </div>
        )
      };
    });
    return (
      <MarkerClustererMap
        containerElement={
          <div className="embed-responsive embed-responsive-500h"/>
        }
        mapElement={<div className="embed-responsive-item"/>}
        markers={markers}
        selected={this.state.markers}
        onMarkerClick={this.handleMarkerClick.bind(this)}
        onMarkerClose={this.handleMarkerClose.bind(this)}
        onZoomChanged={this.handleZoomChanged.bind(this)}
      />
    );
  }
}