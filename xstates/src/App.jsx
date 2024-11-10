import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

const CitySelector = () => {
  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState('');
  const [selectedState, setSelectedState] = useState('');
  const [selectedCity, setSelectedCity] = useState('');
  const [error, setError] = useState('');

  const getCountries = useCallback(() => {
    axios.get('https://crio-location-selector.onrender.com/countries')
      .then(response => {
        setCountries(response.data);
      })
      .catch(error => {
        setError('Failed to load countries');
      });
  }, []);

  const getStates = useCallback((country) => {
    axios.get(`https://crio-location-selector.onrender.com/country=${country}/states`)
      .then(response => {
        setStates(response.data);
        setCities([]);
        setSelectedState('');
        setSelectedCity('');
      })
      .catch(error => {
        setError('Failed to load states');
      });
  }, []);

  const getCities = useCallback((country, state) => {
    axios.get(`https://crio-location-selector.onrender.com/country=${country}/state=${state}/cities`)
      .then(response => {
        setCities(response.data);
        setSelectedCity('');
      })
      .catch(error => {
        setError('Failed to load cities');
      });
  }, []);

  useEffect(() => {
    getCountries();
  }, [getCountries]);

  useEffect(() => {
    if (selectedCountry) {
      getStates(selectedCountry);
    }
  }, [selectedCountry, getStates]);

  useEffect(() => {
    if (selectedState) {
      getCities(selectedCountry, selectedState);
    }
  }, [selectedState, selectedCountry, getCities]);

  return (
    <div>
      <h1>City Selector</h1>
      {error && <p className="error-message">{error}</p>}
      <div>
        <label>Select Country: </label>
        <select onChange={(e) => setSelectedCountry(e.target.value)} value={selectedCountry}>
          <option value="" disabled>Select Country</option>
          {countries.map(country => (
            <option key={country} value={country}>{country}</option>
          ))}
        </select>
      </div>
      <div>
        <label>Select State: </label>
        <select onChange={(e) => setSelectedState(e.target.value)} value={selectedState} disabled={!selectedCountry}>
          <option value="" disabled>Select State</option>
          {states.map(state => (
            <option key={state} value={state}>{state}</option>
          ))}
        </select>
      </div>
      <div>
        <label>Select City: </label>
        <select onChange={(e) => setSelectedCity(e.target.value)} value={selectedCity} disabled={!selectedState}>
          <option value="" disabled>Select City</option>
          {cities.map(city => (
            <option key={city} value={city}>{city}</option>
          ))}
        </select>
      </div>
      {selectedCity && (
        <p>You Selected {selectedCity}, {selectedState}, {selectedCountry}</p>
      )}
    </div>
  );
};

export default CitySelector;