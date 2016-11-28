import React from 'react';
import { Link, withRouter } from 'react-router'
import AddressStore from '../models/AddressStore'

const Address = withRouter(
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

    componentDidMount() {
      AddressStore.addChangeListener(this.updateAddress)
    },

    componentWillUnmount() {
      AddressStore.removeChangeListener(this.updateAddress)
    },

    componentWillReceiveProps(nextProps)  {
      this.setState(this.getStateFromStore(nextProps))
    },

    updateAddress() {
      this.setState(this.getStateFromStore())
    },

    destroy() {
      const { id } = this.props.params
      AddressStore.removeAddress(id)
      this.props.router.push('/')
    },

    render()  {

      const address = this.state.address || {}

      return (
        <div>
          <div className="col-header-secondary">
            <Link className="edit-item" to={`/address/${address.id}/edit`}>
              Edit
            </Link>
            <Link className="close-item" to="/" onClick={this.props.resetActiveFilter}>
              Close
            </Link>
          </div>
          <div className="Address">
            <p>
              {address.address_1} {address.address_2} <br/>
              {address.city}, {address.state}, {address.zipcode} <br/>
              {address.country}
              </p>
              <i onClick={this.destroy} className="fa fa-trash-o delete-item"></i>
            </div>
        </div>
      )
    }

  })
)

export default Address
