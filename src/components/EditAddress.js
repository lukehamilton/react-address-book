import React from 'react';
import { findDOMNode } from 'react-dom'
import { Link, withRouter } from 'react-router'
import Form from 'muicss/lib/react/form';
import { labelSelectOptions, countrySelectOptions } from './Shared'
import AddressStore from '../models/AddressStore'

const EditAddress = withRouter(
  React.createClass({

    getStateFromStore(props) {
      const { id } = props ? props.params : this.props.params
      return {
        address: AddressStore.getAddress(id)
      }
    },

    getInitialState() {
      return this.getStateFromStore()
    },

    updateAddress(event) {
      event.preventDefault()
      AddressStore.updateAddress({
        id: this.props.params.id,
        label: findDOMNode(this.refs.label).value,
        address_1: findDOMNode(this.refs.address_1).value,
        address_2: findDOMNode(this.refs.address_2).value,
        city: findDOMNode(this.refs.city).value,
        state: findDOMNode(this.refs.state).value,
        zipcode: findDOMNode(this.refs.zipcode).value,
        country: findDOMNode(this.refs.country).value,
      }, (address) => {
        this.props.router.push(`/address/${address.id}`)
      })
    },

    render()  {
      const address = this.state.address || {}
      return (
        <div>
          <div className="col-header-secondary">
            <Link className="close-item" to={`/address/${address.id}`} >Cancel</Link>
          </div>
          <div className="mui-divider"></div>
          <Form onSubmit={this.updateAddress}>
            <div className="mui-select">
              <select ref="label" defaultValue={address.label}>
                {labelSelectOptions}
              </select>
            </div>
            <div className="mui-textfield">
              <input type="text" ref="address_1" placeholder="Address 1" defaultValue={address.address_1}/>
            </div>
            <div className="mui-textfield">
              <input type="text" ref="address_2" placeholder="Address 2" defaultValue={address.address_2}/>
            </div>
            <div className="mui-textfield">
              <input type="text" ref="city" placeholder="City" defaultValue={address.city}/>
            </div>
            <div className="mui-textfield">
              <input type="text" ref="state" placeholder="State" defaultValue={address.state}/>
            </div>
            <div className="mui-textfield">
              <input type="text" ref="zipcode" placeholder="Zip Code" defaultValue={address.zipcode}/>
            </div>
            <div className="mui-select">
              <select ref="country" defaultValue={address.country}>
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

export default EditAddress
