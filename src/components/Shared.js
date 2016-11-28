import React from 'react';
import { countryList, labelTypes } from '../data/fixtures'

const labelSelectOptions = labelTypes.map((label, index) => {
  return <option key={index} value={label}>{label}</option>
});

const countrySelectOptions = countryList.map((country, index) => {
  return <option key={index} value={country}>{country}</option>
});

export {
  labelSelectOptions,
  countrySelectOptions
}
