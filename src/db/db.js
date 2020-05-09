const { Sequelize } = require('sequelize');

// Option 1: Passing a connection URI
//module.exports = new Sequelize('postgres://postgres:PedroDavid123@localhost:5432/AutoShopManager') // Example for postgres
module.exports = new Sequelize('postgres://yzeyqail:9vy3_8okrryjz87bskwiEC_50FQkTSv2@kandula.db.elephantsql.com:5432/yzeyqail')

// Option 2: Passing parameters separately (other dialects)
const sequelize = new Sequelize('database', 'username', 'password', {
  host: 'localhost',
  dialect:'postgres'
});