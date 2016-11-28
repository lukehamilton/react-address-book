/* global google */
import _ from "lodash";
import React from 'react';
import { withGoogleMap, GoogleMap, Marker} from "react-google-maps"
import withScriptjs from "react-google-maps/lib/async/withScriptjs"
import FaSpinner from "react-icons/lib/fa/spinner"

const AsyncMap = _.flowRight(
  withScriptjs,
  withGoogleMap,
)(props => (
  <GoogleMap
    ref={props.onMapLoad}
    defaultZoom={3}
    defaultCenter={{ lat: 39.8282, lng: -90.5795 }}
    onClick={props.onMapClick}>
      {props.markers.map(marker => (
        <Marker
          {...marker}
        />
      ))}
  </GoogleMap>
));

const Map = React.createClass({

  geocodeMemo: {},

  getInitialState() {
    return {
      markers: [],
      center: null
    }
  },

  componentWillReceiveProps(nextProps)  {
    if (this.props.addresses.length !== nextProps.addresses.length) {
      this.props = nextProps
      this.state.markers = []
      this.geocodeAddresses()
    }
  },

  handleMapLoad(map) {
    this.map = map;
    if (map) {
      this.geocodeAddresses()
    }
  },

  addMarker(lat, lng)  {
    let position = {
      lat: lat,
      lng: lng
    }

    let marker = {
      position: position,
      key: `${JSON.stringify(position)}`,
      defaultAnimation: 5
    }
    this.state.markers.push(marker)
    this.setState({
      markers: this.state.markers
    })
    this.fitMapToMarkers()
  },

  fitMapToMarkers() {
    let bounds = new google.maps.LatLngBounds();
    this.state.markers.forEach(marker => bounds.extend(marker.position));
    this.map.fitBounds(bounds);
  },

  geocodeAddresses()  {
    let geocoder = new google.maps.Geocoder();
    this.props.addresses.forEach(address => {
      let geocodeAddress = `${address.address_1} ${address.address_2} ${address.city} ${address.state} ${address.zipcode} ${address.country}`
      if (geocodeAddress in this.geocodeMemo)  {
        let lat = this.geocodeMemo[geocodeAddress].lat
        let lng = this.geocodeMemo[geocodeAddress].lng
        this.addMarker(lat, lng)
      } else {
        geocoder.geocode( {'address': geocodeAddress}, (results, status) => {
          if (status === 'OK') {
            let location = results[0].geometry.location
            let lat = location.lat()
            let lng = location.lng()
            // Add geocode results to memo store
            this.geocodeMemo[geocodeAddress] = {
              lat: lat,
              lng: lng
            }
            this.addMarker(lat, lng)
          } else {
            console.log(`Geocode was not successful for the following reason: ${status}`);
          }
        })
      }
    })
  },

  render()  {
    return (
      <AsyncMap
        googleMapURL="https://maps.googleapis.com/maps/api/js?v=3.exp&libraries=geometry,drawing,places&key=AIzaSyDEdpOxJZquMijR9_iXTAxcaxvq17MptnI"
        loadingElement={
          <div style={{ height: `100%` }}>
            <FaSpinner
              style={{
                display: `block`,
                width: `80px`,
                height: `80px`,
                margin: `150px auto`,
                animation: `fa-spin 2s infinite linear`,
              }}
            />
          </div>
        }
        containerElement={
          <div style={{ height: `100%` }} />
        }
        mapElement={
          <div style={{ height: `100%` }} />
        }
        onMapLoad={this.handleMapLoad}
        onMapClick={this.handleMapClick}
        markers={this.state.markers}
      />
    )
  }

})

export default Map
