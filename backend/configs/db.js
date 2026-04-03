const mysql = require('mysql2');
require('dotenv').config();

const pool = mysql.createPool({
   connectionLimit: 10,
   host: process.env.DB_HOST || 'dev-db-instance.cfmik4k60hm1.ap-south-1.rds.amazonaws.com',
   port: process.env.DB_PORT || 3306,
   user: process.env.DB_USER || 'appuser',
   password: process.env.DB_PASSWORD || 'learnIT02#',
   database: process.env.DB_NAME || 'react_node_app'
});

module.exports = pool;
