//const { Sequelize } = require('sequelize');
const Pool = require('pg').Pool
require('dotenv').config();

//passing the necessary information for the postgresql bd
module.exports =  new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: '5432'
})