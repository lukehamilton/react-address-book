import server from '../server/FakeServer'

const API = 'https://app.close.io/api/v1/addresses'

let _addresses = {}
let _initCalled = false
let _changeListeners = []


const AddressStore = {

  init () {
    if (_initCalled)
      return

    _initCalled = true

    getJSON(API, (err, res) => {
      res.addresses.forEach(address => {
        _addresses[address.id] = address
      })
      AddressStore.notifyChange()
    })

    server.respond()
  },

  addAddress (address, cb) {
    postJSON(API, { address }, res => {
      _addresses[res.address.id] = res.address
      AddressStore.notifyChange()
      if (cb) cb(res.address)
    })
    server.respond()
  },

  updateAddress (address, cb) {
    putJSON(`${API}/${address.id}`, { address }, res => {
      _addresses[res.address.id] = res.address
      AddressStore.notifyChange()
      if (cb) cb(res.address)
    })
    server.respond()
  },

  removeAddress(id, cb) {
    deleteJSON(`${API}/${id}`, cb)
    server.respond()
    delete _addresses[id]
    AddressStore.notifyChange()
  },

  getAddresses () {
    const array = []

    for (const id in _addresses)
      array.push(_addresses[id])

    return array
  },

  getAddress (id) {
    return _addresses[id]
  },

  notifyChange () {
    _changeListeners.forEach(listener => {
      listener()
    })
  },

  addChangeListener (listener) {
    _changeListeners.push(listener)
  },

  removeChangeListener (listener) {
    _changeListeners = _changeListeners.filter(l => listener !== l)
  }

}

localStorage.token = localStorage.token || (Date.now()*Math.random())

function getJSON(url, cb) {
  const req = new XMLHttpRequest()
  req.onload = () => {
    if (req.status === 404) {
      cb(new Error('not found'))
    } else {
      cb(null, JSON.parse(req.response))
    }
  }
  req.open('GET', url)
  req.setRequestHeader('authorization', localStorage.token)
  req.send()
}

function postJSON(url, obj, cb) {
  const req = new XMLHttpRequest()
  req.onload = () => {
    cb(JSON.parse(req.response))
  }
  req.open('POST', url)
  req.setRequestHeader('Content-Type', 'application/json;charset=UTF-8')
  req.setRequestHeader('authorization', localStorage.token)
  req.send(JSON.stringify(obj))
}

function putJSON(url, obj, cb) {
  const req = new XMLHttpRequest()
  req.onload = () => {
    cb(JSON.parse(req.response))
  }
  req.open('PUT', url)
  req.setRequestHeader('Content-Type', 'application/json;charset=UTF-8')
  req.setRequestHeader('authorization', localStorage.token)
  req.send(JSON.stringify(obj))
}

function deleteJSON(url, cb) {
  const req = new XMLHttpRequest()
  req.onload = cb
  req.open('DELETE', url)
  req.setRequestHeader('authorization', localStorage.token)
  req.send()
}

export default AddressStore
