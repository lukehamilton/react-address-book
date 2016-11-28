/* global google */

import React from 'react';
import { findDOMNode } from 'react-dom'
import { Link, withRouter } from 'react-router'
import Form from 'muicss/lib/react/form';
import { labelSelectOptions, countrySelectOptions } from './Shared'
import AddressStore from '../models/AddressStore'

const NewAddress = withRouter(
  React.createClass({

    autocomplete: null,

    autocompleteGeocodeMap: {
      street_number: 'short_name',
      route: 'long_name',
      locality: 'long_name',
      administrative_area_level_1: 'short_name',
      country: 'long_name',
      postal_code: 'short_name'
    },

    autocompleteFormMap: {
      street_number: 'address_1',
      route: 'address_2',
      locality: 'city',
      administrative_area_level_1: 'state',
      country: 'country',
      postal_code: 'zipcode'
    },

    getInitialState() {
      return {
        'address_1': '',
        'address_2': '',
        'city': '',
        'state': '',
        'country': '',
        'zipcode': ''
      }
    },

    createAddress(event)  {
      event.preventDefault()

      AddressStore.addAddress({
        label: findDOMNode(this.refs.label).value,
        address_1: findDOMNode(this.refs.address_1).value,
        address_2: findDOMNode(this.refs.address_2).value,
        city: findDOMNode(this.refs.city).value,
        state: findDOMNode(this.refs.state).value,
        zipcode: findDOMNode(this.refs.zipcode).value,
        country: findDOMNode(this.refs.country).value,
      }, (address) => {
        this.props.router.push(`/address/${address.id}`)
        this.props.setActiveFilter(address.id)
      })
    },

    initAutocomplete()  {
      if (google) {
        this.autocomplete = new google.maps.places.Autocomplete(
            (findDOMNode(this.refs.autocomplete)),
            {types: ['geocode']})
        this.autocomplete.addListener('place_changed', this.fillInAddress)
      }
    },

    fillInAddress() {
      let place = this.autocomplete.getPlace()
      for (var i = 0; i < place.address_components.length; i++) {
        let addressType = place.address_components[i].types[0];
        if (this.autocompleteGeocodeMap[addressType]) {
          let value = place.address_components[i][this.autocompleteGeocodeMap[addressType]]
          findDOMNode(this.refs[this.autocompleteFormMap[addressType]]).value = value;
        }
      }
    },

    render()  {
      return (
        <div>
          <div className="col-header-secondary">
            <Link className="close-item" to="/">Cancel</Link>
          </div>
          <input type="text" className="autocomplete" ref="autocomplete" placeholder="Enter your address" onFocus={this.initAutocomplete} type="text"/>
          <Form onSubmit={this.createAddress}>
            <div className="mui-textfield">
              <select ref="label">
                {labelSelectOptions}
              </select>
            </div>
            <div className="mui-textfield">
              <input type="text" ref="address_1" placeholder="Address 1"/>
            </div>
            <div className="mui-textfield">
              <input type="text" ref="address_2" placeholder="Address 2"/>
            </div>
            <div className="mui-textfield">
              <input type="text" ref="city" placeholder="City"/>
            </div>
            <div className="mui-textfield">
              <input type="text" ref="state" placeholder="State"/>
            </div>
            <div className="mui-textfield">
              <input type="text" ref="zipcode" placeholder="Zip Code"/>
            </div>
            <div className="mui-select">
              <select ref="country" defaultValue="United States">
                {countrySelectOptions}
              </select>
            </div>
            <button type="submit" className="mui-btn mui-btn--raised">Save</button>
          </Form>
        </div>
      )
    }

  })
)

export default NewAddress
