import { createSelectOptions } from './view.js';

const APIKEY = 'U1k4OVVDUFpnMEtHNWlzQUo5V2phakUwT0J2VWNOa3ZrTXQ1SHhFSg==';


const ListNames = {
  countries: 'countries',
}

const api = {
  countries: 'https://api.countrystatecity.in/v1/countries'
}

const headers = {
  'X-CSCAPI-KEY': APIKEY
}

const requestOptions = {
  method: 'GET',
  headers: headers,
  redirect: 'follow'
};

const getCountries = async () => {
  let res = await (await fetch(api.countries, {
    headers
  })).json();

  return res;
};


const getStatesForCountry = async (name) => {
  let res = await (await fetch(`${api.countries}/${name}/states`,
    requestOptions
  )).json();

  return res;
};

const getCitiesForStateForCountry = async (country, state) => {
  let res = await (await fetch(`${api.countries}/${country}/states/${state}/cities`,
    requestOptions
  )).json();

  return res;
};

const State = {
  selections: {
    country: null,
    state: null,
    city: null
  }
}

const indiaUrl = 'https://api.countrystatecity.in/v1/countries/IN/states/MH/cities'
const illUrl = 'https://api.countrystatecity.in/v1/countries/US/states/IL/cities'

const app = document.querySelector('#app');
const appBody = document.querySelector('#app-body')
const containers = document.querySelectorAll('.container')

const countryList = await getCountries()
createSelectOptions('country', countryList)


app.addEventListener('selectchange', async ({ detail }) => {
  const { name, value } = detail

  if (name === 'country') {
    State.selections.country = value;

    const states = await getStatesForCountry(value)

    createSelectOptions('state', states);
  }

  else if (name === 'state') {
    State.selections.state = value;
  
    const cities = await getCitiesForStateForCountry(State.selections.country, value)
  
    createSelectOptions('city', cities)
  }
  // else if (name === 'city') {
  //   const cities = await getCitiesForStateForCountry(value)
  //   createSelectOptions('city', cities)
  // }
});