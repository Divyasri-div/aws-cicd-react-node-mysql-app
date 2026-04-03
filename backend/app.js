const express = require('express');
const bodyParser = require('body-parser');
const routes = require('./routes');
const cors = require('cors');
const db = require('./configs/db');
const logger = require('./utils/logger');

const app = express();

app.use(cors());
app.use(bodyParser.json());

/* Test DB connection once (optional but safe) */
db.query('SELECT 1', (err) => {
   if (err) {
      logger.error(`Error connecting to MySQL: ${err.message}`);
   } else {
      logger.info('Connected to MySQL Database');
   }
});

/* Health Check */
app.get('/health', (req, res) => {
   logger.info('Health check endpoint');
   res.status(200).send('OK');
});

app.use('/api', routes);

module.exports = app;
