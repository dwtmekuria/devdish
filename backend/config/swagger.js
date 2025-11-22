const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');
const path = require('path');

const swaggerDocument = YAML.load(path.join(__dirname, '../api/openapi.yaml'));

if (process.env.NODE_ENV === 'production') {
  swaggerDocument.servers = [
    {
      url: process.env.BACKEND_URL,
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

const swaggerOptions = {
  customSiteTitle: "DevDish API Documentation",
};

if (process.env.NODE_ENV === 'production') {
  swaggerOptions.customCssUrl = 'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.15.5/swagger-ui.min.css';
  swaggerOptions.customJs = [
    'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.15.5/swagger-ui-bundle.js',
    'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.15.5/swagger-ui-standalone-preset.js',
  ];
}

module.exports = {
  swaggerDocument,
  swaggerUi,
  swaggerOptions
};