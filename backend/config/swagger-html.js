// backend/config/swagger-html.js
const createSwaggerHTML = (swaggerSpec) => {
  const isProduction = process.env.NODE_ENV === 'production';
  
  const cssUrl = isProduction 
    ? 'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.15.5/swagger-ui.min.css'
    : '/api-docs/swagger-ui.css';
    
  const bundleJs = isProduction
    ? 'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.15.5/swagger-ui-bundle.js'
    : '/api-docs/swagger-ui-bundle.js';
    
  const presetJs = isProduction
    ? 'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.15.5/swagger-ui-standalone-preset.js'
    : '/api-docs/swagger-ui-standalone-preset.js';

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>DevDish API Documentation</title>
  <link rel="stylesheet" type="text/css" href="${cssUrl}" />
  <style>
    html {
      box-sizing: border-box;
      overflow: -moz-scrollbars-vertical;
      overflow-y: scroll;
    }
    *,
    *:before,
    *:after {
      box-sizing: inherit;
    }
    body {
      margin: 0;
      background: #fafafa;
    }
    .topbar {
      display: none !important;
    }
    .swagger-ui .info .title {
      color: #3b82f6;
    }
  </style>
</head>
<body>
  <div id="swagger-ui"></div>
  
  <script src="${bundleJs}"></script>
  <script src="${presetJs}"></script>
  <script>
    window.onload = function() {
      const ui = SwaggerUIBundle({
        spec: ${JSON.stringify(swaggerSpec)},
        dom_id: '#swagger-ui',
        deepLinking: true,
        presets: [
          SwaggerUIBundle.presets.apis,
          SwaggerUIStandalonePreset
        ],
        plugins: [
          SwaggerUIBundle.plugins.DownloadUrl
        ],
        layout: "StandaloneLayout",
        supportedSubmitMethods: ['get', 'post', 'put', 'delete', 'patch'],
        validatorUrl: null
      });
      
      window.ui = ui;
    }
  </script>
</body>
</html>
  `;
};

module.exports = createSwaggerHTML;