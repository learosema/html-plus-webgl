const PORT = +process.env.PORT || 8080;
const HOST = process.env.HOST || 'localhost';
const express = require('express');
const app = express();
app.use(express.static('dist'));
app.listen(PORT, HOST, () =>
  console.log(`Server running: http://${HOST}:${PORT}/`)
);
