// backend/config/swagger.js
const YAML = require('yamljs');
const path = require('path');

const swaggerDocument = YAML.load(path.join(__dirname, '../api/openapi.yaml'));

// Ensure openapi version is correct
if (!swaggerDocument.openapi) {
  swaggerDocument.openapi = '3.0.0';
}

if (process.env.NODE_ENV === 'production') {
  swaggerDocument.servers = [
    {
      url: process.env.BACKEND_URL || 'https://devdish-backend.vercel.app/api',
      description: 'Production server'
    }
  ];
} else {
  swaggerDocument.servers = [
    {
      url: 'http://localhost:5000/api',
      description: 'Development server'
    }
  ];
}

module.exports = {
  swaggerDocument
};