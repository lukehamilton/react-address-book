import React from 'react';
import { render } from 'react-dom'
import { browserHistory, Router, Route, Link } from 'react-router'

import AddressStore from './models/AddressStore'

import Address from './components/Address'
import NewAddress from './components/NewAddress'
import EditAddress from './components/EditAddress'
import Map from './components/Map'

import './styles//bootstrap-flex.css';
import './styles/app.css';

const App = React.createClass({

  getInitialState() {
    AddressStore.init()
    return {
      filter: '(.*?)',
      addresses: AddressStore.getAddresses(),
      filteredAddresses: AddressStore.getAddresses(),
      loading: true,
      selected: ''
    }
  },

  componentDidMount() {
    this.setActiveFilter(this.props.params.id)
    AddressStore.addChangeListener(this.updateAddresses)
  },

  componentWillUnMount()  {
    AddressStore.removeChangeListener(this.updateAddresses)
  },

  handleChange(event) {
    let filter = event.target.value === '' ? '(.*?)' : event.target.value
    this.setState({
      filter: filter
    })
    this.setState({
      filteredAddresses: this.filterAddresses({addresses: AddressStore.getAddresses(), filter: filter})
    })
  },

  filterAddresses(opts) {
    let addresses = opts.addresses || this.state.addresses
    let filter = opts.filter || this.state.filter
    const condition = new RegExp(filter, 'i');
    const filteredAddresses = addresses.filter(address => {
      let formattedAddress = this.formatAddress(address);
      return condition.test(formattedAddress);
    })
    return filteredAddresses
  },

  formatAddress(address) {
    return `${address.label} ${address.address_1} ${address.address_2} ${address.city}, ${address.state}, ${address.zipcode} ${address.country}`
  },

  updateAddresses() {
    this.setState({
      addresses: AddressStore.getAddresses(),
      filteredAddresses: this.filterAddresses({addresses: AddressStore.getAddresses()}),
      loading: false
    })
  },

  setActiveFilter(filter) {
    this.setState({selected  : filter})
  },

  resetActiveFilter() {
    this.setState({selected  : ''})
  },

  isActive(value) {
    return value === this.state.selected ? 'active': ''
  },

  render () {
    const filteredAddresses = this.state.filteredAddresses.map(address => {

      let labelType

      if (address.label === 'business')  {
        labelType = (
          <i className="fa fa-building-o" aria-hidden="true"></i>
        )
      } else if (address.label === 'mailing') {
        labelType = (
          <i className="fa fa-envelope-o" aria-hidden="true"></i>
        )
      } else {
        labelType = (
          <i className="fa fa-asterisk" aria-hidden="true"></i>
        )
      }

      let label = (
        <div className={`label label-${address.label}`}>
          {labelType}
        </div>
      )

      return (

        <Link key={address.id} to={`/address/${address.id}`}>
          <li onClick={this.setActiveFilter.bind(this, address.id)} className={`list-group-item address-item ${this.isActive(address.id)}`}>
            {label}
            <div className="address-content-container">
              <p className="address-content">
                {address.address_1} {address.address_2}<br/>
                {address.city}, {address.state}, {address.zipcode} {address.country}
              </p>
            </div>
          </li>
        </Link>
      )
    });

    let currentRoute = this.props.router.getCurrentLocation().pathname
    let showDetails = currentRoute !== '/' ? true : false

    return (
      <div className="">
        <div className="jumbotron">
          <div className="app">
            <div className="row">
              <div className="address-list col-xs-4">
                <div className="text-sm-center col-header">
                  <h5>Addresses</h5>
                  <Link to="/address/new" onClick={this.resetActiveFilter}><i className="fa fa-plus"></i></Link>
                </div>
                <input
                  className="search"
                  placeholder="Search"
                  onChange={ this.handleChange }
                />
                <ul className="list-group">
                  {filteredAddresses}
                </ul>
              </div>
              <div className={`narrow ${showDetails ? 'show' : 'hide'}`}>
                 { React.Children.map( this.props.children, child => React.cloneElement(child, {resetActiveFilter: this.resetActiveFilter, setActiveFilter: this.setActiveFilter}))}
              </div>
              <div className={`wide ${showDetails ? 'shrink' : ''}`}>
                <Map addresses={this.state.filteredAddresses}/>
              </div>
            </div>
          </div>
        </div>
      </div>
    )

  }

})






render((
  <Router history={browserHistory}>
    <Route path="/" component={App}>

      <Route path="address/new" component={NewAddress} />
      <Route path="address/:id" component={Address} />
      <Route path="address/:id/edit" component={EditAddress} />
    </Route>
  </Router>
), document.getElementById('root'))
