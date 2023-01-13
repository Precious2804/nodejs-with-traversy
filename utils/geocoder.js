const NodeGeocoder = require('node-geocoder');

const options = {
  provider: 'mapquest',
  httpAdapter: 'https',
  apiKey: 'EGY1AJxJ2YEnydaAoAjXp4RD3cGTZSjp',
  formatter: null
};

const geocoder = NodeGeocoder(options);

module.exports = geocoder;
