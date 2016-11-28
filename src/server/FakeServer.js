import sinon from 'sinon'

const server = sinon.fakeServer.create();
const API = "https://app.close.io/api/v1/addresses"

let fakeData = {"addresses":[
  {
    "id": "1",
    "label": "business",
    "city": "Elizabeth",
    "country": "United States",
    "zipcode": "80107",
    "state": "CO",
    "address_1": "28840 La Donna Vista Ln",
    "address_2": ""
  },
  {
    "id": "2",
    "label": "mailing",
    "city": "Vulcan",
    "country": "United States",
    "zipcode": "49892",
    "state": "MI",
    "address_1": "4080 Us 2 Hwy",
    "address_2": ""
  },
  {
    "id": "3",
    "label": "other",
    "city": "Blackville",
    "country": "United States",
    "zipcode": "29817",
    "state": "SC",
    "address_1": "3945 Dexter St",
    "address_2": ""
  },
  {
    "id": "4",
    "label": "business",
    "city": "Moundsville",
    "country": "United States",
    "zipcode": "26041",
    "state": "WV",
    "address_1": "281 Rr 2",
    "address_2": ""
  },
  {
    "id": "5",
    "label": "mailing",
    "city": "Lakeside",
    "country": "United States",
    "zipcode": "85929",
    "state": "AZ",
    "address_1": "2500 Pinon Dr",
    "address_2": ""
  }
]}

server.respondWith("GET", API, request => {
  // console.log('faker', fake)
  request.respond(200, {"Content-Type": "application/json"}, JSON.stringify(fakeData))
})

server.respondWith('POST', API, request => {
  let json = JSON.parse(request.requestBody)
  json.address.id = fakeData.addresses.length + 1
  fakeData.addresses.push(json.address)
  request.respond(200, {"Content-Type": "application/json"}, JSON.stringify(json))
})

server.respondWith('PUT', /https:\/\/app\.close\.io\/api\/v1\/addresses\/\d/, request => {
  let json = JSON.parse(request.requestBody)
  fakeData.addresses = fakeData.addresses.map(address => {
    if (address.id === json.address.id) return json.address
    return address
  })
  request.respond(200, {"Content-Type": "application/json"}, JSON.stringify(json))
})

server.respondWith('DELETE', /https:\/\/app\.close\.io\/api\/v1\/addresses\/\d/, request => {
  let splitUrl = request.url.split('/')
  let id = splitUrl[splitUrl.length - 1]
  fakeData.addresses = fakeData.addresses.filter(address => address.id !== id)
  request.respond(200)
})

export default server
