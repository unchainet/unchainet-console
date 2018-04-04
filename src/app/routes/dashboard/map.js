import React, { Component } from "react";
const mapStyles = require("components/Map/mapStyleNoLabels.json");
import Button from "material-ui/Button";
import $ from "jquery";

import {
  GoogleMap,
  Marker,
  InfoWindow,
  withGoogleMap
} from "react-google-maps";
import MarkerClusterer from "react-google-maps/lib/components/addons/MarkerClusterer";
import { withStyles } from "material-ui/styles";
import {withRouter} from "react-router";
import {compose} from "redux";

const styles = theme => ({
  infoMapTitle: {
    color: theme.palette.secondary.light
  },
  btnBox: {
    padding: "10px 0 0 0"
  }
});

const MarkerClustererMap = withGoogleMap(props => {
  let onDomReady = () => {
    $(".unet-map-region-popup")
      .parents(".gm-style-iw")
      .parent()
      .addClass("gm-info-window");

    let el = $(".unet-map-region-popup").parents(".gm-style-iw");
    el.parent().css({ "background-color": "#555" });
    $(el.prev().children()[1]).css({
      "background-color": "#555"
    });
    $($(el.prev().children()[2]).children()[0])
      .children()
      .css({ "background-color": "#555" });
    $($(el.prev().children()[2]).children()[1])
      .children()
      .css({ "background-color": "#555" });
    $(el.prev().children()[3]).css({
      "background-color": "#555"
    });
    //remove close button
    el.next().remove();
  };

  return (
    <GoogleMap
      defaultZoom={1}
      defaultCenter={{ lat: 40, lng: 30 }}
      onZoomChanged={props.onZoomChanged}
      defaultOptions={{
        fullscreenControl: false,
        mapTypeControl: false,
        panControl: false,
        rotateControl: false,
        scaleControl: false,
        signInControl: false,
        streetViewControl: false,
        zoomControl: false,
        styles: mapStyles
      }}
    >
      <MarkerClusterer averageCenter enableRetinaIcons gridSize={60}>
        {props.markers.map(marker => (
          <Marker
            defaultIcon={`https://raw.githubusercontent.com/googlemaps/v3-utility-library/master/markerclustererplus/images/m${
              marker.hasInstance ? 2 : 1
            }.png`}
            position={{
              lat: marker.location.geo[1],
              lng: marker.location.geo[0]
            }}
            key={marker.key}
            onClick={() => props.onMarkerClick(marker._id)}
          >
            {props.selected.indexOf(marker._id) > -1 && (
              <InfoWindow
                onCloseClick={() => props.onMarkerClose(marker._id)}
                options={{}}
                onDomReady={onDomReady}
              >
                {marker.infoContent}
              </InfoWindow>
            )}
          </Marker>
        ))}
      </MarkerClusterer>
    </GoogleMap>
  );
});

class MarkerClustererContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      markers: []
    };
  }

  stylizePopups() {
    // setTimeout(() => {
    //   let el = $(".unet-map-region-popup").parents(".gm-style-iw");
    //   el
    //     .parent()
    //     .css({ "background-color": "#425061", "border-radius": "7px" });
    //   $(el.prev().children()[1]).css({
    //     "background-color": "#425061",
    //     "border-radius": "7px"
    //   });
    //   $($(el.prev().children()[2]).children()[0])
    //     .children()
    //     .css({ "background-color": "#425061" });
    //   $($(el.prev().children()[2]).children()[1])
    //     .children()
    //     .css({ "background-color": "#425061" });
    //   $(el.prev().children()[3]).css({
    //     "background-color": "#425061",
    //     "border-radius": "7px"
    //   });
    //   //remove close button
    //   el.next().remove();
    // }, 500);
  }

  // Toggle to 'true' to show InfoWindow and re-renders simple
  handleMarkerClick(targetMarker) {
    if (this.state.markers.indexOf(targetMarker) > -1) {
      return this.handleMarkerClose(targetMarker);
    }
    this.setState({
      markers: [targetMarker]
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
    this.setState({ markers: markers });
  }

  handleZoomChanged() {
    this.stylizePopups();
  }

  render() {
    const { classes } = this.props;
    let markers = this.props.items || [];
    markers = markers.map(marker => {
      return {
        ...marker,
        key: marker._id + new Date().getTime(),
        infoContent: (
          <div className="unet-map-region-popup">
            <div className={`name ${classes.infoMapTitle}`}>{marker.name}</div>
            <div className="table">
              <div className="table-row">
                <div className="table-cell-label">Providers</div>
                <div className="table-cell-value">
                  {(marker.numProviders || 0).toLocaleString()}
                </div>
              </div>
              <div className="table-row">
                <div className="table-cell-label">vCPU</div>
                <div className="table-cell-value">
                  {(marker.numCPU || 0).toLocaleString()}
                </div>
              </div>
              <div className="table-row">
                <div className="table-cell-label">RAM</div>
                <div className="table-cell-value">
                  {(marker.memGB || 0).toLocaleString()} GB
                </div>
              </div>
              <div className="table-row">
                <div className="table-cell-label">STORAGE</div>
                <div className="table-cell-value">
                  {(marker.storageGB || 0).toLocaleString()} GB
                </div>
              </div>
            </div>
            <div className={classes.btnBox}>
              <Button
                color="secondary"
                variant="raised"
                size="small"
                onClick={() => this.props.history.push("/app/workloads/wizard?region="+marker._id.toString())}
              >
                Add Workload
              </Button>
            </div>
          </div>
        )
      };
    });
    return (
      <MarkerClustererMap
        containerElement={
          <div className="embed-responsive embed-responsive-360h" />
        }
        mapElement={<div className="embed-responsive-item" />}
        markers={markers}
        selected={this.state.markers}
        onMarkerClick={this.handleMarkerClick.bind(this)}
        onMarkerClose={this.handleMarkerClose.bind(this)}
        onZoomChanged={this.handleZoomChanged.bind(this)}
      />
    );
  }
}

export default compose(withRouter, withStyles(styles))(MarkerClustererContainer);
