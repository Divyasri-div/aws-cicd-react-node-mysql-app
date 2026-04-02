const app = require('./app');
const port = process.env.PORT || 3200;
const logger = require('./utils/logger');

app.listen(port, '0.0.0.0', () => {
  logger.info(`Server is running on port ${port}`);
});
