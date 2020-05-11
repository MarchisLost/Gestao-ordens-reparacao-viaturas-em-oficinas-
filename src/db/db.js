//const { Sequelize } = require('sequelize');
const Pool = require('pg').Pool

//passing the necessary information for the postgresql bd
module.exports =  new Pool({
  user: 'yzeyqail',
  host: 'kandula.db.elephantsql.com',
  database: 'yzeyqail',
  password: '9vy3_8okrryjz87bskwiEC_50FQkTSv2',
  port: '5432'
})