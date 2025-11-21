const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');
const path = require('path');

const swaggerDocument = YAML.load(path.join(__dirname, '../api/openapi.yaml'));

if (process.env.NODE_ENV === 'production') {
  swaggerDocument.servers = [
    {
      url: process.env.BACKEND_URL || 'https://your-deployed-app.herokuapp.com/api',
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
  swaggerDocument,
  swaggerUi
};